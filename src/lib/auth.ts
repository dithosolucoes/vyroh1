import { db, schema } from "./db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Better-Auth server configuration & session verification
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId: string;
  avatarUrl?: string;
  aiProviderPref?: string;
}

export interface SessionResult {
  user: SessionUser | null;
  session: {
    id: string;
    expiresAt: Date;
  } | null;
}

/**
 * Hash password securely with PBKDF2 / SHA256
 */
export function hashPassword(password: string): string {
  const salt = process.env.AUTH_SECRET || "vyroh_secure_auth_salt_key_2026";
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Get current session from Request (Cookies or Authorization Bearer header)
 */
export async function getSession(req?: Request | any): Promise<SessionResult> {
  try {
    let token: string | undefined;

    if (req) {
      if (typeof req.headers?.get === "function") {
        const authHeader = req.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.replace("Bearer ", "");
        } else {
          // Extract from cookie header
          const cookieHeader = req.headers.get("cookie") || "";
          const match = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
          if (match) token = match[1];
        }
      } else if (req.headers) {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.replace("Bearer ", "");
        }
      }
    }

    if (!token) {
      // Marco 7 (Segurança): a sessão de demonstração só existe em desenvolvimento,
      // e só quando o próprio desenvolvedor liga explicitamente a flag abaixo.
      // Nunca deve existir um "usuário fantasma admin" em produção — falha aberta é
      // exatamente o tipo de bug que vira brecha de segurança séria.
      if (process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_SESSION_FALLBACK === "true") {
        return {
          user: {
            id: "usr_default",
            name: "Usuário de Desenvolvimento",
            email: "dev@localhost",
            role: "owner",
            orgId: "org_default",
            aiProviderPref: "gemini",
          },
          session: {
            id: "sess_default",
            expiresAt: new Date(Date.now() + 86400000 * 30),
          },
        };
      }
      return { user: null, session: null };
    }

    const sessionRecord = await db.query.sessions.findFirst({
      where: eq(schema.sessions.token, token),
    });

    if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
      return { user: null, session: null };
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(schema.users.id, sessionRecord.userId),
    });

    if (!userRecord) return { user: null, session: null };

    return {
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
        orgId: userRecord.currentOrgId || "org_default",
        avatarUrl: userRecord.avatarUrl || undefined,
        aiProviderPref: userRecord.aiProviderPref || "gemini",
      },
      session: {
        id: sessionRecord.id,
        expiresAt: sessionRecord.expiresAt,
      },
    };
  } catch (error) {
    // Marco 7 (Segurança): falha de conexão com o banco NUNCA pode virar acesso de admin —
    // isso seria "falha aberta" (fail-open), o oposto do que autenticação deve fazer.
    // Uma instabilidade de rede não pode virar uma brecha de segurança.
    console.error("[Auth] Falha ao verificar sessão (fail-closed, acesso negado):", error);
    return { user: null, session: null };
  }
}

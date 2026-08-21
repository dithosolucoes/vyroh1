import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../../../../src/lib/db";
import { getSession, hashPassword, verifyPassword } from "../../../../src/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { user, session } = await getSession(req);
  return NextResponse.json({ user, session });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name, role, orgName } = body;

    if (action === "sign-in" || action === "login") {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (!user) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
      }

      // Check password if account exists
      const account = await db.query.accounts.findFirst({
        where: eq(schema.accounts.userId, user.id),
      });

      if (account?.password && !verifyPassword(password, account.password)) {
        return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
      }

      const token = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const expiresAt = new Date(Date.now() + 86400000 * 30);

      await db.insert(schema.sessions).values({
        id: `sess_id_${Date.now()}`,
        userId: user.id,
        token,
        expiresAt,
        activeOrganizationId: user.currentOrgId || "org_default",
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          orgId: user.currentOrgId || "org_default",
        },
        token,
      });

      response.cookies.set("better-auth.session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 86400 * 30,
      });

      return response;
    }

    if (action === "sign-up" || action === "register") {
      const existing = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (existing) {
        return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
      }

      const userId = `usr_${Date.now()}`;
      const orgId = `org_${Date.now()}`;

      // Create Organization
      await db.insert(schema.organizations).values({
        id: orgId,
        name: orgName || `Org de ${name}`,
        ownerId: userId,
      });

      // Create User
      await db.insert(schema.users).values({
        id: userId,
        name,
        email,
        role: role || "developer",
        currentOrgId: orgId,
      });

      // Create Account with Hashed Password
      await db.insert(schema.accounts).values({
        id: `acc_${Date.now()}`,
        userId,
        accountId: email,
        providerId: "credentials",
        password: hashPassword(password),
      });

      // Create Membership
      await db.insert(schema.memberships).values({
        id: `mem_${Date.now()}`,
        userId,
        orgId,
        role: "owner",
      });

      const token = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const expiresAt = new Date(Date.now() + 86400000 * 30);

      await db.insert(schema.sessions).values({
        id: `sess_id_${Date.now()}`,
        userId,
        token,
        expiresAt,
        activeOrganizationId: orgId,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: userId, name, email, role: role || "developer", orgId },
        token,
      });

      response.cookies.set("better-auth.session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 86400 * 30,
      });

      return response;
    }

    return NextResponse.json({ error: "Ação não suportada" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro no processamento de autenticação" }, { status: 500 });
  }
}

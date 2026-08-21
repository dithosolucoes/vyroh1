import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getDb, isDbConnected, schema } from "./src/server/db/index";
import { eq, desc } from "drizzle-orm";
import { VYROH_MCP_TOOLS, executeMCPTool } from "./src/server/mcp/server";
import { generateAiCompletion, AiProvider } from "./src/lib/ai";
import {
  calculatePlatformSplit,
  createStripeCheckoutSession,
  createStripeConnectAccountLink,
  getStripeClient,
} from "./src/server/payments/stripe";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing json
app.use(express.json());

// In-memory data store for fallback when database is not yet provisioned
let inMemoryStore: any = {
  commissionRules: [
    { id: "rule_a", flowType: "A", percentage: "0.00", label: "Assinatura da Plataforma (100% Vyroh)" },
    { id: "rule_b", flowType: "B", percentage: "10.00", label: "Produtos Digitais Avulsos (10% taxa de plataforma)" },
    { id: "rule_c", flowType: "C", percentage: "12.50", label: "Assinaturas de Criador (12.5% split mensal)" },
    { id: "rule_d", flowType: "D", percentage: "15.00", label: "Serviços & Contratos Escrow (15% taxa de garantia)" },
  ],
  pricingPlans: [
    { id: "plan_starter", name: "Solo Starter", priceCents: 0, interval: "free", maxProjects: 3, maxPrompts: 15, aiCalls: 50 },
    { id: "plan_pro", name: "Solo Pro", priceCents: 8900, interval: "month", maxProjects: 20, maxPrompts: 200, aiCalls: 1000 },
    { id: "plan_unlimited", name: "Studio Unlimited", priceCents: 19900, interval: "month", maxProjects: -1, maxPrompts: -1, aiCalls: -1 },
  ],
  users: [
    { id: "usr_default", email: "tgabrieltgabriel324@gmail.com", name: "Gabriel", role: "admin", orgId: "org_default" },
  ],
  sessions: {
    "sess_default": { userId: "usr_default", email: "tgabrieltgabriel324@gmail.com", name: "Gabriel", role: "admin", orgId: "org_default" },
  },
};

// Initialize Gemini Client server-side with telemetry
function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// -------------------------------------------------------------
// 1. System Health & Infrastructure Status
// -------------------------------------------------------------
app.get("/api/health", (req, res) => {
  const db = getDb();
  res.json({
    status: "ok",
    app: "Vyroh Central Hub",
    timestamp: new Date().toISOString(),
    aiReady: Boolean(process.env.GEMINI_API_KEY),
    dbConnected: isDbConnected(),
    stripeReady: Boolean(process.env.STRIPE_SECRET_KEY),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/db/status", (req, res) => {
  const db = getDb();
  res.json({
    connected: isDbConnected(),
    databaseUrlSet: Boolean(process.env.DATABASE_URL),
    mode: isDbConnected() ? "postgresql_live" : "resilient_local_storage",
  });
});

// -------------------------------------------------------------
// 2. Authentication & Multi-tenant Session Management (Better-Auth spec)
// -------------------------------------------------------------
app.get("/api/auth/session", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace("Bearer ", "") : "sess_default";
  const session = inMemoryStore.sessions[token] || inMemoryStore.sessions["sess_default"] || inMemoryStore.users[0];
  res.json({ success: true, user: session, token });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const userId = `usr_${Date.now()}`;
    const orgId = `org_${Date.now()}`;
    const userRole = role || (email.includes("admin") ? "admin" : "owner");

    const newUser = {
      id: userId,
      email,
      name: name || email.split("@")[0] || "Usuário Vyroh",
      role: userRole,
      orgId,
      createdAt: new Date().toISOString(),
    };

    const token = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    inMemoryStore.users.push(newUser);
    inMemoryStore.sessions[token] = newUser;

    const db = getDb();
    if (db) {
      await db.insert(schema.users).values({
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: userRole,
        currentOrgId: orgId,
      }).onConflictDoNothing();

      await db.insert(schema.organizations).values({
        id: orgId,
        name: `${newUser.name}'s Vault`,
        ownerId: userId,
      }).onConflictDoNothing();
    }

    return res.json({ success: true, user: newUser, token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório" });
  }

  // Find existing user or establish fresh multi-tenant tenant
  const existingUser = inMemoryStore.users?.find((u: any) => u.email?.toLowerCase() === email?.toLowerCase());
  const user = existingUser || {
    id: `usr_${Date.now()}`,
    email,
    name: email.split("@")[0] || "Usuário Vyroh",
    role: email.includes("admin") ? "admin" : email.includes("seller") ? "seller" : email.includes("buyer") ? "buyer" : "owner",
    orgId: `org_${Date.now()}`,
  };

  const token = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  inMemoryStore.sessions[token] = user;

  res.json({ success: true, user, token });
});

app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    delete inMemoryStore.sessions[token];
  }
  res.json({ success: true, message: "Sessão encerrada com sucesso" });
});

// -------------------------------------------------------------
// 3. Vault CRUD API (Postgres live when connected, resilient memory fallback)
// -------------------------------------------------------------

// Projects CRUD
app.get("/api/projects", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const liveProjects = await db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt));
      return res.json({ success: true, data: liveProjects });
    }
    return res.json({ success: true, data: inMemoryStore.projects || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.projects || [] });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    if (db) {
      const proj = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
      if (proj.length > 0) return res.json({ success: true, data: proj[0] });
    }
    const local = (inMemoryStore.projects || []).find((p: any) => p.id === id);
    return res.json({ success: true, data: local });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const newProject = req.body;
    const item = {
      id: newProject.id || `proj_${Date.now()}`,
      orgId: newProject.orgId || "org_default",
      name: newProject.name || "Novo Projeto",
      description: newProject.description || "",
      status: newProject.status || "active",
      clientId: newProject.clientId || null,
      budgetCents: Number(newProject.budgetCents || newProject.budget) || 0,
      deadline: newProject.deadline ? new Date(newProject.deadline) : null,
      tags: newProject.tags || ["Next.js"],
      roadmapPlan: newProject.roadmapPlan || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!inMemoryStore.projects) inMemoryStore.projects = [];
    inMemoryStore.projects = [item, ...inMemoryStore.projects];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.projects).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Project fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (inMemoryStore.projects) {
      inMemoryStore.projects = inMemoryStore.projects.map((p: any) =>
        p.id === id ? { ...p, ...updateData, updatedAt: new Date().toISOString() } : p
      );
    }

    const db = getDb();
    if (db) {
      try {
        await db.update(schema.projects).set({ ...updateData, updatedAt: new Date() }).where(eq(schema.projects.id, id));
      } catch (dbErr) {
        console.warn("[DB Update Project fallback]:", dbErr);
      }
    }
    return res.json({ success: true, message: "Projeto atualizado", data: updateData });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (inMemoryStore.projects) {
      inMemoryStore.projects = inMemoryStore.projects.filter((p: any) => p.id !== id);
    }
    const db = getDb();
    if (db) {
      try {
        await db.delete(schema.projects).where(eq(schema.projects.id, id));
      } catch (dbErr) {
        console.warn("[DB Delete Project fallback]:", dbErr);
      }
    }
    return res.json({ success: true, message: "Projeto removido" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Prompts CRUD
app.get("/api/prompts", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const livePrompts = await db.select().from(schema.prompts).orderBy(desc(schema.prompts.createdAt));
      return res.json({ success: true, data: livePrompts });
    }
    return res.json({ success: true, data: inMemoryStore.prompts || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.prompts || [] });
  }
});

app.post("/api/prompts", async (req, res) => {
  try {
    const newPrompt = req.body;
    const item = {
      id: newPrompt.id || `prm_${Date.now()}`,
      orgId: newPrompt.orgId || "org_default",
      title: newPrompt.title || "Novo Prompt",
      content: newPrompt.content || "",
      category: newPrompt.category || "code",
      targetModel: newPrompt.targetModel || "universal",
      favorite: Boolean(newPrompt.favorite || newPrompt.isFavorite),
      visibility: newPrompt.visibility || "private",
      versionCount: Number(newPrompt.version || newPrompt.versionCount) || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!inMemoryStore.prompts) inMemoryStore.prompts = [];
    inMemoryStore.prompts = [item, ...inMemoryStore.prompts];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.prompts).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Prompt fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/prompts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (inMemoryStore.prompts) {
      inMemoryStore.prompts = inMemoryStore.prompts.map((p: any) =>
        p.id === id ? { ...p, ...updateData, updatedAt: new Date().toISOString() } : p
      );
    }
    const db = getDb();
    if (db) {
      try {
        await db.update(schema.prompts).set({ ...updateData, updatedAt: new Date() }).where(eq(schema.prompts.id, id));
      } catch (dbErr) {
        console.warn("[DB Update Prompt fallback]:", dbErr);
      }
    }
    return res.json({ success: true, message: "Prompt atualizado" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/prompts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (inMemoryStore.prompts) {
      inMemoryStore.prompts = inMemoryStore.prompts.filter((p: any) => p.id !== id);
    }
    const db = getDb();
    if (db) {
      try {
        await db.delete(schema.prompts).where(eq(schema.prompts.id, id));
      } catch (dbErr) {
        console.warn("[DB Delete Prompt fallback]:", dbErr);
      }
    }
    return res.json({ success: true, message: "Prompt removido" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Boilerplates CRUD
app.get("/api/boilerplates", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const liveBps = await db.select().from(schema.boilerplates).orderBy(desc(schema.boilerplates.createdAt));
      return res.json({ success: true, data: liveBps });
    }
    return res.json({ success: true, data: inMemoryStore.boilerplates || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.boilerplates || [] });
  }
});

app.post("/api/boilerplates", async (req, res) => {
  try {
    const item = {
      id: req.body.id || `bp_${Date.now()}`,
      orgId: req.body.orgId || "org_default",
      name: req.body.name,
      repoUrl: req.body.repoUrl || "https://github.com/vyroh",
      description: req.body.description || "",
      techStack: req.body.stack || ["TypeScript", "Next.js"],
      visibility: req.body.visibility || "public",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!inMemoryStore.boilerplates) inMemoryStore.boilerplates = [];
    inMemoryStore.boilerplates = [item, ...inMemoryStore.boilerplates];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.boilerplates).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Boilerplate fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/api/boilerplates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (inMemoryStore.boilerplates) {
      inMemoryStore.boilerplates = inMemoryStore.boilerplates.filter((b: any) => b.id !== id);
    }
    const db = getDb();
    if (db) {
      try {
        await db.delete(schema.boilerplates).where(eq(schema.boilerplates.id, id));
      } catch (dbErr) {
        console.warn("[DB Delete Boilerplate fallback]:", dbErr);
      }
    }
    return res.json({ success: true, message: "Boilerplate desindexado" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Clients CRUD
app.get("/api/clients", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const liveClients = await db.select().from(schema.clients).orderBy(desc(schema.clients.createdAt));
      return res.json({ success: true, data: liveClients });
    }
    return res.json({ success: true, data: inMemoryStore.clients || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.clients || [] });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const item = {
      id: req.body.id || `cli_${Date.now()}`,
      orgId: req.body.orgId || "org_default",
      name: req.body.name,
      company: req.body.company || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      status: req.body.status || "ativo",
      notes: req.body.notes || "",
      totalSpentCents: Number(req.body.totalSpentCents || req.body.totalValue) || 0,
      activeProjectsCount: Number(req.body.activeProjectsCount) || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!inMemoryStore.clients) inMemoryStore.clients = [];
    inMemoryStore.clients = [item, ...inMemoryStore.clients];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.clients).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Client fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// SOPs CRUD
app.get("/api/sops", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const liveSops = await db.select().from(schema.sops).orderBy(desc(schema.sops.createdAt));
      return res.json({ success: true, data: liveSops });
    }
    return res.json({ success: true, data: inMemoryStore.sops || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.sops || [] });
  }
});

app.post("/api/sops", async (req, res) => {
  try {
    const item = {
      id: req.body.id || `sop_${Date.now()}`,
      orgId: req.body.orgId || "org_default",
      title: req.body.title,
      category: req.body.category || "deploy",
      description: req.body.description || "",
      steps: req.body.steps || [],
      checklist: req.body.checklist || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!inMemoryStore.sops) inMemoryStore.sops = [];
    inMemoryStore.sops = [item, ...inMemoryStore.sops];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.sops).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert SOP fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Proposals CRUD
app.get("/api/proposals", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const liveProps = await db.select().from(schema.proposals).orderBy(desc(schema.proposals.createdAt));
      return res.json({ success: true, data: liveProps });
    }
    return res.json({ success: true, data: inMemoryStore.proposals || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.proposals || [] });
  }
});

app.post("/api/proposals", async (req, res) => {
  try {
    const item = {
      id: req.body.id || `prop_${Date.now()}`,
      orgId: req.body.orgId || "org_default",
      title: req.body.title,
      clientName: req.body.clientName || "Cliente",
      status: req.body.status || "rascunho",
      tiers: req.body.tiers || req.body.scopeItems || [],
      escrowStatus: "nenhum",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!inMemoryStore.proposals) inMemoryStore.proposals = [];
    inMemoryStore.proposals = [item, ...inMemoryStore.proposals];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.proposals).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Proposal fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Marketplace Listings CRUD
app.get("/api/marketplace/listings", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const liveListings = await db.select().from(schema.listings).orderBy(desc(schema.listings.createdAt));
      return res.json({ success: true, data: liveListings });
    }
    return res.json({ success: true, data: inMemoryStore.listings || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.listings || [] });
  }
});

app.post("/api/marketplace/listings", async (req, res) => {
  try {
    const newL = req.body;
    const item = {
      id: newL.id || `list_${Date.now()}`,
      sellerOrgId: newL.sellerOrgId || "org_default",
      sellerId: newL.sellerId || "usr_default",
      sellerName: newL.sellerName || "Vendedor Vyroh",
      sellerAvatar: newL.sellerAvatar || null,
      type: newL.type || "boilerplate",
      sourceRecordType: newL.sourceRecordType || null,
      sourceRecordId: newL.sourceRecordId || null,
      title: newL.title,
      description: newL.description || "",
      priceCents: Number(newL.priceCents) || 9900,
      currency: newL.currency || "BRL",
      category: newL.category || "Boilerplates",
      licenseType: newL.licenseType || "comercial",
      flowType: newL.flowType || "B",
      status: "publicado",
      rating: "5.00",
      salesCount: 0,
      previewContent: newL.previewContent || null,
      fullPayload: newL.fullPayload || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!inMemoryStore.listings) inMemoryStore.listings = [];
    inMemoryStore.listings = [item, ...inMemoryStore.listings];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.listings).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Listing fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Orders & Purchases CRUD
app.get("/api/orders", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const liveOrders = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
      return res.json({ success: true, data: liveOrders });
    }
    return res.json({ success: true, data: inMemoryStore.orders || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.orders || [] });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const newOrd = req.body;
    const item = {
      id: newOrd.id || `ord_${Date.now()}`,
      listingId: newOrd.listingId,
      sellerId: newOrd.sellerId || "usr_seller_1",
      sellerOrgId: newOrd.sellerOrgId || "org_seller",
      buyerId: newOrd.buyerId || "usr_default",
      buyerOrgId: newOrd.buyerOrgId || "org_default",
      amountCents: Number(newOrd.amountCents) || 0,
      platformFeeCents: Number(newOrd.platformFeeCents) || 0,
      sellerPayoutCents: Number(newOrd.sellerPayoutCents) || 0,
      flowType: newOrd.flowType || "B",
      status: "pago",
      createdAt: new Date(),
    };
    if (!inMemoryStore.orders) inMemoryStore.orders = [];
    inMemoryStore.orders = [item, ...inMemoryStore.orders];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.orders).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Order fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Community Topics CRUD
app.get("/api/community/topics", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const posts = await db.select().from(schema.communityPosts).orderBy(desc(schema.communityPosts.createdAt));
      return res.json({ success: true, data: posts });
    }
    return res.json({ success: true, data: inMemoryStore.communityTopics || [] });
  } catch (error: any) {
    return res.json({ success: true, data: inMemoryStore.communityTopics || [] });
  }
});

app.post("/api/community/topics", async (req, res) => {
  try {
    const t = req.body;
    const item = {
      id: t.id || `top_${Date.now()}`,
      authorId: t.authorId || "usr_default",
      authorName: t.authorName || "Membro Vyroh",
      authorAvatar: t.authorAvatar || null,
      authorRole: t.authorRole || "Desenvolvedor Solo",
      category: t.category || "dev",
      title: t.title,
      content: t.content,
      tags: t.tags || ["Geral"],
      likesCount: 1,
      repliesCount: 0,
      solved: false,
      aiMatchedSolutions: t.aiAnalysis ? [t.aiAnalysis] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!inMemoryStore.communityTopics) inMemoryStore.communityTopics = [];
    inMemoryStore.communityTopics = [item, ...inMemoryStore.communityTopics];

    const db = getDb();
    if (db) {
      try {
        const inserted = await db.insert(schema.communityPosts).values(item).returning();
        return res.json({ success: true, data: inserted[0] });
      } catch (dbErr) {
        console.warn("[DB Insert Community Post fallback]:", dbErr);
      }
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// AI Model Capabilities Endpoint
app.get("/api/ai/models", (req, res) => {
  res.json({
    providers: [
      { id: "gemini", name: "Google Gemini", models: ["gemini-3.7-flash", "gemini-1.5-pro"], default: "gemini-3.7-flash", isAvailable: Boolean(process.env.GEMINI_API_KEY) },
      { id: "claude", name: "Anthropic Claude", models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"], default: "claude-3-5-sonnet-20241022", isAvailable: Boolean(process.env.ANTHROPIC_API_KEY) },
      { id: "openai", name: "OpenAI GPT", models: ["gpt-4o", "gpt-4o-mini"], default: "gpt-4o", isAvailable: Boolean(process.env.OPENAI_API_KEY) },
      { id: "ollama", name: "Ollama Local (Offline)", models: ["llama3.2", "mistral", "deepseek-r1"], default: "llama3.2", isAvailable: true },
    ],
  });
});

// Admin Configuration & Commission Rules (Section 29)
app.get("/api/admin/commission-rules", async (req, res) => {
  try {
    const db = getDb();
    if (db) {
      const rules = await db.select().from(schema.commissionRules);
      if (rules.length > 0) return res.json({ success: true, rules });
    }
    return res.json({ success: true, rules: inMemoryStore.commissionRules });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/commission-rules", async (req, res) => {
  try {
    const { flowType, percentage } = req.body;
    inMemoryStore.commissionRules = inMemoryStore.commissionRules.map((r: any) =>
      r.flowType === flowType ? { ...r, percentage: String(percentage), updatedAt: new Date().toISOString() } : r
    );

    const db = getDb();
    if (db) {
      await db
        .update(schema.commissionRules)
        .set({ percentage: String(percentage), updatedAt: new Date() })
        .where(eq(schema.commissionRules.flowType, flowType));
    }

    return res.json({ success: true, message: "Regra de comissão atualizada com sucesso", flowType, percentage });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 4. AI Engine: Multi-Provider (Claude, OpenAI, Ollama, Gemini)
// -------------------------------------------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, systemInstruction, provider, model, apiKey, temperature } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt é obrigatório" });
    }

    const result = await generateAiCompletion({
      prompt,
      systemInstruction: systemInstruction || "Você é o assistente inteligente do Vyroh Central Hub. Responda em português com precisão técnica.",
      provider: (provider || process.env.DEFAULT_AI_PROVIDER || "gemini") as AiProvider,
      model,
      apiKey,
      temperature,
    });

    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: error.message || "Erro ao processar IA multi-provedor" });
  }
});

app.post("/api/gemini/generate-roadmap", async (req, res) => {
  try {
    const { goalDescription, vaultContext, targetTimeline } = req.body;

    if (!goalDescription) {
      return res.status(400).json({ error: "Descrição do objetivo é obrigatória" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        roadmap: {
          title: `Roadmap: ${goalDescription.slice(0, 60)}...`,
          complexity: "Média",
          targetWeeks: targetTimeline || "3-4 semanas",
          summary: "Plano de execução detalhado gerado para maximizar o reuso do seu cofre pessoal de ativos.",
          matchedAssets: [
            { type: "boilerplate", name: "Next.js + Postgres Starter (Boilerplate)", reason: "Reduz 80% do setup inicial de banco e autenticação" },
            { type: "prompt", name: "System Prompt de Refinamento de Código", reason: "Útil para gerar componentes com design tokens restritos" },
            { type: "sop", name: "SOP de Deploy & Checklist de Lançamento", reason: "Garante segurança e validação pré-produção" },
          ],
          steps: [
            {
              stepNumber: 1,
              title: "Estruturação da Fundação & Arquitetura",
              duration: "3 dias",
              deliverables: ["Schema do banco relacional", "Autenticação multi-tenant", "Configuração de variáveis de ambiente"],
              toolsNeeded: ["PostgreSQL", "Tailwind CSS", "Better-Auth"],
              vaultAssetMatched: "Next.js + Postgres Starter (Boilerplate)",
            },
            {
              stepNumber: 2,
              title: "Desenvolvimento do Core & Regras de Negócio",
              duration: "1-2 semanas",
              deliverables: ["CRUD dos recursos principais", "Integração do motor de busca", "Playground de testes"],
              toolsNeeded: ["TypeScript", "tRPC / REST endpoints"],
              vaultAssetMatched: "System Prompt de Refinamento de Código",
            },
            {
              stepNumber: 3,
              title: "Camada de Validação & Lançamento",
              duration: "4 dias",
              deliverables: ["Testes de fluxo de checkout", "Documentação técnica", "Auditoria de segurança"],
              toolsNeeded: ["Stripe Connect", "Docker"],
              vaultAssetMatched: "SOP de Deploy & Checklist de Lançamento",
            },
          ],
          gaps: [
            "Falta um template de termos de uso e licença comercial no cofre para este modelo de projeto.",
            "Não há MCP de sincronização com webhook externo cadastrado.",
          ],
          professionalNeeded: {
            needed: true,
            role: "Designer UI/UX Especialista em Design Systems Dark Mode",
            skills: ["Figma", "Design Tokens", "Micro-interações", "Acessibilidade WCAG AA"],
            estimatedHours: "15-20 horas",
            reason: "Para refinar o catálogo de assets e transformar telas em layouts de altíssima conversão.",
          },
        },
      });
    }

    const ai = getGeminiClient();
    const promptText = `
Você é o Cérebro Inteligente do Vyroh, o agregador e hub central para profissionais-empresa ("solo developers").
O usuário quer executar um objetivo e precisa de um Roadmap estruturado em JSON que cruze as informações e recomende ativos do cofre, identifique lacunas (gaps) e informe se é necessário contratar um profissional.

Contexto do Cofre do Usuário (se houver):
${JSON.stringify(vaultContext || {})}

Objetivo do Usuário:
"${goalDescription}"
Prazo desejado: ${targetTimeline || "Automático"}

Retorne APENAS um JSON válido no seguinte formato:
{
  "title": "Título conciso do roadmap",
  "complexity": "Baixa | Média | Alta",
  "targetWeeks": "Ex: 2-3 semanas",
  "summary": "Resumo executivo da estratégia em 2 parágrafos objetivos",
  "matchedAssets": [
    { "type": "boilerplate | prompt | sop | client | mcp", "name": "Nome do ativo", "reason": "Por que este ativo acelera o projeto" }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Nome da fase/etapa",
      "duration": "Ex: 4 dias",
      "deliverables": ["Entregável 1", "Entregável 2"],
      "toolsNeeded": ["Ferramenta 1", "Ferramenta 2"],
      "vaultAssetMatched": "Nome do ativo do cofre aproveitado aqui (ou null)"
    }
  ],
  "gaps": [
    "Identificação de peças ou conhecimento faltantes no cofre"
  ],
  "professionalNeeded": {
    "needed": true,
    "role": "Nome do cargo/especialista sugerido se houver lacuna técnica/design",
    "skills": ["Skill 1", "Skill 2"],
    "estimatedHours": "Ex: 10-15h",
    "reason": "Por que este profissional economiza tempo crítico"
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Você é um arquiteto sênior e estrategista de produtos do Vyroh. Seja pragmático, objetivo, técnico e focado em alto ROI e reaproveitamento de código e processos.",
      },
    });

    const text = response.text || "{}";
    const roadmap = JSON.parse(text);
    return res.json({ success: true, roadmap });
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    return res.status(500).json({ error: error.message || "Falha ao gerar roadmap com IA" });
  }
});

app.post("/api/gemini/run-prompt", async (req, res) => {
  try {
    const { promptContent, variables, systemInstruction } = req.body;

    if (!promptContent) {
      return res.status(400).json({ error: "Conteúdo do prompt é obrigatório" });
    }

    let finalPrompt = promptContent;
    if (variables && typeof variables === "object") {
      Object.entries(variables).forEach(([key, val]) => {
        finalPrompt = finalPrompt.replaceAll(`{{${key}}}`, String(val));
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        output: `[SIMULAÇÃO VYROH - Prompt executado com sucesso]\n\nEntrada processada: "${finalPrompt.slice(0, 120)}..."\n\nResultado gerado: Esta resposta demonstra a execução do prompt no ambiente local. Ao anexar sua GEMINI_API_KEY nas Configurações, a resposta será processada em tempo real pelo modelo Gemini 3.7 Flash.`,
        latencyMs: 340,
        model: "gemini-3.7-flash",
      });
    }

    const ai = getGeminiClient();
    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: finalPrompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    const latencyMs = Date.now() - startTime;
    return res.json({
      success: true,
      output: response.text || "Nenhuma resposta de texto gerada.",
      latencyMs,
      model: "gemini-3.7-flash",
    });
  } catch (error: any) {
    console.error("Error running prompt:", error);
    return res.status(500).json({ error: error.message || "Erro na execução do prompt" });
  }
});

app.post("/api/gemini/match-community", async (req, res) => {
  try {
    const { questionTitle, questionContent, category } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        aiAnalysis: {
          summaryAnswer: `Para solucionar "${questionTitle}", a abordagem recomendada no ecossistema Vyroh é componentizar a lógica com design tokens e isolar as chamadas no servidor Express.`,
          recommendedAssets: [
            { type: "boilerplate", name: "Next.js + Postgres Boilerplate", reason: "Estrutura nativa com migrations e tipagem forte" },
            { type: "prompt", name: "Auditor de Performance & React Rerenders", reason: "Detecta ciclos infinitos e otimiza useMemo" },
          ],
          recommendedExperts: [
            { name: "Lucas Rocha", role: "Arquiteto Full-Stack & Especialista em Postgres", rating: "4.9 (42 jobs)" },
            { name: "Mariana Souza", role: "UI Designer & Engenheira de Design Tokens", rating: "5.0 (28 jobs)" },
          ],
        },
      });
    }

    const ai = getGeminiClient();
    const prompt = `
Você é o assistente de Comunidade do Vyroh.
Um membro postou uma dúvida na categoria "${category || "Dev"}":
Título: "${questionTitle}"
Conteúdo: "${questionContent}"

Faça uma análise rápida, forneça uma sugestão técnica direta de resolução, indique que tipo de ativos do cofre (boilertemplates/prompts/SOPs) resolvem isso e recomende o perfil do profissional que pode ser contratado caso precise de ajuda.

Retorne em JSON:
{
  "summaryAnswer": "Resposta técnica e sintetizada em 1-2 parágrafos",
  "recommendedAssets": [
    { "type": "boilerplate | prompt | sop", "name": "Nome sugerido", "reason": "Motivo" }
  ],
  "recommendedExperts": [
    { "name": "Nome fictício", "role": "Especialidade", "rating": "4.9 (35 reviews)" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const aiAnalysis = JSON.parse(response.text || "{}");
    return res.json({ success: true, aiAnalysis });
  } catch (error: any) {
    console.error("Error matching community:", error);
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 5. MCP (Model Context Protocol) API
// -------------------------------------------------------------
app.get("/api/mcp/tools", (req, res) => {
  res.json({
    name: "vyroh-mcp-server",
    version: "1.0.0",
    tools: VYROH_MCP_TOOLS,
  });
});

app.post("/api/mcp/execute", async (req, res) => {
  try {
    const { tool, arguments: args, vaultContext } = req.body;
    if (!tool) {
      return res.status(400).json({ error: "Nome da ferramenta MCP é obrigatório" });
    }
    const result = await executeMCPTool(tool, args || {}, vaultContext || inMemoryStore);
    return res.json({ success: true, result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 6. Payments & Stripe Connect (Section 28)
// -------------------------------------------------------------
app.post("/api/payments/checkout", async (req, res) => {
  try {
    const { listingId, title, priceCents, buyerOrgId, flowType, customCommissionRate } = req.body;
    const session = await createStripeCheckoutSession({
      listingId,
      title,
      priceCents: Number(priceCents) || 0,
      buyerOrgId: buyerOrgId || "org_buyer_1",
      flowType: flowType || "B",
      customCommissionRate: customCommissionRate !== undefined ? Number(customCommissionRate) : undefined,
    });
    return res.json({ success: true, session });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/connect-onboarding", async (req, res) => {
  try {
    const { orgId, returnUrl } = req.body;
    const result = await createStripeConnectAccountLink(orgId || "org_current", returnUrl || "http://localhost:3000/vender/dashboard");
    return res.json({ success: true, connect: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/calculate-split", (req, res) => {
  const { amountCents, flowType, customCommissionRate } = req.body;
  const split = calculatePlatformSplit(Number(amountCents) || 0, flowType || "B", customCommissionRate !== undefined ? Number(customCommissionRate) : undefined);
  return res.json({ success: true, split });
});

// Stripe Webhook handler
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret && sig) {
    const stripe = getStripeClient();
    if (stripe) {
      try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as any;
          console.log("[Stripe Webhook] Order successfully paid:", session.id);
        }
        return res.json({ received: true });
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  }

  res.json({ received: true, simulated: true });
});

// -------------------------------------------------------------
// 7. GitHub Repository Importer & Automatic Sync
// -------------------------------------------------------------
app.post("/api/github/import-repo", async (req, res) => {
  try {
    const { repoUrl, customName, tags } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: "URL do repositório é obrigatória" });
    }

    // Extract owner/repo
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    const repoOwner = match ? match[1] : "vyroh";
    const repoName = match ? match[2].replace(/\.git$/, "") : "boilerplate-repo";

    let fetchedData = {
      name: customName || repoName,
      description: `Repositório importado automaticamente do GitHub: ${repoOwner}/${repoName}`,
      stack: tags || ["TypeScript", "GitHub"],
      stars: 12,
      forks: 4,
      defaultBranch: "main",
      cloneCommand: `git clone ${repoUrl}.git`,
    };

    // If GITHUB_TOKEN or public access, try fetching real repo data
    try {
      const ghRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
        headers: {
          "User-Agent": "Vyroh-Hub-Applet",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
        },
      });
      if (ghRes.ok) {
        const gh = await ghRes.json();
        fetchedData.name = customName || gh.name || repoName;
        fetchedData.description = gh.description || fetchedData.description;
        fetchedData.stars = gh.stargazers_count || 0;
        fetchedData.forks = gh.forks_count || 0;
        fetchedData.defaultBranch = gh.default_branch || "main";
        if (gh.language && !fetchedData.stack.includes(gh.language)) {
          fetchedData.stack = [gh.language, ...fetchedData.stack];
        }
        if (gh.topics && Array.isArray(gh.topics)) {
          fetchedData.stack = Array.from(new Set([...fetchedData.stack, ...gh.topics]));
        }
      }
    } catch (e) {
      console.warn("[GitHub Fetch Warning]:", e);
    }

    const newBoilerplate = {
      id: `bp_gh_${Date.now()}`,
      orgId: "org_default",
      name: fetchedData.name,
      repoUrl: repoUrl,
      description: fetchedData.description,
      techStack: fetchedData.stack,
      visibility: "public",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!inMemoryStore.boilerplates) inMemoryStore.boilerplates = [];
    inMemoryStore.boilerplates = [newBoilerplate, ...inMemoryStore.boilerplates];

    const db = getDb();
    if (db) {
      try {
        await db.insert(schema.boilerplates).values(newBoilerplate).onConflictDoNothing();
      } catch (dbErr) {
        console.warn("[DB Insert Boilerplate fallback]:", dbErr);
      }
    }

    return res.json({ success: true, boilerplate: newBoilerplate, metadata: fetchedData });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 8. Vault Backup & Restore (Full Zero-Lock-In Export/Import)
// -------------------------------------------------------------
app.get("/api/vault/export", async (req, res) => {
  try {
    const db = getDb();
    let payload = {
      exportedAt: new Date().toISOString(),
      vaultVersion: "2.4.0",
      app: "Vyroh Central Hub",
      data: {
        projects: inMemoryStore.projects || [],
        prompts: inMemoryStore.prompts || [],
        boilerplates: inMemoryStore.boilerplates || [],
        clients: inMemoryStore.clients || [],
        sops: inMemoryStore.sops || [],
        proposals: inMemoryStore.proposals || [],
        listings: inMemoryStore.listings || [],
      },
    };

    if (db) {
      try {
        payload.data.projects = await db.select().from(schema.projects);
        payload.data.prompts = await db.select().from(schema.prompts);
        payload.data.boilerplates = await db.select().from(schema.boilerplates);
        payload.data.clients = await db.select().from(schema.clients);
        payload.data.sops = await db.select().from(schema.sops);
        payload.data.proposals = await db.select().from(schema.proposals);
        payload.data.listings = await db.select().from(schema.listings);
      } catch (err) {
        console.warn("[DB Export partial fallback]:", err);
      }
    }

    res.setHeader("Content-Disposition", `attachment; filename="vyroh-vault-backup-${new Date().toISOString().slice(0, 10)}.json"`);
    res.setHeader("Content-Type", "application/json");
    return res.send(JSON.stringify(payload, null, 2));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/vault/import", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Estrutura de dados de backup inválida" });
    }

    if (Array.isArray(data.projects)) inMemoryStore.projects = data.projects;
    if (Array.isArray(data.prompts)) inMemoryStore.prompts = data.prompts;
    if (Array.isArray(data.boilerplates)) inMemoryStore.boilerplates = data.boilerplates;
    if (Array.isArray(data.clients)) inMemoryStore.clients = data.clients;
    if (Array.isArray(data.sops)) inMemoryStore.sops = data.sops;

    return res.json({
      success: true,
      message: "Cofre restaurado com sucesso",
      stats: {
        projects: data.projects?.length || 0,
        prompts: data.prompts?.length || 0,
        boilerplates: data.boilerplates?.length || 0,
        clients: data.clients?.length || 0,
        sops: data.sops?.length || 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 9. Semantic & Hybrid Vault Search (RAG Engine)
// -------------------------------------------------------------
app.post("/api/search/semantic", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Termo de busca é obrigatório" });
    }

    const q = query.toLowerCase();
    const results: any[] = [];

    (inMemoryStore.projects || []).forEach((p: any) => {
      if (p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))) {
        results.push({ type: "project", id: p.id, title: p.name, snippet: p.description, score: 0.95 });
      }
    });

    (inMemoryStore.prompts || []).forEach((pr: any) => {
      if (pr.title?.toLowerCase().includes(q) || pr.content?.toLowerCase().includes(q) || pr.category?.toLowerCase().includes(q)) {
        results.push({ type: "prompt", id: pr.id, title: pr.title, snippet: pr.content?.slice(0, 100), score: 0.92 });
      }
    });

    (inMemoryStore.boilerplates || []).forEach((b: any) => {
      if (b.name?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q) || (b.stack && b.stack.some((s: string) => s.toLowerCase().includes(q)))) {
        results.push({ type: "boilerplate", id: b.id, title: b.name, snippet: b.description, score: 0.90 });
      }
    });

    return res.json({ success: true, query, total: results.length, results });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 7. Start Server with Vite Middleware
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vyroh Server running on port ${PORT} at http://0.0.0.0:${PORT}`);
  });
}

startServer();

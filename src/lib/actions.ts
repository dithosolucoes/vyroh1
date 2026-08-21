import { db, schema } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "./auth";

/**
 * Action: Create Project
 */
export async function createProjectAction(data: {
  name: string;
  description?: string;
  clientId?: string;
  budgetCents?: number;
  roadmapPlan?: any;
}) {
  const { user } = await getSession();
  if (!user) throw new Error("Não autorizado");

  const newId = `prj_${Date.now()}`;
  const [created] = await db
    .insert(schema.projects)
    .values({
      id: newId,
      orgId: user.orgId,
      name: data.name,
      description: data.description,
      clientId: data.clientId,
      budgetCents: data.budgetCents || 0,
      roadmapPlan: data.roadmapPlan || [],
      status: "em_andamento",
    })
    .returning();

  return created;
}

/**
 * Action: Create Prompt
 */
export async function createPromptAction(data: {
  title: string;
  content: string;
  category: string;
  targetModel?: string;
  visibility?: string;
}) {
  const { user } = await getSession();
  if (!user) throw new Error("Não autorizado");

  const newId = `prm_${Date.now()}`;
  const [created] = await db
    .insert(schema.prompts)
    .values({
      id: newId,
      orgId: user.orgId,
      title: data.title,
      content: data.content,
      category: data.category,
      targetModel: data.targetModel || "universal",
      visibility: data.visibility || "private",
    })
    .returning();

  return created;
}

/**
 * Action: Create Client
 */
export async function createClientAction(data: {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
}) {
  const { user } = await getSession();
  if (!user) throw new Error("Não autorizado");

  const newId = `cli_${Date.now()}`;
  const [created] = await db
    .insert(schema.clients)
    .values({
      id: newId,
      orgId: user.orgId,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      status: "ativo",
    })
    .returning();

  return created;
}

/**
 * Action: Update Commission Rule (Section 29)
 */
export async function updateCommissionRuleAction(flowType: string, percentage: number) {
  const { user } = await getSession();
  if (!user || user.role !== "admin") throw new Error("Acesso restrito ao Administrador");

  const [updated] = await db
    .insert(schema.commissionRules)
    .values({
      id: `rule_${flowType.toLowerCase()}`,
      flowType,
      percentage: percentage.toFixed(2),
      label: `Regra Fluxo ${flowType}`,
    })
    .onConflictDoUpdate({
      target: schema.commissionRules.flowType,
      set: {
        percentage: percentage.toFixed(2),
        updatedAt: new Date(),
      },
    })
    .returning();

  return updated;
}

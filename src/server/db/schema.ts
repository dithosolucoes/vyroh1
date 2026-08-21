import { pgTable, varchar, text, timestamp, boolean, bigint, integer, numeric, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. Better-Auth Standard Tables
// ==========================================
export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 50 }).notNull().default("developer"), // developer | agency | seller | buyer | admin
  currentOrgId: varchar("current_org_id", { length: 64 }),
  aiProviderPref: varchar("ai_provider_pref", { length: 50 }).default("gemini"), // gemini | claude | openai | ollama
  customAiApiKey: text("custom_ai_api_key"),
  ollamaBaseUrl: text("ollama_base_url").default("http://localhost:11434"),
  stripeAccountId: varchar("stripe_account_id", { length: 255 }),
  stripeAccountReady: boolean("stripe_account_ready").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  activeOrganizationId: varchar("active_organization_id", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 50 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"), // Hashed password for email/password credentials
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 2. Organizations & Multi-tenancy (Section 16)
// ==========================================
export const organizations = pgTable("organizations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  ownerId: varchar("owner_id", { length: 64 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: varchar("plan_id", { length: 50 }).default("plan_starter"),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull().default("member"), // owner | admin | member | viewer
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 3. Clientes & CRM (Section 13 & 16)
// ==========================================
export const clients = pgTable("clients", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  contactInfo: jsonb("contact_info"),
  status: varchar("status", { length: 50 }).default("ativo"),
  notes: text("notes"),
  totalSpentCents: bigint("total_spent_cents", { mode: "number" }).default(0),
  activeProjectsCount: integer("active_projects_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 4. Projetos & Kanban
// ==========================================
export const projects = pgTable("projects", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("em_andamento"), // briefing | discovery | desenvolvimento | aprovacao | concluido
  clientId: varchar("client_id", { length: 64 }).references(() => clients.id, { onDelete: "set null" }),
  budgetCents: bigint("budget_cents", { mode: "number" }).default(0),
  deadline: timestamp("deadline", { withTimezone: true }),
  tags: jsonb("tags").default([]),
  roadmapPlan: jsonb("roadmap_plan"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const projectTasks = pgTable("project_tasks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("project_id", { length: 64 }).notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  completed: boolean("completed").default(false),
  assignedTo: varchar("assigned_to", { length: 64 }),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 5. Cofre: Prompts, Boilerplates, SOPs
// ==========================================
export const prompts = pgTable("prompts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).default("Geral"),
  targetModel: varchar("target_model", { length: 100 }).default("universal"),
  favorite: boolean("favorite").default(false),
  visibility: varchar("visibility", { length: 50 }).default("private"),
  versionCount: integer("version_count").default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const boilerplates = pgTable("boilerplates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  repoUrl: text("repo_url").notNull(),
  description: text("description"),
  techStack: jsonb("tech_stack").default([]),
  lastUsedProjectId: varchar("last_used_project_id", { length: 64 }).references(() => projects.id, { onDelete: "set null" }),
  visibility: varchar("visibility", { length: 50 }).default("private"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const sops = pgTable("sops", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  steps: jsonb("steps").notNull().default([]),
  checklist: jsonb("checklist").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 5b. MCPs, Skills & Stack de Assinaturas (Tier 2 - Section 5)
// ==========================================
export const mcps = pgTable("mcps", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  endpoint: text("endpoint").notNull(),
  description: text("description"),
  transport: varchar("transport", { length: 50 }).default("sse"),
  toolsCount: integer("tools_count").default(0),
  status: varchar("status", { length: 50 }).default("connected"), // connected | offline
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).default("infra"),
  costMonthlyCents: bigint("cost_monthly_cents", { mode: "number" }).default(0),
  currency: varchar("currency", { length: 10 }).default("BRL"),
  renewalDate: varchar("renewal_date", { length: 20 }),
  paymentMethod: varchar("payment_method", { length: 100 }),
  roiRating: varchar("roi_rating", { length: 50 }).default("bom"),
  status: varchar("status", { length: 50 }).default("active"),
  url: text("url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const roadmapRuns = pgTable("roadmap_runs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  goalDescription: text("goal_description").notNull(),
  generatedPlan: jsonb("generated_plan").notNull(),
  status: varchar("status", { length: 50 }).default("draft"), // draft | in_progress | executed
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 6. Propostas Comerciais & Escrow (Section 13)
// ==========================================
export const proposals = pgTable("proposals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("rascunho"), // rascunho | enviada | aceita | recusada
  tiers: jsonb("tiers").notNull().default([]),
  escrowStatus: varchar("escrow_status", { length: 50 }).default("nenhum"), // retido | liberado | disputado | nenhum
  validUntil: timestamp("valid_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 7. Marketplace & Stripe Connect Split (Section 28 & 29)
// ==========================================
export const listings = pgTable("listings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sellerOrgId: varchar("seller_org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  sellerId: varchar("seller_id", { length: 64 }).notNull().references(() => users.id),
  sellerName: varchar("seller_name", { length: 255 }).notNull(),
  sellerAvatar: text("seller_avatar"),
  type: varchar("type", { length: 50 }).notNull(), // prompt | boilerplate | sop | template | automation
  sourceRecordType: varchar("source_record_type", { length: 50 }),
  sourceRecordId: varchar("source_record_id", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priceCents: bigint("price_cents", { mode: "number" }).notNull(),
  currency: varchar("currency", { length: 10 }).default("BRL"),
  category: varchar("category", { length: 100 }).notNull(),
  licenseType: varchar("license_type", { length: 50 }).default("comercial"),
  flowType: varchar("flow_type", { length: 50 }).default("B"), // A | B | C | D
  status: varchar("status", { length: 50 }).default("publicado"),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("5.00"),
  salesCount: integer("sales_count").default(0),
  previewContent: text("preview_content"),
  fullPayload: jsonb("full_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id", { length: 64 }).primaryKey(),
  listingId: varchar("listing_id", { length: 64 }).notNull().references(() => listings.id),
  sellerId: varchar("seller_id", { length: 64 }).notNull().references(() => users.id),
  sellerOrgId: varchar("seller_org_id", { length: 64 }).notNull().references(() => organizations.id),
  buyerId: varchar("buyer_id", { length: 64 }).notNull().references(() => users.id),
  buyerOrgId: varchar("buyer_org_id", { length: 64 }).notNull().references(() => organizations.id),
  amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
  platformFeeCents: bigint("platform_fee_cents", { mode: "number" }).notNull(),
  sellerPayoutCents: bigint("seller_payout_cents", { mode: "number" }).notNull(),
  flowType: varchar("flow_type", { length: 50 }).default("B"),
  status: varchar("status", { length: 50 }).default("pago"), // pendente | pago | reembolsado
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeTransferId: varchar("stripe_transfer_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const creatorSubscriptions = pgTable("creator_subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  listingId: varchar("listing_id", { length: 64 }).notNull().references(() => listings.id),
  subscriberOrgId: varchar("subscriber_org_id", { length: 64 }).notNull().references(() => organizations.id),
  amountMonthlyCents: bigint("amount_monthly_cents", { mode: "number" }).notNull(),
  status: varchar("status", { length: 50 }).default("active"), // active | cancelled
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const sellerAccounts = pgTable("seller_accounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orgId: varchar("org_id", { length: 64 }).notNull().references(() => organizations.id, { onDelete: "cascade" }).unique(),
  stripeConnectAccountId: varchar("stripe_connect_account_id", { length: 255 }),
  kycStatus: varchar("kyc_status", { length: 50 }).default("pending"), // pending | verified | required
  totalEarningsCents: bigint("total_earnings_cents", { mode: "number" }).default(0),
  pendingBalanceCents: bigint("pending_balance_cents", { mode: "number" }).default(0),
  availableBalanceCents: bigint("available_balance_cents", { mode: "number" }).default(0),
  payouts: jsonb("payouts").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Section 29: Commission Rules (Governança e Edição de Taxas sem redeploy)
export const commissionRules = pgTable("commission_rules", {
  id: varchar("id", { length: 64 }).primaryKey(),
  flowType: varchar("flow_type", { length: 50 }).notNull().unique(), // A | B | C | D
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 8. Comunidade & Suporte (Section 13)
// ==========================================
export const communityPosts = pgTable("community_posts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  authorId: varchar("author_id", { length: 64 }).notNull().references(() => users.id),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorAvatar: text("author_avatar"),
  authorRole: varchar("author_role", { length: 50 }).default("Membro"),
  category: varchar("category", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  tags: jsonb("tags").default([]),
  likesCount: integer("likes_count").default(0),
  repliesCount: integer("replies_count").default(0),
  solved: boolean("solved").default(false),
  aiMatchedSolutions: jsonb("ai_matched_solutions").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const communityComments = pgTable("community_comments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  postId: varchar("post_id", { length: 64 }).notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  authorId: varchar("author_id", { length: 64 }).notNull().references(() => users.id),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isSolution: boolean("is_solution").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Relacionamentos Drizzle
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  prompts: many(prompts),
  orders: many(orders),
  listings: many(listings),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, { fields: [organizations.ownerId], references: [users.id] }),
  memberships: many(memberships),
  projects: many(projects),
  clients: many(clients),
  prompts: many(prompts),
  boilerplates: many(boilerplates),
  sops: many(sops),
  proposals: many(proposals),
  listings: many(listings),
}));

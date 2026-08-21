export type UserRole = 'owner' | 'seller' | 'buyer' | 'admin' | 'collaborator';

export type PortalDomain = 'vault' | 'marketplace' | 'seller' | 'admin' | 'landing';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  orgId: string;
  plan: 'free' | 'pro' | 'enterprise';
  bio?: string;
  aiProviderPref?: 'gemini' | 'claude' | 'openai' | 'ollama';
  stripeConnectStatus?: 'verified' | 'pending' | 'unlinked';
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  plan: string;
  createdAt: string;
}

export interface Project {
  id: string;
  orgId: string;
  name: string;
  description: string;
  status: 'lead' | 'active' | 'in_progress' | 'completed' | 'archived';
  clientId?: string;
  clientName?: string;
  budget?: number;
  deadline?: string;
  promptIds: string[];
  boilerplateIds: string[];
  mcpIds?: string[];
  tags: string[];
  notes?: string;
  activityHistory: {
    id: string;
    action: string;
    timestamp: string;
    author: string;
  }[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  changeNotes: string;
  createdAt: string;
}

export interface Prompt {
  id: string;
  orgId: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: 'code' | 'marketing' | 'sales' | 'product' | 'copywriting' | 'agent' | 'custom';
  isFavorite: boolean;
  visibility: 'private' | 'shared' | 'public';
  version: number;
  versions: PromptVersion[];
  variables?: string[];
  lastResult?: {
    output: string;
    latencyMs: number;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Boilerplate {
  id: string;
  orgId: string;
  name: string;
  description: string;
  repoUrl: string;
  stack: string[];
  cloneCommand: string;
  lastUsedProjectId?: string;
  lastUsedProjectName?: string;
  visibility: 'private' | 'shared' | 'public';
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai_agent' | 'mcp';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  orgId: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: 'prospect' | 'active' | 'completed' | 'inactive';
  notes: string;
  totalValue: number;
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SOPStep {
  id: string;
  title: string;
  details?: string;
  instructions?: string;
  commandSnippet?: string;
  completed: boolean;
}

export interface SOP {
  id: string;
  orgId: string;
  title: string;
  description: string;
  category: 'onboarding' | 'deploy' | 'launch' | 'marketing' | 'support' | 'sales' | 'security';
  steps: SOPStep[];
  tags?: string[];
  estimatedMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  orgId: string;
  serviceName: string;
  category: 'infra' | 'ai' | 'design' | 'dev_tools' | 'marketing' | 'database';
  costMonthly: number;
  currency: string;
  renewalDate: string;
  paymentMethod: string;
  roiRating: 'excelente' | 'bom' | 'neutro' | 'revisar_cancelamento';
  status: 'active' | 'paused' | 'cancelled';
  url: string;
}

export interface Proposal {
  id: string;
  orgId: string;
  title: string;
  clientName: string;
  clientId?: string;
  totalAmount: number;
  currency: string;
  scopeItems: string[];
  timelineWeeks: number;
  terms: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface MCP {
  id: string;
  orgId: string;
  name: string;
  endpoint: string;
  description: string;
  transport: 'stdio' | 'sse' | 'http';
  toolsCount: number;
  tools: string[];
  status: 'connected' | 'offline';
  createdAt: string;
}

export interface Skill {
  id: string;
  orgId: string;
  name: string;
  description: string;
  fileRef: string;
  category: 'dev' | 'analysis' | 'automation' | 'generation';
  promptTrigger: string;
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  duration: string;
  deliverables: string[];
  toolsNeeded: string[];
  vaultAssetMatched?: string;
}

export interface ProfessionalNeeded {
  needed: boolean;
  role: string;
  skills: string[];
  estimatedHours: string;
  reason: string;
}

export interface RoadmapRun {
  id: string;
  orgId: string;
  goalDescription: string;
  title: string;
  complexity: string;
  targetWeeks: string;
  summary: string;
  matchedAssets: {
    type: string;
    name: string;
    reason: string;
  }[];
  steps: RoadmapStep[];
  gaps: string[];
  professionalNeeded?: ProfessionalNeeded;
  status: 'draft' | 'in_progress' | 'executed';
  createdAt: string;
}

// Marketplace & Monetization (Flows A, B, C, D)
export type MonetizationFlow = 'flow_a_asset' | 'flow_b_bundle' | 'flow_c_template' | 'flow_d_subscription';
export type ListingType = 'digital_product' | 'creator_subscription' | 'service';
export type LicenseType = 'personal' | 'commercial' | 'commercial_solo' | 'resale' | 'extended' | 'mit' | 'agency_unlimited';
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export type PromptItem = Prompt;
export type SOPItem = SOP;

export interface AIRoadmapResult {
  title: string;
  description: string;
  reusedAssets: {
    prompts: Prompt[];
    boilerplates: Boilerplate[];
  };
  missingAssets: string[];
  phases: {
    name: string;
    estimatedDays: number;
    tasks: string[];
    suggestedVaultItems: string[];
  }[];
}

export interface AdminSystemConfig {
  commissionRates: {
    flow_a_asset: number;
    flow_b_bundle: number;
    flow_c_template: number;
    flow_d_subscription: number;
  };
  minPriceCents: number;
  maxPriceCents: number;
  planPricing: {
    proMonthlyCents: number;
    enterpriseMonthlyCents: number;
  };
  allowedLicenseTypes: string[];
  kycRequirements: {
    requireStripeConnect: boolean;
    requireDocumentVerification: boolean;
  };
  aiEngineLimits: {
    defaultModel: string;
    maxMonthlyTokensPerFreeUser: number;
  };
}

export interface Listing {
  id: string;
  sellerId?: string;
  sellerOrgId: string;
  sellerName: string;
  sellerAvatar?: string;
  type: ListingType;
  monetizationFlow?: MonetizationFlow;
  billingPeriod?: 'one_time' | 'monthly' | 'yearly';
  assetType?: string;
  repoAccessUrl?: string;
  sourceRecordType?: 'prompt' | 'boilerplate' | 'sop' | 'bundle';
  sourceRecordId?: string;
  title: string;
  description: string;
  priceCents: number; // e.g. 9700 = R$ 97,00
  currency: string;
  licenseType: LicenseType;
  status: 'active' | 'paused' | 'under_review';
  rating: number;
  reviewsCount: number;
  salesCount: number;
  tags: string[];
  category: string;
  includedItems: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: ListingType;
  buyerOrgId: string;
  buyerName: string;
  amountCents: number;
  platformFeeCents: number;
  sellerPayoutCents: number;
  licenseType: LicenseType;
  status: 'completed' | 'refunded';
  paymentMethod?: string;
  licenseKey?: string;
  downloadUrl?: string;
  itemAccessUrl?: string;
  repoAccessUrl?: string;
  downloadContent?: string;
  createdAt: string;
}

export interface CreatorSubscription {
  id: string;
  listingId: string;
  listingTitle: string;
  creatorName: string;
  subscriberOrgId: string;
  amountMonthlyCents: number;
  status: 'active' | 'cancelled';
  currentPeriodEnd: string;
  createdAt: string;
}

export interface SellerAccount {
  id: string;
  orgId: string;
  stripeConnectAccountId: string;
  kycStatus: 'verified' | 'pending' | 'required';
  totalEarningsCents: number;
  pendingBalanceCents: number;
  availableBalanceCents: number;
  payouts: {
    id: string;
    amountCents: number;
    date: string;
    status: 'completed' | 'processing';
  }[];
}

// Community Forum
export interface CommunityTopic {
  id: string;
  title: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  category: 'dev' | 'marketing' | 'design' | 'business' | 'ai' | 'automation';
  content: string;
  tags: string[];
  answersCount: number;
  likesCount: number;
  isSolved: boolean;
  aiAnalysis?: {
    summaryAnswer: string;
    recommendedAssets: { type: string; name: string; reason: string }[];
    recommendedExperts: { name: string; role: string; rating: string }[];
  };
  replies: {
    id: string;
    authorName: string;
    authorAvatar?: string;
    authorRole: string;
    content: string;
    isAccepted: boolean;
    likes: number;
    createdAt: string;
  }[];
  createdAt: string;
}

// Admin Configurable Engine (Section 29)
export interface CommissionRule {
  id: string;
  flowType: 'A' | 'B' | 'C' | 'D';
  name: string;
  percentage: number;
  description: string;
  updatedAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  period: 'monthly' | 'yearly';
  features: string[];
  limits: {
    projects: number;
    prompts: number;
    boilerplates: number;
    aiCallsPerMonth: number;
    marketplaceSelling: boolean;
  };
  isPopular?: boolean;
  active: boolean;
}

export interface LicenseTypeConfig {
  id: string;
  code: LicenseType;
  name: string;
  description: string;
  terms: string[];
  active: boolean;
}

export interface CategoryConfig {
  id: string;
  name: string;
  area: 'dev' | 'business' | 'marketing' | 'design' | 'ai' | 'automation';
  slug: string;
  description: string;
  active: boolean;
}

export interface KYCRequirement {
  id: string;
  context: 'digital_product' | 'creator_subscription' | 'service' | 'payout_above_threshold';
  name: string;
  levelRequired: 'standard' | 'express_id' | 'full_business_tax';
  description: string;
}

export interface AIUsageLimit {
  id: string;
  planId: string;
  planName: string;
  provider: string;
  monthlyCallLimit: number;
  currentUsed: number;
}

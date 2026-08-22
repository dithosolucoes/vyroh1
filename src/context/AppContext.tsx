"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  UserRole,
  PortalDomain,
  Project,
  Prompt,
  PromptVersion,
  Boilerplate,
  Client,
  SOP,
  Subscription,
  Proposal,
  MCP,
  Skill,
  RoadmapRun,
  Listing,
  Order,
  CreatorSubscription,
  SellerAccount,
  CommunityTopic,
  CommissionRule,
  PricingPlan,
  LicenseTypeConfig,
  CategoryConfig,
  KYCRequirement,
  AIUsageLimit,
  SubscriptionPlan,
  AdminSystemConfig,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_PROMPTS,
  INITIAL_BOILERPLATES,
  INITIAL_CLIENTS,
  INITIAL_SOPS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PROPOSALS,
  INITIAL_MCPS,
  INITIAL_SKILLS,
  INITIAL_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_CREATOR_SUBSCRIPTIONS,
  INITIAL_SELLER_ACCOUNT,
  INITIAL_COMMUNITY_TOPICS,
  INITIAL_COMMISSION_RULES,
  INITIAL_PRICING_PLANS,
  INITIAL_LICENSE_TYPES,
  INITIAL_CATEGORIES,
  INITIAL_KYC_REQUIREMENTS,
  INITIAL_AI_USAGE_LIMITS,
} from '../data/mockData';

export type ActiveView =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'projetos'
  | 'projeto_detalhe'
  | 'prompts'
  | 'prompt_detalhe'
  | 'boilerplates'
  | 'clientes'
  | 'sops'
  | 'stack'
  | 'propostas'
  | 'mcps'
  | 'cerebro'
  | 'marketplace'
  | 'loja_vendedor'
  | 'vender'
  | 'vender_dashboard'
  | 'minhas_compras'
  | 'assinaturas'
  | 'comunidade'
  | 'admin_configuracoes'
  | 'configuracoes';

export type AiProvider = 'gemini' | 'claude' | 'openai' | 'ollama';

export function getDomainForView(view: ActiveView): PortalDomain {
  if (view === 'admin_configuracoes' || (view as string) === 'admin_config') return 'admin';
  if (view === 'vender' || view === 'vender_dashboard' || view === 'loja_vendedor') return 'seller';
  if (view === 'marketplace' || view === 'minhas_compras' || view === 'assinaturas' || view === 'comunidade') return 'marketplace';
  if (view === 'landing') return 'landing';
  return 'vault';
}

interface AppContextType {
  // Auth & Session
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchRole: (role: User['role']) => void;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, role?: string) => Promise<boolean>;
  logout: () => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Workspace / Portal Domain Partitioning
  portalDomain: PortalDomain;
  setPortalDomain: (portal: PortalDomain) => void;

  // Navigation & Real URL Routing (Section 14)
  activeView: ActiveView;
  setActiveView: (view: ActiveView, customId?: string | null) => void;
  navigate: (path: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedPromptId: string | null;
  setSelectedPromptId: (id: string | null) => void;
  selectedSellerId: string | null;
  setSelectedSellerId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Multi-Provider AI (Section 10.5)
  aiProvider: AiProvider;
  setAiProvider: (provider: AiProvider) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  runAiCompletion: (prompt: string, systemInstruction?: string, options?: any) => Promise<any>;

  // Data Collections (Synchronized with Backend API & Postgres)
  projects: Project[];
  prompts: Prompt[];
  boilerplates: Boilerplate[];
  clients: Client[];
  sops: SOP[];
  subscriptions: Subscription[];
  proposals: Proposal[];
  mcps: MCP[];
  skills: Skill[];
  roadmapRuns: RoadmapRun[];
  listings: Listing[];
  orders: Order[];
  creatorSubscriptions: CreatorSubscription[];
  sellerAccount: SellerAccount;
  communityTopics: CommunityTopic[];

  // Admin Configs (Section 29)
  commissionRules: CommissionRule[];
  pricingPlans: PricingPlan[];
  licenseTypes: LicenseTypeConfig[];
  categories: CategoryConfig[];
  kycRequirements: KYCRequirement[];
  aiUsageLimits: AIUsageLimit[];

  // Action Handlers
  addProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addPrompt: (data: Partial<Prompt>) => Promise<Prompt>;
  updatePrompt: (id: string, data: Partial<Prompt>) => Promise<void>;
  updatePromptVersion: (id: string, newContent: string, changeNotes: string) => Promise<void>;
  toggleFavoritePrompt: (id: string) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  testPromptAI: (promptId: string, variables?: Record<string, string>) => Promise<{ output: string; latencyMs: number }>;

  addBoilerplate: (data: Partial<Boilerplate>) => Promise<Boilerplate>;
  updateBoilerplate: (id: string, data: Partial<Boilerplate>) => Promise<void>;
  deleteBoilerplate: (id: string) => Promise<void>;

  addClient: (data: Partial<Client>) => Promise<Client>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  addSOP: (data: Partial<SOP>) => Promise<SOP>;
  updateSOP: (id: string, data: Partial<SOP>) => Promise<void>;
  toggleSOPStep: (sopId: string, stepId: string) => Promise<void>;
  deleteSOP: (id: string) => Promise<void>;

  addSubscription: (data: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;

  addProposal: (data: Partial<Proposal>) => Promise<void>;
  updateProposalStatus: (id: string, status: Proposal['status']) => Promise<void>;

  addMCP: (data: Partial<MCP>) => Promise<void>;
  toggleMCPStatus: (id: string) => Promise<void>;

  generateRoadmap: (goal: string, timeline?: string) => Promise<RoadmapRun>;
  convertRoadmapToProject: (roadmap: RoadmapRun) => Promise<Project>;

  // Marketplace Actions
  addListing: (data: Partial<Listing>) => Promise<Listing>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  pauseListing: (id: string) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  selectedListingForCheckout: Listing | null;
  setSelectedListingForCheckout: (listing: Listing | null) => void;
  purchaseListing: (listing: Listing, licenseType: Listing['licenseType']) => Promise<Order>;
  subscribeToCreator: (listing: Listing) => Promise<CreatorSubscription>;
  cancelCreatorSubscription: (id: string) => void;
  requestSellerPayout: (amountCents: number) => boolean;
  upgradePlan: (planId: SubscriptionPlan) => Promise<void>;

  // Community Actions
  createCommunityTopic: (data: Partial<CommunityTopic>) => Promise<CommunityTopic>;
  addTopicReply: (topicId: string, content: string) => Promise<void>;
  upvoteTopic: (topicId: string) => Promise<void>;

  // Admin Config Actions
  adminConfig: AdminSystemConfig;
  updateAdminConfig: (data: Partial<AdminSystemConfig>) => void;
  updateCommissionRule: (flowType: string, percentage: number) => Promise<void>;
  updatePricingPlan: (id: string, data: Partial<PricingPlan>) => void;
  updateLicenseType: (id: string, data: Partial<LicenseTypeConfig>) => void;
  updateCategory: (id: string, data: Partial<CategoryConfig>) => void;
  updateKYCRequirement: (id: string, data: Partial<KYCRequirement>) => void;
  updateAIUsageLimit: (id: string, limit: number) => void;

  // Vault Backup & Sovereignty (Anti lock-in)
  exportVaultBackup: () => string;
  importVaultBackup: (jsonStr: string) => boolean;

  // Modals & Notifications
  activeModal: string | null;
  openModal: (modalName: string, modalProps?: any) => void;
  closeModal: () => void;
  modalProps: any;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'vyroh_hub_';

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Map real browser URL path to ActiveView state and entity IDs (Section 14)
function parsePathToView(pathname: string): { view: ActiveView; entityId: string | null } {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean || clean === 'dashboard') return { view: 'dashboard', entityId: null };
  if (clean === 'login') return { view: 'login', entityId: null };
  if (clean === 'register') return { view: 'register', entityId: null };
  if (clean === 'projetos') return { view: 'projetos', entityId: null };
  if (clean.startsWith('projetos/')) {
    const id = clean.split('/')[1];
    return { view: 'projeto_detalhe', entityId: id || null };
  }
  if (clean === 'prompts' || clean === 'cofre/prompts') return { view: 'prompts', entityId: null };
  if (clean.startsWith('cofre/prompts/') || clean.startsWith('prompts/')) {
    const parts = clean.split('/');
    const id = parts[parts.length - 1];
    return { view: 'prompts', entityId: id || null };
  }
  if (clean === 'boilerplates' || clean === 'cofre/boilerplates') return { view: 'boilerplates', entityId: null };
  if (clean === 'sops' || clean === 'cofre/sops') return { view: 'sops', entityId: null };
  if (clean === 'clientes') return { view: 'clientes', entityId: null };
  if (clean === 'stack') return { view: 'stack', entityId: null };
  if (clean === 'propostas') return { view: 'propostas', entityId: null };
  if (clean === 'cerebro') return { view: 'cerebro', entityId: null };
  if (clean === 'mcp' || clean === 'mcps') return { view: 'mcps', entityId: null };
  if (clean === 'marketplace') return { view: 'marketplace', entityId: null };
  if (clean.startsWith('loja/')) {
    const id = clean.split('/')[1];
    return { view: 'loja_vendedor', entityId: id || null };
  }
  if (clean === 'vendedor' || clean === 'vender' || clean === 'vender/dashboard') return { view: 'vender_dashboard', entityId: null };
  if (clean === 'minhas-compras' || clean === 'minhas_compras') return { view: 'minhas_compras', entityId: null };
  if (clean === 'assinaturas') return { view: 'assinaturas', entityId: null };
  if (clean === 'comunidade') return { view: 'comunidade', entityId: null };
  if (clean === 'configuracoes') return { view: 'configuracoes', entityId: null };
  if (clean === 'admin/configuracoes' || clean === 'admin_configuracoes') return { view: 'admin_configuracoes', entityId: null };
  return { view: 'dashboard', entityId: null };
}

// Convert ActiveView and ID back to canonical URL path
function formatViewToPath(view: ActiveView, entityId?: string | null): string {
  switch (view) {
    case 'dashboard': return '/dashboard';
    case 'login': return '/login';
    case 'register': return '/register';
    case 'projetos': return '/projetos';
    case 'projeto_detalhe': return entityId ? `/projetos/${entityId}` : '/projetos';
    case 'prompts': return entityId ? `/cofre/prompts/${entityId}` : '/cofre/prompts';
    case 'prompt_detalhe': return entityId ? `/cofre/prompts/${entityId}` : '/cofre/prompts';
    case 'boilerplates': return '/cofre/boilerplates';
    case 'sops': return '/cofre/sops';
    case 'clientes': return '/clientes';
    case 'stack': return '/stack';
    case 'propostas': return '/propostas';
    case 'cerebro': return '/cerebro';
    case 'mcps': return '/mcp';
    case 'marketplace': return '/marketplace';
    case 'loja_vendedor': return entityId ? `/loja/${entityId}` : '/marketplace';
    case 'vender':
    case 'vender_dashboard': return '/vendedor';
    case 'minhas_compras': return '/minhas-compras';
    case 'assinaturas': return '/assinaturas';
    case 'comunidade': return '/comunidade';
    case 'configuracoes': return '/configuracoes';
    case 'admin_configuracoes': return '/admin/configuracoes';
    default: return '/dashboard';
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real Next.js router — navegação de verdade (troca a página renderizada), não só a URL na barra
  const router = useRouter();

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (loadStorage('vyroh-theme', 'dark') as 'dark' | 'light');
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('vyroh-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth & Session
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return loadStorage<User>('current_user', INITIAL_USERS[0]);
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return loadStorage<boolean>('is_auth', true);
  });

  // AI Provider & Model Selection (Section 10.5)
  const [aiProvider, setAiProvider] = useState<AiProvider>(() => {
    return loadStorage<AiProvider>('ai_provider', 'gemini');
  });
  const [aiModel, setAiModel] = useState<string>(() => {
    return loadStorage<string>('ai_model', 'gemini-3.7-flash');
  });

  useEffect(() => {
    saveStorage('ai_provider', aiProvider);
  }, [aiProvider]);

  useEffect(() => {
    saveStorage('ai_model', aiModel);
  }, [aiModel]);

  // Real URL Navigation State
  const [activeView, setActiveViewState] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const parsed = parsePathToView(window.location.pathname);
      return parsed.view;
    }
    return 'dashboard';
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const parsed = parsePathToView(window.location.pathname);
      if (parsed.view === 'projeto_detalhe' && parsed.entityId) return parsed.entityId;
    }
    return 'proj_1';
  });

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const parsed = parsePathToView(window.location.pathname);
      if (parsed.view === 'prompts' && parsed.entityId) return parsed.entityId;
    }
    return 'prm_1';
  });

  const [selectedListingForCheckout, setSelectedListingForCheckout] = useState<Listing | null>(null);

  const [adminConfig, setAdminConfig] = useState<AdminSystemConfig>(() =>
    loadStorage('admin_config', {
      commissionRates: {
        flow_a_asset: 0,
        flow_b_bundle: 10,
        flow_c_template: 12.5,
        flow_d_subscription: 15,
      },
      minPriceCents: 500,
      maxPriceCents: 5000000,
      planPricing: {
        proMonthlyCents: 8900,
        enterpriseMonthlyCents: 19900,
      },
      allowedLicenseTypes: ['personal', 'commercial', 'commercial_solo', 'resale', 'extended', 'mit', 'agency_unlimited'],
      kycRequirements: {
        requireStripeConnect: true,
        requireDocumentVerification: false,
      },
      aiEngineLimits: {
        defaultModel: 'gemini-2.5-flash',
        maxMonthlyTokensPerFreeUser: 50000,
      },
    } as AdminSystemConfig)
  );

  useEffect(() => saveStorage('admin_config', adminConfig), [adminConfig]);

  const updateAdminConfig = (data: Partial<AdminSystemConfig>) => {
    setAdminConfig((prev) => ({ ...prev, ...data }));
    showToast('Configuração administrável atualizada.');
  };

  const [selectedSellerId, setSelectedSellerId] = useState<string | null>('usr_seller_1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [portalDomain, setPortalDomainState] = useState<PortalDomain>(() => {
    return getDomainForView(activeView);
  });

  useEffect(() => {
    setPortalDomainState(getDomainForView(activeView));
  }, [activeView]);

  // Real navigation (Section 14): usa o router do Next.js, não só reescreve a URL.
  // Isso é o que faz o conteúdo da tela realmente trocar quando o usuário clica no menu.
  const navigate = useCallback((path: string) => {
    router.push(path);
    const parsed = parsePathToView(path);
    setActiveViewState(parsed.view);
    if (parsed.view === 'projeto_detalhe' && parsed.entityId) setSelectedProjectId(parsed.entityId);
    if (parsed.view === 'loja_vendedor' && parsed.entityId) setSelectedSellerId(parsed.entityId);
    if (parsed.view === 'prompts' && parsed.entityId) setSelectedPromptId(parsed.entityId);
  }, [router]);

  const setActiveView = useCallback((view: ActiveView, customId?: string | null) => {
    setActiveViewState(view);
    if (view === 'projeto_detalhe' && customId) setSelectedProjectId(customId);
    if (view === 'loja_vendedor' && customId) setSelectedSellerId(customId);
    if (view === 'prompts' && customId) setSelectedPromptId(customId);

    const canonicalPath = formatViewToPath(view, customId || (view === 'projeto_detalhe' ? selectedProjectId : view === 'loja_vendedor' ? selectedSellerId : undefined));
    if (typeof window !== 'undefined' && window.location.pathname !== canonicalPath) {
      router.push(canonicalPath);
    }
  }, [selectedProjectId, selectedSellerId, router]);

  const setPortalDomain = useCallback((portal: PortalDomain) => {
    setPortalDomainState(portal);
    switch (portal) {
      case 'vault':
        setActiveView('dashboard');
        break;
      case 'marketplace':
        setActiveView('marketplace');
        break;
      case 'seller':
        setActiveView('vender_dashboard');
        break;
      case 'admin':
        setActiveView('admin_configuracoes');
        break;
      case 'landing':
        setActiveView('landing');
        break;
    }
  }, [setActiveView]);

  // Listen to browser Back and Forward navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePathToView(window.location.pathname);
      setActiveViewState(parsed.view);
      if (parsed.view === 'projeto_detalhe' && parsed.entityId) setSelectedProjectId(parsed.entityId);
      if (parsed.view === 'loja_vendedor' && parsed.entityId) setSelectedSellerId(parsed.entityId);
      if (parsed.view === 'prompts' && parsed.entityId) setSelectedPromptId(parsed.entityId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Modals & Toasts
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openModal = (modalName: string, props: any = null) => {
    setActiveModal(modalName);
    setModalProps(props);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalProps(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Data Collections
  const [projects, setProjects] = useState<Project[]>(() => loadStorage('projects', INITIAL_PROJECTS));
  const [prompts, setPrompts] = useState<Prompt[]>(() => loadStorage('prompts', INITIAL_PROMPTS));
  const [boilerplates, setBoilerplates] = useState<Boilerplate[]>(() => loadStorage('boilerplates', INITIAL_BOILERPLATES));
  const [clients, setClients] = useState<Client[]>(() => loadStorage('clients', INITIAL_CLIENTS));
  const [sops, setSOPs] = useState<SOP[]>(() => loadStorage('sops', INITIAL_SOPS));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadStorage('subscriptions', INITIAL_SUBSCRIPTIONS));
  const [proposals, setProposals] = useState<Proposal[]>(() => loadStorage('proposals', INITIAL_PROPOSALS));
  const [mcps, setMCPs] = useState<MCP[]>(() => loadStorage('mcps', INITIAL_MCPS));
  const [skills] = useState<Skill[]>(INITIAL_SKILLS);
  const [roadmapRuns, setRoadmapRuns] = useState<RoadmapRun[]>(() => loadStorage('roadmaps', []));

  // Marketplace & Orders
  const [listings, setListings] = useState<Listing[]>(() => loadStorage('listings', INITIAL_LISTINGS));
  const [orders, setOrders] = useState<Order[]>(() => loadStorage('orders', INITIAL_ORDERS));
  const [creatorSubscriptions, setCreatorSubscriptions] = useState<CreatorSubscription[]>(() =>
    loadStorage('creator_subs', INITIAL_CREATOR_SUBSCRIPTIONS)
  );
  const [sellerAccount, setSellerAccount] = useState<SellerAccount>(() => loadStorage('seller_account', INITIAL_SELLER_ACCOUNT));
  const [communityTopics, setCommunityTopics] = useState<CommunityTopic[]>(() => loadStorage('community_topics', INITIAL_COMMUNITY_TOPICS));

  // Admin Configs (Section 29)
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(() => loadStorage('commission_rules', INITIAL_COMMISSION_RULES));
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(() => loadStorage('pricing_plans', INITIAL_PRICING_PLANS));
  const [licenseTypes, setLicenseTypes] = useState<LicenseTypeConfig[]>(() => loadStorage('license_types', INITIAL_LICENSE_TYPES));
  const [categories, setCategories] = useState<CategoryConfig[]>(() => loadStorage('categories', INITIAL_CATEGORIES));
  const [kycRequirements, setKycRequirements] = useState<KYCRequirement[]>(() => loadStorage('kyc_reqs', INITIAL_KYC_REQUIREMENTS));
  const [aiUsageLimits, setAiUsageLimits] = useState<AIUsageLimit[]>(() => loadStorage('ai_limits', INITIAL_AI_USAGE_LIMITS));

  // Helper for authenticated API calls with Bearer Token
  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vyroh_auth_token') || 'sess_default' : 'sess_default';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    };
    return fetch(url, { ...options, headers });
  };

  // Full Initial Synchronization with PostgreSQL / Express REST Backend
  useEffect(() => {
    const syncFromBackend = async () => {
      try {
        const [
          projRes,
          prmRes,
          bpRes,
          sopRes,
          cliRes,
          propRes,
          listRes,
          ordRes,
          topRes,
          commRes,
        ] = await Promise.allSettled([
          apiFetch('/api/projects').then((r) => r.json()),
          apiFetch('/api/prompts').then((r) => r.json()),
          apiFetch('/api/boilerplates').then((r) => r.json()),
          apiFetch('/api/sops').then((r) => r.json()),
          apiFetch('/api/clients').then((r) => r.json()),
          apiFetch('/api/proposals').then((r) => r.json()),
          apiFetch('/api/marketplace/listings').then((r) => r.json()),
          apiFetch('/api/orders').then((r) => r.json()),
          apiFetch('/api/community/topics').then((r) => r.json()),
          apiFetch('/api/admin/commission-rules').then((r) => r.json()),
        ]);

        if (projRes.status === 'fulfilled' && projRes.value?.data?.length > 0) setProjects(projRes.value.data);
        if (prmRes.status === 'fulfilled' && prmRes.value?.data?.length > 0) setPrompts(prmRes.value.data);
        if (bpRes.status === 'fulfilled' && bpRes.value?.data?.length > 0) setBoilerplates(bpRes.value.data);
        if (sopRes.status === 'fulfilled' && sopRes.value?.data?.length > 0) setSOPs(sopRes.value.data);
        if (cliRes.status === 'fulfilled' && cliRes.value?.data?.length > 0) setClients(cliRes.value.data);
        if (propRes.status === 'fulfilled' && propRes.value?.data?.length > 0) setProposals(propRes.value.data);
        if (listRes.status === 'fulfilled' && listRes.value?.data?.length > 0) setListings(listRes.value.data);
        if (ordRes.status === 'fulfilled' && ordRes.value?.data?.length > 0) setOrders(ordRes.value.data);
        if (topRes.status === 'fulfilled' && topRes.value?.data?.length > 0) setCommunityTopics(topRes.value.data);
        if (commRes.status === 'fulfilled' && commRes.value?.rules?.length > 0) setCommissionRules(commRes.value.rules);
      } catch (err) {
        console.warn('[Sync with Backend]: Using cached state fallback', err);
      }
    };

    syncFromBackend();
  }, []);

  // Save changes locally for offline tolerance
  useEffect(() => saveStorage('projects', projects), [projects]);
  useEffect(() => saveStorage('prompts', prompts), [prompts]);
  useEffect(() => saveStorage('boilerplates', boilerplates), [boilerplates]);
  useEffect(() => saveStorage('clients', clients), [clients]);
  useEffect(() => saveStorage('sops', sops), [sops]);
  useEffect(() => saveStorage('subscriptions', subscriptions), [subscriptions]);
  useEffect(() => saveStorage('proposals', proposals), [proposals]);
  useEffect(() => saveStorage('mcps', mcps), [mcps]);
  useEffect(() => saveStorage('roadmaps', roadmapRuns), [roadmapRuns]);
  useEffect(() => saveStorage('listings', listings), [listings]);
  useEffect(() => saveStorage('orders', orders), [orders]);
  useEffect(() => saveStorage('creator_subs', creatorSubscriptions), [creatorSubscriptions]);
  useEffect(() => saveStorage('seller_account', sellerAccount), [sellerAccount]);
  useEffect(() => saveStorage('community_topics', communityTopics), [communityTopics]);
  useEffect(() => saveStorage('commission_rules', commissionRules), [commissionRules]);
  useEffect(() => saveStorage('pricing_plans', pricingPlans), [pricingPlans]);
  useEffect(() => saveStorage('license_types', licenseTypes), [licenseTypes]);
  useEffect(() => saveStorage('categories', categories), [categories]);
  useEffect(() => saveStorage('kyc_reqs', kycRequirements), [kycRequirements]);
  useEffect(() => saveStorage('ai_limits', aiUsageLimits), [aiUsageLimits]);

  // Auth Operations
  const switchRole = (role: User['role']) => {
    const matched = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matched);
    saveStorage('current_user', matched);

    if (role === 'seller') {
      setActiveView('vender_dashboard');
    } else if (role === 'buyer') {
      setActiveView('marketplace');
    } else if (role === 'admin') {
      setActiveView('admin_configuracoes');
    } else if (role === 'collaborator') {
      setActiveView('projetos');
    } else {
      setActiveView('dashboard');
    }

    showToast(`Perfil alterado para: ${matched.name} (${matched.role.toUpperCase()})`);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('vyroh_auth_token', data.token);
        }
        saveStorage('current_user', data.user);
        saveStorage('is_auth', true);
        setActiveView('dashboard');
        showToast(`Bem-vindo de volta ao seu cofre, ${data.user.name}!`);
        return true;
      }
    } catch (e) {
      console.warn('API login fallback:', e);
    }

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    setCurrentUser(found);
    setIsAuthenticated(true);
    saveStorage('current_user', found);
    saveStorage('is_auth', true);
    setActiveView('dashboard');
    showToast(`Bem-vindo de volta ao seu cofre, ${found.name}!`);
    return true;
  };

  const register = async (name: string, email: string, pass: string, role?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('vyroh_auth_token', data.token);
        }
        saveStorage('current_user', data.user);
        saveStorage('is_auth', true);
        setActiveView('dashboard');
        showToast(`Cofre criado com sucesso! Bem-vindo, ${data.user.name}.`);
        return true;
      }
    } catch (e) {
      console.warn('API register fallback:', e);
    }
    return login(email, pass);
  };

  const logout = () => {
    apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vyroh_auth_token');
    }
    setIsAuthenticated(false);
    saveStorage('is_auth', false);
    setActiveView('login');
    showToast('Sessão encerrada com segurança.');
  };

  // Multi-Provider AI Completion Helper (Section 10.5)
  const runAiCompletion = async (prompt: string, systemInstruction?: string, options: any = {}) => {
    const res = await apiFetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        systemInstruction,
        provider: options.provider || aiProvider,
        model: options.model || aiModel,
        temperature: options.temperature,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na chamada de IA');
    return data.data;
  };

  // Project CRUD Actions (Persisted to Backend API)
  const addProject = async (data: Partial<Project>): Promise<Project> => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      orgId: currentUser.orgId,
      name: data.name || 'Novo Projeto',
      description: data.description || '',
      status: data.status || 'active',
      clientId: data.clientId,
      clientName: data.clientName,
      budget: data.budget || 0,
      deadline: data.deadline || '',
      promptIds: data.promptIds || [],
      boilerplateIds: data.boilerplateIds || [],
      tags: data.tags || ['Next.js'],
      notes: data.notes || '',
      activityHistory: [
        {
          id: `act_${Date.now()}`,
          action: 'Projeto criado no cofre central',
          timestamp: 'Agora mesmo',
          author: currentUser.name,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);

    // Backend sync
    apiFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(newProj),
    }).catch((err) => console.warn('[Backend Sync Project POST]:', err));

    showToast(`Projeto "${newProj.name}" salvo no cofre!`);
    return newProj;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              updatedAt: new Date().toISOString(),
              activityHistory: [
                {
                  id: `act_${Date.now()}`,
                  action: 'Dados do projeto atualizados',
                  timestamp: 'Agora mesmo',
                  author: currentUser.name,
                },
                ...p.activityHistory,
              ],
            }
          : p
      )
    );

    apiFetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).catch((err) => console.warn('[Backend Sync Project PUT]:', err));

    showToast('Projeto atualizado com sucesso.');
  };

  const archiveProject = async (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'archived', archivedAt: new Date().toISOString() } : p))
    );
    apiFetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'archived' }),
    }).catch(() => {});
    showToast('Projeto arquivado no cofre.');
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    apiFetch(`/api/projects/${id}`, { method: 'DELETE' }).catch(() => {});
    showToast('Projeto removido.');
  };

  // Prompts CRUD Actions
  const addPrompt = async (data: Partial<Prompt>): Promise<Prompt> => {
    const initialContent = data.content || '';
    const newPromptId = `prm_${Date.now()}`;
    const initialVersion: PromptVersion = {
      id: `ver_${Date.now()}`,
      promptId: newPromptId,
      versionNumber: 1,
      content: initialContent,
      changeNotes: 'Versão inicial criada no cofre',
      createdAt: new Date().toISOString(),
    };

    const newPrompt: Prompt = {
      id: newPromptId,
      orgId: currentUser.orgId,
      title: data.title || 'Novo Prompt',
      description: data.description || '',
      content: initialContent,
      tags: data.tags || ['Engenharia'],
      category: data.category || 'code',
      isFavorite: false,
      visibility: data.visibility || 'private',
      version: 1,
      versions: [initialVersion],
      variables: data.variables || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPrompts((prev) => [newPrompt, ...prev]);

    apiFetch('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(newPrompt),
    }).catch((err) => console.warn('[Backend Sync Prompt POST]:', err));

    showToast(`Prompt "${newPrompt.title}" salvo no cofre!`);
    return newPrompt;
  };

  const updatePromptVersion = async (id: string, newContent: string, changeNotes: string) => {
    setPrompts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextVerNum = p.version + 1;
        const newVer: PromptVersion = {
          id: `ver_${Date.now()}`,
          promptId: id,
          versionNumber: nextVerNum,
          content: newContent,
          changeNotes: changeNotes || `Atualização v${nextVerNum}`,
          createdAt: new Date().toISOString(),
        };

        return {
          ...p,
          content: newContent,
          version: nextVerNum,
          versions: [newVer, ...p.versions],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    apiFetch(`/api/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: newContent }),
    }).catch(() => {});

    showToast('Nova versão do prompt salva no histórico!');
  };

  const updatePrompt = async (id: string, data: Partial<Prompt>) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)));
    apiFetch(`/api/prompts/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
    showToast('Prompt atualizado.');
  };

  const toggleFavoritePrompt = async (id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const deletePrompt = async (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    apiFetch(`/api/prompts/${id}`, { method: 'DELETE' }).catch(() => {});
    showToast('Prompt excluído.');
  };

  const testPromptAI = async (promptId: string, variables?: Record<string, string>) => {
    const prompt = prompts.find((p) => p.id === promptId);
    if (!prompt) throw new Error('Prompt não encontrado');

    try {
      const res = await apiFetch('/api/gemini/run-prompt', {
        method: 'POST',
        body: JSON.stringify({
          promptContent: prompt.content,
          variables,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na execução');

      setPrompts((prev) =>
        prev.map((p) =>
          p.id === promptId
            ? {
                ...p,
                lastResult: {
                  output: data.output,
                  latencyMs: data.latencyMs,
                  timestamp: new Date().toISOString(),
                },
              }
            : p
        )
      );
      showToast(`Executado em ${data.latencyMs}ms com IA`);
      return { output: data.output, latencyMs: data.latencyMs };
    } catch (e: any) {
      console.error(e);
      showToast(`Erro: ${e.message}`);
      throw e;
    }
  };

  // Boilerplate CRUD Actions
  const addBoilerplate = async (data: Partial<Boilerplate>): Promise<Boilerplate> => {
    const newBp: Boilerplate = {
      id: `bp_${Date.now()}`,
      orgId: currentUser.orgId,
      name: data.name || 'Novo Boilerplate',
      description: data.description || '',
      repoUrl: data.repoUrl || 'https://github.com/usuario/repo',
      stack: data.stack || ['TypeScript'],
      cloneCommand: data.cloneCommand || `git clone ${data.repoUrl || 'https://github.com/...'}`,
      visibility: data.visibility || 'public',
      category: data.category || 'fullstack',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBoilerplates((prev) => [newBp, ...prev]);

    apiFetch('/api/boilerplates', {
      method: 'POST',
      body: JSON.stringify(newBp),
    }).catch(() => {});

    showToast(`Boilerplate "${newBp.name}" indexado no cofre!`);
    return newBp;
  };

  const updateBoilerplate = async (id: string, data: Partial<Boilerplate>) => {
    setBoilerplates((prev) =>
      prev.map((bp) => (bp.id === id ? { ...bp, ...data, updatedAt: new Date().toISOString() } : bp))
    );
    apiFetch(`/api/boilerplates/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
    showToast('Boilerplate atualizado.');
  };

  const deleteBoilerplate = async (id: string) => {
    setBoilerplates((prev) => prev.filter((b) => b.id !== id));
    apiFetch(`/api/boilerplates/${id}`, { method: 'DELETE' }).catch(() => {});
    showToast('Boilerplate desindexado.');
  };

  // Client CRUD Actions
  const addClient = async (data: Partial<Client>): Promise<Client> => {
    const newClient: Client = {
      id: `cli_${Date.now()}`,
      orgId: currentUser.orgId,
      name: data.name || 'Novo Cliente',
      company: data.company || '',
      email: data.email || '',
      phone: data.phone || '',
      status: data.status || 'prospect',
      notes: data.notes || '',
      totalValue: data.totalValue || 0,
      projectIds: data.projectIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);

    apiFetch('/api/clients', {
      method: 'POST',
      body: JSON.stringify(newClient),
    }).catch(() => {});

    showToast(`Cliente "${newClient.name}" cadastrado.`);
    return newClient;
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
    );
    showToast('Ficha do cliente atualizada.');
  };

  const deleteClient = async (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast('Cliente removido.');
  };

  // SOP CRUD Actions
  const addSOP = async (data: Partial<SOP>): Promise<SOP> => {
    const newSop: SOP = {
      id: `sop_${Date.now()}`,
      orgId: currentUser.orgId,
      title: data.title || 'Novo SOP / Processo',
      description: data.description || '',
      category: data.category || 'deploy',
      estimatedMinutes: data.estimatedMinutes || 30,
      steps: data.steps || [
        { id: `st_${Date.now()}_1`, title: 'Passo 1: Preparação', completed: false },
        { id: `st_${Date.now()}_2`, title: 'Passo 2: Execução', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSOPs((prev) => [newSop, ...prev]);

    apiFetch('/api/sops', {
      method: 'POST',
      body: JSON.stringify(newSop),
    }).catch(() => {});

    showToast(`SOP "${newSop.title}" adicionado.`);
    return newSop;
  };

  const toggleSOPStep = async (sopId: string, stepId: string) => {
    setSOPs((prev) =>
      prev.map((s) => {
        if (s.id !== sopId) return s;
        return {
          ...s,
          steps: s.steps.map((st) => (st.id === stepId ? { ...st, completed: !st.completed } : st)),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateSOP = async (id: string, data: Partial<SOP>) => {
    setSOPs((prev) => prev.map((s) => (s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s)));
    apiFetch(`/api/sops/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
  };

  const deleteSOP = async (id: string) => {
    setSOPs((prev) => prev.filter((s) => s.id !== id));
    showToast('SOP removido.');
  };

  // Subscription / Stack Actions
  const addSubscription = async (data: Partial<Subscription>) => {
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      orgId: currentUser.orgId,
      serviceName: data.serviceName || 'Nova Assinatura',
      category: data.category || 'infra',
      costMonthly: data.costMonthly || 0,
      currency: data.currency || 'BRL',
      renewalDate: data.renewalDate || '2026-09-01',
      paymentMethod: data.paymentMethod || 'Cartão PJ',
      roiRating: data.roiRating || 'bom',
      status: data.status || 'active',
      url: data.url || 'https://',
    };
    setSubscriptions((prev) => [newSub, ...prev]);

    apiFetch('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify(newSub),
    }).catch(() => {});

    showToast('Assinatura SaaS registrada no cofre.');
  };

  const deleteSubscription = async (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    apiFetch(`/api/subscriptions/${id}`, { method: 'DELETE' }).catch(() => {});
    showToast('Assinatura removida do inventário.');
  };

  // Proposal Actions
  const addProposal = async (data: Partial<Proposal>) => {
    const newProp: Proposal = {
      id: `prop_${Date.now()}`,
      orgId: currentUser.orgId,
      title: data.title || 'Nova Proposta Comercial',
      clientName: data.clientName || 'Cliente',
      clientId: data.clientId,
      totalAmount: data.totalAmount || 5000,
      currency: data.currency || 'BRL',
      scopeItems: data.scopeItems || ['Escopo 1', 'Escopo 2'],
      timelineWeeks: data.timelineWeeks || 4,
      terms: data.terms || '50% entrada / 50% entrega',
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
    };
    setProposals((prev) => [newProp, ...prev]);

    apiFetch('/api/proposals', {
      method: 'POST',
      body: JSON.stringify(newProp),
    }).catch(() => {});

    showToast('Proposta comercial criada.');
  };

  const updateProposalStatus = async (id: string, status: Proposal['status']) => {
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    apiFetch('/api/proposals', { method: 'PUT', body: JSON.stringify({ id, status }) }).catch(() => {});
    showToast(`Status da proposta alterado para: ${status.toUpperCase()}`);
  };

  // MCP Actions
  const addMCP = async (data: Partial<MCP>) => {
    const newMcp: MCP = {
      id: `mcp_${Date.now()}`,
      orgId: currentUser.orgId,
      name: data.name || 'Servidor MCP',
      endpoint: data.endpoint || 'http://localhost:4000/sse',
      description: data.description || '',
      transport: data.transport || 'sse',
      toolsCount: data.toolsCount || 4,
      tools: data.tools || ['tool_1', 'tool_2'],
      status: 'connected',
      createdAt: new Date().toISOString(),
    };
    setMCPs((prev) => [newMcp, ...prev]);

    apiFetch('/api/mcps', {
      method: 'POST',
      body: JSON.stringify(newMcp),
    }).catch(() => {});

    showToast('Servidor MCP registrado!');
  };

  const toggleMCPStatus = async (id: string) => {
    let nextStatus: 'connected' | 'offline' = 'connected';
    setMCPs((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        nextStatus = m.status === 'connected' ? 'offline' : 'connected';
        return { ...m, status: nextStatus };
      })
    );
    apiFetch('/api/mcps', { method: 'PUT', body: JSON.stringify({ id, status: nextStatus }) }).catch(() => {});
  };

  // Cérebro AI Roadmap
  const generateRoadmap = async (goal: string, timeline?: string): Promise<RoadmapRun> => {
    const vaultContext = {
      promptsCount: prompts.length,
      boilerplatesCount: boilerplates.length,
      sampleBoilerplates: boilerplates.map((b) => ({ name: b.name, stack: b.stack })),
      samplePrompts: prompts.map((p) => ({ title: p.title, tags: p.tags })),
      sampleSOPs: sops.map((s) => ({ title: s.title, category: s.category })),
    };

    const res = await apiFetch('/api/gemini/generate-roadmap', {
      method: 'POST',
      body: JSON.stringify({
        goalDescription: goal,
        vaultContext,
        targetTimeline: timeline,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha ao gerar plano');

    const roadmapData = data.roadmap;
    const newRun: RoadmapRun = {
      id: `rm_${Date.now()}`,
      orgId: currentUser.orgId,
      goalDescription: goal,
      title: roadmapData.title || `Roadmap: ${goal.slice(0, 40)}`,
      complexity: roadmapData.complexity || 'Média',
      targetWeeks: roadmapData.targetWeeks || '3-4 semanas',
      summary: roadmapData.summary || 'Plano de execução customizado pelo Cérebro.',
      matchedAssets: roadmapData.matchedAssets || [],
      steps: roadmapData.steps || [],
      gaps: roadmapData.gaps || [],
      professionalNeeded: roadmapData.professionalNeeded,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    setRoadmapRuns((prev) => [newRun, ...prev]);
    showToast('Roadmap gerado com sucesso pelo Cérebro IA!');
    return newRun;
  };

  const convertRoadmapToProject = async (roadmap: RoadmapRun): Promise<Project> => {
    const proj = await addProject({
      name: roadmap.title,
      description: roadmap.summary,
      status: 'active',
      tags: ['Gerado via Cérebro IA', roadmap.complexity],
      notes: `Metas do Roadmap:\n${roadmap.steps.map((s) => `${s.stepNumber}. ${s.title} (${s.duration})`).join('\n')}`,
    });
    setRoadmapRuns((prev) =>
      prev.map((r) => (r.id === roadmap.id ? { ...r, status: 'executed' } : r))
    );
    showToast(`Projeto criado a partir do Roadmap! Redirecionando...`);
    setSelectedProjectId(proj.id);
    setActiveView('projeto_detalhe', proj.id);
    return proj;
  };

  // Marketplace & Payments
  const addListing = async (data: Partial<Listing>): Promise<Listing> => {
    const newListing: Listing = {
      id: `list_${Date.now()}`,
      sellerOrgId: currentUser.orgId,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      type: data.type || 'digital_product',
      sourceRecordType: data.sourceRecordType,
      sourceRecordId: data.sourceRecordId,
      title: data.title || 'Nova Listagem',
      description: data.description || '',
      priceCents: data.priceCents || 9900,
      currency: data.currency || 'BRL',
      licenseType: data.licenseType || 'commercial',
      status: 'active',
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      tags: data.tags || ['Vyroh'],
      category: data.category || 'Boilerplates & Starters',
      includedItems: data.includedItems || ['Acesso completo'],
      createdAt: new Date().toISOString(),
    };
    setListings((prev) => [newListing, ...prev]);

    apiFetch('/api/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(newListing),
    }).catch(() => {});

    showToast(`Listagem "${newListing.title}" publicada na vitrine do Marketplace!`);
    return newListing;
  };

  const updateListing = async (id: string, data: Partial<Listing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    showToast('Listagem atualizada.');
  };

  const pauseListing = async (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l
      )
    );
  };

  const deleteListing = async (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    apiFetch(`/api/marketplace/listings/${id}`, { method: 'DELETE' }).catch(() => {});
    showToast('Listagem removida do Marketplace.');
  };

  const purchaseListing = async (listing: Listing, licenseType: Listing['licenseType']): Promise<Order> => {
    const ruleType = listing.type === 'service' ? 'D' : listing.type === 'creator_subscription' ? 'C' : 'B';
    const rule = commissionRules.find((r) => r.flowType === ruleType) || commissionRules[1];
    const platformFeeCents = Math.round((listing.priceCents * Number(rule.percentage)) / 100);
    const sellerPayoutCents = listing.priceCents - platformFeeCents;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingType: listing.type,
      buyerOrgId: currentUser.orgId,
      buyerName: currentUser.name,
      amountCents: listing.priceCents,
      platformFeeCents,
      sellerPayoutCents,
      licenseType,
      status: 'completed',
      itemAccessUrl: `https://vyroh.io/vault/access/${listing.id}`,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, salesCount: l.salesCount + 1 } : l))
    );

    apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    setSellerAccount((prev) => ({
      ...prev,
      totalEarningsCents: prev.totalEarningsCents + sellerPayoutCents,
      availableBalanceCents: prev.availableBalanceCents + sellerPayoutCents,
    }));

    showToast(`Compra confirmada! O item já está na sua biblioteca "Minhas Compras".`);
    return newOrder;
  };

  const subscribeToCreator = async (listing: Listing): Promise<CreatorSubscription> => {
    const newSub: CreatorSubscription = {
      id: `csub_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      creatorName: listing.sellerName,
      subscriberOrgId: currentUser.orgId,
      amountMonthlyCents: listing.priceCents,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setCreatorSubscriptions((prev) => [newSub, ...prev]);
    showToast(`Assinatura ativa! Acesso liberado ao cofre do criador ${listing.sellerName}.`);
    return newSub;
  };

  const cancelCreatorSubscription = (id: string) => {
    setCreatorSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s))
    );
    showToast('Assinatura cancelada.');
  };

  const upgradePlan = async (planId: SubscriptionPlan) => {
    setCurrentUser((prev) => ({ ...prev, plan: planId }));
    apiFetch('/api/users/plan', { method: 'PUT', body: JSON.stringify({ plan: planId }) }).catch(() => {});
    showToast(`Plano atualizado para ${planId.toUpperCase()}!`);
  };

  const requestSellerPayout = (amountCents: number): boolean => {
    if (amountCents > sellerAccount.availableBalanceCents || amountCents <= 0) {
      showToast('Saldo insuficiente para repasse.');
      return false;
    }

    setSellerAccount((prev) => ({
      ...prev,
      availableBalanceCents: prev.availableBalanceCents - amountCents,
      payouts: [
        {
          id: `pay_${Date.now()}`,
          amountCents,
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
        },
        ...prev.payouts,
      ],
    }));

    showToast(`Repasse de R$ ${(amountCents / 100).toFixed(2)} processado via Stripe Connect Express!`);
    return true;
  };

  // Community Topics
  const createCommunityTopic = async (data: Partial<CommunityTopic>): Promise<CommunityTopic> => {
    let aiAnalysis: CommunityTopic['aiAnalysis'];

    try {
      const res = await apiFetch('/api/gemini/match-community', {
        method: 'POST',
        body: JSON.stringify({
          questionTitle: data.title,
          questionContent: data.content,
          category: data.category,
        }),
      });
      const resData = await res.json();
      if (res.ok && resData.aiAnalysis) {
        aiAnalysis = resData.aiAnalysis;
      }
    } catch (e) {
      console.warn('AI Match fallback:', e);
    }

    const newTopic: CommunityTopic = {
      id: `top_${Date.now()}`,
      title: data.title || 'Nova Discussão',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.bio || 'Membro do Vyroh',
      category: data.category || 'dev',
      content: data.content || '',
      tags: data.tags || ['Geral'],
      answersCount: 0,
      likesCount: 1,
      isSolved: false,
      aiAnalysis,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    setCommunityTopics((prev) => [newTopic, ...prev]);

    apiFetch('/api/community/topics', {
      method: 'POST',
      body: JSON.stringify(newTopic),
    }).catch(() => {});

    showToast('Tópico postado na comunidade! A IA cruzou ativos compatíveis.');
    return newTopic;
  };

  const upvoteTopic = async (topicId: string) => {
    setCommunityTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, likesCount: t.likesCount + 1 } : t))
    );
  };

  const addTopicReply = async (topicId: string, content: string) => {
    const newReply = {
      id: `rep_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.bio || 'Membro do Vyroh',
      content,
      isAccepted: false,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    apiFetch(`/api/community/topics/${topicId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }).catch(() => {});

    setCommunityTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              answersCount: t.answersCount + 1,
              replies: [...t.replies, newReply],
            }
          : t
      )
    );
    showToast('Resposta enviada!');
  };

  // Admin Config Actions (Section 29)
  const updateCommissionRule = async (flowType: string, percentage: number) => {
    setCommissionRules((prev) =>
      prev.map((r) => (r.flowType === flowType ? { ...r, percentage, updatedAt: new Date().toISOString() } : r))
    );

    apiFetch('/api/admin/commission-rules', {
      method: 'PUT',
      body: JSON.stringify({ flowType, percentage }),
    }).catch(() => {});

    showToast('Regra de comissão atualizada sem necessidade de deploy!');
  };

  const updatePricingPlan = (id: string, data: Partial<PricingPlan>) => {
    setPricingPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    showToast('Plano de precificação atualizado.');
  };

  const updateLicenseType = (id: string, data: Partial<LicenseTypeConfig>) => {
    setLicenseTypes((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    showToast('Tipo de licença atualizado.');
  };

  const updateCategory = (id: string, data: Partial<CategoryConfig>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    showToast('Categoria atualizada.');
  };

  const updateKYCRequirement = (id: string, data: Partial<KYCRequirement>) => {
    setKycRequirements((prev) => prev.map((k) => (k.id === id ? { ...k, ...data } : k)));
    showToast('Requisito de KYC atualizado.');
  };

  const updateAIUsageLimit = (id: string, limit: number) => {
    setAiUsageLimits((prev) => prev.map((a) => (a.id === id ? { ...a, monthlyCallLimit: limit } : a)));
    showToast('Limite de IA atualizado.');
  };

  // Vault Backup & Sovereignty
  const exportVaultBackup = (): string => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: currentUser,
      projects,
      prompts,
      boilerplates,
      clients,
      sops,
      subscriptions,
      proposals,
      mcps,
      listings,
      orders,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importVaultBackup = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.projects) setProjects(data.projects);
      if (data.prompts) setPrompts(data.prompts);
      if (data.boilerplates) setBoilerplates(data.boilerplates);
      if (data.clients) setClients(data.clients);
      if (data.sops) setSOPs(data.sops);
      if (data.subscriptions) setSubscriptions(data.subscriptions);
      if (data.proposals) setProposals(data.proposals);
      if (data.mcps) setMCPs(data.mcps);
      return true;
    } catch (e) {
      console.error('Failed to parse backup JSON:', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        switchRole,
        isAuthenticated,
        login,
        register,
        logout,
        theme,
        toggleTheme,
        portalDomain,
        setPortalDomain,
        activeView,
        setActiveView,
        navigate,
        selectedProjectId,
        setSelectedProjectId,
        selectedPromptId,
        setSelectedPromptId,
        selectedSellerId,
        setSelectedSellerId,
        searchQuery,
        setSearchQuery,
        aiProvider,
        setAiProvider,
        aiModel,
        setAiModel,
        runAiCompletion,
        projects,
        prompts,
        boilerplates,
        clients,
        sops,
        subscriptions,
        proposals,
        mcps,
        skills,
        roadmapRuns,
        listings,
        orders,
        creatorSubscriptions,
        sellerAccount,
        communityTopics,
        commissionRules,
        pricingPlans,
        licenseTypes,
        categories,
        kycRequirements,
        aiUsageLimits,
        addProject,
        updateProject,
        archiveProject,
        deleteProject,
        addPrompt,
        updatePrompt,
        updatePromptVersion,
        toggleFavoritePrompt,
        deletePrompt,
        testPromptAI,
        addBoilerplate,
        updateBoilerplate,
        deleteBoilerplate,
        addClient,
        updateClient,
        deleteClient,
        addSOP,
        updateSOP,
        toggleSOPStep,
        deleteSOP,
        addSubscription,
        deleteSubscription,
        addProposal,
        updateProposalStatus,
        addMCP,
        toggleMCPStatus,
        generateRoadmap,
        convertRoadmapToProject,
        addListing,
        updateListing,
        pauseListing,
        deleteListing,
        selectedListingForCheckout,
        setSelectedListingForCheckout,
        purchaseListing,
        subscribeToCreator,
        cancelCreatorSubscription,
        requestSellerPayout,
        upgradePlan,
        createCommunityTopic,
        addTopicReply,
        upvoteTopic,
        adminConfig,
        updateAdminConfig,
        updateCommissionRule,
        updatePricingPlan,
        updateLicenseType,
        updateCategory,
        updateKYCRequirement,
        updateAIUsageLimit,
        exportVaultBackup,
        importVaultBackup,
        activeModal,
        openModal,
        closeModal,
        modalProps,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

import {
  User,
  Project,
  Prompt,
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
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_owner_1',
    name: 'Thomas Dev',
    email: 'thomas@vyroh.io',
    role: 'owner',
    orgId: 'org_main_1',
    plan: 'pro',
    bio: 'Desenvolvedor Full-Stack Solo & Criador de Produtos',
    aiProviderPref: 'gemini',
    stripeConnectStatus: 'verified',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'usr_seller_1',
    name: 'Carolina Silva',
    email: 'carol@templates.io',
    role: 'seller',
    orgId: 'org_seller_1',
    plan: 'pro',
    bio: 'Arquiteta de Software & Criadora Top Seller no Vyroh',
    aiProviderPref: 'gemini',
    stripeConnectStatus: 'verified',
    createdAt: '2026-02-15T14:30:00Z',
  },
  {
    id: 'usr_buyer_1',
    name: 'Rafael Mendes',
    email: 'rafael@techlab.com',
    role: 'buyer',
    orgId: 'org_buyer_1',
    plan: 'free',
    bio: 'Empreendedor digital e desenvolvedor em transição',
    aiProviderPref: 'gemini',
    stripeConnectStatus: 'unlinked',
    createdAt: '2026-03-01T09:15:00Z',
  },
  {
    id: 'usr_admin_1',
    name: 'Admin Vyroh Platform',
    email: 'admin@vyroh.internal',
    role: 'admin',
    orgId: 'org_platform',
    plan: 'enterprise',
    bio: 'Administrador geral da infraestrutura e parâmetros do Vyroh',
    aiProviderPref: 'gemini',
    stripeConnectStatus: 'verified',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    orgId: 'org_main_1',
    name: 'Plataforma SaaS B2B Multi-tenant',
    description: 'Sistema completo com autenticação por organização, billing Stripe e painel de analytics.',
    status: 'in_progress',
    clientId: 'cli_1',
    clientName: 'Nexus Logística & Supply',
    budget: 18500,
    deadline: '2026-09-30',
    promptIds: ['prm_1', 'prm_3'],
    boilerplateIds: ['bp_1', 'bp_3'],
    mcpIds: ['mcp_1'],
    tags: ['Next.js', 'Postgres', 'Stripe', 'Tailwind'],
    notes: 'Prioridade para o módulo de relatórios exportáveis e webhook de cobrança.',
    activityHistory: [
      { id: 'act_1', action: 'Roadmap de execução gerado via Cérebro IA', timestamp: 'Hoje às 14:20', author: 'Thomas Dev' },
      { id: 'act_2', action: 'Boilerplate Next.js + Postgres vinculado ao projeto', timestamp: 'Ontem às 18:45', author: 'Thomas Dev' },
      { id: 'act_3', action: 'Proposta comercial aceita no valor de R$ 18.500', timestamp: '2 dias atrás', author: 'Nexus Logística' },
    ],
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-20T18:00:00Z',
  },
  {
    id: 'proj_2',
    orgId: 'org_main_1',
    name: 'Aplicativo Mobile de Gestão de Frotas',
    description: 'App React Native com geolocalização e sincronização offline-first.',
    status: 'active',
    clientId: 'cli_2',
    clientName: 'Veloce Transportes',
    budget: 12000,
    deadline: '2026-10-15',
    promptIds: ['prm_2'],
    boilerplateIds: ['bp_2'],
    tags: ['React Native', 'Expo', 'SQLite', 'Offline'],
    notes: 'Aguardando validação do protótipo com os motoristas parceiros.',
    activityHistory: [
      { id: 'act_4', action: 'Prompt de auditoria de re-renders executado', timestamp: '3 dias atrás', author: 'Thomas Dev' },
    ],
    createdAt: '2026-08-05T11:30:00Z',
    updatedAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'proj_3',
    orgId: 'org_main_1',
    name: 'Landing Page de Alta Conversão + Checkout',
    description: 'Página de vendas focada em infoproduto com tempo de carregamento < 0.8s e A/B testing.',
    status: 'completed',
    clientId: 'cli_3',
    clientName: 'EducaDigital Treinamentos',
    budget: 6500,
    deadline: '2026-08-12',
    promptIds: ['prm_4'],
    boilerplateIds: ['bp_4'],
    tags: ['Vite', 'Tailwind', 'Hotjar', 'A/B Test'],
    notes: 'Entregue com nota 100 no Lighthouse e taxa de conversão média de 7.4%.',
    activityHistory: [
      { id: 'act_5', action: 'Projeto finalizado e deploy realizado em VPS Hetzner', timestamp: '12 de Agosto', author: 'Thomas Dev' },
    ],
    createdAt: '2026-07-28T09:00:00Z',
    updatedAt: '2026-08-12T17:00:00Z',
  },
  {
    id: 'proj_4',
    orgId: 'org_main_1',
    name: 'Automação de Leads CRM n8n + WhatsApp',
    description: 'Pipeline de qualificação de leads com IA para triagem automática e agendamento no Calendly.',
    status: 'lead',
    clientId: 'cli_1',
    clientName: 'Nexus Logística & Supply',
    budget: 4800,
    deadline: '2026-11-01',
    promptIds: ['prm_1'],
    boilerplateIds: [],
    tags: ['n8n', 'WhatsApp API', 'IA Triagem'],
    notes: 'Aguardando reunião de alinhamento com time de vendas.',
    activityHistory: [
      { id: 'act_6', action: 'Rascunho de proposta criado no cofre', timestamp: 'Ontem', author: 'Thomas Dev' },
    ],
    createdAt: '2026-08-18T14:00:00Z',
    updatedAt: '2026-08-19T10:00:00Z',
  },
];

export const INITIAL_PROMPTS: Prompt[] = [
  {
    id: 'prm_1',
    orgId: 'org_main_1',
    title: 'Arquiteto de Banco Relacional & Migrations Postgres',
    description: 'Transforma requisitos de produto em schemas Drizzle/Prisma perfeitos com constraints e índices otimizados.',
    category: 'code',
    isFavorite: true,
    visibility: 'public',
    version: 3,
    versions: [
      {
        id: 'ver_1',
        promptId: 'prm_1',
        versionNumber: 1,
        content: 'Crie um schema sql para o seguinte requisito: {{requisito}}',
        changeNotes: 'Versão inicial básica',
        createdAt: '2026-05-10T10:00:00Z',
      },
      {
        id: 'ver_2',
        promptId: 'prm_1',
        versionNumber: 2,
        content: 'Você é um DBA Postgres sênior. Crie o schema Drizzle ORM completo para: {{requisito}}, incluindo índices e relations.',
        changeNotes: 'Migração para Drizzle ORM e índices compostos',
        createdAt: '2026-06-15T15:30:00Z',
      },
      {
        id: 'ver_3',
        promptId: 'prm_1',
        versionNumber: 3,
        content: `Você é um Arquiteto de Software Principal especializado em PostgreSQL 16+ e Drizzle ORM.
Analise a seguinte especificação de produto:
"{{especificacao}}"

Gere:
1. Schema TypeScript Drizzle rigorosamente tipado com timestamps em UTC (created_at, updated_at).
2. Índices B-Tree e GIN para campos frequentemente buscados (tsvector, status, org_id).
3. Constraints de integridade referencial com cascata inteligente e soft-delete.
4. Explicação objetiva das decisões de normalização (evite over-engineering).`,
        changeNotes: 'Refinamento avançado com suporte a tsvector, soft-delete e strict TypeScript',
        createdAt: '2026-08-10T12:00:00Z',
      },
    ],
    content: `Você é um Arquiteto de Software Principal especializado em PostgreSQL 16+ e Drizzle ORM.
Analise a seguinte especificação de produto:
"{{especificacao}}"

Gere:
1. Schema TypeScript Drizzle rigorosamente tipado com timestamps em UTC (created_at, updated_at).
2. Índices B-Tree e GIN para campos frequentemente buscados (tsvector, status, org_id).
3. Constraints de integridade referencial com cascata inteligente e soft-delete.
4. Explicação objetiva das decisões de normalização (evite over-engineering).`,
    tags: ['PostgreSQL', 'Drizzle ORM', 'Schema', 'Database', 'SQL'],
    variables: ['especificacao'],
    lastResult: {
      output: '// Schema gerado com sucesso para Sistema de Ingressos com 6 tabelas e índices em event_id e user_id.',
      latencyMs: 420,
      timestamp: '2026-08-19T20:15:00Z',
    },
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'prm_2',
    orgId: 'org_main_1',
    title: 'Auditor de Performance & Re-renders React',
    description: 'Diagnostica gargalos no React 19, dependências instáveis em useEffect e renderizações desnecessárias.',
    category: 'code',
    isFavorite: true,
    visibility: 'private',
    version: 1,
    versions: [
      {
        id: 'ver_4',
        promptId: 'prm_2',
        versionNumber: 1,
        content: `Você é um especialista em performance React 19.
Analise o componente abaixo:
\`\`\`tsx
{{codigo_componente}}
\`\`\`

Aponte:
1. Objetos ou funções não memoizados passados a filhos que causam re-render.
2. Inconsistências em useEffect dependency array.
3. Versão reescrita e otimizada mantendo exatamente a mesma API e comportamento.`,
        changeNotes: 'Versão de lançamento',
        createdAt: '2026-07-02T14:00:00Z',
      },
    ],
    content: `Você é um especialista em performance React 19.
Analise o componente abaixo:
\`\`\`tsx
{{codigo_componente}}
\`\`\`

Aponte:
1. Objetos ou funções não memoizados passados a filhos que causam re-render.
2. Inconsistências em useEffect dependency array.
3. Versão reescrita e otimizada mantendo exatamente a mesma API e comportamento.`,
    tags: ['React', 'Performance', 'Hooks', 'TypeScript'],
    variables: ['codigo_componente'],
    createdAt: '2026-07-02T14:00:00Z',
    updatedAt: '2026-07-02T14:00:00Z',
  },
  {
    id: 'prm_3',
    orgId: 'org_main_1',
    title: 'Gerador de Propostas Comerciais de Alto Fechamento',
    description: 'Estrutura propostas no modelo de precificação baseada em valor (Value-Based Pricing) com 3 opções de escopo.',
    category: 'sales',
    isFavorite: false,
    visibility: 'shared',
    version: 2,
    versions: [
      {
        id: 'ver_5',
        promptId: 'prm_3',
        versionNumber: 1,
        content: 'Crie uma proposta de desenvolvimento para o cliente {{cliente}} no valor de {{valor}}.',
        changeNotes: 'Versão inicial',
        createdAt: '2026-06-01T10:00:00Z',
      },
      {
        id: 'ver_6',
        promptId: 'prm_3',
        versionNumber: 2,
        content: `Você é um consultor sênior em vendas de serviços digitais e desenvolvimento de software.
Crie uma proposta comercial matadora para:
- Cliente: {{nome_cliente}}
- Nicho: {{nicho}}
- Dor Principal: {{dor_principal}}
- Orçamento estimado: {{orcamento}}

Estruture em:
1. Diagnóstico do Problema & Impacto Financeiro
2. Solução Proposta & Fases de Entrega
3. Três Pacotes de Investimento (Essencial, Recomendado, Acelerado)
4. Garantias, Termos e Próximos Passos Imediatos.`,
        changeNotes: 'Estrutura de 3 pacotes e ancoragem de valor',
        createdAt: '2026-07-20T16:00:00Z',
      },
    ],
    content: `Você é um consultor sênior em vendas de serviços digitais e desenvolvimento de software.
Crie uma proposta comercial matadora para:
- Cliente: {{nome_cliente}}
- Nicho: {{nicho}}
- Dor Principal: {{dor_principal}}
- Orçamento estimado: {{orcamento}}

Estruture em:
1. Diagnóstico do Problema & Impacto Financeiro
2. Solução Proposta & Fases de Entrega
3. Três Pacotes de Investimento (Essencial, Recomendado, Acelerado)
4. Garantias, Termos e Próximos Passos Imediatos.`,
    tags: ['Vendas', 'Proposta', 'Comercial', 'Freelance'],
    variables: ['nome_cliente', 'nicho', 'dor_principal', 'orcamento'],
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-07-20T16:00:00Z',
  },
  {
    id: 'prm_4',
    orgId: 'org_main_1',
    title: 'Copywriter de Landing Page (Framework PAS + StoryBrand)',
    description: 'Gera a estrutura completa de headline, problema, autoridade e quebra de objeções para páginas de venda.',
    category: 'copywriting',
    isFavorite: false,
    visibility: 'public',
    version: 1,
    versions: [
      {
        id: 'ver_7',
        promptId: 'prm_4',
        versionNumber: 1,
        content: 'Crie uma copy para a landing page do produto: {{produto}} direcionado para {{publico}}.',
        changeNotes: 'Lançamento',
        createdAt: '2026-07-15T11:00:00Z',
      },
    ],
    content: `Você é um Copywriter de Resposta Direta de classe mundial.
Crie a estrutura de texto persuasivo para a página de vendas de:
- Produto/Serviço: {{produto}}
- Público-Alvo: {{publico}}
- Promessa Central: {{promessa}}

Estruture as seções: Hero (Headline + Sub + CTA), Problema Agitado (PAS), A Nova Oportunidade, Prova Social, O Que Está Incluso, Quebra de Objeções (FAQ) e Garantia Incondicional.`,
    tags: ['Copywriting', 'Landing Page', 'Marketing', 'Conversão'],
    variables: ['produto', 'publico', 'promessa'],
    createdAt: '2026-07-15T11:00:00Z',
    updatedAt: '2026-07-15T11:00:00Z',
  },
];

export const INITIAL_BOILERPLATES: Boilerplate[] = [
  {
    id: 'bp_1',
    orgId: 'org_main_1',
    name: 'Next.js 15 + PostgreSQL + Drizzle + Better-Auth Multi-tenant',
    description: 'Starter completo com organização, papéis RBAC, pgvector para busca semântica, Stripe Billing e Tailwind v4.',
    repoUrl: 'https://github.com/thomasdev/vyroh-t3-starter',
    stack: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'Better-Auth', 'Stripe', 'Tailwind'],
    cloneCommand: 'git clone https://github.com/thomasdev/vyroh-t3-starter.git meu-saas',
    lastUsedProjectId: 'proj_1',
    lastUsedProjectName: 'Plataforma SaaS B2B Multi-tenant',
    visibility: 'public',
    category: 'fullstack',
    createdAt: '2026-04-12T10:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'bp_2',
    orgId: 'org_main_1',
    name: 'Expo React Native Offline-First + WatermelonDB',
    description: 'Template de app mobile com sincronização SQLite local, navegação Expo Router e tema escuro nativo.',
    repoUrl: 'https://github.com/thomasdev/expo-offline-starter',
    stack: ['React Native', 'Expo', 'WatermelonDB', 'TypeScript', 'Lucide Icons'],
    cloneCommand: 'git clone https://github.com/thomasdev/expo-offline-starter.git app-mobile',
    lastUsedProjectId: 'proj_2',
    lastUsedProjectName: 'Aplicativo Mobile de Gestão de Frotas',
    visibility: 'private',
    category: 'mobile',
    createdAt: '2026-05-18T14:20:00Z',
    updatedAt: '2026-08-05T11:00:00Z',
  },
  {
    id: 'bp_3',
    orgId: 'org_main_1',
    name: 'Fast MCP Server Template (Node/TypeScript)',
    description: 'Servidor Model Context Protocol com stdio e SSE prontos para expor banco de dados e APIs para Claude e agentes.',
    repoUrl: 'https://github.com/thomasdev/mcp-server-ts-template',
    stack: ['TypeScript', 'Model Context Protocol', 'Node.js', 'Zod', 'SSE'],
    cloneCommand: 'git clone https://github.com/thomasdev/mcp-server-ts-template.git meu-mcp-server',
    lastUsedProjectId: 'proj_1',
    lastUsedProjectName: 'Plataforma SaaS B2B Multi-tenant',
    visibility: 'public',
    category: 'mcp',
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-08-02T15:00:00Z',
  },
  {
    id: 'bp_4',
    orgId: 'org_main_1',
    name: 'Vite React 19 + Tailwind Ultra-Fast Landing Starter',
    description: 'Template otimizado para performance 100 no Lighthouse, micro-interações motion e formulário com webhook.',
    repoUrl: 'https://github.com/thomasdev/vite-landing-starter',
    stack: ['React 19', 'Vite', 'Tailwind CSS', 'Motion', 'Lucide'],
    cloneCommand: 'git clone https://github.com/thomasdev/vite-landing-starter.git landing-page',
    lastUsedProjectId: 'proj_3',
    lastUsedProjectName: 'Landing Page de Alta Conversão + Checkout',
    visibility: 'public',
    category: 'frontend',
    createdAt: '2026-07-01T16:00:00Z',
    updatedAt: '2026-07-28T09:00:00Z',
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli_1',
    orgId: 'org_main_1',
    name: 'Marcos Vasconcelos',
    company: 'Nexus Logística & Supply',
    email: 'marcos@nexuslog.com.br',
    phone: '+55 11 98765-4321',
    status: 'active',
    notes: 'Cliente prioritário. Diretor de Operações, preza por cumprimento de prazo e relatórios semanais por vídeo.',
    totalValue: 23300,
    projectIds: ['proj_1', 'proj_4'],
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-08-18T14:00:00Z',
  },
  {
    id: 'cli_2',
    orgId: 'org_main_1',
    name: 'Fernanda Drummond',
    company: 'Veloce Transportes',
    email: 'fernanda@velocetrans.com',
    phone: '+55 41 99123-8877',
    status: 'active',
    notes: 'Contrato de app mobile e manutenção mensal garantida após lançamento.',
    totalValue: 12000,
    projectIds: ['proj_2'],
    createdAt: '2026-06-12T11:00:00Z',
    updatedAt: '2026-08-05T11:30:00Z',
  },
  {
    id: 'cli_3',
    orgId: 'org_main_1',
    name: 'Rodrigo Alcantara',
    company: 'EducaDigital Treinamentos',
    email: 'rodrigo@educadigital.academy',
    phone: '+55 21 98844-3322',
    status: 'completed',
    notes: 'Projeto de landing page entregue com sucesso. Potencial para reformulação do portal de alunos em 2027.',
    totalValue: 6500,
    projectIds: ['proj_3'],
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-08-12T17:00:00Z',
  },
];

export const INITIAL_SOPS: SOP[] = [
  {
    id: 'sop_1',
    orgId: 'org_main_1',
    title: 'Checklist de Deploy & Lançamento em Produção (VPS Docker)',
    description: 'Passo a passo padrão para colocar aplicações web no ar com SSL automático, backups e zero-downtime.',
    category: 'deploy',
    estimatedMinutes: 35,
    steps: [
      { id: 'st_1', title: 'Configurar variáveis de ambiente no .env de produção (sem secrets no git)', completed: true, details: 'Verificar DATABASE_URL, STRIPE_SECRET_KEY e GEMINI_API_KEY' },
      { id: 'st_2', title: 'Executar migrations do PostgreSQL em ambiente de staging', completed: true, details: 'npx drizzle-kit migrate' },
      { id: 'st_3', title: 'Validar build estático e bundle do servidor (npm run build)', completed: true, details: 'Garantir que dist/server.cjs foi gerado' },
      { id: 'st_4', title: 'Iniciar container Docker e checar health check (/api/health)', completed: false, details: 'docker compose up -d && curl http://localhost:3000/api/health' },
      { id: 'st_5', title: 'Configurar backup diário automatizado do Postgres para Bucket S3', completed: false, details: 'Script cron com pg_dump comprimido e retenção de 30 dias' },
    ],
    createdAt: '2026-05-15T10:00:00Z',
    updatedAt: '2026-08-10T14:00:00Z',
  },
  {
    id: 'sop_2',
    orgId: 'org_main_1',
    title: 'Onboarding Completo de Novo Cliente B2B',
    description: 'Processo padronizado desde a assinatura do contrato até a reunião de kick-off e criação dos acessos.',
    category: 'onboarding',
    estimatedMinutes: 45,
    steps: [
      { id: 'st_6', title: 'Enviar contrato com assinatura digital e link de pagamento da primeira parcela', completed: true },
      { id: 'st_7', title: 'Criar registro no Vyroh (Clientes + Projeto vinculado com orçamento)', completed: true },
      { id: 'st_8', title: 'Criar canal compartilhado no Slack/WhatsApp e pasta no Google Drive', completed: false },
      { id: 'st_9', title: 'Enviar questionário técnico (briefing de acessos, repositórios, API keys)', completed: false },
      { id: 'st_10', title: 'Agendar call de alinhamento e apresentar o Roadmap gerado pelo Cérebro IA', completed: false },
    ],
    createdAt: '2026-06-02T16:00:00Z',
    updatedAt: '2026-08-01T09:00:00Z',
  },
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    orgId: 'org_main_1',
    serviceName: 'Hetzner Cloud VPS (Dedicated AMD)',
    category: 'infra',
    costMonthly: 78.0,
    currency: 'BRL',
    renewalDate: '2026-09-05',
    paymentMethod: 'Cartão de Crédito PJ',
    roiRating: 'excelente',
    status: 'active',
    url: 'https://hetzner.com',
  },
  {
    id: 'sub_2',
    orgId: 'org_main_1',
    serviceName: 'Google Workspace (E-mail @vyroh.io + Drive)',
    category: 'infra',
    costMonthly: 42.0,
    currency: 'BRL',
    renewalDate: '2026-09-12',
    paymentMethod: 'Cartão de Crédito PJ',
    roiRating: 'excelente',
    status: 'active',
    url: 'https://workspace.google.com',
  },
  {
    id: 'sub_3',
    orgId: 'org_main_1',
    serviceName: 'Figma Professional (Design System)',
    category: 'design',
    costMonthly: 85.0,
    currency: 'BRL',
    renewalDate: '2026-09-22',
    paymentMethod: 'Cartão de Crédito PJ',
    roiRating: 'bom',
    status: 'active',
    url: 'https://figma.com',
  },
  {
    id: 'sub_4',
    orgId: 'org_main_1',
    serviceName: 'SaaS Antigo de Monitoramento SEO',
    category: 'marketing',
    costMonthly: 120.0,
    currency: 'BRL',
    renewalDate: '2026-09-01',
    paymentMethod: 'Cartão de Crédito PJ',
    roiRating: 'revisar_cancelamento',
    status: 'active',
    url: 'https://tool-seo.example',
  },
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop_1',
    orgId: 'org_main_1',
    title: 'Desenvolvimento do Sistema SaaS Nexus Supply v1.0',
    clientName: 'Nexus Logística & Supply',
    clientId: 'cli_1',
    totalAmount: 18500,
    currency: 'BRL',
    scopeItems: [
      'Arquitetura multi-tenant com banco Postgres particionado por organização',
      'Módulo de cadastro de rotas, transportadoras e cálculo automático de frete',
      'Integração com gateway de pagamentos Stripe e split para frotistas',
      'Dashboard com indicadores operacionais e exportação de relatórios em CSV/PDF',
      'Garantia de 60 dias para correções de bugs pós-deploy',
    ],
    timelineWeeks: 6,
    terms: '50% na aprovação / 25% na entrega do MVP funcional / 25% no deploy final.',
    status: 'accepted',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'prop_2',
    orgId: 'org_main_1',
    title: 'Automação de Qualificação de Leads WhatsApp + IA',
    clientName: 'Nexus Logística & Supply',
    clientId: 'cli_1',
    totalAmount: 4800,
    currency: 'BRL',
    scopeItems: [
      'Configuração do servidor n8n self-hosted com webhook seguro',
      'Integração com Evolution API / Z-API para WhatsApp',
      'Fluxo de triagem com Gemini 3.7 Flash para qualificar orçamento e urgência',
      'Sincronização direta com CRM Pipedrive e aviso imediato no Slack da equipe',
    ],
    timelineWeeks: 2,
    terms: '50% no início / 50% na homologação com leads de teste.',
    status: 'draft',
    createdAt: '2026-08-18T14:00:00Z',
  },
];

export const INITIAL_MCPS: MCP[] = [
  {
    id: 'mcp_1',
    orgId: 'org_main_1',
    name: 'PostgreSQL Database Inspector & Query Runner',
    endpoint: 'http://localhost:4005/sse',
    description: 'Permite que a IA consulte schemas de tabelas, execute queries seguras somente-leitura e gere DDL otimizado.',
    transport: 'sse',
    toolsCount: 6,
    tools: ['describe_table', 'run_select_query', 'list_tables', 'explain_query', 'get_foreign_keys', 'generate_migration'],
    status: 'connected',
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'mcp_2',
    orgId: 'org_main_1',
    name: 'GitHub Repo & Issue Synchronizer',
    endpoint: 'stdio:gh-mcp',
    description: 'Sincroniza issues de projetos, cria PRs automáticos de boilerplates e consulta commits recentes.',
    transport: 'stdio',
    toolsCount: 8,
    tools: ['create_issue', 'list_pull_requests', 'search_code', 'get_file_contents', 'commit_files', 'create_branch', 'merge_pr', 'list_starred_repos'],
    status: 'connected',
    createdAt: '2026-07-01T15:00:00Z',
  },
];

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'skl_1',
    orgId: 'org_main_1',
    name: 'Refinamento de Código & Design Tokens',
    description: 'Aplica a paleta de cores estrita de 3 tons do Vyroh (#050506, #6B21A8, #C2410C) e elimina AI Slop.',
    fileRef: '/skills/design-tokens.md',
    category: 'dev',
    promptTrigger: 'Quando precisar estilizar componentes ou refatorar layouts para o padrão profissional.',
  },
  {
    id: 'skl_2',
    orgId: 'org_main_1',
    name: 'Gerador de Casos de Uso & Diagrama de Dados',
    description: 'Mapeia requisitos brutos de clientes em entidades normalizadas e fluxos operacionais.',
    fileRef: '/skills/db-architect.md',
    category: 'analysis',
    promptTrigger: 'Na fase de descoberta de novo cliente ou kick-off de projeto.',
  },
];

// Marketplace Listings (Covering Flows A, B, C, D)
export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'list_1',
    sellerOrgId: 'org_seller_1',
    sellerName: 'Carolina Silva',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    type: 'digital_product', // Flow B: Produto Avulso
    sourceRecordType: 'boilerplate',
    title: 'Mega Boilerplate SaaS B2B: Next.js 15, Drizzle, Stripe Connect & Multi-tenant',
    description: 'Economize 120 horas de engenharia. Boilerplate ultra-completo com organizações, permissões granulares RBAC, sistema de cobrança por assinatura e split Stripe Connect, pgvector integrado e dark mode estilo Linear.',
    priceCents: 19700, // R$ 197,00
    currency: 'BRL',
    licenseType: 'commercial',
    status: 'active',
    rating: 4.9,
    reviewsCount: 38,
    salesCount: 142,
    tags: ['Next.js 15', 'TypeScript', 'Stripe Connect', 'Drizzle', 'Multi-tenant'],
    category: 'Boilerplates & Starters',
    includedItems: [
      'Código fonte completo no GitHub com atualizações vitalícias',
      'Configuração Docker Compose com Postgres + pgvector',
      'Documentação de arquitetura e endpoints tRPC',
      'Suporte via canal exclusivo na comunidade Vyroh',
    ],
    createdAt: '2026-06-10T12:00:00Z',
  },
  {
    id: 'list_2',
    sellerOrgId: 'org_main_1',
    sellerName: 'Thomas Dev',
    type: 'creator_subscription', // Flow C: Assinatura de Criador
    sourceRecordType: 'bundle',
    title: 'Cofre VIP de Prompts & Agentes de Alta Conversão (Atualizado Semanalmente)',
    description: 'Acesso contínuo e irrestrito ao meu cofre pessoal de prompts técnicos para engenharia de software, automações n8n e copies comerciais validadas em mais de R$ 500k em projetos.',
    priceCents: 4990, // R$ 49,90 / mês
    currency: 'BRL',
    licenseType: 'commercial',
    status: 'active',
    rating: 5.0,
    reviewsCount: 19,
    salesCount: 64,
    tags: ['Prompts IA', 'Engenharia de Prompt', 'Agentes', 'Automação'],
    category: 'Prompts & Agentes',
    includedItems: [
      'Mais de 40 prompts avançados prontos para testar no playground',
      '2 novos prompts técnicos adicionados toda semana',
      'Workflows prontos para importar no n8n e Activepieces',
      'Acesso direto ao criador para sugestões de prompts',
    ],
    createdAt: '2026-07-01T14:00:00Z',
  },
  {
    id: 'list_3',
    sellerOrgId: 'org_seller_1',
    sellerName: 'Carolina Silva',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    type: 'service', // Flow D: Serviço / Profissional
    title: 'Auditoria de Arquitetura & Otimização de Performance de Banco Postgres',
    description: 'Consultoria técnica individual: análise profunda de queries lentas, modelagem de índices compostos, migração sem downtime e otimização de custos de infraestrutura.',
    priceCents: 120000, // R$ 1.200,00
    currency: 'BRL',
    licenseType: 'commercial',
    status: 'active',
    rating: 5.0,
    reviewsCount: 12,
    salesCount: 18,
    tags: ['PostgreSQL', 'Performance', 'DBA', 'Consultoria'],
    category: 'Serviços & Consultoria',
    includedItems: [
      'Reunião de diagnóstico técnico de 90 minutos (Google Meet)',
      'Relatório detalhado de gargalos com scripts de correção imediatos',
      'Acompanhamento de homologação em ambiente de staging',
    ],
    createdAt: '2026-07-15T09:00:00Z',
  },
  {
    id: 'list_4',
    sellerOrgId: 'org_platform',
    sellerName: 'Vyroh Oficial',
    type: 'digital_product',
    sourceRecordType: 'sop',
    title: 'Kit de Playbooks & SOPs do Desenvolvedor Solo: De Zero a R$ 30k/mês',
    description: 'Todos os processos documentados: propostas comerciais de alto fechamento, contratos protegidos por advogados de tech, onboarding e checklist de sustentação.',
    priceCents: 9700, // R$ 97,00
    currency: 'BRL',
    licenseType: 'resale',
    status: 'active',
    rating: 4.8,
    reviewsCount: 27,
    salesCount: 89,
    tags: ['SOPs', 'Processos', 'Freelance', 'Negócios'],
    category: 'SOPs & Modelos',
    includedItems: [
      '12 SOPs completos em formato Markdown e JSON para importar no Vyroh',
      'Templates de contrato e NDA em conformidade com a LGPD',
      'Calculadora de precificação hora vs valor em planilha',
    ],
    createdAt: '2026-05-20T10:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    listingId: 'list_1',
    listingTitle: 'Mega Boilerplate SaaS B2B: Next.js 15, Drizzle, Stripe Connect & Multi-tenant',
    listingType: 'digital_product',
    buyerOrgId: 'org_main_1',
    buyerName: 'Thomas Dev',
    amountCents: 19700,
    platformFeeCents: 1970, // 10% comissão plataforma
    sellerPayoutCents: 17730,
    licenseType: 'commercial',
    status: 'completed',
    itemAccessUrl: 'https://github.com/carol-silva/saas-b2b-boilerplate-pro',
    createdAt: '2026-07-20T18:30:00Z',
  },
  {
    id: 'ord_2',
    listingId: 'list_4',
    listingTitle: 'Kit de Playbooks & SOPs do Desenvolvedor Solo',
    listingType: 'digital_product',
    buyerOrgId: 'org_main_1',
    buyerName: 'Thomas Dev',
    amountCents: 9700,
    platformFeeCents: 970,
    sellerPayoutCents: 8730,
    licenseType: 'resale',
    status: 'completed',
    itemAccessUrl: 'https://vyroh.io/vault/kit-sops-download',
    createdAt: '2026-08-02T11:15:00Z',
  },
];

export const INITIAL_CREATOR_SUBSCRIPTIONS: CreatorSubscription[] = [
  {
    id: 'csub_1',
    listingId: 'list_2',
    listingTitle: 'Cofre VIP de Prompts & Agentes de Alta Conversão',
    creatorName: 'Thomas Dev',
    subscriberOrgId: 'org_buyer_1',
    amountMonthlyCents: 4990,
    status: 'active',
    currentPeriodEnd: '2026-09-18T00:00:00Z',
    createdAt: '2026-08-18T10:00:00Z',
  },
];

export const INITIAL_SELLER_ACCOUNT: SellerAccount = {
  id: 'sell_acc_1',
  orgId: 'org_main_1',
  stripeConnectAccountId: 'acct_1VyrohStripeExpress9982',
  kycStatus: 'verified',
  totalEarningsCents: 485000, // R$ 4.850,00 total
  pendingBalanceCents: 4990,
  availableBalanceCents: 125000,
  payouts: [
    { id: 'pay_1', amountCents: 210000, date: '2026-08-10', status: 'completed' },
    { id: 'pay_2', amountCents: 150000, date: '2026-07-25', status: 'completed' },
  ],
};

export const INITIAL_COMMUNITY_TOPICS: CommunityTopic[] = [
  {
    id: 'top_1',
    title: 'Como estruturar migração segura de banco sem downtime em SaaS com pgvector?',
    authorName: 'Gabriel Peixoto',
    authorRole: 'Tech Lead @ SoloStack',
    category: 'dev',
    content: 'Fala pessoal! Estou adicionando embeddings com pgvector numa tabela com mais de 500k linhas em produção. Qual é a melhor estratégia para adicionar a coluna e popular os vetores sem travar as queries concorrentes?',
    tags: ['PostgreSQL', 'pgvector', 'Migrations', 'Performance'],
    answersCount: 3,
    likesCount: 14,
    isSolved: true,
    aiAnalysis: {
      summaryAnswer: 'Para evitar lock exclusivo: 1) Adicione a coluna vector como nullable; 2) Crie o índice HNSW/IVFFlat usando CONCURRENTLY; 3) Popule os vetores em background em batches de 1.000 registros com cursor.',
      recommendedAssets: [
        { type: 'boilerplate', name: 'Fast MCP Server Template', reason: 'Possui scripts de migração assíncrona testados' },
        { type: 'prompt', name: 'Arquiteto de Banco Relacional & Migrations', reason: 'Gera a migration segura com statements transacionais' },
      ],
      recommendedExperts: [
        { name: 'Carolina Silva', role: 'Arquiteta de Banco Postgres & DBA', rating: '5.0 (38 jobs)' },
      ],
    },
    replies: [
      {
        id: 'rep_1',
        authorName: 'Carolina Silva',
        authorRole: 'Arquiteta de Software Top Seller',
        content: 'Exatamente o que a IA do Vyroh resumiu acima! Nunca crie o índice HNSW sem CONCURRENTLY em produção. Se quiser, dê uma olhada no meu boilerplate SaaS no marketplace que já vem com o script de batching em Node pronto.',
        isAccepted: true,
        likes: 9,
        createdAt: '2026-08-15T16:30:00Z',
      },
    ],
    createdAt: '2026-08-15T14:00:00Z',
  },
  {
    id: 'top_2',
    title: 'Qual a taxa média de conversão que vocês estão conseguindo em propostas de software sob medida?',
    authorName: 'Lucas Matos',
    authorRole: 'Dev & Fundador Solo',
    category: 'business',
    content: 'Geralmente envio proposta detalhada em PDF após 1 call de briefing. Fecho cerca de 25% a 30%. Gostaria de saber se o modelo de 3 opções de pacote aumentou a taxa de vocês.',
    tags: ['Vendas', 'Precificação', 'Propostas', 'Freelance'],
    answersCount: 5,
    likesCount: 18,
    isSolved: false,
    aiAnalysis: {
      summaryAnswer: 'Ao adotar 3 opções de pacotes ancoradas em valor (Essencial, Recomendado, Acelerado), a taxa de fechamento costuma subir para 45-55%, pois elimina a dúvida binária "compro ou não" e transforma em "qual versão eu quero".',
      recommendedAssets: [
        { type: 'prompt', name: 'Gerador de Propostas Comerciais de Alto Fechamento', reason: 'Estrutura automática de 3 opções ancoradas' },
      ],
      recommendedExperts: [
        { name: 'Thomas Dev', role: 'Criador do Vyroh & Estrategista de Vendas', rating: '4.9 (24 jobs)' },
      ],
    },
    replies: [],
    createdAt: '2026-08-18T10:00:00Z',
  },
];

// Section 29: Admin Configurable Engine Initial Seeds
export const INITIAL_COMMISSION_RULES: CommissionRule[] = [
  {
    id: 'com_a',
    flowType: 'A',
    name: 'Fluxo A — Assinatura da Plataforma Vyroh',
    percentage: 100.0,
    description: 'Receita direta da assinatura dos planos do cofre (Free, Pro, Enterprise). 100% da plataforma.',
    updatedAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'com_b',
    flowType: 'B',
    name: 'Fluxo B — Produtos Digitais Avulsos (Marketplace)',
    percentage: 10.0,
    description: 'Comissão da plataforma retida a cada venda de boilerplate, prompt, bundle ou SOP entre usuários.',
    updatedAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'com_c',
    flowType: 'C',
    name: 'Fluxo C — Assinaturas Recorrentes de Criadores',
    percentage: 12.0,
    description: 'Comissão da plataforma retida a cada renovação mensal da assinatura de conteúdo do criador.',
    updatedAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'com_d',
    flowType: 'D',
    name: 'Fluxo D — Intermediação de Serviços e Consultorias',
    percentage: 15.0,
    description: 'Taxa de serviço e garantia de custódia na contratação de profissionais indicados pela IA.',
    updatedAt: '2026-08-20T00:00:00Z',
  },
];

export const INITIAL_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan_free',
    name: 'Cofre Pessoal Solo (Free)',
    priceCents: 0,
    currency: 'BRL',
    period: 'monthly',
    features: [
      'Até 3 Projetos ativos',
      'Até 10 Prompts no cofre',
      'Até 5 Boilerplates indexados',
      'Acesso para comprar no Marketplace',
      'Cérebro IA com 30 execuções de roadmap/mês',
    ],
    limits: {
      projects: 3,
      prompts: 10,
      boilerplates: 5,
      aiCallsPerMonth: 30,
      marketplaceSelling: false,
    },
    active: true,
  },
  {
    id: 'plan_pro',
    name: 'Profissional Empresa (Pro)',
    priceCents: 8900, // R$ 89,00 / mês
    currency: 'BRL',
    period: 'monthly',
    isPopular: true,
    features: [
      'Projetos ilimitados',
      'Prompts, Boilerplates e SOPs ilimitados',
      'Cérebro IA com Gemini 3.7 Flash sem teto artificial',
      'Direito de Vender no Marketplace (produtos e assinaturas)',
      'MCPs e automações em background conectadas',
      'Exportação completa de dados em JSON/CSV a qualquer momento',
    ],
    limits: {
      projects: 9999,
      prompts: 9999,
      boilerplates: 9999,
      aiCallsPerMonth: 1000,
      marketplaceSelling: true,
    },
    active: true,
  },
  {
    id: 'plan_enterprise',
    name: 'Squad / Studio Multi-usuário',
    priceCents: 24900, // R$ 249,00 / mês
    currency: 'BRL',
    period: 'monthly',
    features: [
      'Tudo do Pro para até 5 colaboradores',
      'Permissões granulares RBAC por área do cofre',
      'Suporte prioritário e onboarding de dados dedicado',
      'Taxa de comissão reduzida nas vendas do Marketplace',
    ],
    limits: {
      projects: 99999,
      prompts: 99999,
      boilerplates: 99999,
      aiCallsPerMonth: 5000,
      marketplaceSelling: true,
    },
    active: true,
  },
];

export const INITIAL_LICENSE_TYPES: LicenseTypeConfig[] = [
  {
    id: 'lic_pers',
    code: 'personal',
    name: 'Licença Pessoal (Uso Próprio)',
    description: 'Permite utilizar o código/prompt em projetos pessoais sem fins lucrativos diretos de revenda.',
    terms: ['Uso em projetos pessoais ilimitados', 'Proibida a redistribuição ou revenda do código fonte original'],
    active: true,
  },
  {
    id: 'lic_comm',
    code: 'commercial',
    name: 'Licença Comercial Padrão',
    description: 'Permite criar produtos finais comerciais, SaaS para clientes ou uso em empresas.',
    terms: ['Uso em múltiplos produtos comerciais', 'Proibida a revenda como boilerplate ou template direto'],
    active: true,
  },
  {
    id: 'lic_resale',
    code: 'resale',
    name: 'Licença com Direitos de Revenda (PLR)',
    description: 'Concede direito integral para reempacotar, modificar e comercializar o ativo.',
    terms: ['Direito de modificação e revenda', 'Direitos autorais transferidos conforme contrato'],
    active: true,
  },
];

export const INITIAL_CATEGORIES: CategoryConfig[] = [
  { id: 'cat_1', name: 'Desenvolvimento & Engenharia', area: 'dev', slug: 'dev', description: 'Frontend, backend, APIs, PostgreSQL, Docker, MCP', active: true },
  { id: 'cat_2', name: 'Modelos Mentais & Negócios', area: 'business', slug: 'negocios', description: 'Estratégia, precificação, propostas comerciais, contratos', active: true },
  { id: 'cat_3', name: 'Marketing & Conversão', area: 'marketing', slug: 'marketing', description: 'Funis, landing pages, SEO técnico, métricas de conversão', active: true },
  { id: 'cat_4', name: 'Design Systems & UI/UX', area: 'design', slug: 'design', description: 'Design tokens, Figma, micro-interações, acessibilidade WCAG', active: true },
  { id: 'cat_5', name: 'Inteligência Artificial & Agentes', area: 'ai', slug: 'ia', description: 'Prompts, chains, fine-tuning, RAG, pgvector, MCP tools', active: true },
  { id: 'cat_6', name: 'Automações & Workflows', area: 'automation', slug: 'automacao', description: 'n8n, Activepieces, webhooks, integrações WhatsApp', active: true },
];

export const INITIAL_KYC_REQUIREMENTS: KYCRequirement[] = [
  {
    id: 'kyc_1',
    context: 'digital_product',
    name: 'Venda de Produtos Digitais & Prompts',
    levelRequired: 'express_id',
    description: 'Verificação básica de identidade e dados bancários via Stripe Connect Express.',
  },
  {
    id: 'kyc_2',
    context: 'creator_subscription',
    name: 'Venda de Assinatura Recorrente de Criador',
    levelRequired: 'express_id',
    description: 'Verificação com comprovação de residência e chave Pix/IBAN para repasses mensais.',
  },
  {
    id: 'kyc_3',
    context: 'service',
    name: 'Prestação de Serviços & Consultorias Técnicas',
    levelRequired: 'full_business_tax',
    description: 'Verificação fiscal completa (CPF/CNPJ ativo) e histórico de portfólio comprovado.',
  },
];

export const INITIAL_AI_USAGE_LIMITS: AIUsageLimit[] = [
  {
    id: 'ail_1',
    planId: 'plan_free',
    planName: 'Cofre Pessoal Solo (Free)',
    provider: 'Gemini 3.7 Flash',
    monthlyCallLimit: 30,
    currentUsed: 8,
  },
  {
    id: 'ail_2',
    planId: 'plan_pro',
    planName: 'Profissional Empresa (Pro)',
    provider: 'Gemini 3.7 Flash + Claude + Ollama Híbrido',
    monthlyCallLimit: 1000,
    currentUsed: 84,
  },
];

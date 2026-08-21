-- Enable pgvector extension for RAG and semantic embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Organizations (Multi-tenant Foundation)
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    ai_provider_pref VARCHAR(50) DEFAULT 'gemini',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Memberships (Organization Roles & RBAC)
CREATE TABLE IF NOT EXISTS memberships (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'owner' | 'admin' | 'member' | 'guest'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, org_id)
);

-- 4. Clients
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    contact_info JSONB,
    status VARCHAR(50) DEFAULT 'ativo', -- 'ativo' | 'inativo' | 'prospect'
    notes TEXT,
    total_spent_cents BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Projects (Central Core Axis)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'em_andamento', -- 'planejamento' | 'em_andamento' | 'concluido' | 'pausado' | 'arquivado'
    client_id VARCHAR(64) REFERENCES clients(id) ON DELETE SET NULL,
    budget_cents BIGINT DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    roadmap_plan JSONB,
    archived_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Prompts & Versions
CREATE TABLE IF NOT EXISTS prompts (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Geral',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    embedding vector(1536),
    favorite BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(50) DEFAULT 'private', -- 'private' | 'shared' | 'public'
    version_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prompt_versions (
    id VARCHAR(64) PRIMARY KEY,
    prompt_id VARCHAR(64) NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    version INT NOT NULL,
    changelog TEXT,
    created_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Boilerplates
CREATE TABLE IF NOT EXISTS boilerplates (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    repo_url TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    stack TEXT[] DEFAULT ARRAY[]::TEXT[],
    last_used_project_id VARCHAR(64) REFERENCES projects(id) ON DELETE SET NULL,
    visibility VARCHAR(50) DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Many-to-Many Pivot Tables for Projects
CREATE TABLE IF NOT EXISTS project_prompts (
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    prompt_id VARCHAR(64) NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, prompt_id)
);

CREATE TABLE IF NOT EXISTS project_boilerplates (
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    boilerplate_id VARCHAR(64) NOT NULL REFERENCES boilerplates(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, boilerplate_id)
);

-- 9. Tier 2 Assets: SOPs, Subscriptions, Proposals, MCPs, Skills
CREATE TABLE IF NOT EXISTS sops (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    checklist JSONB DEFAULT '[]'::JSONB,
    estimated_minutes INT DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    cost_cents BIGINT NOT NULL,
    billing_cycle VARCHAR(50) DEFAULT 'mensal', -- 'mensal' | 'anual'
    renewal_date DATE,
    url TEXT,
    roi_rating VARCHAR(50) DEFAULT 'essencial', -- 'essencial' | 'alto' | 'medio' | 'reavaliar'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS proposals (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    client_id VARCHAR(64) REFERENCES clients(id) ON DELETE SET NULL,
    value_cents BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'rascunho', -- 'rascunho' | 'enviada' | 'aceita' | 'recusada'
    valid_until DATE,
    scope_items JSONB DEFAULT '[]'::JSONB,
    content_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mcps (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    endpoint TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'conectado',
    tools_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    file_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. AI Roadmap Runs & Selective Sharing
CREATE TABLE IF NOT EXISTS roadmap_runs (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    goal_description TEXT NOT NULL,
    generated_plan JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shares (
    id VARCHAR(64) PRIMARY KEY,
    record_type VARCHAR(50) NOT NULL, -- 'prompt' | 'boilerplate' | 'sop' | 'project'
    record_id VARCHAR(64) NOT NULL,
    shared_with_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(50) DEFAULT 'read', -- 'read' | 'write'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Marketplace & Stripe Connect Payments
CREATE TABLE IF NOT EXISTS listings (
    id VARCHAR(64) PRIMARY KEY,
    seller_org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    seller_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'digital_product' | 'creator_subscription' | 'service'
    source_record_type VARCHAR(50), -- 'prompt' | 'boilerplate' | 'sop' | 'skill'
    source_record_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price_cents BIGINT NOT NULL,
    currency VARCHAR(10) DEFAULT 'BRL',
    category VARCHAR(100) NOT NULL,
    license_type VARCHAR(50) DEFAULT 'comercial',
    status VARCHAR(50) DEFAULT 'publicado', -- 'publicado' | 'pausado' | 'em_revisao'
    rating NUMERIC(3,2) DEFAULT 5.00,
    sales_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    listing_id VARCHAR(64) NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    buyer_org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    amount_cents BIGINT NOT NULL,
    platform_fee_cents BIGINT NOT NULL,
    seller_net_cents BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'pago', -- 'pendente' | 'pago' | 'reembolsado'
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS creator_subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    listing_id VARCHAR(64) NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    subscriber_org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ativo', -- 'ativo' | 'cancelado' | 'inadimplente'
    stripe_subscription_id VARCHAR(255),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan VARCHAR(50) DEFAULT 'free', -- 'free' | 'pro' | 'enterprise'
    status VARCHAR(50) DEFAULT 'active',
    stripe_subscription_id VARCHAR(255),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_accounts (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_connect_account_id VARCHAR(255) NOT NULL,
    kyc_status VARCHAR(50) DEFAULT 'verificado', -- 'pendente' | 'verificado' | 'rejeitado'
    payouts_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payouts (
    id VARCHAR(64) PRIMARY KEY,
    seller_account_id VARCHAR(64) NOT NULL REFERENCES seller_accounts(id) ON DELETE CASCADE,
    amount_cents BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'pago',
    stripe_transfer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Dynamic Configurable Business Rules (Section 29)
CREATE TABLE IF NOT EXISTS commission_rules (
    id VARCHAR(64) PRIMARY KEY,
    flow_type VARCHAR(50) UNIQUE NOT NULL, -- 'A_plataforma' | 'B_produto_avulso' | 'C_assinatura_criador' | 'D_servico'
    percentage NUMERIC(5,2) NOT NULL,
    label VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing_plans (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price_cents BIGINT NOT NULL,
    billing_period VARCHAR(50) DEFAULT 'mensal',
    features JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plan_limits (
    id VARCHAR(64) PRIMARY KEY,
    plan_id VARCHAR(64) NOT NULL REFERENCES pricing_plans(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'projects' | 'prompts' | 'storage_mb'
    max_records INT NOT NULL,
    UNIQUE(plan_id, entity_type)
);

CREATE TABLE IF NOT EXISTS license_types (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    terms TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL,
    context VARCHAR(50) NOT NULL, -- 'forum' | 'marketplace'
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS kyc_requirements (
    id VARCHAR(64) PRIMARY KEY,
    context VARCHAR(50) UNIQUE NOT NULL, -- 'digital_product' | 'service' | 'payout'
    level_required VARCHAR(50) NOT NULL, -- 'basico' | 'completo' | 'rigoroso'
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_usage_limits (
    id VARCHAR(64) PRIMARY KEY,
    plan_id VARCHAR(64) NOT NULL REFERENCES pricing_plans(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    monthly_call_limit INT NOT NULL,
    UNIQUE(plan_id, provider)
);

-- Seed Initial Default Config Data (Section 29)
INSERT INTO commission_rules (id, flow_type, percentage, label) VALUES
('cr_b', 'B_produto_avulso', 10.00, 'Comissão sobre venda avulsa de produtos digitais'),
('cr_c', 'C_assinatura_criador', 12.50, 'Comissão sobre assinaturas recorrentes de criadores'),
('cr_d', 'D_servico', 15.00, 'Taxa sobre intermediação e escrow de serviços')
ON CONFLICT (flow_type) DO NOTHING;

INSERT INTO pricing_plans (id, name, price_cents, billing_period, features, active) VALUES
('plan_free', 'Plano Gratuito', 0, 'mensal', '["Tier 1 Básico", "Até 5 projetos", "Até 25 prompts", "50 chamadas de IA/mês"]'::JSONB, TRUE),
('plan_pro', 'Plano Pro (Solo-Founder)', 9700, 'mensal', '["Tier 1 & 2 Ilimitados", "Projetos e Clientes ilimitados", "Cérebro IA com RAG", "Venda no Marketplace", "1.000 chamadas IA/mês"]'::JSONB, TRUE),
('plan_agency', 'Plano Agency', 24900, 'mensal', '["Multi-usuário & Membros", "Contratos & Propostas Avançadas", "Prioridade no Auto-Match", "Suporte VIP", "Chamadas IA Ilimitadas"]'::JSONB, TRUE)
ON CONFLICT (id) DO NOTHING;

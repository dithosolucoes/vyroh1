# Vyroh Central Hub - Monorepo Arquitetural de Produção

Plataforma All-in-One para Engenheiros de IA, Criadores e Agências Digitais.

## 🚀 Arquitetura Completa (Stack & Decisões Técnicas)

- **Framework:** Next.js 14+ (App Router) + React 19 / Vite + Express Runner
- **Database & ORM:** PostgreSQL 16 (com extensão `pgvector`) + Drizzle ORM
- **Multi-Tenancy:** Isolamento estrito por `orgId` em todas as tabelas (`organizations`, `memberships`, `projects`, `prompts`, `listings`, `orders`)
- **Autenticação:** Better-Auth com sessões persistidas em banco relacional e cookies seguros
- **Motor de IA Híbrido (Multi-Provider):**
  - Google Gemini (Gemini 2.5 Flash / 3.7 Flash)
  - Anthropic Claude (Claude 3.5 Sonnet / Opus)
  - OpenAI (GPT-4o)
  - Ollama Local (LLMs locais na VPS sem custo de API)
- **Marketplace & Pagamentos (Split Stripe Connect):**
  - **Fluxo A (0%):** Assinatura da plataforma (100% Vyroh)
  - **Fluxo B (10%):** Produtos Digitais Avulsos (10% taxa de plataforma / 90% criador)
  - **Fluxo C (12.5%):** Assinaturas de Criador (12.5% split mensal recorrente)
  - **Fluxo D (15%):** Serviços & Contratos Escrow com liberação por marcos
  - **Seção 29 (Governança):** Alteração e persistência de regras de comissão sem necessidade de redeploy
- **Model Context Protocol (MCP):** Servidor MCP integrado (`/src/server/mcp/server.ts`) com ferramentas para automação de agentes externos

---

## 📁 Estrutura de Diretórios (App Router & Monorepo)

```
├── app/                                 # Next.js 14+ App Router
│   ├── (auth)/                          # Rotas de Autenticação (Login / Cadastro)
│   ├── (dashboard)/                     # Layouts protegidos com Sidebar e TopBar
│   │   ├── dashboard/                   # Visão Geral & Métricas
│   │   ├── projetos/                    # Gestão de Projetos & Kanban
│   │   │   └── [id]/                    # Detalhes do Projeto, Roadmap e Tasks
│   │   ├── cofre/                       # Cofre Central de Ativos
│   │   │   ├── prompts/                 # Versionamento de Prompts & Teste Live
│   │   │   ├── boilerplates/            # Repositórios e Starter Kits
│   │   │   └── sops/                    # Procedimentos Operacionais Padrão
│   │   ├── clientes/                    # CRM de Clientes & Histórico
│   │   ├── stack/                       # Calculadora de Custos de Ferramentas
│   │   ├── propostas/                   # Propostas em 3 Níveis & Escrow
│   │   ├── cerebro/                     # IA Estratégica & Cruzamento de Ativos
│   │   ├── mcp/                         # Servidor e Catálogo de Ferramentas MCP
│   │   ├── marketplace/                 # Vitrine Pública com Checkout Split
│   │   ├── loja/[sellerId]/             # Loja Pública do Criador
│   │   ├── minhas-compras/              # Biblioteca de Assets Adquiridos
│   │   ├── assinaturas/                 # Gestão de Planos & Faturamento
│   │   ├── vendedor/                    # Painel do Vendedor & Stripe Connect
│   │   ├── admin/configuracoes/         # Governança de Taxas (Seção 29)
│   │   ├── comunidade/                  # Fórum & Auto-Matcher de Especialistas
│   │   └── configuracoes/               # Chaves de API, Preferências de IA e Perfil
│   └── api/                             # Endpoints de API REST & Webhooks
│       ├── auth/[...all]/               # Better-Auth Handler
│       ├── chat/                        # AI Multi-Provider (Claude/OpenAI/Ollama/Gemini)
│       ├── projects/                    # CRUD de Projetos
│       ├── prompts/                     # CRUD de Prompts
│       ├── clients/                     # CRUD de Clientes
│       ├── marketplace/                 # Vitrine e Checkout Stripe Connect
│       ├── admin/commission-rules/      # Governança de Comissões
│       └── webhooks/stripe/             # Webhooks de Pagamento e Split
├── src/
│   ├── lib/
│   │   ├── db.ts                        # Conexão PostgreSQL Pool + Drizzle ORM
│   │   ├── auth.ts                      # Helpers de Autenticação e Sessão
│   │   ├── ai.ts                        # Motor Multi-Provedor de IA
│   │   ├── stripe.ts                    # Lógica de Split Stripe Connect (A, B, C, D)
│   │   ├── actions.ts                   # Server Actions para o App Router
│   │   └── api-client.ts                # Cliente HTTP tipado para o Frontend
│   ├── server/
│   │   ├── db/schema.ts                 # Schema Completo Multi-Tenant do Drizzle
│   │   └── mcp/server.ts                # Servidor Model Context Protocol
│   └── components/                      # Design System Linear Dark Mode
├── drizzle/                             # Migrações SQL Geradas
├── docker-compose.yml                   # Postgres 16 (pgvector) + Caddy + App
└── server.ts                            # Servidor Full-Stack Node.js/Express
```

---

## 🛠️ Como Rodar Localmente ou na VPS

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o `.env.example` para `.env` e preencha suas chaves:
```bash
cp .env.example .env
```

### 3. Subir o Banco de Dados com Docker
```bash
docker-compose up -d db
```

### 4. Executar as Migrações do Banco
```bash
npm run db:push
```

### 5. Iniciar a Aplicação
- **Modo Desenvolvimento (Next.js):**
  ```bash
  npm run dev:next
  ```
- **Modo Full-Stack Integrado:**
  ```bash
  npm run dev
  ```

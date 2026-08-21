import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Terminal,
  Layers,
  Users,
  Brain,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Plus,
  CheckCircle2,
  DollarSign,
  Copy,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    projects,
    prompts,
    boilerplates,
    clients,
    orders,
    listings,
    setActiveView,
    setSelectedProjectId,
    openModal,
    showToast,
  } = useApp();

  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'in_progress');
  const totalPipelineValue = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalMarketplaceSales = orders.reduce((acc, o) => acc + o.amountCents, 0) / 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121014] via-[#0F0D11] to-[#160E1E] border border-[var(--border-strong)] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[var(--action)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#6B21A8]/20 text-[#8B35D6] border border-[#6B21A8]/30">
                HUB CENTRAL VYROH
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">v1.0.0 • Organização: {currentUser.orgId}</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Olá, {currentUser.name}. Seu cofre está sincronizado.
            </h1>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              O agregador do desenvolvedor solo. Todos os seus projetos, prompts versionados, boilerplates indexados e receita centralizados em um único cérebro.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => setActiveView('cerebro')}
              className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 badge-glow"
            >
              <Brain className="w-4 h-4 text-[#F3EEFB]" />
              <span>Gerar Roadmap com IA</span>
            </button>

            <button
              onClick={() => openModal('add_project')}
              className="bg-[#121014] hover:bg-[#1A1620] text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--accent)] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-[var(--accent-bright)]" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Projetos Ativos</span>
            <FolderKanban className="w-4 h-4 text-[var(--accent-bright)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {activeProjects.length}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
            <span>Pipeline Total:</span>
            <span className="font-semibold text-emerald-400">R$ {totalPipelineValue.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Prompts no Cofre</span>
            <Terminal className="w-4 h-4 text-[#8B35D6]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {prompts.length}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            <span>Todos versionados com histórico</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Boilerplates Prontos</span>
            <Layers className="w-4 h-4 text-[#C2410C]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {boilerplates.length}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            <span>{boilerplates.filter((b) => b.visibility === 'public').length} públicos no marketplace</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Vendas Marketplace</span>
            <DollarSign className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono text-[#EA580C]">
            R$ {totalMarketplaceSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            <span>{orders.length} pedidos confirmados</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Projects & AI Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Projects Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[var(--accent-bright)]" />
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Projetos em Andamento</h2>
            </div>

            <button
              onClick={() => setActiveView('projetos')}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-bright)] flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Ver todos ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setActiveView('projeto_detalhe');
                }}
                className="p-4 rounded-xl bg-[#0F0D11] hover:bg-[#121014] border border-[var(--border)] hover:border-[var(--accent)] transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-bright)] transition-colors">
                        {project.name}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          project.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : project.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : project.status === 'active'
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}
                      >
                        {project.status === 'in_progress'
                          ? 'Em Progresso'
                          : project.status === 'completed'
                          ? 'Entregue'
                          : project.status === 'active'
                          ? 'Ativo'
                          : 'Lead'}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{project.description}</p>
                  </div>

                  {project.budget ? (
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        R$ {project.budget.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">{project.clientName || 'Cliente Direto'}</div>
                    </div>
                  ) : null}
                </div>

                {/* Linked assets pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                  <span className="font-mono text-[10px]">Ativos Vinculados:</span>
                  {project.promptIds.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#1A1620] text-[#A79BC4] border border-[var(--border)]">
                      {project.promptIds.length} Prompts
                    </span>
                  )}
                  {project.boilerplateIds.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#1A1620] text-[#A79BC4] border border-[var(--border)]">
                      {project.boilerplateIds.length} Boilerplates
                    </span>
                  )}
                  {project.tags.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#050506] text-[var(--text-muted)] text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: AI Brain Insights & Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C2410C]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Radar do Cérebro IA</h2>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-4">
            <div className="p-3 rounded-lg bg-[#121014] border border-[var(--accent)]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-bright)]">
                <Brain className="w-4 h-4" />
                <span>Oportunidade de Reuso Detectada</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Você possui o <strong>Next.js 15 Starter</strong> e o <strong>Prompt de Arquiteto Postgres</strong>. O Cérebro estima que você pode montar novos SaaS B2B com <strong>75% de economia de tempo</strong>.
              </p>
              <button
                onClick={() => setActiveView('cerebro')}
                className="text-xs font-semibold text-[#8B35D6] hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>Criar roadmap para nova ideia</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Ações Rápidas do Cofre:
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => openModal('add_prompt')}
                  className="p-2.5 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer transition-all"
                >
                  <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#8B35D6]" />
                    <span>Salvar Prompt</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">Com versionamento</div>
                </button>

                <button
                  onClick={() => openModal('add_boilerplate')}
                  className="p-2.5 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer transition-all"
                >
                  <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>Indexar Repo</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">Link do GitHub</div>
                </button>

                <button
                  onClick={() => openModal('add_client')}
                  className="p-2.5 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer transition-all"
                >
                  <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Novo Cliente</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">Ficha no CRM</div>
                </button>

                <button
                  onClick={() => openModal('add_listing')}
                  className="p-2.5 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer transition-all"
                >
                  <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Vender Ativo</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">No Marketplace</div>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts Shelf */}
          <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-primary)]">Prompts Mais Testados</span>
              <button
                onClick={() => setActiveView('prompts')}
                className="text-[var(--accent-bright)] hover:underline cursor-pointer"
              >
                Abrir Playground
              </button>
            </div>

            <div className="space-y-2">
              {prompts.slice(0, 2).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveView('prompts');
                  }}
                  className="p-2.5 rounded-lg bg-[#121014] border border-[var(--border)] hover:border-[var(--accent-bright)] cursor-pointer text-xs space-y-1"
                >
                  <div className="font-medium text-[var(--text-primary)] truncate">{p.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">
                    v{p.version} • {p.category.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

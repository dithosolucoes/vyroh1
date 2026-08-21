import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Brain,
  Sparkles,
  Layers,
  Terminal,
  CheckSquare,
  CheckCircle2,
  ArrowRight,
  Clock,
  Zap,
  PlusCircle,
  RefreshCw,
  FolderKanban,
  FileCode,
} from 'lucide-react';
import { AIRoadmapResult } from '../../types';

export const BrainView: React.FC = () => {
  const {
    generateRoadmap,
    prompts,
    boilerplates,
    sops,
    addProject,
    setActiveView,
    setSelectedProjectId,
    showToast,
  } = useApp();

  const [ideaText, setIdeaText] = useState(
    'Quero construir uma plataforma SaaS B2B de gestão de contratos para advogados autônomos com geração via IA, assinatura digital e painel financeiro.'
  );
  const [targetStack, setTargetStack] = useState('Next.js 15, PostgreSQL, Tailwind, Gemini AI');
  const [estimatedHours, setEstimatedHours] = useState('40');
  const [budgetGoal, setBudgetGoal] = useState('25000');
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState<AIRoadmapResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsLoading(true);
    const result = await generateRoadmap(ideaText, {
      stack: targetStack,
      budget: Number(budgetGoal),
      hours: Number(estimatedHours),
    });
    setRoadmapResult(result);
    setIsLoading(false);
  };

  const handleCreateProjectFromRoadmap = () => {
    if (!roadmapResult) return;

    const newProj = addProject({
      name: roadmapResult.title || 'Novo Projeto do Cérebro',
      description: ideaText,
      status: 'active',
      tags: ['SaaS', 'IA', 'B2B', 'Postgres'],
      budget: Number(budgetGoal) || 25000,
      deadline: '4 semanas',
      promptIds: roadmapResult.reusedAssets.prompts.map((p) => p.id),
      boilerplateIds: roadmapResult.reusedAssets.boilerplates.map((b) => b.id),
      notes: `Roadmap gerado pelo Cérebro Vyroh:\n${roadmapResult.phases
        .map((p) => `## ${p.name} (~${p.estimatedDays} dias)\n${p.tasks.map((t) => `- ${t}`).join('\n')}`)
        .join('\n\n')}`,
    });

    setSelectedProjectId(newProj.id);
    setActiveView('projeto_detalhe');
    showToast('Projeto criado e vinculado com sucesso a partir do Roadmap!');
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1A0E28] via-[#0F0D11] to-[#1F1210] border border-[#6B21A8]/40 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#6B21A8]/30 text-[#A79BC4] border border-[#6B21A8]/40">
            MOTOR DE INTELIGÊNCIA VYROH
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">Gemini 3.7 Flash Integrado</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
              <Brain className="w-8 h-8 text-[#8B35D6]" />
              <span>O Cérebro IA</span>
            </h1>
            <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              O planejador central do desenvolvedor solo. Descreva o que você quer construir; o Cérebro vasculha todo o seu cofre técnico, cruza com seus prompts e repositórios existentes, e entrega um plano de execução pronto para faturar.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border)] shadow-xl space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Descreva a ideia do projeto ou escopo do cliente:</span>
              <span className="text-[11px] text-[var(--text-muted)] font-normal">
                Quanto mais detalhado, mais preciso o cruzamento com o cofre
              </span>
            </label>
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              rows={3}
              placeholder="Ex: Quero criar um SaaS de automação de cobrança no WhatsApp com webhook Stripe e dashboard em Next.js..."
              className="w-full bg-[#121014] border border-[var(--border-strong)] rounded-xl p-3.5 text-xs lg:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)] transition-all font-sans leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-muted)]">Stack Preferencial:</label>
              <input
                type="text"
                value={targetStack}
                onChange={(e) => setTargetStack(e.target.value)}
                className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-muted)]">Meta de Orçamento (R$):</label>
              <input
                type="number"
                value={budgetGoal}
                onChange={(e) => setBudgetGoal(e.target.value)}
                className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-muted)]">Tempo Estimado (Horas):</label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#6B21A8] hover:bg-[#8B35D6] disabled:opacity-50 text-[#F3EEFB] px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md badge-glow"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#F3EEFB]" />
                  <span>Cruzando cofre com Gemini 3.7 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F3EEFB]" />
                  <span>Calcular & Gerar Roadmap com IA</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      {roadmapResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header of the generated roadmap */}
          <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--accent)]/40 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Plano Estratégico Concluído
                </span>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{roadmapResult.title}</h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{roadmapResult.description}</p>
              </div>

              <button
                onClick={handleCreateProjectFromRoadmap}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shrink-0"
              >
                <FolderKanban className="w-4 h-4" />
                <span>Transformar em Projeto Ativo</span>
              </button>
            </div>

            {/* Reused Vault Assets (The core value of Vyroh) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-bright)] uppercase tracking-wider font-mono">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Ativos do seu Cofre Reaproveitados (Economia de ~65% do tempo):</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roadmapResult.reusedAssets.boilerplates.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-[#121014] border border-[var(--border)] flex items-start gap-3">
                    <Layers className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[var(--text-primary)]">Boilerplate: {b.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">{b.cloneCommand}</div>
                    </div>
                  </div>
                ))}

                {roadmapResult.reusedAssets.prompts.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-[#121014] border border-[var(--border)] flex items-start gap-3">
                    <Terminal className="w-4 h-4 text-[#8B35D6] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[var(--text-primary)]">Prompt: {p.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] line-clamp-1">{p.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Assets / Gap Analysis */}
            {roadmapResult.missingAssets.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1.5">
                <div className="font-semibold text-amber-400 font-mono text-[11px]">
                  Análise de Gaps (Ativos recomendados para adquirir ou construir):
                </div>
                <div className="flex flex-wrap gap-2">
                  {roadmapResult.missingAssets.map((gap, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-[#0F0D11] text-amber-300 border border-amber-500/20 text-[11px]">
                      • {gap}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phased Roadmap Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
              Fases Sequenciais de Entrega:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadmapResult.phases.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] space-y-3 flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-[#6B21A8]/20 text-[var(--accent-bright)] font-mono font-bold text-xs flex items-center justify-center border border-[#6B21A8]/40">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{phase.estimatedDays} dias</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{phase.name}</h4>

                    <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                      {phase.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {phase.suggestedVaultItems.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
                      <span>Usar do cofre: </span>
                      <strong className="text-[var(--text-primary)]">{phase.suggestedVaultItems.join(', ')}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

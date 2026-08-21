import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Circle,
  Tag,
  Trash2,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SOPItem } from '../../types';

export const SOPsView: React.FC = () => {
  const { sops, updateSOP, deleteSOP, openModal, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSop, setActiveSop] = useState<SOPItem | null>(sops[0] || null);

  const filtered = sops.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleStep = (stepId: string) => {
    if (!activeSop) return;
    const updatedSteps = activeSop.steps.map((st) =>
      st.id === stepId ? { ...st, completed: !st.completed } : st
    );
    const updated = { ...activeSop, steps: updatedSteps };
    setActiveSop(updated);
    updateSOP(activeSop.id, { steps: updatedSteps });
  };

  const resetAllSteps = () => {
    if (!activeSop) return;
    const reset = activeSop.steps.map((st) => ({ ...st, completed: false }));
    setActiveSop({ ...activeSop, steps: reset });
    updateSOP(activeSop.id, { steps: reset });
    showToast('Checklist reiniciado para nova execução!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              SOPs & Processos Repetíveis
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-emerald-400 border border-emerald-500/30 font-mono">
              {sops.length} playbooks
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Playbooks operacionais para deploys, onboarding e entregas consistentes sem erro humano.
          </p>
        </div>

        <button
          onClick={() => openModal('add_sop')}
          className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo SOP</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0F0D11] p-3 rounded-xl border border-[var(--border)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar SOPs por título, tag..."
            className="w-full bg-[#121014] text-xs text-[var(--text-primary)] pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] focus:border-[var(--accent-bright)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['all', 'infra', 'deploy', 'qualidade', 'cliente'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1A1620] text-[var(--accent-bright)] font-semibold border border-[var(--accent)]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Columns: List & Active Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SOPs cards */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map((s) => {
            const isSelected = activeSop?.id === s.id;
            const completedCount = s.steps.filter((st) => st.completed).length;

            return (
              <div
                key={s.id}
                onClick={() => setActiveSop(s)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-[#121014] border-[var(--accent-bright)] shadow-md'
                    : 'bg-[#0F0D11] hover:bg-[#121014] border-[var(--border)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1620] text-emerald-400">
                    {completedCount}/{s.steps.length}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{s.description}</p>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>~{s.estimatedMinutes} min</span>
                  </span>
                  <span className="font-mono">Cat: {s.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Checklist Detail */}
        <div className="lg:col-span-7">
          {activeSop ? (
            <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border-strong)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{activeSop.title}</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{activeSop.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetAllSteps}
                    className="p-2 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5 cursor-pointer"
                    title="Reiniciar checklist"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resetar</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Deseja excluir este SOP?')) {
                        deleteSOP(activeSop.id);
                        setActiveSop(null);
                      }
                    }}
                    className="p-2 rounded-lg bg-[#121014] hover:bg-red-500/10 border border-[var(--border)] text-xs text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Progresso da Execução</span>
                  <span className="font-mono font-semibold text-[var(--accent-bright)]">
                    {Math.round(
                      (activeSop.steps.filter((st) => st.completed).length / activeSop.steps.length) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-[#121014] h-2 rounded-full overflow-hidden border border-[var(--border)]">
                  <div
                    className="bg-gradient-to-r from-[#6B21A8] to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(activeSop.steps.filter((st) => st.completed).length / activeSop.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Step by step checklist items */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  Etapas do Processo:
                </div>

                {activeSop.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      step.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-[var(--text-muted)]'
                        : 'bg-[#121014] hover:bg-[#16121B] border-[var(--border)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${step.completed ? 'line-through opacity-70' : ''}`}>
                          {idx + 1}. {step.title}
                        </span>
                        {step.commandSnippet && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#050506] text-[var(--accent-bright)]">
                            CLI
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {step.instructions}
                      </p>

                      {step.commandSnippet && (
                        <div className="mt-2 p-2 rounded-lg bg-[#050506] border border-[var(--border)] font-mono text-[11px] text-[var(--accent-bright)] select-all">
                          {step.commandSnippet}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[var(--text-muted)]">
              Selecione um SOP para visualizar as etapas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal,
  Plus,
  Search,
  Copy,
  Check,
  Play,
  History,
  Tag,
  Share2,
  Sparkles,
  Lock,
  Globe,
  Trash2,
  ChevronRight,
  Code,
  Edit3,
} from 'lucide-react';
import { PromptItem } from '../../types';

export const PromptsView: React.FC = () => {
  const { prompts, updatePrompt, deletePrompt, testPromptAI, openModal, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(prompts[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testVariables, setTestVariables] = useState<Record<string, string>>({});
  const [aiOutput, setAiOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const categories = ['all', 'arquitetura', 'frontend', 'backend', 'vendas', 'gestao'];

  const filteredPrompts = prompts.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const copyPromptText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Prompt copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunAI = async () => {
    if (!activePrompt) return;
    setIsGenerating(true);
    setAiOutput('');

    let processedContent = activePrompt.content;
    Object.entries(testVariables).forEach(([key, val]) => {
      processedContent = processedContent.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });

    const result = await testPromptAI(activePrompt.id, testVariables);
    setAiOutput(result.output);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Prompts & Agentes
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-[#8B35D6] border border-[#6B21A8]/30 font-mono">
              {prompts.length} salvos
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Seus prompts com versionamento semântico, variáveis dinâmicas e playground com Gemini AI.
          </p>
        </div>

        <button
          onClick={() => openModal('add_prompt')}
          className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Prompt</span>
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
            placeholder="Buscar por título, tag, categoria..."
            className="w-full bg-[#121014] text-xs text-[var(--text-primary)] pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] focus:border-[var(--accent-bright)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
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

      {/* Two Pane Layout: Prompt List & Real-time Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompts List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredPrompts.map((p) => {
            const isSelected = activePrompt?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setActivePrompt(p);
                  setAiOutput('');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-[#121014] border-[var(--accent-bright)] shadow-md'
                    : 'bg-[#0F0D11] hover:bg-[#121014] border-[var(--border)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                      {p.title}
                      {p.visibility === 'public' ? (
                        <span title="Público / Marketplace"><Globe className="w-3 h-3 text-emerald-400" /></span>
                      ) : (
                        <span title="Privado"><Lock className="w-3 h-3 text-[var(--text-muted)]" /></span>
                      )}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{p.description}</p>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1620] text-[#A79BC4] border border-[var(--border)]">
                    v{p.version}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#050506] text-[var(--text-muted)] text-[10px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                  <span>Categoria: {p.category}</span>
                  <span className="font-mono">{(p.variables?.length ?? 0)} variáveis</span>
                </div>
              </div>
            );
          })}

          {filteredPrompts.length === 0 && (
            <div className="p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)]">
              Nenhum prompt encontrado para os filtros aplicados.
            </div>
          )}
        </div>

        {/* Right Column: Prompt Detail & Live AI Execution (7 Cols) */}
        <div className="lg:col-span-7">
          {activePrompt ? (
            <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border-strong)] space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">{activePrompt.title}</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#6B21A8]/20 text-[#8B35D6] font-mono font-semibold">
                      v{activePrompt.version}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{activePrompt.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyPromptText(activePrompt.content, activePrompt.id)}
                    className="p-2 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === activePrompt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === activePrompt.id ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={() => setShowHistoryModal(!showHistoryModal)}
                    className="p-2 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-bright)] flex items-center gap-1.5 cursor-pointer"
                    title="Histórico de Versões"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Versões ({activePrompt.versions.length})</span>
                  </button>
                </div>
              </div>

              {/* Version History Drawer (if expanded) */}
              {showHistoryModal && (
                <div className="p-4 rounded-xl bg-[#121014] border border-[var(--accent)]/40 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--accent-bright)]">Histórico de Alterações de Versão:</span>
                    <button onClick={() => setShowHistoryModal(false)} className="text-[var(--text-muted)] hover:text-white">
                      Fechar
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {activePrompt.versions.map((h, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#050506] border border-[var(--border)] space-y-1">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-bold text-[var(--accent-bright)]">Versão {h.versionNumber}</span>
                          <span className="text-[var(--text-muted)]">{h.createdAt.split('T')[0]}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">{h.changeNotes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>CORPO DO PROMPT:</span>
                  <span>{activePrompt.content.length} caracteres</span>
                </div>

                <div className="p-4 rounded-xl bg-[#050506] border border-[var(--border)] font-mono text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {activePrompt.content}
                </div>
              </div>

              {/* Dynamic Variables Inputs */}
              {(activePrompt.variables?.length ?? 0) > 0 && (
                <div className="space-y-3 p-4 rounded-xl bg-[#121014] border border-[var(--border)]">
                  <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                    Preencher Variáveis do Prompt:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activePrompt.variables ?? []).map((varName) => (
                      <div key={varName} className="space-y-1">
                        <label className="text-xs font-mono text-[var(--accent-bright)]">
                          {`{{${varName}}}`}
                        </label>
                        <input
                          type="text"
                          value={testVariables[varName] || ''}
                          onChange={(e) =>
                            setTestVariables({ ...testVariables, [varName]: e.target.value })
                          }
                          placeholder={`Valor para ${varName}...`}
                          className="w-full bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Action */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                    Playground Gemini AI
                  </span>
                  <button
                    onClick={handleRunAI}
                    disabled={isGenerating}
                    className="bg-[#6B21A8] hover:bg-[#8B35D6] disabled:opacity-50 text-[#F3EEFB] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md badge-glow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGenerating ? 'Executando no Gemini...' : 'Executar Prompt'}</span>
                  </button>
                </div>

                {/* AI Output Console */}
                <div className="p-4 rounded-xl bg-[#050506] border border-[var(--border)] min-h-[160px] text-xs font-mono text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {isGenerating ? (
                    <div className="flex items-center gap-2 text-[var(--accent-bright)]">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Processando contexto com Gemini 3.7 Flash...</span>
                    </div>
                  ) : aiOutput ? (
                    <div className="space-y-2">
                      <div className="text-[10px] text-emerald-400 font-bold tracking-wider">
                        RESPOSTA GERADA PELO GEMINI AI:
                      </div>
                      <div className="text-[var(--text-primary)]">{aiOutput}</div>
                    </div>
                  ) : (
                    <div className="text-[var(--text-muted)] italic">
                      Clique em "Executar Prompt" para testar o resultado em tempo real usando a API do Gemini.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[var(--text-muted)]">
              Selecione um prompt na lista para visualizar detalhes ou testar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

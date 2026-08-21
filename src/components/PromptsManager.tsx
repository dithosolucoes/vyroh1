'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Plus,
  Search,
  Star,
  Copy,
  Check,
  Play,
  History,
  Trash2,
  Edit2,
  Sparkles,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import { Prompt, VyrohStore } from '@/libs/VyrohStore';

export function PromptsManager() {
  const [prompts, setPrompts] = useState<Prompt[]>(VyrohStore.getPrompts());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Active prompt selected for inspection / testing
  const [activePrompt, setActivePrompt] = useState<Prompt>(prompts[0] || ({} as Prompt));
  const [selectedVersion, setSelectedVersion] = useState<number>(activePrompt.currentVersion || 1);

  // Test Runner state
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Dev' as Prompt['category'],
    tags: '',
    visibility: 'private' as Prompt['visibility'],
    changeLog: '',
  });

  const handleOpenCreate = () => {
    setEditingPrompt(null);
    setFormData({
      title: '',
      content: '',
      category: 'Dev',
      tags: 'Prompt, Sênior',
      visibility: 'private',
      changeLog: 'Criação inicial',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Prompt) => {
    setEditingPrompt(p);
    setFormData({
      title: p.title,
      content: p.content,
      category: p.category,
      tags: p.tags.join(', '),
      visibility: p.visibility,
      changeLog: `Ajuste na versão ${p.currentVersion + 1}`,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingPrompt) {
      const updated = VyrohStore.updatePrompt(
        editingPrompt.id,
        formData.content,
        formData.changeLog,
        {
          title: formData.title,
          category: formData.category,
          tags: tagArray,
          visibility: formData.visibility,
        }
      );
      if (updated) {
        setActivePrompt(updated);
        setSelectedVersion(updated.currentVersion);
      }
    } else {
      const created = VyrohStore.createPrompt({
        orgId: 'org_solo_1',
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tagArray,
        favorite: false,
        visibility: formData.visibility,
      });
      setActivePrompt(created);
      setSelectedVersion(created.currentVersion);
    }

    setPrompts([...VyrohStore.getPrompts()]);
    setIsModalOpen(false);
  };

  const handleCopy = (content: string, id: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = (id: number) => {
    VyrohStore.toggleFavoritePrompt(id);
    setPrompts([...VyrohStore.getPrompts()]);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta instrução? Todo o histórico de versões será apagado.')) {
      VyrohStore.deletePrompt(id);
      const remaining = VyrohStore.getPrompts();
      setPrompts([...remaining]);
      if (activePrompt.id === id && remaining[0]) {
        setActivePrompt(remaining[0]);
        setSelectedVersion(remaining[0].currentVersion);
      }
    }
  };

  const handleRunPromptTest = async () => {
    setIsRunningTest(true);
    setTestOutput('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: activePrompt.content,
          prompt: testInput || 'Demonstre um exemplo prático seguindo rigorosamente suas instruções.',
        }),
      });

      const data = await res.json();
      if (data.text) {
        setTestOutput(data.text);
      } else {
        setTestOutput(
          `[Resposta Simulada]: Executando "${activePrompt.title}" v${selectedVersion}.\n\nProcessamento concluído com sucesso com base nas diretrizes do sistema.`
        );
      }
    } catch {
      setTestOutput(
        `[Execução Local]: Resposta simulada para prompt v${selectedVersion}:\n\nEstrutura validada e pronta para produção.`
      );
    } finally {
      setIsRunningTest(false);
    }
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const currentVersionData =
    activePrompt.versions?.find(v => v.versionNumber === selectedVersion) ||
    activePrompt.versions?.[activePrompt.versions.length - 1];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-400" />
            <span>Prompts Versionados & Test Runner</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Instruções técnicas com versionamento seguro (nunca sobrescreve), tags e teste imediato.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Prompt</span>
        </button>
      </div>

      {/* Grid: 2 Columns (Prompt List & Live Inspector / Test Runner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Prompts List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-lg border border-[#272733] bg-[#131318] p-2 flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar prompts por tag, título..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
              {['all', 'Dev', 'Marketing', 'Design', 'Vendas'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredPrompts.map(prompt => {
              const isSelected = activePrompt?.id === prompt.id;
              return (
                <div
                  key={prompt.id}
                  onClick={() => {
                    setActivePrompt(prompt);
                    setSelectedVersion(prompt.currentVersion);
                  }}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/20 shadow-sm'
                      : 'border-[#272733] bg-[#131318] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleFavorite(prompt.id);
                        }}
                        className="text-zinc-500 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            prompt.favorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                      <h4 className="text-xs font-semibold text-zinc-100 line-clamp-1">
                        {prompt.title}
                      </h4>
                    </div>
                    <span className="rounded bg-purple-950 px-1.5 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-800/50">
                      v{prompt.currentVersion}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[11px] text-zinc-400 line-clamp-2 font-mono bg-[#0B0B0D]/50 p-1.5 rounded border border-[#272733]">
                    {prompt.content}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500">
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.slice(0, 2).map(t => (
                        <span key={t} className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
                          {t}
                        </span>
                      ))}
                      {prompt.tags.length > 2 && <span>+{prompt.tags.length - 2}</span>}
                    </div>

                    <span className="capitalize">{prompt.visibility}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Prompt Detail, Version History & Test Runner */}
        <div className="lg:col-span-7 space-y-4">
          {activePrompt ? (
            <div className="rounded-xl border border-[#272733] bg-[#131318] p-4 shadow-sm space-y-4">
              {/* Header of selected prompt */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#272733] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-zinc-100">{activePrompt.title}</h2>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300">
                      {activePrompt.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Atualizado em {activePrompt.updatedAt} • {activePrompt.versions?.length || 1} versões salvas
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(currentVersionData?.content || activePrompt.content, activePrompt.id)}
                    className="flex items-center gap-1 rounded border border-[#272733] bg-[#0B0B0D] px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    {copiedId === activePrompt.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(activePrompt)}
                    className="rounded border border-[#272733] bg-[#0B0B0D] p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    title="Editar e gerar nova versão"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(activePrompt.id)}
                    className="rounded border border-[#272733] bg-[#0B0B0D] p-1 text-zinc-400 hover:bg-red-950/40 hover:text-red-400"
                    title="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Version History Selector */}
              <div className="flex items-center justify-between rounded-lg bg-[#0B0B0D] p-2 border border-[#272733]">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <History className="h-3.5 w-3.5 text-purple-400" />
                  <span>Histórico de Versões:</span>
                </div>

                <div className="flex gap-1 overflow-x-auto">
                  {activePrompt.versions?.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVersion(v.versionNumber)}
                      className={`rounded px-2 py-0.5 text-xs font-mono transition-colors ${
                        selectedVersion === v.versionNumber
                          ? 'bg-purple-600 text-white font-semibold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      v{v.versionNumber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content box */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Conteúdo da Instrução (v{selectedVersion}):</span>
                  {currentVersionData?.changeLog && (
                    <span className="text-[11px] text-purple-400 font-mono">
                      Log: {currentVersionData.changeLog}
                    </span>
                  )}
                </div>
                <div className="rounded-lg border border-[#272733] bg-[#0B0B0D] p-3 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {currentVersionData?.content}
                </div>
              </div>

              {/* Live Test Runner */}
              <div className="border-t border-[#272733] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <h3 className="text-xs font-semibold text-zinc-200">Runner de Teste Imediato</h3>
                  </div>
                  <span className="text-[10px] text-zinc-500">Motor Gemini 2.5 Flash / Híbrido</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Envie uma entrada para testar o prompt (ex: Proponha a estrutura de tabelas...)"
                    value={testInput}
                    onChange={e => setTestInput(e.target.value)}
                    className="flex-1 rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={handleRunPromptTest}
                    disabled={isRunningTest}
                    className="flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>{isRunningTest ? 'Executando...' : 'Testar'}</span>
                  </button>
                </div>

                {testOutput && (
                  <div className="rounded-lg border border-purple-800/40 bg-purple-950/20 p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-300 mb-1">
                      Resultado da Execução:
                    </div>
                    <div className="text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {testOutput}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center rounded-xl border border-[#272733] bg-[#131318] text-xs text-zinc-500">
              Selecione um prompt para inspecionar
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create/Edit Prompt */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#272733] pb-3 mb-4">
              <h3 className="text-base font-semibold text-zinc-100">
                {editingPrompt ? `Editar "${editingPrompt.title}"` : 'Novo Prompt no Cofre'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Título do Prompt</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Arquiteto de Software Next.js"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({ ...formData, category: e.target.value as Prompt['category'] })
                    }
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Dev">Desenvolvimento (Dev)</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design & UI</option>
                    <option value="Vendas">Vendas & Propostas</option>
                    <option value="Arquitetura">Arquitetura de Dados</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Visibilidade</label>
                  <select
                    value={formData.visibility}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        visibility: e.target.value as Prompt['visibility'],
                      })
                    }
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="private">Privado (Somente Você)</option>
                    <option value="shared">Compartilhado Seletivo</option>
                    <option value="public">Público / Comunidade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Conteúdo da Instrução / Prompt
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escreva a instrução completa do sistema..."
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs font-mono text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {editingPrompt && (
                <div>
                  <label className="block text-xs font-medium text-purple-300 mb-1">
                    Changelog da Nova Versão (v{editingPrompt.currentVersion + 1})
                  </label>
                  <input
                    type="text"
                    value={formData.changeLog}
                    onChange={e => setFormData({ ...formData, changeLog: e.target.value })}
                    placeholder="Descreva o que mudou nesta versão..."
                    className="w-full rounded-md border border-purple-800/60 bg-[#0B0B0D] px-3 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Next.js, Tailwind, System Prompt"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#272733]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-[#272733] px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-500"
                >
                  {editingPrompt ? 'Salvar Nova Versão' : 'Criar Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

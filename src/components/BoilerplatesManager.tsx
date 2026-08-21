'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Github,
  Trash2,
  Edit2,
  FolderGit2,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { Boilerplate, VyrohStore } from '@/libs/VyrohStore';

export function BoilerplatesManager() {
  const [boilerplates, setBoilerplates] = useState<Boilerplate[]>(VyrohStore.getBoilerplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Boilerplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    repoUrl: '',
    description: '',
    stack: '',
    useCases: '',
    visibility: 'public' as Boilerplate['visibility'],
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      repoUrl: '',
      description: '',
      stack: 'Next.js 16, Tailwind CSS v4, TypeScript',
      useCases: 'SaaS B2B, Micro-SaaS e dashboards',
      visibility: 'public',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Boilerplate) => {
    setEditingItem(b);
    setFormData({
      name: b.name,
      repoUrl: b.repoUrl,
      description: b.description,
      stack: b.stack.join(', '),
      useCases: b.useCases,
      visibility: b.visibility,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const stackArray = formData.stack
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingItem) {
      VyrohStore.updateBoilerplate(editingItem.id, {
        name: formData.name,
        repoUrl: formData.repoUrl,
        description: formData.description,
        stack: stackArray,
        useCases: formData.useCases,
        visibility: formData.visibility,
      });
    } else {
      VyrohStore.createBoilerplate({
        orgId: 'org_solo_1',
        name: formData.name,
        repoUrl: formData.repoUrl,
        description: formData.description,
        stack: stackArray,
        useCases: formData.useCases,
        visibility: formData.visibility,
      });
    }

    setBoilerplates([...VyrohStore.getBoilerplates()]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja remover este boilerplate indexado?')) {
      VyrohStore.deleteBoilerplate(id);
      setBoilerplates([...VyrohStore.getBoilerplates()]);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredBoilerplates = boilerplates.filter(b => {
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.stack.some(s => s.toLowerCase().includes(q)) ||
      b.useCases.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <span>Boilerplates & Repositórios Indexados</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Índice de repositórios base para acelerar novos projetos sem duplicar código.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Indexar Boilerplate</span>
        </button>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-[#272733] bg-[#131318] p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar boilerplates por stack, nome, caso de uso..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBoilerplates.map(b => (
          <div
            key={b.id}
            className="group flex flex-col justify-between rounded-xl border border-[#272733] bg-[#131318] p-4 shadow-sm hover:border-purple-500/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
                    <Github className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-100 line-clamp-1">{b.name}</h3>
                    <span className="text-[10px] font-mono text-purple-400 capitalize">
                      {b.visibility}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    title="Editar"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="rounded p-1 text-zinc-400 hover:bg-red-950/40 hover:text-red-400"
                    title="Excluir"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {b.description}
              </p>

              {/* Stack Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {b.stack.map(s => (
                  <span
                    key={s}
                    className="rounded bg-[#0B0B0D] border border-[#272733] px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Use cases */}
              <div className="mt-3 rounded-lg bg-[#0B0B0D]/60 p-2 border border-[#272733]/60 text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-300 block mb-0.5">Quando usar:</span>
                {b.useCases}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-4 pt-3 border-t border-[#272733] flex items-center justify-between text-xs">
              {b.lastUsedProjectName ? (
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 truncate">
                  <FolderGit2 className="h-3 w-3 text-purple-400 shrink-0" />
                  <span className="truncate">Usado em: {b.lastUsedProjectName}</span>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-600">Disponível para novos projetos</span>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopyUrl(b.repoUrl)}
                  className="rounded border border-[#272733] bg-[#0B0B0D] p-1 text-zinc-400 hover:text-zinc-200"
                  title="Copiar URL"
                >
                  {copiedUrl === b.repoUrl ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
                <a
                  href={b.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded border border-[#272733] bg-[#0B0B0D] px-2 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Repositório</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#272733] pb-3 mb-4">
              <h3 className="text-base font-semibold text-zinc-100">
                {editingItem ? 'Editar Boilerplate' : 'Indexar Novo Boilerplate'}
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
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome do Boilerplate</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Next.js 16 + Drizzle + Tailwind v4 Starter"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Link do Repositório (Git)</label>
                <input
                  type="url"
                  required
                  value={formData.repoUrl}
                  onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
                  placeholder="https://github.com/seu-user/repo"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Finalidade e principais recursos..."
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Stack (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.stack}
                  onChange={e => setFormData({ ...formData, stack: e.target.value })}
                  placeholder="Next.js 16, Tailwind CSS v4, Drizzle, TypeScript"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Quando usar / Casos de Uso</label>
                <input
                  type="text"
                  value={formData.useCases}
                  onChange={e => setFormData({ ...formData, useCases: e.target.value })}
                  placeholder="Ex: SaaS B2B com autenticação e pagamentos rápidos"
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
                  {editingItem ? 'Salvar Alterações' : 'Indexar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  Github,
  Lock,
  Globe,
  Tag,
  Calendar,
  FolderKanban,
  Trash2,
} from 'lucide-react';

export const BoilerplatesView: React.FC = () => {
  const { boilerplates, openModal, deleteBoilerplate, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = boilerplates.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.stack.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const copyCloneCommand = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    showToast('Comando git clone copiado!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Boilerplates & Repositórios
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-[#EA580C] border border-[#C2410C]/30 font-mono">
              {boilerplates.length} repos indexados
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Indexe seus repositórios base, stacks e comandos de clone para iniciar novos projetos em segundos.
          </p>
        </div>

        <button
          onClick={() => openModal('add_boilerplate')}
          className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Indexar Repositório</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou tecnologia (ex: Next.js, FastAPI)..."
          className="w-full bg-[#0F0D11] text-xs text-[var(--text-primary)] pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent-bright)] focus:outline-none"
        />
      </div>

      {/* Grid of Boilerplates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] hover:border-[var(--accent)] transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    {b.name}
                    {b.visibility === 'public' ? (
                      <span title="Público"><Globe className="w-3.5 h-3.5 text-emerald-400" /></span>
                    ) : (
                      <span title="Privado"><Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" /></span>
                    )}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <a
                  href={b.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-[#121014] text-[var(--text-muted)] hover:text-white border border-[var(--border)]"
                  title="Abrir no GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>

              {/* Stack Tags */}
              <div className="flex flex-wrap gap-1.5">
                {b.stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[#121014] text-[var(--text-secondary)] text-[10px] font-mono border border-[var(--border)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Clone snippet and actions */}
            <div className="space-y-3 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#050506] border border-[var(--border)] text-[11px] font-mono text-[var(--text-secondary)]">
                <span className="truncate mr-2 select-all">{b.cloneCommand}</span>
                <button
                  onClick={() => copyCloneCommand(b.cloneCommand, b.id)}
                  className="p-1 text-[var(--text-muted)] hover:text-white cursor-pointer"
                  title="Copiar comando de clone"
                >
                  {copiedId === b.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                <span>Último uso: {b.lastUsedProjectId || 'Recentemente'}</span>
                <button
                  onClick={() => {
                    if (confirm('Deseja remover este boilerplate?')) {
                      deleteBoilerplate(b.id);
                    }
                  }}
                  className="text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 border border-dashed border-[var(--border)] rounded-2xl text-center text-xs text-[var(--text-muted)]">
            Nenhum boilerplate encontrado com esse filtro.
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Columns,
  Table as TableIcon,
  Layers,
  Terminal,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Download,
  Archive,
  Trash2,
  Tag,
} from 'lucide-react';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    setSelectedProjectId,
    setActiveView,
    openModal,
    archiveProject,
    deleteProject,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      filterStatus === 'all'
        ? p.status !== 'archived'
        : filterStatus === 'archived'
        ? p.status === 'archived'
        : p.status === filterStatus;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const kanbanColumns: { id: Project['status']; title: string; color: string }[] = [
    { id: 'lead', title: 'Leads & Descoberta', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { id: 'active', title: 'Projetos Aprovados', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
    { id: 'in_progress', title: 'Em Desenvolvimento', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'completed', title: 'Entregues & Lançados', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  ];

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vyroh_projetos_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exportação JSON gerada com sucesso.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Projetos do Cofre
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-[#A79BC4] border border-[var(--border)] font-mono">
              {filteredProjects.length}
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            O eixo central do Vyroh: cada projeto conecta boilerplates, prompts, clientes e MCPs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="p-2 rounded-lg bg-[#0F0D11] hover:bg-[#121014] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-all"
            title="Exportar dados em JSON (Sem travas)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* View mode toggle */}
          <div className="flex items-center bg-[#0F0D11] border border-[var(--border)] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'kanban' ? 'bg-[#6B21A8] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Visão Kanban"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'table' ? 'bg-[#6B21A8] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Visão Tabela"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openModal('add_project')}
            className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0F0D11] p-3 rounded-xl border border-[var(--border)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nome, tags (ex: Next.js, Postgres)..."
            className="w-full bg-[#121014] text-xs text-[var(--text-primary)] pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] focus:border-[var(--accent-bright)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'Todos os Ativos' },
            { id: 'lead', label: 'Leads' },
            { id: 'active', label: 'Aprovados' },
            { id: 'in_progress', label: 'Em Progresso' },
            { id: 'completed', label: 'Entregues' },
            { id: 'archived', label: 'Arquivados' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                filterStatus === tab.id
                  ? 'bg-[#1A1620] text-[var(--accent-bright)] font-semibold border border-[var(--accent)]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Kanban */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colProjects = filteredProjects.filter((p) => p.status === col.id);
            return (
              <div key={col.id} className="bg-[#0F0D11] border border-[var(--border)] rounded-xl p-3 space-y-3 min-h-[420px]">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${col.color}`}>
                      {col.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{colProjects.length}</span>
                </div>

                <div className="space-y-2.5">
                  {colProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setActiveView('projeto_detalhe');
                      }}
                      className="p-3.5 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] hover:border-[var(--accent-bright)] cursor-pointer transition-all space-y-2.5 group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-bright)] leading-snug">
                          {project.name}
                        </h3>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-bright)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Linked Assets Badges */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px]">
                        {project.promptIds.length > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#050506] text-[var(--text-secondary)] border border-[var(--border)] font-mono">
                            <Terminal className="w-2.5 h-2.5 text-[#8B35D6]" />
                            {project.promptIds.length}
                          </span>
                        )}
                        {project.boilerplateIds.length > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#050506] text-[var(--text-secondary)] border border-[var(--border)] font-mono">
                            <Layers className="w-2.5 h-2.5 text-[#C2410C]" />
                            {project.boilerplateIds.length}
                          </span>
                        )}
                        {project.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-1 py-0.5 rounded bg-[#1A1620] text-[var(--text-muted)] font-mono text-[9px]">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                        <span className="truncate max-w-[120px]">{project.clientName || 'Interno'}</span>
                        {project.budget ? (
                          <span className="font-mono font-bold text-emerald-400">
                            R$ {project.budget.toLocaleString('pt-BR')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {colProjects.length === 0 && (
                    <div className="p-6 border border-dashed border-[var(--border)] rounded-lg text-center text-xs text-[var(--text-muted)]">
                      Nenhum projeto nesta coluna
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode: Table */
        <div className="bg-[#0F0D11] border border-[var(--border)] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121014] text-[var(--text-muted)] uppercase tracking-wider font-mono border-b border-[var(--border)]">
                <tr>
                  <th className="py-3 px-4">Nome do Projeto</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Orçamento</th>
                  <th className="py-3 px-4">Ativos Vinculados</th>
                  <th className="py-3 px-4">Prazo</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setActiveView('projeto_detalhe');
                    }}
                    className="hover:bg-[#121014] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">
                      <div className="truncate max-w-xs">{p.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-normal truncate">{p.description}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          p.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : p.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : p.status === 'active'
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                      {p.clientName || 'Projeto Interno'}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                      {p.budget ? `R$ ${p.budget.toLocaleString('pt-BR')}` : '-'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-[#1A1620] text-[#A79BC4]">
                          {p.promptIds.length} Prm
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#1A1620] text-[#A79BC4]">
                          {p.boilerplateIds.length} Bp
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[var(--text-muted)] font-mono">
                      {p.deadline || '-'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveProject(p.id);
                        }}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-amber-400 hover:bg-[#1A1620] cursor-pointer"
                        title="Arquivar Projeto"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  LayoutGrid,
  List,
  Search,
  Terminal,
  Layers,
  User,
  MoreVertical,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Project, VyrohStore, Client, Prompt, Boilerplate } from '@/libs/VyrohStore';

interface ProjectsProps {
  onSelectPrompt?: (id: number) => void;
  onSelectBoilerplate?: (id: number) => void;
}

export function ProjectsTableKanban({ onSelectPrompt, onSelectBoilerplate }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>(VyrohStore.getProjects());
  const [clients] = useState<Client[]>(VyrohStore.getClients());
  const [prompts] = useState<Prompt[]>(VyrohStore.getPrompts());
  const [boilerplates] = useState<Boilerplate[]>(VyrohStore.getBoilerplates());
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'in_progress' as Project['status'],
    priority: 'medium' as Project['priority'],
    clientId: undefined as number | undefined,
    tags: '',
    color: '#8B5CF6',
    promptIds: [] as number[],
    boilerplateIds: [] as number[],
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'in_progress',
      priority: 'medium',
      clientId: clients[0]?.id,
      tags: 'Next.js, Core',
      color: '#8B5CF6',
      promptIds: prompts[0] ? [prompts[0].id] : [],
      boilerplateIds: boilerplates[0] ? [boilerplates[0].id] : [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      clientId: project.clientId,
      tags: project.tags.join(', '),
      color: project.color,
      promptIds: project.promptIds,
      boilerplateIds: project.boilerplateIds,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingProject) {
      VyrohStore.updateProject(editingProject.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        clientId: formData.clientId ? Number(formData.clientId) : undefined,
        tags: tagArray,
        color: formData.color,
        promptIds: formData.promptIds,
        boilerplateIds: formData.boilerplateIds,
      });
    } else {
      VyrohStore.createProject({
        orgId: 'org_solo_1',
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        clientId: formData.clientId ? Number(formData.clientId) : undefined,
        tags: tagArray,
        color: formData.color,
        promptIds: formData.promptIds,
        boilerplateIds: formData.boilerplateIds,
      });
    }

    setProjects([...VyrohStore.getProjects()]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este projeto do cofre?')) {
      VyrohStore.deleteProject(id);
      setProjects([...VyrohStore.getProjects()]);
    }
  };

  const handleStatusChange = (projectId: number, newStatus: Project['status']) => {
    VyrohStore.updateProjectStatus(projectId, newStatus);
    setProjects([...VyrohStore.getProjects()]);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const columns: { id: Project['status']; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'backlog',
      label: 'Backlog / Ideias',
      icon: <Clock className="h-3.5 w-3.5 text-zinc-400" />,
      color: 'border-zinc-700 bg-zinc-900/40',
    },
    {
      id: 'in_progress',
      label: 'Em Desenvolvimento',
      icon: <Sparkles className="h-3.5 w-3.5 text-purple-400" />,
      color: 'border-purple-800/40 bg-purple-950/20',
    },
    {
      id: 'review',
      label: 'Em Revisão / QA',
      icon: <AlertCircle className="h-3.5 w-3.5 text-blue-400" />,
      color: 'border-blue-800/40 bg-blue-950/20',
    },
    {
      id: 'completed',
      label: 'Concluídos',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
      color: 'border-emerald-800/40 bg-emerald-950/20',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-purple-400" />
            <span>Projetos (Eixo Central)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            O hub gravitacional que conecta seus boilerplates, prompts versionados e clientes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center rounded-lg border border-[#272733] bg-[#131318] p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Tabela</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline-none transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-[#272733] bg-[#131318] p-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, tag ou descrição..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Filtrar:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-md border border-[#272733] bg-[#0B0B0D] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="backlog">Backlog</option>
            <option value="in_progress">Em Desenvolvimento</option>
            <option value="review">Em Revisão</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(col => {
            const colProjects = filteredProjects.filter(p => p.status === col.id);
            return (
              <div
                key={col.id}
                className={`rounded-xl border ${col.color} p-3 flex flex-col min-h-[480px]`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#272733]/60 mb-3">
                  <div className="flex items-center gap-1.5">
                    {col.icon}
                    <h3 className="text-xs font-semibold text-zinc-200">{col.label}</h3>
                  </div>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                    {colProjects.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                  {colProjects.map(project => {
                    const client = clients.find(c => c.id === project.clientId);
                    return (
                      <div
                        key={project.id}
                        className="group relative rounded-lg border border-[#272733] bg-[#131318] p-3 shadow-sm hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-zinc-100 line-clamp-1">
                            {project.name}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(project)}
                              className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                              title="Editar"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="rounded p-1 text-zinc-400 hover:bg-red-950/40 hover:text-red-400"
                              title="Excluir"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Linked client info */}
                        {client && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-zinc-300">
                            <User className="h-3 w-3 text-zinc-500" />
                            <span className="truncate">{client.name}</span>
                          </div>
                        )}

                        {/* Connected Assets Badges */}
                        <div className="mt-3 pt-2.5 border-t border-[#272733]/60 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Terminal className="h-3 w-3 text-purple-400" />
                              {project.promptIds.length}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="h-3 w-3 text-blue-400" />
                              {project.boilerplateIds.length}
                            </span>
                          </div>

                          {/* Quick stage mover */}
                          <select
                            value={project.status}
                            onChange={e =>
                              handleStatusChange(project.id, e.target.value as Project['status'])
                            }
                            className="rounded border border-[#272733] bg-[#0B0B0D] px-1.5 py-0.5 text-[10px] text-zinc-300 focus:border-purple-500 focus:outline-none"
                          >
                            <option value="backlog">Backlog</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="review">Revisão</option>
                            <option value="completed">Concluído</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}

                  {colProjects.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#272733] text-center p-3">
                      <p className="text-[11px] text-zinc-500">Nenhum projeto nesta fase</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-[#272733] bg-[#131318] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#272733] bg-[#0B0B0D]/60 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Projeto</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Prompts Conectados</th>
                  <th className="px-4 py-3">Boilerplates</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272733]">
                {filteredProjects.map(project => {
                  const client = clients.find(c => c.id === project.clientId);
                  return (
                    <tr key={project.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-zinc-100">{project.name}</div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-xs">
                          {project.description}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                            project.status === 'in_progress'
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                              : project.status === 'completed'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                              : project.status === 'review'
                              ? 'bg-blue-950/80 text-blue-300 border border-blue-800/40'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {project.status === 'in_progress'
                            ? 'Em Progresso'
                            : project.status === 'completed'
                            ? 'Concluído'
                            : project.status === 'review'
                            ? 'Em Revisão'
                            : 'Backlog'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {client ? client.name : <span className="text-zinc-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-purple-400">
                          <Terminal className="h-3 w-3" />
                          {project.promptIds.length} prompts
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-blue-400">
                          <Layers className="h-3 w-3" />
                          {project.boilerplateIds.length} boilerplates
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map(t => (
                            <span
                              key={t}
                              className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            title="Editar"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="rounded p-1 text-zinc-400 hover:bg-red-950/40 hover:text-red-400"
                            title="Remover"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create/Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#272733] pb-3 mb-4">
              <h3 className="text-base font-semibold text-zinc-100">
                {editingProject ? 'Editar Projeto' : 'Novo Projeto no Cofre'}
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
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nome do Projeto
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: SaaS B2B Dashboard"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Objetivo principal deste projeto..."
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Fase / Status</label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as Project['status'] })
                    }
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="in_progress">Em Progresso</option>
                    <option value="review">Em Revisão</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cliente Vinculado</label>
                  <select
                    value={formData.clientId ?? ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        clientId: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Nenhum (Projeto Próprio)</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Next.js, Tailwind, Stripe, IA"
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
                  {editingProject ? 'Salvar Alterações' : 'Criar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

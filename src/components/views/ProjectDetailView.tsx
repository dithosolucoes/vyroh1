import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  FolderKanban,
  Terminal,
  Layers,
  Users,
  Brain,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Play,
  FileText,
  Archive,
  Trash2,
  Send,
  MessageSquare,
} from 'lucide-react';

export const ProjectDetailView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setActiveView,
    prompts,
    boilerplates,
    clients,
    updateProject,
    archiveProject,
    deleteProject,
    testPromptAI,
    openModal,
    showToast,
  } = useApp();

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'prompts' | 'boilerplates' | 'client' | 'roadmap'>('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(project?.notes || '');
  const [newActivityText, setNewActivityText] = useState('');

  if (!project) {
    return (
      <div className="p-12 text-center text-sm text-[var(--text-muted)]">
        Projeto não encontrado.{' '}
        <button onClick={() => setActiveView('projetos')} className="text-[var(--accent-bright)] underline">
          Voltar para a lista
        </button>
      </div>
    );
  }

  const linkedPrompts = prompts.filter((p) => project.promptIds.includes(p.id));
  const linkedBoilerplates = boilerplates.filter((b) => project.boilerplateIds.includes(b.id));
  const linkedClient = clients.find((c) => c.id === project.clientId);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveNotes = () => {
    updateProject(project.id, { notes: notesDraft });
    setIsEditingNotes(false);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;

    const newAct = {
      id: `act_${Date.now()}`,
      action: newActivityText.trim(),
      timestamp: 'Agora mesmo',
      author: 'Thomas Dev',
    };

    updateProject(project.id, {
      activityHistory: [newAct, ...project.activityHistory],
    });
    setNewActivityText('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar with Back Link and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('projetos')}
            className="p-2 rounded-lg bg-[#0F0D11] hover:bg-[#121014] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-all"
            title="Voltar aos Projetos"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">{project.name}</h1>
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
                {project.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">ID: {project.id} • Criado em {project.createdAt.split('T')[0]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => archiveProject(project.id)}
            className="px-3 py-1.5 rounded-lg bg-[#0F0D11] hover:bg-[#121014] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-amber-400 flex items-center gap-1.5 cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Arquivar</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Deseja realmente excluir este projeto do cofre?')) {
                deleteProject(project.id);
                setActiveView('projetos');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-[#0F0D11] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 text-xs text-red-400 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto pb-1 text-xs">
        {[
          { id: 'overview', label: 'Visão Geral & Timeline', icon: FolderKanban },
          { id: 'prompts', label: `Prompts Vinculados (${linkedPrompts.length})`, icon: Terminal },
          { id: 'boilerplates', label: `Boilerplates (${linkedBoilerplates.length})`, icon: Layers },
          { id: 'client', label: 'Cliente & CRM', icon: Users },
          { id: 'roadmap', label: 'Roadmap IA', icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg font-medium cursor-pointer transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-[var(--accent-bright)] text-[var(--accent-bright)] bg-[#121014]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-4">
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Descrição & Escopo do Projeto
              </h2>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {project.description || 'Nenhuma descrição detalhada informada.'}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-[#121014] text-[var(--text-secondary)] border border-[var(--border)] text-xs font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  Notas de Engenharia & Decisões
                </h2>
                {!isEditingNotes ? (
                  <button
                    onClick={() => {
                      setNotesDraft(project.notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-xs text-[var(--accent-bright)] hover:underline cursor-pointer font-medium"
                  >
                    Editar Notas
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="text-xs bg-[#6B21A8] text-white px-2.5 py-1 rounded-md cursor-pointer font-medium"
                    >
                      Salvar
                    </button>
                  </div>
                )}
              </div>

              {!isEditingNotes ? (
                <div className="text-xs text-[var(--text-secondary)] bg-[#121014] p-3 rounded-lg border border-[var(--border)] whitespace-pre-line leading-relaxed font-mono">
                  {project.notes || 'Nenhuma nota gravada. Clique em "Editar Notas" para registrar decisões técnicas.'}
                </div>
              ) : (
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={5}
                  className="w-full bg-[#121014] border border-[var(--accent-bright)] rounded-lg p-3 text-xs text-[var(--text-primary)] font-mono outline-none focus:ring-1 focus:ring-[var(--accent-bright)]"
                  placeholder="Escreva notas, decisões de arquitetura, pendências..."
                />
              )}
            </div>

            {/* Timeline of activity */}
            <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-4">
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Linha do Tempo & Histórico
              </h2>

              <form onSubmit={handleAddActivity} className="flex gap-2">
                <input
                  type="text"
                  value={newActivityText}
                  onChange={(e) => setNewActivityText(e.target.value)}
                  placeholder="Registrar nova atividade ou marco no projeto..."
                  className="flex-1 bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#1A1620] hover:bg-[#6B21A8] text-[var(--text-primary)] px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  Registrar
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {project.activityHistory.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-bright)] mt-1.5 shrink-0" />
                    <div className="space-y-0.5 flex-1">
                      <p className="text-[var(--text-primary)]">{act.action}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">
                        {act.timestamp} • por {act.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Metadata and Linked summary */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-4">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Parâmetros Comerciais
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Orçamento</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {project.budget ? `R$ ${project.budget.toLocaleString('pt-BR')}` : 'Não informado'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Prazo Estimado</span>
                  <span className="font-mono text-[var(--text-primary)]">{project.deadline || 'A definir'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Cliente Vinculado</span>
                  <span className="font-semibold text-[var(--text-primary)] truncate max-w-[140px]">
                    {project.clientName || 'Interno'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Assets Linked */}
            <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-3">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Ativos em Uso neste Projeto
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#121014] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#8B35D6]" />
                    <span>Prompts</span>
                  </div>
                  <span className="font-mono font-semibold">{linkedPrompts.length}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#121014] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>Boilerplates</span>
                  </div>
                  <span className="font-mono font-semibold">{linkedBoilerplates.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Prompts Linked */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Prompts Vinculados ao Projeto
            </h2>
            <button
              onClick={() => openModal('add_prompt')}
              className="bg-[#6B21A8] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Novo Prompt</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedPrompts.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{p.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">{p.description}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1620] text-[#8B35D6] font-mono">
                    v{p.version}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#121014] text-[11px] font-mono text-[var(--text-secondary)] line-clamp-3">
                  {p.content}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs">
                  <button
                    onClick={() => copyToClipboard(p.content, p.id)}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === p.id ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={() => {
                      testPromptAI(p.id);
                    }}
                    className="text-[var(--accent-bright)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Testar no Gemini</span>
                  </button>
                </div>
              </div>
            ))}

            {linkedPrompts.length === 0 && (
              <div className="col-span-full p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)] space-y-2">
                <Terminal className="w-6 h-6 mx-auto text-[var(--text-muted)] opacity-50" />
                <p>Nenhum prompt vinculado a este projeto ainda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Boilerplates Linked */}
      {activeTab === 'boilerplates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Boilerplates & Repositórios Utilizados
            </h2>
            <button
              onClick={() => openModal('add_boilerplate')}
              className="bg-[#6B21A8] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Indexar Novo Boilerplate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedBoilerplates.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{b.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{b.description}</p>
                  </div>
                  <a
                    href={b.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#121014] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Clone snippet */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#050506] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)]">
                  <span className="truncate mr-2">{b.cloneCommand}</span>
                  <button
                    onClick={() => copyToClipboard(b.cloneCommand, b.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-white cursor-pointer"
                  >
                    {copiedId === b.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {b.stack.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#1A1620] text-[var(--text-secondary)] text-[10px] font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {linkedBoilerplates.length === 0 && (
              <div className="col-span-full p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)] space-y-2">
                <Layers className="w-6 h-6 mx-auto text-[var(--text-muted)] opacity-50" />
                <p>Nenhum boilerplate vinculado a este projeto.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Client Details */}
      {activeTab === 'client' && (
        <div className="p-6 rounded-xl bg-[#0F0D11] border border-[var(--border)] max-w-2xl space-y-4">
          {linkedClient ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{linkedClient.name}</h2>
                  <p className="text-xs text-[var(--text-secondary)]">{linkedClient.company}</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {linkedClient.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#121014] border border-[var(--border)]">
                  <div className="text-[var(--text-muted)]">E-mail de Contato</div>
                  <div className="font-semibold text-[var(--text-primary)] mt-1">{linkedClient.email}</div>
                </div>

                <div className="p-3 rounded-lg bg-[#121014] border border-[var(--border)]">
                  <div className="text-[var(--text-muted)]">Telefone / WhatsApp</div>
                  <div className="font-semibold text-[var(--text-primary)] mt-1">{linkedClient.phone || 'Não cadastrado'}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#121014] border border-[var(--border)] space-y-1">
                <div className="text-xs font-semibold text-[var(--text-muted)] font-mono">Notas do Cliente:</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{linkedClient.notes}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[var(--text-muted)]">
              Este projeto não possui um cliente externo vinculado (projeto de uso interno ou produto próprio).
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Roadmap IA */}
      {activeTab === 'roadmap' && (
        <div className="p-6 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#8B35D6]" />
                <span>Roadmap de Execução do Projeto</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Planejamento gerado e calibrado com os ativos do cofre.
              </p>
            </div>

            <button
              onClick={() => setActiveView('cerebro')}
              className="bg-[#6B21A8] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Abrir no Cérebro</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-[#121014] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--accent-bright)]">Fases Estruturadas:</span>
              <span className="text-[var(--text-muted)] font-mono">3 fases mapeadas</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-md bg-[#050506] border border-[var(--border)] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#6B21A8]/30 text-[#A79BC4] flex items-center justify-center font-bold font-mono text-[10px]">
                  1
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--text-primary)]">Setup de Fundação & Banco Multi-tenant</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Ativo reaproveitado: <strong>Next.js 15 Starter</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-[#050506] border border-[var(--border)] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#6B21A8]/30 text-[#A79BC4] flex items-center justify-center font-bold font-mono text-[10px]">
                  2
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--text-primary)]">Implementação do Core & Regras de Negócio</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Ativo reaproveitado: <strong>Prompt Arquiteto Postgres</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-md bg-[#050506] border border-[var(--border)] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#6B21A8]/30 text-[#A79BC4] flex items-center justify-center font-bold font-mono text-[10px]">
                  3
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--text-primary)]">Deploy em Produção & Testes de Carga</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Ativo reaproveitado: <strong>SOP de Deploy VPS Docker</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  DollarSign,
  FolderKanban,
  ExternalLink,
  Edit2,
  Trash2,
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, projects, openModal, deleteClient, setActiveView, setSelectedProjectId } = useApp();
  const [search, setSearch] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalClientsRevenue = clients.reduce((acc, c) => acc + (c.totalValue ?? (c as any).totalRevenue ?? 0), 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Clientes & CRM Técnico
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-blue-400 border border-blue-500/30 font-mono">
              {clients.length} clientes
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Gerencie o histórico de clientes, receita gerada, contatos e projetos vinculados no cofre.
          </p>
        </div>

        <button
          onClick={() => openModal('add_client')}
          className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Summary KPI Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Faturamento Total com Clientes</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            R$ {(totalClientsRevenue ?? 0).toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Clientes Ativos</span>
          <div className="text-xl font-bold text-[var(--text-primary)] font-mono">
            {clients.filter((c) => c.status === 'active').length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Ticket Médio por Cliente</span>
          <div className="text-xl font-bold text-[var(--text-primary)] font-mono">
            R$ {clients.length > 0 ? ((totalClientsRevenue ?? 0) / clients.length).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : 0}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cliente, empresa ou e-mail..."
          className="w-full bg-[#0F0D11] text-xs text-[var(--text-primary)] pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] focus:border-[var(--accent-bright)] focus:outline-none"
        />
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const clientProjects = projects.filter((p) => c.projectIds.includes(p.id) || p.clientId === c.id);

          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] hover:border-blue-500/40 transition-all space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{c.name}</h3>
                    <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{c.company}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      c.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>

                {/* Contact details */}
                <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {c.notes && (
                  <p className="text-xs text-[var(--text-muted)] italic bg-[#121014] p-2.5 rounded-lg border border-[var(--border)] line-clamp-2">
                    "{c.notes}"
                  </p>
                )}
              </div>

              {/* Projects linked and total revenue */}
              <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Faturamento Gerado:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    R$ {((c.totalValue ?? (c as any).totalRevenue ?? 0)).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                    Projetos Vinculados ({clientProjects.length}):
                  </div>

                  <div className="space-y-1">
                    {clientProjects.slice(0, 2).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveView('projeto_detalhe');
                        }}
                        className="p-1.5 rounded-md bg-[#121014] hover:bg-[#1A1620] text-xs text-[var(--text-primary)] flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate max-w-[180px]">{p.name}</span>
                        <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (confirm('Deseja remover este cliente do cofre?')) {
                        deleteClient(c.id);
                      }
                    }}
                    className="text-[10px] text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
                  >
                    Excluir Cliente
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 border border-dashed border-[var(--border)] rounded-2xl text-center text-xs text-[var(--text-muted)]">
            Nenhum cliente cadastrado com este critério.
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Building,
  DollarSign,
  FolderGit2,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';
import { Client, VyrohStore, Project } from '@/libs/VyrohStore';

export function ClientsManager() {
  const [clients, setClients] = useState<Client[]>(VyrohStore.getClients());
  const [projects] = useState<Project[]>(VyrohStore.getProjects());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactInfo: '',
    status: 'active' as Client['status'],
    budget: '',
    notes: '',
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      company: '',
      contactInfo: '',
      status: 'active',
      budget: 'R$ 10.000 / projeto',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient(c);
    setFormData({
      name: c.name,
      company: c.company || '',
      contactInfo: c.contactInfo,
      status: c.status,
      budget: c.budget || '',
      notes: c.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      VyrohStore.updateClient(editingClient.id, formData);
    } else {
      VyrohStore.createClient({
        orgId: 'org_solo_1',
        ...formData,
      });
    }
    setClients([...VyrohStore.getClients()]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja remover este cliente do seu CRM?')) {
      VyrohStore.deleteClient(id);
      setClients([...VyrohStore.getClients()]);
    }
  };

  const filteredClients = clients.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.contactInfo.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            <span>Clientes & CRM Leve</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Mantenha o contexto comercial e histórico de entregas sem perder informações de reuniões.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-[#272733] bg-[#131318] p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome do cliente, empresa, e-mail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => {
          const clientProjects = projects.filter(p => p.clientId === client.id);
          return (
            <div
              key={client.id}
              className="group rounded-xl border border-[#272733] bg-[#131318] p-4 shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{client.name}</h3>
                    {client.company && (
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                        <Building className="h-3 w-3 text-zinc-500" />
                        <span>{client.company}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium capitalize ${
                        client.status === 'active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                          : client.status === 'prospect'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {client.status === 'active'
                        ? 'Ativo'
                        : client.status === 'prospect'
                        ? 'Prospect'
                        : 'Inativo'}
                    </span>

                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Editar"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="rounded p-1 text-zinc-400 hover:bg-red-950/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Excluir"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-zinc-300">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Mail className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="truncate">{client.contactInfo}</span>
                  </div>

                  {client.budget && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{client.budget}</span>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <div className="mt-3 rounded-lg bg-[#0B0B0D]/70 p-2 border border-[#272733]/60 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1 text-zinc-300 font-medium mb-0.5">
                      <FileText className="h-3 w-3 text-purple-400" />
                      <span>Notas de Contexto:</span>
                    </div>
                    {client.notes}
                  </div>
                )}
              </div>

              {/* Linked Projects list */}
              <div className="mt-4 pt-3 border-t border-[#272733]">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                  <span className="font-semibold text-zinc-400 flex items-center gap-1">
                    <FolderGit2 className="h-3 w-3 text-purple-400" />
                    Projetos Vinculados ({clientProjects.length})
                  </span>
                </div>

                <div className="space-y-1">
                  {clientProjects.slice(0, 2).map(p => (
                    <div
                      key={p.id}
                      className="rounded bg-[#0B0B0D] px-2 py-1 text-[11px] text-zinc-300 flex items-center justify-between border border-[#272733]"
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] font-mono text-purple-400 capitalize">{p.status}</span>
                    </div>
                  ))}
                  {clientProjects.length === 0 && (
                    <span className="text-[10px] text-zinc-600 italic">Nenhum projeto associado</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#272733] pb-3 mb-4">
              <h3 className="text-base font-semibold text-zinc-100">
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
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
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome do Cliente / Contato</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Marina Silva"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Empresa / Razão</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ex: Aurora Labs"
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as Client['status'] })
                    }
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="active">Ativo</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Contato (E-mail / WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="marina@aurora.design | (11) 99999-9999"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Orçamento / Ticket Médio</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="R$ 15.000 / projeto"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Notas de Alinhamento</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Preferências técnicas, acordos de prazo..."
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
                  {editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  FileCode,
  CreditCard,
  Plus,
  Search,
  ExternalLink,
  DollarSign,
  Calendar,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { VyrohStore, SOP, StackSubscription } from '@/libs/VyrohStore';
import { formatCurrency } from '@/lib/utils';

export function Tier2Manager() {
  const [sops, setSops] = useState<SOP[]>(VyrohStore.getSOPs());
  const [subscriptions, setSubscriptions] = useState<StackSubscription[]>(
    VyrohStore.getSubscriptions()
  );
  const [activeSubTab, setActiveSubTab] = useState<'sops' | 'stack'>('sops');

  // SOP Modal
  const [isSopModalOpen, setIsSopModalOpen] = useState(false);
  const [sopFormData, setSopFormData] = useState({
    title: '',
    category: 'Técnico',
    content: '',
    tags: 'Processo, Deploy',
  });

  // Stack Modal
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);
  const [stackFormData, setStackFormData] = useState({
    serviceName: '',
    category: 'Dev Tool',
    costCents: 10000,
    renewalPeriod: 'monthly' as StackSubscription['renewalPeriod'],
    renewalDate: 'Dia 10',
    url: '',
  });

  const handleSaveSop = (e: React.FormEvent) => {
    e.preventDefault();
    VyrohStore.createSOP({
      title: sopFormData.title,
      category: sopFormData.category,
      content: sopFormData.content,
      tags: sopFormData.tags.split(',').map(t => t.trim()),
    });
    setSops([...VyrohStore.getSOPs()]);
    setIsSopModalOpen(false);
  };

  const handleSaveStack = (e: React.FormEvent) => {
    e.preventDefault();
    VyrohStore.createSubscription({
      serviceName: stackFormData.serviceName,
      category: stackFormData.category,
      costCents: Number(stackFormData.costCents),
      currency: 'BRL',
      renewalPeriod: stackFormData.renewalPeriod,
      renewalDate: stackFormData.renewalDate,
      url: stackFormData.url,
    });
    setSubscriptions([...VyrohStore.getSubscriptions()]);
    setIsStackModalOpen(false);
  };

  const totalMonthlyCost = subscriptions.reduce((acc, sub) => acc + sub.costCents, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <FileCode className="h-5 w-5 text-purple-400" />
            <span>SOPs de Operação & Gestão de Stack (Tier 2)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Processos operacionais repetíveis e inventário financeiro dos seus SaaS e infraestrutura.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[#272733] bg-[#131318] p-0.5">
            <button
              onClick={() => setActiveSubTab('sops')}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                activeSubTab === 'sops'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              SOPs & Processos
            </button>
            <button
              onClick={() => setActiveSubTab('stack')}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                activeSubTab === 'stack'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Stack & Assinaturas
            </button>
          </div>

          {activeSubTab === 'sops' ? (
            <button
              onClick={() => setIsSopModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-500"
            >
              <Plus className="h-4 w-4" />
              <span>Novo SOP</span>
            </button>
          ) : (
            <button
              onClick={() => setIsStackModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-500"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar SaaS</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'sops' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sops.map(sop => (
            <div
              key={sop.id}
              className="rounded-xl border border-[#272733] bg-[#131318] p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded bg-purple-950 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-800/40">
                    {sop.category}
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-100 mt-1">{sop.title}</h3>
                </div>
                <span className="text-[10px] text-zinc-500">{sop.createdAt}</span>
              </div>

              <div className="rounded-lg bg-[#0B0B0D] p-3 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed border border-[#272733]">
                {sop.content}
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {sop.tags.map(t => (
                  <span key={t} className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Total cost banner */}
          <div className="rounded-xl border border-purple-800/40 bg-[#131318] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-950 border border-purple-800/50 text-purple-300">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-400">Custo Total de Operação Mensal</h3>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {formatCurrency(totalMonthlyCost)} /mês
                </div>
              </div>
            </div>

            <span className="text-xs text-zinc-400">{subscriptions.length} assinaturas registradas</span>
          </div>

          <div className="rounded-xl border border-[#272733] bg-[#131318] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#272733] bg-[#0B0B0D]/60 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Serviço / Ferramenta</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Custo</th>
                  <th className="px-4 py-3">Ciclo</th>
                  <th className="px-4 py-3">Data de Renovação</th>
                  <th className="px-4 py-3 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272733]">
                {subscriptions.map(sub => (
                  <tr key={sub.id} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-semibold text-zinc-100">{sub.serviceName}</td>
                    <td className="px-4 py-3 text-zinc-400">{sub.category}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-emerald-400">
                      {formatCurrency(sub.costCents)}
                    </td>
                    <td className="px-4 py-3 capitalize text-zinc-400">{sub.renewalPeriod}</td>
                    <td className="px-4 py-3 text-zinc-300">{sub.renewalDate}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={sub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-purple-400 hover:underline"
                      >
                        <span>Acessar</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOP Modal */}
      {isSopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-4">Novo Procedimento Operacional (SOP)</h3>
            <form onSubmit={handleSaveSop} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Título do Processo</label>
                <input
                  type="text"
                  required
                  value={sopFormData.title}
                  onChange={e => setSopFormData({ ...sopFormData, title: e.target.value })}
                  placeholder="Ex: Checklist de Deploy em Produção"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Categoria</label>
                <input
                  type="text"
                  value={sopFormData.category}
                  onChange={e => setSopFormData({ ...sopFormData, category: e.target.value })}
                  placeholder="Técnico, Onboarding, Vendas..."
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Passo a Passo</label>
                <textarea
                  rows={5}
                  required
                  value={sopFormData.content}
                  onChange={e => setSopFormData({ ...sopFormData, content: e.target.value })}
                  placeholder="1. Primeiro passo...&#10;2. Segundo passo..."
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs font-mono text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#272733]">
                <button
                  type="button"
                  onClick={() => setIsSopModalOpen(false)}
                  className="rounded-md border border-[#272733] px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-500"
                >
                  Salvar SOP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stack Modal */}
      {isStackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-4">Registrar Assinatura SaaS / Infra</h3>
            <form onSubmit={handleSaveStack} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome da Ferramenta</label>
                <input
                  type="text"
                  required
                  value={stackFormData.serviceName}
                  onChange={e => setStackFormData({ ...stackFormData, serviceName: e.target.value })}
                  placeholder="Ex: Cursor Pro, Hetzner, Vercel"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Custo Mensal (Centavos R$)</label>
                  <input
                    type="number"
                    required
                    value={stackFormData.costCents}
                    onChange={e => setStackFormData({ ...stackFormData, costCents: Number(e.target.value) })}
                    placeholder="11000 = R$ 110,00"
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Renovação</label>
                  <input
                    type="text"
                    value={stackFormData.renewalDate}
                    onChange={e => setStackFormData({ ...stackFormData, renewalDate: e.target.value })}
                    placeholder="Todo dia 10"
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">URL de Acesso</label>
                <input
                  type="url"
                  value={stackFormData.url}
                  onChange={e => setStackFormData({ ...stackFormData, url: e.target.value })}
                  placeholder="https://suaferramenta.com"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#272733]">
                <button
                  type="button"
                  onClick={() => setIsStackModalOpen(false)}
                  className="rounded-md border border-[#272733] px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-500"
                >
                  Salvar Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

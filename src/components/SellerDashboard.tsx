'use client';

import React, { useState } from 'react';
import {
  Store,
  Plus,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Package,
  Layers,
  Terminal,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { MarketplaceListing, VyrohStore, Prompt, Boilerplate } from '@/libs/VyrohStore';
import { formatCurrency } from '@/lib/utils';

export function SellerDashboard() {
  const [listings, setListings] = useState<MarketplaceListing[]>(VyrohStore.getListings());
  const [prompts] = useState<Prompt[]>(VyrohStore.getPrompts());
  const [boilerplates] = useState<Boilerplate[]>(VyrohStore.getBoilerplates());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'digital_product' as MarketplaceListing['type'],
    priceCents: 9700,
    category: 'Dev & Código',
    licenseType: 'Uso Comercial Ilimitado',
    tags: 'Next.js, Tailwind, Starter',
    sourceType: 'none',
    sourceId: undefined as number | undefined,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      type: 'digital_product',
      priceCents: 9700,
      category: 'Dev & Código',
      licenseType: 'Uso Comercial Ilimitado',
      tags: 'Next.js, Boilerplate, Prod',
      sourceType: 'none',
      sourceId: undefined,
    });
    setIsModalOpen(true);
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    VyrohStore.createListing({
      sellerName: 'Gabriel T. (Vyroh Solo)',
      sellerOrgId: 'org_solo_1',
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priceCents: Number(formData.priceCents),
      currency: 'BRL',
      category: formData.category,
      licenseType: formData.licenseType,
      tags: formData.tags.split(',').map(t => t.trim()),
      sourceType: formData.sourceType !== 'none' ? (formData.sourceType as any) : undefined,
      sourceId: formData.sourceId,
    });
    setListings([...VyrohStore.getListings()]);
    setIsModalOpen(false);
  };

  const totalSales = listings.reduce((acc, l) => acc + l.salesCount, 0);
  const grossRevenue = listings.reduce((acc, l) => acc + l.salesCount * l.priceCents, 0);
  const netPayout = grossRevenue * 0.9; // 90% after platform fee

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Store className="h-5 w-5 text-orange-400" />
            <span>Painel do Vendedor & Stripe Connect Express</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie suas listagens de produtos digitais, assinaturas recorrentes e repasses automáticos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Criar Listagem</span>
        </button>
      </div>

      {/* KYC Stripe Connect Status Banner */}
      <div className="rounded-xl border border-emerald-800/40 bg-[#131318] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-zinc-100">
                Conta Stripe Connect Express Ativa
              </h3>
              <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800/50">
                KYC Verificado
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Identidade fiscal validada. Repasses diários habilitados para sua conta bancária.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Redirecionando para o portal Stripe Express...')}
          className="rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 self-start sm:self-auto"
        >
          Acessar Portal Stripe
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#272733] bg-[#131318] p-4">
          <div className="text-xs text-zinc-400 flex items-center justify-between">
            <span>Faturamento Bruto</span>
            <DollarSign className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-2">
            {formatCurrency(grossRevenue)}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Volume total intermediado</span>
        </div>

        <div className="rounded-xl border border-[#272733] bg-[#131318] p-4">
          <div className="text-xs text-zinc-400 flex items-center justify-between">
            <span>Repasse Líquido (Payout)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-2">
            {formatCurrency(netPayout)}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">90% após comissão da plataforma</span>
        </div>

        <div className="rounded-xl border border-[#272733] bg-[#131318] p-4">
          <div className="text-xs text-zinc-400 flex items-center justify-between">
            <span>Total de Vendas</span>
            <Package className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-2">{totalSales}</div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Pedidos e assinaturas ativas</span>
        </div>
      </div>

      {/* Seller's Listings Table */}
      <div className="rounded-xl border border-[#272733] bg-[#131318] overflow-hidden">
        <div className="p-4 border-b border-[#272733] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">Suas Listagens Ativas</h3>
          <span className="text-xs text-zinc-400">{listings.length} itens no marketplace</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#272733] bg-[#0B0B0D]/60 text-zinc-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Item / Listagem</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Vendas</th>
                <th className="px-4 py-3">Origem no Cofre</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#272733]">
              {listings.map(item => (
                <tr key={item.id} className="hover:bg-zinc-900/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-100">{item.title}</div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-xs">{item.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-[#0B0B0D] px-2 py-0.5 text-[10px] font-medium text-orange-400 border border-[#272733]">
                      {item.type === 'digital_product'
                        ? 'Produto Digital'
                        : item.type === 'creator_subscription'
                        ? 'Assinatura'
                        : 'Serviço'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-zinc-200">
                    {formatCurrency(item.priceCents)}
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-300">{item.salesCount}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {item.sourceType ? (
                      <span className="flex items-center gap-1 text-[11px] text-purple-400">
                        {item.sourceType === 'boilerplate' ? (
                          <Layers className="h-3 w-3" />
                        ) : (
                          <Terminal className="h-3 w-3" />
                        )}
                        <span>{item.sourceType} vinculado</span>
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => alert(`Listagem "${item.title}" aberta para edição.`)}
                      className="rounded p-1 text-zinc-400 hover:text-zinc-200"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Listing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-4">Criar Nova Listagem no Marketplace</h3>
            <form onSubmit={handleSaveListing} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Título da Listagem</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Next.js 16 Starter Kit com Pagamentos"
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Tipo de Monetização</label>
                  <select
                    value={formData.type}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        type: e.target.value as MarketplaceListing['type'],
                      })
                    }
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="digital_product">Produto Digital Avulso (Fluxo B)</option>
                    <option value="creator_subscription">Assinatura Recorrente (Fluxo C)</option>
                    <option value="service">Serviço / Consultoria (Fluxo D)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Preço (Centavos R$)</label>
                  <input
                    type="number"
                    required
                    value={formData.priceCents}
                    onChange={e => setFormData({ ...formData, priceCents: Number(e.target.value) })}
                    placeholder="9700 = R$ 97,00"
                    className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-orange-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Link directly to a vault asset */}
              <div className="rounded-lg bg-[#0B0B0D] p-3 border border-purple-800/40">
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Vincular Ativo do seu Cofre (Zero Duplicação)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.sourceType}
                    onChange={e => setFormData({ ...formData, sourceType: e.target.value })}
                    className="rounded border border-[#272733] bg-[#131318] px-2 py-1 text-xs text-zinc-200"
                  >
                    <option value="none">Nenhum (Criar avulso)</option>
                    <option value="boilerplate">Boilerplate do Cofre</option>
                    <option value="prompt">Prompt do Cofre</option>
                  </select>

                  {formData.sourceType === 'boilerplate' && (
                    <select
                      onChange={e => setFormData({ ...formData, sourceId: Number(e.target.value) })}
                      className="rounded border border-[#272733] bg-[#131318] px-2 py-1 text-xs text-zinc-200"
                    >
                      {boilerplates.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {formData.sourceType === 'prompt' && (
                    <select
                      onChange={e => setFormData({ ...formData, sourceId: Number(e.target.value) })}
                      className="rounded border border-[#272733] bg-[#131318] px-2 py-1 text-xs text-zinc-200"
                    >
                      {prompts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Descrição Comercial</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explique o que está incluso no pacote..."
                  className="w-full rounded-md border border-[#272733] bg-[#0B0B0D] px-3 py-2 text-xs text-zinc-200 focus:border-orange-500 focus:outline-none"
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
                  className="rounded-md bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-500"
                >
                  Publicar Listagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

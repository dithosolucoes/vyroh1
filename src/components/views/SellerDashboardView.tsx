import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Eye,
  ExternalLink,
  Edit2,
  Trash2,
} from 'lucide-react';

export const SellerDashboardView: React.FC = () => {
  const {
    currentUser,
    listings,
    orders,
    openModal,
    setActiveView,
    deleteListing,
    showToast,
  } = useApp();

  const myListings = listings.filter((l) => l.sellerId === currentUser.id || l.sellerOrgId === currentUser.orgId);
  const myListingIds = new Set(myListings.map((l) => l.id));
  const myOrders = orders.filter((o) => (o as any).sellerId === currentUser.id || myListingIds.has(o.listingId));

  const totalGrossRevenue = myOrders.reduce((acc, o) => acc + (o.amountCents ?? 0), 0) / 100;
  const platformFees = myOrders.reduce((acc, o) => acc + (o.platformFeeCents ?? 0), 0) / 100;
  const netEarnings = myOrders.reduce((acc, o) => acc + (o.sellerPayoutCents ?? (o as any).sellerNetCents ?? 0), 0) / 100;

  const handleStripeConnect = () => {
    showToast('Redirecionando para o Stripe Connect Express para configuração de conta bancária...');
  };

  const handleRequestPayout = () => {
    showToast('Solicitação de saque de R$ ' + netEarnings.toFixed(2) + ' enviada via PIX/Stripe!');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Painel do Vendedor
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#C2410C]/20 text-[#EA580C] border border-[#C2410C]/30 font-mono font-semibold">
              SELLER HUB
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Gerencie seus ativos publicados, métricas de vendas, repasses automáticos e vitrine pública.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('loja_vendedor')}
            className="p-2 rounded-lg bg-[#0F0D11] hover:bg-[#121014] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Minha Loja Pública</span>
          </button>

          <button
            onClick={() => openModal('add_listing')}
            className="bg-[#C2410C] hover:bg-[#EA580C] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm action-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Anúncio</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Saldo Líquido Disponível</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            R$ {netEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <button
            onClick={handleRequestPayout}
            className="text-[11px] text-[var(--accent-bright)] hover:underline cursor-pointer font-medium pt-1"
          >
            Solicitar Saque Imediato →
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Faturamento Bruto Total</span>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            R$ {totalGrossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Taxa da plataforma (12%): R$ {platformFees.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Ativos Ativos / Vendas</span>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {myListings.length} / {myOrders.length}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stripe Connect Express Ativo</span>
          </div>
        </div>
      </div>

      {/* Published Listings Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Seus Ativos Publicados no Marketplace</h2>
          <span className="text-xs text-[var(--text-muted)] font-mono">{myListings.length} produtos listados</span>
        </div>

        <div className="bg-[#0F0D11] border border-[var(--border)] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121014] text-[var(--text-muted)] uppercase tracking-wider font-mono border-b border-[var(--border)]">
                <tr>
                  <th className="py-3 px-4">Título do Ativo</th>
                  <th className="py-3 px-4">Fluxo / Categoria</th>
                  <th className="py-3 px-4">Preço (R$)</th>
                  <th className="py-3 px-4">Vendas</th>
                  <th className="py-3 px-4">Avaliação</th>
                  <th className="py-3 px-4">Licença</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {myListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-[#121014] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">
                      <div className="truncate max-w-xs">{listing.title}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-normal truncate">{listing.description}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1620] text-[#EA580C] border border-[#C2410C]/30">
                        {listing.monetizationFlow.replace('flow_', '').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      R$ {(listing.priceCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 font-mono text-[var(--text-primary)]">
                      {listing.salesCount} un
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-400">
                      ★ {listing.rating.toFixed(1)}
                    </td>

                    <td className="py-3 px-4 text-[var(--text-muted)] font-mono text-[10px]">
                      {listing.licenseType.toUpperCase()}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          if (confirm('Deseja pausar ou remover este anúncio?')) {
                            deleteListing(listing.id);
                          }
                        }}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
                        title="Remover anúncio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {myListings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[var(--text-muted)]">
                      Você ainda não publicou nenhum ativo para venda. Clique em "+ Novo Anúncio" para começar a monetizar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

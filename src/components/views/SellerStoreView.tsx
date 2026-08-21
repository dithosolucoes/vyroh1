import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Star,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Github,
  Globe,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { MarketplaceListing } from '../../types';

export const SellerStoreView: React.FC = () => {
  const { listings, setActiveView, setSelectedListingForCheckout, openModal } = useApp();

  // Pick seller "Elena Vaz" or current user
  const sellerListings = listings.filter((l) => l.sellerName.includes('Elena') || l.sellerName.includes('Dev'));
  const seller = {
    name: 'Elena Vaz',
    handle: '@elenavaz_arch',
    bio: 'Arquiteta de Software Cloud e Engenheira Full-stack com foco em Next.js 15, PostgreSQL Multi-tenant e Agentes de IA.',
    rating: 4.9,
    reviewsCount: 42,
    totalSales: 128,
    joined: 'Membro desde Janeiro 2025',
    verified: true,
  };

  const handleBuy = (item: MarketplaceListing) => {
    setSelectedListingForCheckout(item);
    openModal('checkout');
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => setActiveView('marketplace')}
        className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Marketplace Geral</span>
      </button>

      {/* Storefront Hero Profile */}
      <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border-strong)] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6B21A8] to-[#C2410C] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {seller.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">{seller.name}</h1>
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Vendedor Verificado</span>
                </span>
              </div>

              <div className="text-xs text-[var(--text-muted)] font-mono">{seller.handle} • {seller.joined}</div>
            </div>
          </div>

          {/* Social and Stats */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-center p-2 rounded-lg bg-[#121014] border border-[var(--border)]">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{seller.rating}</span>
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">({seller.reviewsCount} reviews)</div>
            </div>

            <div className="text-center p-2 rounded-lg bg-[#121014] border border-[var(--border)]">
              <div className="font-bold text-emerald-400">{seller.totalSales}</div>
              <div className="text-[10px] text-[var(--text-muted)]">Vendas Totais</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-3xl pt-2 border-t border-[var(--border)]">
          {seller.bio}
        </p>
      </div>

      {/* Catalog from this seller */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            Ativos e Boilerplates por {seller.name}
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-mono">{sellerListings.length} disponíveis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sellerListings.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] hover:border-[#C2410C]/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121014] text-[#EA580C]">
                    {item.category.toUpperCase()}
                  </span>
                  <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <div className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(item.priceCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  className="bg-[#C2410C] hover:bg-[#EA580C] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>Comprar Agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

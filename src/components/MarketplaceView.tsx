'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  Search,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MarketplaceListing, VyrohStore } from '@/libs/VyrohStore';
import { formatCurrency } from '@/lib/utils';

export function MarketplaceView() {
  const [listings, setListings] = useState<MarketplaceListing[]>(VyrohStore.getListings());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasedListing, setPurchasedListing] = useState<MarketplaceListing | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenCheckout = (listing: MarketplaceListing) => {
    setPurchasedListing(listing);
    setIsSuccess(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPurchase = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setIsSuccess(false);
    }, 2500);
  };

  const filteredListings = listings.filter(l => {
    const matchesCat = selectedCategory === 'all' || l.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.tags.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Marketplace Hero Banner */}
      <div className="rounded-xl border border-orange-800/40 bg-gradient-to-r from-orange-950/40 via-[#131318] to-orange-950/20 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShoppingBag className="h-4 w-4" />
          <span>Marketplace & Vitrine de Criadores (Fase 4b)</span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">
          Compre & Venda Ativos Reutilizáveis de Alta Performance
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Boilerplates production-ready, clubes de prompts atualizados e consultoria especializada com repasses via Stripe Connect Express.
        </p>

        {/* Search & Filters */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar boilerplates, prompts, consultorias..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#272733] bg-[#0B0B0D] pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1">
            {['all', 'Dev & Código', 'Prompts & IA', 'Serviços & Consultoria'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'bg-[#131318] border border-[#272733] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat === 'all' ? 'Todas as Categorias' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map(item => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-[#272733] bg-[#131318] p-5 shadow-sm hover:border-orange-500/50 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                    item.type === 'digital_product'
                      ? 'bg-blue-950/80 text-blue-300 border-blue-800/40'
                      : item.type === 'creator_subscription'
                      ? 'bg-purple-950/80 text-purple-300 border-purple-800/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40'
                  }`}
                >
                  {item.type === 'digital_product'
                    ? 'Produto Digital (Fluxo B)'
                    : item.type === 'creator_subscription'
                    ? 'Assinatura Criador (Fluxo C)'
                    : 'Serviço sob Demanda (Fluxo D)'}
                </span>

                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{item.rating}</span>
                  <span className="text-zinc-500 text-[10px]">({item.salesCount})</span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-1">
                {item.tags.map(t => (
                  <span
                    key={t}
                    className="rounded bg-[#0B0B0D] border border-[#272733] px-2 py-0.5 text-[10px] font-mono text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
                <span>Licença: {item.licenseType}</span>
              </div>
            </div>

            {/* Price & Buy Action */}
            <div className="mt-5 pt-4 border-t border-[#272733] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-semibold">
                  {item.type === 'creator_subscription' ? 'Recorrente' : 'Valor Único'}
                </span>
                <span className="text-base font-bold font-mono text-zinc-100">
                  {formatCurrency(item.priceCents)}
                  {item.type === 'creator_subscription' && (
                    <span className="text-xs font-normal text-zinc-400">/mês</span>
                  )}
                </span>
              </div>

              <button
                onClick={() => handleOpenCheckout(item)}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
              >
                <Zap className="h-3.5 w-3.5 fill-white" />
                <span>{item.type === 'creator_subscription' ? 'Assinar' : 'Comprar'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Dialog Modal */}
      {isCheckoutOpen && purchasedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#272733] bg-[#131318] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#272733] pb-3">
              <h3 className="text-base font-semibold text-zinc-100">Checkout Stripe Connect</h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            {isSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-100">Compra Confirmada com Sucesso!</h4>
                <p className="text-xs text-zinc-400">
                  O ativo foi indexado diretamente no seu Cofre pessoal em "Minhas Compras". Split de pagamento realizado com o vendedor.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="rounded-lg bg-[#0B0B0D] p-3 border border-[#272733]">
                  <div className="font-semibold text-zinc-200">{purchasedListing.title}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Vendido por: {purchasedListing.sellerName}
                  </div>
                  <div className="mt-2 text-base font-bold font-mono text-orange-400">
                    {formatCurrency(purchasedListing.priceCents)}
                  </div>
                </div>

                <div className="space-y-1.5 text-zinc-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>Taxa da Plataforma (10%):</span>
                    <span className="font-mono text-zinc-300">
                      {formatCurrency(purchasedListing.priceCents * 0.1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repasse ao Vendedor (90%):</span>
                    <span className="font-mono text-zinc-300">
                      {formatCurrency(purchasedListing.priceCents * 0.9)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#272733] flex justify-end gap-2">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="rounded-md border border-[#272733] px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    className="rounded-md bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 flex items-center gap-1.5"
                  >
                    <Zap className="h-3.5 w-3.5 fill-white" />
                    <span>Pagar com Stripe</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

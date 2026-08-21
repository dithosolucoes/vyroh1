import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Search,
  Star,
  Download,
  Tag,
  ShieldCheck,
  Zap,
  Layers,
  Terminal,
  Cpu,
  Repeat,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { MarketplaceListing, MonetizationFlow } from '../../types';

export const MarketplaceView: React.FC = () => {
  const { listings, openModal, setSelectedListingForCheckout, setActiveView, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = listings.filter((l) => {
    const matchesFlow = selectedFlow === 'all' || l.monetizationFlow === selectedFlow;
    const matchesCat = selectedCategory === 'all' || l.category === selectedCategory;
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      l.sellerName.toLowerCase().includes(search.toLowerCase());
    return matchesFlow && matchesCat && matchesSearch;
  });

  const flows = [
    { id: 'all', label: 'Todos os Fluxos' },
    { id: 'flow_a_asset', label: 'Fluxo A: Ativos Únicos' },
    { id: 'flow_b_bundle', label: 'Fluxo B: Bundles Completos' },
    { id: 'flow_c_template', label: 'Fluxo C: Boilerplates' },
    { id: 'flow_d_subscription', label: 'Fluxo D: Assinatura de Criador' },
  ];

  const handleBuy = (listing: MarketplaceListing) => {
    setSelectedListingForCheckout(listing);
    openModal('checkout');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E110A] via-[#0F0D11] to-[#1E0F2B] border border-[#C2410C]/40 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#C2410C]/20 text-[#EA580C] border border-[#C2410C]/40">
            MARKETPLACE B2B VYROH
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">Fase 4b • Monetização de Ativos Técnicos</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
              <ShoppingBag className="w-8 h-8 text-[#EA580C]" />
              <span>Vitrine de Ativos & Boilerplates</span>
            </h1>
            <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
              Compre e venda boilerplates validados, prompts testados em produção e pacotes de arquitetura. Economize semanas de desenvolvimento.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView('vender_dashboard')}
              className="bg-[#121014] hover:bg-[#1A1620] text-[var(--text-primary)] border border-[var(--border-strong)] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Painel do Vendedor</span>
            </button>

            <button
              onClick={() => openModal('add_listing')}
              className="bg-[#C2410C] hover:bg-[#EA580C] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md action-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Ativo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0F0D11] p-3 rounded-xl border border-[var(--border)]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar boilerplates, prompts, criadores..."
              className="w-full bg-[#121014] text-xs text-[var(--text-primary)] pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] focus:border-[var(--accent-bright)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['all', 'boilerplates', 'prompts', 'bundles', 'mcps'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1A1620] text-[var(--accent-bright)] font-semibold border border-[var(--accent)]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat === 'all' ? 'Todas as Categorias' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Monetization Flow Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {flows.map((flow) => (
            <button
              key={flow.id}
              onClick={() => setSelectedFlow(flow.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                selectedFlow === flow.id
                  ? 'bg-[#C2410C]/20 text-[#EA580C] font-semibold border border-[#C2410C]/50'
                  : 'bg-[#0F0D11] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]'
              }`}
            >
              {flow.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] hover:border-[#C2410C]/50 transition-all space-y-4 shadow-lg flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Header Info with flow tag */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#121014] text-[#EA580C] border border-[#C2410C]/30">
                  {item.monetizationFlow.replace('flow_', 'FLUXO ').toUpperCase()}
                </span>

                <div className="flex items-center gap-1 text-xs text-amber-400 font-mono font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="text-[var(--text-muted)] font-normal">({item.reviewsCount})</span>
                </div>
              </div>

              {/* Title and description */}
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[#EA580C] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Seller details */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => {
                    setActiveView('loja_vendedor');
                  }}
                  className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center text-[10px] font-bold text-purple-200">
                    {item.sellerName.charAt(0)}
                  </div>
                  <span className="font-medium text-[11px] truncate max-w-[130px]">{item.sellerName}</span>
                </button>

                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {item.salesCount} vendas
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#121014] text-[var(--text-muted)] text-[10px] font-mono border border-[var(--border)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price and Checkout button */}
            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  R$ {(item.priceCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  {item.billingPeriod === 'monthly' && (
                    <span className="text-[10px] text-[var(--text-muted)] font-normal"> /mês</span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">
                  Licença: {item.licenseType.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <button
                onClick={() => handleBuy(item)}
                className="bg-[#C2410C] hover:bg-[#EA580C] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md action-glow"
              >
                <span>Comprar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-16 border border-dashed border-[var(--border)] rounded-2xl text-center text-xs text-[var(--text-muted)] space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto opacity-40 text-[#EA580C]" />
            <p>Nenhum ativo encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import { PortalDomain } from '../../types';
import {
  LayoutDashboard,
  FolderKanban,
  Terminal,
  Layers,
  Users,
  CheckSquare,
  CreditCard,
  FileText,
  Cpu,
  Brain,
  ShoppingBag,
  Store,
  PackageCheck,
  Repeat,
  MessageSquareCode,
  Sliders,
  Settings,
  ChevronDown,
  Globe,
  Sparkles,
  ShieldAlert,
  Coins,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  highlight?: 'accent' | 'action' | 'success';
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    portalDomain,
    setPortalDomain,
    projects,
    prompts,
    boilerplates,
    clients,
    sops,
    subscriptions,
    currentUser,
    orders,
    listings,
    theme,
  } = useApp();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const activeProjectsCount = projects.filter((p) => p.status !== 'archived').length;
  const sellerListingIds = new Set(listings.filter((l) => l.sellerOrgId === currentUser.orgId).map((l) => l.id));
  const myOrdersCount = orders.filter((o) => sellerListingIds.has(o.listingId)).length;

  const isDark = theme === 'dark';

  // Strict domain definitions for 100% separated workspaces
  const getSectionsForDomain = (): { title: string; items: NavItem[] }[] => {
    switch (portalDomain) {
      case 'marketplace':
        return [
          {
            title: 'Vitrine & Descoberta',
            items: [
              { id: 'marketplace' as ActiveView, label: 'Vitrine de Produtos', icon: ShoppingBag, highlight: 'action' as const, badge: listings.length },
              { id: 'comunidade' as ActiveView, label: 'Fórum & Auto-Match', icon: MessageSquareCode, badge: 'IA' },
            ],
          },
          {
            title: 'Minha Conta de Comprador',
            items: [
              { id: 'minhas_compras' as ActiveView, label: 'Minha Biblioteca (Compras)', icon: PackageCheck, badge: orders.length },
              { id: 'assinaturas' as ActiveView, label: 'Minhas Assinaturas', icon: Repeat },
            ],
          },
          {
            title: 'Ajuda & IA',
            items: [
              { id: 'cerebro' as ActiveView, label: 'O Cérebro IA', icon: Brain, highlight: 'accent' as const },
              { id: 'configuracoes' as ActiveView, label: 'Preferências', icon: Settings },
            ],
          },
        ];

      case 'seller':
        return [
          {
            title: 'Gestão de Vendas (Seller)',
            items: [
              { id: 'vender_dashboard' as ActiveView, label: 'Dashboard de Vendas', icon: Store, highlight: 'action' as const, badge: myOrdersCount > 0 ? `${myOrdersCount} vendas` : undefined },
              { id: 'loja_vendedor' as ActiveView, label: 'Minha Loja Pública', icon: Globe },
              { id: 'marketplace' as ActiveView, label: 'Vitrine do Marketplace', icon: ShoppingBag },
            ],
          },
          {
            title: 'Ativos Cadastrados',
            items: [
              { id: 'prompts' as ActiveView, label: 'Prompts à Venda', icon: Terminal, badge: prompts.length },
              { id: 'boilerplates' as ActiveView, label: 'Boilerplates & Repos', icon: Layers, badge: boilerplates.length },
              { id: 'mcps' as ActiveView, label: 'MCPs & Skills', icon: Cpu },
            ],
          },
          {
            title: 'Financeiro & Repasses',
            items: [
              { id: 'assinaturas' as ActiveView, label: 'Assinaturas de Criador', icon: Repeat },
              { id: 'configuracoes' as ActiveView, label: 'Conta Stripe Connect', icon: Settings },
            ],
          },
        ];

      case 'admin':
        return [
          {
            title: 'Governança (Seção 29)',
            items: [
              { id: 'admin_configuracoes' as ActiveView, label: 'Painel de Governança', icon: Sliders, highlight: 'accent' as const, badge: 'Seção 29' },
              { id: 'marketplace' as ActiveView, label: 'Moderação de Vitrine', icon: ShoppingBag, badge: listings.length },
              { id: 'comunidade' as ActiveView, label: 'Moderação de Fórum', icon: MessageSquareCode },
            ],
          },
          {
            title: 'Visão Global',
            items: [
              { id: 'dashboard' as ActiveView, label: 'Dashboard Executivo', icon: LayoutDashboard },
              { id: 'projetos' as ActiveView, label: 'Todos os Projetos', icon: FolderKanban, badge: activeProjectsCount },
              { id: 'clientes' as ActiveView, label: 'Clientes & Orgs', icon: Users, badge: clients.length },
              { id: 'vender_dashboard' as ActiveView, label: 'Analytics de Vendas', icon: Store },
            ],
          },
          {
            title: 'Cofre Técnico Geral',
            items: [
              { id: 'prompts' as ActiveView, label: 'Prompts Globais', icon: Terminal, badge: prompts.length },
              { id: 'boilerplates' as ActiveView, label: 'Boilerplates & Repos', icon: Layers, badge: boilerplates.length },
              { id: 'configuracoes' as ActiveView, label: 'Configurações do Sistema', icon: Settings },
            ],
          },
        ];

      // Default: 'vault' (Cofre Pessoal / Dev Solo)
      default:
        return [
          {
            title: 'Principal',
            items: [
              { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
              { id: 'projetos' as ActiveView, label: 'Projetos', icon: FolderKanban, badge: activeProjectsCount },
            ],
          },
          {
            title: 'Cofre Técnico (Tier 1 & 2)',
            items: [
              { id: 'prompts' as ActiveView, label: 'Prompts & Agentes', icon: Terminal, badge: prompts.length },
              { id: 'boilerplates' as ActiveView, label: 'Boilerplates & Repos', icon: Layers, badge: boilerplates.length },
              { id: 'clientes' as ActiveView, label: 'Clientes & CRM', icon: Users, badge: clients.length },
              { id: 'sops' as ActiveView, label: 'SOPs & Processos', icon: CheckSquare, badge: sops.length },
              { id: 'stack' as ActiveView, label: 'Stack & Assinaturas', icon: CreditCard, badge: subscriptions.length },
              { id: 'propostas' as ActiveView, label: 'Propostas & Contratos', icon: FileText },
              { id: 'mcps' as ActiveView, label: 'MCPs & Skills', icon: Cpu },
            ],
          },
          {
            title: 'Inteligência',
            items: [
              { id: 'cerebro' as ActiveView, label: 'O Cérebro IA', icon: Brain, highlight: 'accent' as const, badge: 'Roadmaps' },
            ],
          },
          {
            title: 'Sistema',
            items: [
              { id: 'configuracoes' as ActiveView, label: 'Configurações & IA', icon: Settings },
            ],
          },
        ];
    }
  };

  const portalInfo: Record<PortalDomain, { label: string; icon: any; color: string; badge: string }> = {
    vault: { label: 'Cofre Solo (Dev)', icon: FolderKanban, color: 'text-purple-400', badge: 'SOLO' },
    marketplace: { label: 'Marketplace & Hub', icon: ShoppingBag, color: 'text-[#EA580C]', badge: 'STORE' },
    seller: { label: 'Seller Studio', icon: Store, color: 'text-emerald-400', badge: 'SELLER' },
    admin: { label: 'Admin Governança', icon: Sliders, color: 'text-purple-300', badge: 'SEÇÃO 29' },
    landing: { label: 'Landing Page', icon: Globe, color: 'text-blue-400', badge: 'WEB' },
  };

  const currentDomain = portalInfo[portalDomain] || portalInfo.vault;
  const sections = getSectionsForDomain();

  return (
    <aside
      className={`w-64 ${
        isDark ? 'bg-[#0F0D11] border-[#2D2338]' : 'bg-[#FAFAFC] border-gray-200'
      } border-r flex flex-col h-[calc(100vh-53px)] shrink-0 select-none overflow-y-auto font-sans transition-colors duration-200`}
    >
      {/* Top Workspace / Domain Selector (100% Separated Context) */}
      <div className="p-3 border-b border-inherit relative">
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          className={`w-full flex items-center justify-between p-2 rounded-xl border ${
            isDark ? 'bg-[#121014] border-[#2D2338] hover:border-[#6B21A8]' : 'bg-white border-gray-200 hover:border-purple-300 shadow-xs'
          } cursor-pointer transition-all text-left group`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-lg ${isDark ? 'bg-[#1A1620]' : 'bg-purple-50'} flex items-center justify-center ${currentDomain.color}`}>
              <currentDomain.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate leading-tight">{currentDomain.label}</div>
              <div className="text-[10px] text-gray-500 font-mono">{currentUser.name}</div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-200 transition-transform" />
        </button>

        {/* Dropdown to switch portal domain */}
        {workspaceMenuOpen && (
          <div
            className={`absolute left-3 right-3 top-14 z-50 rounded-xl ${
              isDark ? 'bg-[#121014] border-[#2D2338] shadow-2xl' : 'bg-white border-gray-200 shadow-lg'
            } border p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100`}
          >
            <div className="px-2.5 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Alternar Ambiente:
            </div>

            {(['vault', 'marketplace', 'seller', 'admin'] as PortalDomain[]).map((domain) => {
              const info = portalInfo[domain];
              const isSelected = portalDomain === domain;

              return (
                <button
                  key={domain}
                  onClick={() => {
                    setPortalDomain(domain);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                    isSelected
                      ? isDark
                        ? 'bg-[#6B21A8]/20 text-purple-300 font-semibold'
                        : 'bg-purple-50 text-purple-900 font-semibold'
                      : isDark
                      ? 'hover:bg-[#1A1620] text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <info.icon className={`w-3.5 h-3.5 ${info.color}`} />
                    <span>{info.label}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/20 text-gray-400">
                    {info.badge}
                  </span>
                </button>
              );
            })}

            <div className="pt-1 border-t border-inherit">
              <button
                onClick={() => {
                  setPortalDomain('landing');
                  setActiveView('landing');
                  setWorkspaceMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                  isDark ? 'hover:bg-[#1A1620] text-blue-400' : 'hover:bg-blue-50 text-blue-600'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Ver Landing Page Pública</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="p-3 space-y-5 flex-1">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-gray-500 font-mono">
              {section.title}
            </div>

            <div className="space-y-0.5 pt-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                let activeStyle = '';
                if (isActive) {
                  if (item.highlight === 'action') {
                    activeStyle = isDark
                      ? 'bg-[#C2410C]/20 text-[#EA580C] font-semibold border-l-2 border-[#C2410C]'
                      : 'bg-orange-50 text-orange-700 font-semibold border-l-2 border-orange-500';
                  } else {
                    activeStyle = isDark
                      ? 'bg-[#6B21A8]/20 text-purple-300 font-semibold border-l-2 border-[#6B21A8]'
                      : 'bg-purple-50 text-purple-900 font-semibold border-l-2 border-purple-600';
                  }
                } else {
                  activeStyle = isDark
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-[#121014]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer group ${activeStyle}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? item.highlight === 'action'
                              ? 'text-[#EA580C]'
                              : 'text-[#C084FC]'
                            : 'text-gray-500 group-hover:text-gray-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                          isActive
                            ? item.highlight === 'action'
                              ? 'bg-[#C2410C] text-white'
                              : 'bg-[#6B21A8] text-white'
                            : isDark
                            ? 'bg-[#1A1620] text-gray-400'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Widget */}
      <div className={`p-3 border-t ${isDark ? 'border-[#2D2338] bg-[#050506]/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#121014] border-[#2D2338]' : 'bg-white border-gray-200'} space-y-2`}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-medium">Uso do Cofre</span>
            <span className="text-purple-400 font-mono font-semibold">
              {currentUser.plan === 'free' ? '3 / 10 itens' : 'Ilimitado'}
            </span>
          </div>

          <div className={`w-full ${isDark ? 'bg-[#1A1620]' : 'bg-gray-100'} h-1.5 rounded-full overflow-hidden`}>
            <div
              className="bg-gradient-to-r from-[#6B21A8] to-[#C2410C] h-full rounded-full transition-all"
              style={{ width: currentUser.plan === 'free' ? '30%' : '100%' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>Plano {currentUser.plan.toUpperCase()}</span>
            {currentUser.plan === 'free' ? (
              <button
                onClick={() => setActiveView('assinaturas')}
                className="text-[#EA580C] hover:underline cursor-pointer font-semibold"
              >
                Upgrade
              </button>
            ) : (
              <span className="text-emerald-400 font-medium">Ativo</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

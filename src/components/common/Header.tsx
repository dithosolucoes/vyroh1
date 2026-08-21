import React, { useState } from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import {
  Search,
  Sun,
  Moon,
  Shield,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Brain,
  Sliders,
  DollarSign,
  Globe,
  FolderKanban,
  Store,
} from 'lucide-react';
import { UserRole, PortalDomain } from '../../types';

export const BrandMark: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 110" aria-hidden="true" className={className}>
    <line x1="20" y1="12" x2="50" y2="92" stroke="#6B21A8" strokeWidth="15" strokeLinecap="round" />
    <line x1="80" y1="12" x2="50" y2="92" stroke="#C2410C" strokeWidth="15" strokeLinecap="round" />
    <circle cx="50" cy="92" r="7" fill="currentColor" />
  </svg>
);

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    theme,
    toggleTheme,
    activeView,
    setActiveView,
    portalDomain,
    setPortalDomain,
    searchQuery,
    setSearchQuery,
    openModal,
    logout,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    owner: { label: 'Owner (Cofre Solo)', badge: 'SOLO', color: 'bg-[#6B21A8]/20 text-purple-400 border-[#6B21A8]/40' },
    seller: { label: 'Vendedor (Marketplace)', badge: 'SELLER', color: 'bg-[#C2410C]/20 text-[#EA580C] border-[#C2410C]/40' },
    buyer: { label: 'Comprador', badge: 'BUYER', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    admin: { label: 'Admin Governança', badge: 'ADMIN', color: 'bg-purple-950/40 text-purple-300 border-purple-500/50' },
    collaborator: { label: 'Colaborador', badge: 'MEMBER', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  };

  const domainNames: Record<PortalDomain, string> = {
    vault: 'Cofre Pessoal',
    marketplace: 'Marketplace',
    seller: 'Seller Studio',
    admin: 'Governança',
    landing: 'Página Pública',
  };

  const viewTitles: Record<string, string> = {
    dashboard: 'Visão Geral',
    projetos: 'Projetos',
    projeto_detalhe: 'Detalhe do Projeto',
    prompts: 'Prompts & Agentes',
    boilerplates: 'Boilerplates & Repos',
    clientes: 'Clientes & CRM',
    sops: 'SOPs & Processos',
    stack: 'Stack & Assinaturas',
    propostas: 'Propostas & Contratos',
    mcps: 'MCPs & Skills',
    cerebro: 'O Cérebro IA',
    marketplace: 'Vitrine de Produtos',
    vender_dashboard: 'Painel de Vendas',
    loja_vendedor: 'Loja Pública',
    minhas_compras: 'Minhas Compras',
    assinaturas: 'Minhas Assinaturas',
    comunidade: 'Fórum da Comunidade',
    admin_configuracoes: 'Painel de Governança',
    configuracoes: 'Configurações',
    landing: 'Institucional',
  };

  const isDark = theme === 'dark';
  const currentRoleInfo = roleLabels[currentUser.role] || roleLabels.owner;

  return (
    <header
      className={`sticky top-0 z-30 w-full ${
        isDark ? 'bg-[#0F0D11]/90 border-[#2D2338]' : 'bg-white/90 border-gray-200 shadow-xs'
      } backdrop-blur-md border-b px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4 select-none font-sans transition-colors duration-200`}
    >
      {/* Left: Brand & Portal Breadcrumb */}
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        <button
          onClick={() => {
            setPortalDomain('vault');
            setActiveView('dashboard');
          }}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
        >
          <BrandMark size={28} className="transition-transform group-hover:scale-105" />
          <span className="text-xl font-bold tracking-tight">vyroh</span>
        </button>

        {/* Separator */}
        <span className="text-gray-500 hidden sm:inline">/</span>

        {/* Breadcrumb Context */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span
            className={`font-semibold px-2 py-0.5 rounded-md ${
              portalDomain === 'marketplace'
                ? 'bg-[#C2410C]/15 text-[#EA580C]'
                : portalDomain === 'seller'
                ? 'bg-emerald-500/15 text-emerald-400'
                : portalDomain === 'admin'
                ? 'bg-purple-500/15 text-purple-300'
                : 'bg-[#6B21A8]/15 text-purple-400'
            }`}
          >
            {domainNames[portalDomain]}
          </span>
          <span className="text-gray-500">›</span>
          <span className="font-sans font-medium text-gray-300 truncate max-w-[150px]">
            {viewTitles[activeView] || 'Hub'}
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar no cofre (projetos, prompts, boilerplates)..."
            className={`w-full ${
              isDark
                ? 'bg-[#050506] text-[#F3EEFB] border-[#2D2338] placeholder-gray-500 focus:border-[#6B21A8]'
                : 'bg-gray-100 text-gray-900 border-gray-200 placeholder-gray-400 focus:border-[#6B21A8]'
            } text-xs lg:text-sm pl-9 pr-4 py-1.5 rounded-xl border outline-none transition-all font-sans`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              esc
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick actions & Profile */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Cérebro shortcut */}
        <button
          onClick={() => setActiveView('cerebro')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            activeView === 'cerebro'
              ? 'bg-[#6B21A8] text-white border-purple-400 shadow-md shadow-purple-900/30'
              : isDark
              ? 'bg-[#121014] text-gray-300 hover:text-white border-[#2D2338] hover:border-[#6B21A8]'
              : 'bg-white text-gray-700 hover:text-purple-700 border-gray-200 hover:border-purple-300'
          }`}
          title="Abrir o Cérebro IA (Gerador de Roadmaps)"
        >
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden lg:inline">Cérebro IA</span>
        </button>

        {/* Marketplace shortcut */}
        <button
          onClick={() => {
            setPortalDomain('marketplace');
            setActiveView('marketplace');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            activeView === 'marketplace'
              ? 'bg-[#C2410C] text-white border-orange-400 shadow-md shadow-orange-900/30'
              : isDark
              ? 'bg-[#121014] text-gray-300 hover:text-white border-[#2D2338] hover:border-[#C2410C]'
              : 'bg-white text-gray-700 hover:text-orange-700 border-gray-200 hover:border-orange-300'
          }`}
          title="Navegar no Marketplace"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#EA580C]" />
          <span className="hidden lg:inline">Marketplace</span>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => openModal('add_anything')}
          className="hidden sm:flex items-center gap-1 bg-[#6B21A8] hover:bg-[#7E22CE] text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <span>+ Criar</span>
        </button>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer ${currentRoleInfo.color}`}
            title="Alternar Papel no Ecossistema Vyroh"
          >
            <Shield className="w-3 h-3" />
            <span className="font-semibold">{currentRoleInfo.badge}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {roleMenuOpen && (
            <div
              className={`absolute right-0 mt-2 w-60 rounded-xl ${
                isDark ? 'bg-[#121014] border-[#2D2338] shadow-2xl' : 'bg-white border-gray-200 shadow-xl'
              } border py-2 z-50 animate-in fade-in zoom-in-95 duration-100`}
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider border-b border-inherit">
                Simular Papel (Multi-tenant):
              </div>
              {(['owner', 'seller', 'buyer', 'admin'] as UserRole[]).map((r) => {
                const info = roleLabels[r];
                const isActive = currentUser.role === r;

                return (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-inherit cursor-pointer transition-colors ${
                      isActive
                        ? isDark
                          ? 'bg-[#6B21A8]/20 text-purple-300 font-semibold'
                          : 'bg-purple-50 text-purple-900 font-semibold'
                        : isDark
                        ? 'text-gray-300 hover:bg-[#1A1620]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{info.label}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] border ${info.color}`}>
                      {info.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border ${
            isDark
              ? 'bg-[#121014] border-[#2D2338] text-gray-300 hover:text-white hover:border-[#6B21A8]'
              : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
          } cursor-pointer transition-all`}
          aria-label="Alternar tema claro/escuro"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-0.5 rounded-full border border-inherit hover:border-purple-400 cursor-pointer focus:outline-none transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6B21A8] to-[#C2410C] flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
          </button>

          {userMenuOpen && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-xl ${
                isDark ? 'bg-[#121014] border-[#2D2338] shadow-2xl' : 'bg-white border-gray-200 shadow-xl'
              } border p-2 z-50 animate-in fade-in zoom-in-95 duration-100`}
            >
              <div className="px-3 py-2 border-b border-inherit mb-1">
                <p className="text-xs font-semibold">{currentUser.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Plano {currentUser.plan.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => {
                  setPortalDomain('vault');
                  setActiveView('configuracoes');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-inherit rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                Configurações & Provedor IA
              </button>

              <button
                onClick={() => {
                  setPortalDomain('landing');
                  setActiveView('landing');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-blue-400 hover:bg-inherit rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                Ver Landing Page Pública
              </button>

              <div className="border-t border-inherit my-1" />

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair do Cofre
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

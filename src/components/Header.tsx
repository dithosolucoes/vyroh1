'use client';

import React from 'react';
import {
  Layers,
  Sparkles,
  ShoppingBag,
  Sliders,
  FolderGit2,
  Terminal,
  Users,
  Shield,
  Store,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'projects'
  | 'prompts'
  | 'boilerplates'
  | 'clients'
  | 'brain'
  | 'tier2'
  | 'marketplace'
  | 'seller'
  | 'admin';

export type UserRole = 'owner' | 'seller' | 'buyer' | 'admin';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

export function Header({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#272733] bg-[#0B0B0D]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Brand Title (Single Text Element) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 text-left focus-visible:outline-none"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6B21A8] text-white shadow-sm">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-zinc-100">
              Vyroh
            </span>
          </button>
          <span className="hidden rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-300 md:inline-block">
            Vault OS
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, 4-6 items based on role, with overflow handling) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-zinc-800/80 text-white'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
            }`}
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Projetos</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'prompts'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Prompts</span>
          </button>

          <button
            onClick={() => setActiveTab('boilerplates')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'boilerplates'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Boilerplates</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`hidden sm:flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'clients'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab('brain')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'brain'
                ? 'bg-purple-600 text-white font-semibold shadow-sm'
                : 'text-purple-300 hover:bg-purple-950/30'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
            <span>O Cérebro</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'marketplace'
                ? 'bg-orange-600 text-white font-semibold shadow-sm'
                : 'text-orange-400 hover:bg-orange-950/30'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-orange-400" />
            <span>Marketplace</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Role Switching (Single-line) */}
        <div className="flex items-center gap-2">
          {/* Role selector to switch perspectives seamlessly */}
          <div className="hidden lg:flex items-center gap-1 rounded-lg border border-[#272733] bg-[#131318] p-0.5">
            <span className="px-2 text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
              Modo:
            </span>
            <button
              onClick={() => {
                setCurrentRole('owner');
                if (['seller', 'admin'].includes(activeTab)) setActiveTab('overview');
              }}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                currentRole === 'owner'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Solo / Cofre
            </button>
            <button
              onClick={() => {
                setCurrentRole('seller');
                setActiveTab('seller');
              }}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                currentRole === 'seller'
                  ? 'bg-orange-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Vendedor
            </button>
            <button
              onClick={() => {
                setCurrentRole('admin');
                setActiveTab('admin');
              }}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                currentRole === 'admin'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Admin
            </button>
          </div>

          {currentRole === 'seller' && (
            <button
              onClick={() => setActiveTab('seller')}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline-none"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Painel Vendedor</span>
            </button>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 focus-visible:outline-none"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Configurações</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

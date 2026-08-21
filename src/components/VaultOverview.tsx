'use client';

import React from 'react';
import {
  FolderGit2,
  Terminal,
  Layers,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Plus,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import { VyrohStore } from '@/libs/VyrohStore';
import { formatCurrency } from '@/lib/utils';
import { ActiveTab } from './Header';

interface OverviewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export function VaultOverview({ setActiveTab }: OverviewProps) {
  const projects = VyrohStore.getProjects();
  const prompts = VyrohStore.getPrompts();
  const boilerplates = VyrohStore.getBoilerplates();
  const clients = VyrohStore.getClients();
  const subscriptions = VyrohStore.getSubscriptions();

  const totalMonthlyCost = subscriptions.reduce((acc, s) => acc + s.costCents, 0);
  const activeProjects = projects.filter(p => p.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Top Banner with Brain Call to Action */}
      <div className="rounded-xl border border-purple-800/40 bg-gradient-to-r from-purple-950/40 via-[#131318] to-purple-950/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>O Cérebro com Poderes Ativo</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-100">
            Bem-vindo ao Vyroh — O Hub do Desenvolvedor Solo
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Seu centro de comando unificado: guarde projetos, versionamento de prompts, indexação de repositórios e execute roadmaps inteligentes sem retrabalho.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('brain')}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-500 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Abrir O Cérebro</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-1.5 rounded-lg border border-[#272733] bg-[#0B0B0D] px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <FolderGit2 className="h-4 w-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* 4 Core Vault Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('projects')}
          className="rounded-xl border border-[#272733] bg-[#131318] p-4 text-left hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Projetos no Hub</span>
            <FolderGit2 className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-2">{projects.length}</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            {activeProjects.length} em desenvolvimento
          </span>
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className="rounded-xl border border-[#272733] bg-[#131318] p-4 text-left hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Prompts Versionados</span>
            <Terminal className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-2">{prompts.length}</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            {prompts.reduce((acc, p) => acc + p.versions.length, 0)} versões registradas
          </span>
        </button>

        <button
          onClick={() => setActiveTab('boilerplates')}
          className="rounded-xl border border-[#272733] bg-[#131318] p-4 text-left hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Boilerplates Indexados</span>
            <Layers className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-2">
            {boilerplates.length}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Zero duplicação de código</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className="rounded-xl border border-[#272733] bg-[#131318] p-4 text-left hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Clientes no CRM</span>
            <Users className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-2">{clients.length}</div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            {clients.filter(c => c.status === 'active').length} clientes ativos
          </span>
        </button>
      </div>

      {/* 2-Column Section: Active Projects vs Prompts Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Projects Kanban summary */}
        <div className="lg:col-span-7 rounded-xl border border-[#272733] bg-[#131318] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#272733] pb-3">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-zinc-100">Projetos em Andamento</h2>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map(p => (
              <div
                key={p.id}
                className="rounded-lg border border-[#272733] bg-[#0B0B0D] p-3 flex items-start justify-between gap-3 hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-zinc-100">{p.name}</h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-mono capitalize ${
                        p.status === 'in_progress'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{p.description}</p>
                  {p.clientName && (
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Cliente: {p.clientName}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('projects')}
                  className="rounded border border-[#272733] bg-[#131318] px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800 shrink-0"
                >
                  Abrir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Tools & Stack cost */}
        <div className="lg:col-span-5 space-y-4">
          {/* Monthly stack summary */}
          <div className="rounded-xl border border-[#272733] bg-[#131318] p-5">
            <div className="flex items-center justify-between border-b border-[#272733] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Stack & SaaS Ativos</h3>
              </div>
              <button
                onClick={() => setActiveTab('tier2')}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Gerenciar
              </button>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-400">Total Mensal:</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {formatCurrency(totalMonthlyCost)} /mês
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              {subscriptions.slice(0, 2).map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-[11px] text-zinc-300 bg-[#0B0B0D] p-2 rounded border border-[#272733]"
                >
                  <span>{s.serviceName}</span>
                  <span className="font-mono text-zinc-400">{formatCurrency(s.costCents)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-xl border border-[#272733] bg-[#131318] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-950 border border-orange-800/50 text-orange-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-100">Marketplace de Ativos</h4>
                <p className="text-[11px] text-zinc-400">Venda seus boilerplates e prompts</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-500"
            >
              Explorar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

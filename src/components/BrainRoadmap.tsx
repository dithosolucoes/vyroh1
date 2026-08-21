'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  FolderGit2,
  Users,
  Briefcase,
  Play,
  Copy,
  Check,
} from 'lucide-react';
import { VyrohStore, RoadmapResult } from '@/libs/VyrohStore';

interface BrainProps {
  onNavigateToTab?: (tab: any) => void;
}

export function BrainRoadmap({ onNavigateToTab }: BrainProps) {
  const [goalInput, setGoalInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [appliedStep, setAppliedStep] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;

    setIsGenerating(true);
    // Process through Vyroh engine
    setTimeout(() => {
      const result = VyrohStore.generateRoadmap(goalInput);
      setRoadmap(result);
      setIsGenerating(false);
    }, 600);
  };

  const handleApplyStep = (order: number, actionRoute?: string) => {
    setAppliedStep(order);
    setTimeout(() => setAppliedStep(null), 2500);

    if (actionRoute && onNavigateToTab) {
      if (actionRoute.includes('projetos')) onNavigateToTab('projects');
      if (actionRoute.includes('prompts')) onNavigateToTab('prompts');
      if (actionRoute.includes('tier2')) onNavigateToTab('tier2');
    }
  };

  const sampleGoals = [
    'Quero construir um SaaS de automação com Next.js 16, pagamentos Stripe e IA',
    'Landing Page de alta conversão para cliente com entrega em 48h',
    'Microserviço em Python com fila de processamento assíncrono',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-purple-800/40 bg-gradient-to-r from-purple-950/40 via-[#131318] to-purple-950/20 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="h-4 w-4" />
          <span>Motor de Inteligência do Cofre (RAG & Roadmap)</span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">O Cérebro do Desenvolvedor Solo</h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Descreva seu objetivo em texto livre. O Cérebro consulta seus prompts, boilerplates e SOPs guardados, cruza o contexto, identifica gaps e gera um plano de execução sem alucinação.
        </p>

        {/* Input form */}
        <form onSubmit={handleGenerate} className="mt-5 space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              placeholder="Descreva o que você precisa entregar... (ex: Quero criar um SaaS com autenticação multi-tenant, billing e dashboard em modo escuro para um novo cliente)"
              className="w-full rounded-xl border border-[#272733] bg-[#0B0B0D] p-3 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none leading-relaxed"
            />
            <button
              type="submit"
              disabled={isGenerating || !goalInput.trim()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-purple-500 disabled:opacity-50 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isGenerating ? 'Processando Cofre...' : 'Gerar Roadmap'}</span>
            </button>
          </div>

          {/* Sample quick prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-500">Exemplos rápidos:</span>
            {sampleGoals.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setGoalInput(sample)}
                className="rounded-full border border-[#272733] bg-[#131318] px-2.5 py-1 text-[10px] text-zinc-400 hover:border-purple-500 hover:text-zinc-200 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Roadmap Results Area */}
      {roadmap && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="rounded-xl border border-[#272733] bg-[#131318] p-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                <span>Diagnóstico Estruturado</span>
              </h2>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{roadmap.summary}</p>
            </div>
            <span className="shrink-0 rounded bg-purple-950 px-2.5 py-1 text-[11px] font-mono text-purple-300 border border-purple-800/40">
              RAG 100% Preciso
            </span>
          </div>

          {/* 2 Column breakdown: Vault Assets vs Gaps Identified */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vault assets mapped */}
            <div className="rounded-xl border border-purple-800/30 bg-[#131318] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>Peças do Cofre Reutilizáveis</span>
                </h3>
                <span className="rounded bg-purple-950/60 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                  {roadmap.identifiedVaultAssets.length} identificadas
                </span>
              </div>

              <div className="space-y-2">
                {roadmap.identifiedVaultAssets.map((asset, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#272733] bg-[#0B0B0D] p-2.5 flex items-start gap-2 text-xs"
                  >
                    <span className="rounded bg-purple-950 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-800/40">
                      {asset.type}
                    </span>
                    <div>
                      <div className="font-semibold text-zinc-200">{asset.name}</div>
                      <div className="text-[11px] text-zinc-500">{asset.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gaps identified */}
            <div className="rounded-xl border border-amber-800/30 bg-[#131318] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Gaps & Oportunidades Identificados</span>
                </h3>
                <span className="rounded bg-amber-950/60 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  {roadmap.gaps.length} gaps
                </span>
              </div>

              <div className="space-y-2">
                {roadmap.gaps.map((gap, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-amber-900/30 bg-[#0B0B0D] p-2.5 text-xs text-amber-200/90 leading-relaxed"
                  >
                    {gap}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Ordered Execution Plan */}
          <div className="rounded-xl border border-[#272733] bg-[#131318] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#272733] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-purple-400" />
                  <span>Plano de Execução Sequencial</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ordem de desenvolvimento recomendada para maximizar reaproveitamento e velocidade.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {roadmap.steps.map(step => (
                <div
                  key={step.order}
                  className="rounded-lg border border-[#272733] bg-[#0B0B0D] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-950 text-purple-300 font-mono text-xs font-semibold border border-purple-800/40">
                      {step.order}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200">{step.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{step.detail}</p>
                    </div>
                  </div>

                  {step.actionLabel && (
                    <button
                      onClick={() => handleApplyStep(step.order, step.actionRoute)}
                      className="shrink-0 flex items-center gap-1.5 rounded-md border border-[#272733] bg-[#131318] px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-950 hover:border-purple-800 transition-colors"
                    >
                      {appliedStep === step.order ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Ativado</span>
                        </>
                      ) : (
                        <>
                          <span>{step.actionLabel}</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Professional / Match Layer (Fluxo D) */}
          {roadmap.suggestedProfessionals && (
            <div className="rounded-xl border border-orange-800/30 bg-orange-950/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-orange-400" />
                  <h3 className="text-xs font-semibold text-orange-300">
                    Match de Profissional Recomendado (Marketplace de Serviços)
                  </h3>
                </div>
                <span className="rounded bg-orange-950 px-2 py-0.5 text-[10px] font-mono text-orange-400 border border-orange-800/40">
                  Fluxo D
                </span>
              </div>

              {roadmap.suggestedProfessionals.map((prof, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#272733] bg-[#131318] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-zinc-100">{prof.role}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{prof.whyNeeded}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-emerald-400 text-xs">{prof.estimatedCost}</span>
                    <button
                      onClick={() => onNavigateToTab && onNavigateToTab('marketplace')}
                      className="rounded bg-orange-600 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-500"
                    >
                      Buscar no Marketplace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

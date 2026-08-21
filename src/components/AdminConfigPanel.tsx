'use client';

import React, { useState } from 'react';
import {
  Shield,
  Percent,
  Sliders,
  FileCheck,
  Tag,
  CheckCircle,
  Save,
} from 'lucide-react';
import { CommissionRule, VyrohStore } from '@/libs/VyrohStore';

export function AdminConfigPanel() {
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(
    VyrohStore.getCommissionRules()
  );
  const [saveToast, setSaveToast] = useState(false);

  const handleUpdatePercentage = (id: number, val: number) => {
    VyrohStore.updateCommissionRule(id, val);
    setCommissionRules([...VyrohStore.getCommissionRules()]);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            <span>Governança da Plataforma & Regras (/admin/configuracoes)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Defina comissões de repasse, tetos de planos e licenças como dados gerenciáveis sem precisar de novo deploy.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-950 px-3 py-1.5 text-xs text-emerald-300 border border-emerald-800 animate-fade-in">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Regra atualizada em tempo real</span>
          </div>
        )}
      </div>

      {/* Commission Rules by Payment Flow (Sections 28 & 29) */}
      <div className="rounded-xl border border-[#272733] bg-[#131318] p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#272733] pb-3">
          <Percent className="h-4 w-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-zinc-100">
            Regras de Comissão por Fluxo de Pagamento (commission_rules)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commissionRules.map(rule => (
            <div
              key={rule.id}
              className="rounded-lg border border-[#272733] bg-[#0B0B0D] p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase font-semibold text-purple-400">
                    {rule.flowType}
                  </span>
                  <h3 className="text-xs font-semibold text-zinc-200 mt-0.5">{rule.flowLabel}</h3>
                </div>

                <div className="flex items-center gap-1 rounded bg-[#131318] border border-[#272733] px-2 py-1">
                  <input
                    type="number"
                    value={rule.percentage}
                    onChange={e => handleUpdatePercentage(rule.id, Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-12 bg-transparent text-right text-xs font-mono font-bold text-zinc-100 focus:outline-none"
                  />
                  <span className="text-xs font-mono text-zinc-400">%</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">{rule.description}</p>

              <div className="text-[10px] text-zinc-500 pt-2 border-t border-[#272733]/60 flex justify-between">
                <span>Atualizado por: {rule.updatedBy}</span>
                <span>{rule.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Limits & SaaS Tiers (Section 29) */}
      <div className="rounded-xl border border-[#272733] bg-[#131318] p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#272733] pb-3">
          <Sliders className="h-4 w-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-zinc-100">
            Limites dos Planos de Assinatura (plan_limits)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-[#272733] bg-[#0B0B0D] p-3 text-xs space-y-2">
            <h3 className="font-semibold text-zinc-200">Plano Solo Grátis</h3>
            <ul className="space-y-1 text-[11px] text-zinc-400">
              <li>• Até 5 Projetos no Cofre</li>
              <li>• 20 Prompts Versionados</li>
              <li>• 10 Chamadas do Cérebro /mês</li>
              <li>• Taxa Marketplace: 15%</li>
            </ul>
          </div>

          <div className="rounded-lg border border-purple-800/40 bg-purple-950/20 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-purple-300">Vyroh Pro (R$ 69/mês)</h3>
              <span className="rounded bg-purple-900 px-1.5 py-0.5 text-[9px] text-purple-200">Recomendado</span>
            </div>
            <ul className="space-y-1 text-[11px] text-zinc-300">
              <li>• Projetos Ilimitados</li>
              <li>• Prompts & Histórico Ilimitado</li>
              <li>• Cérebro IA com RAG Completo</li>
              <li>• Servidor MCP Ativo</li>
              <li>• Taxa Marketplace: 10%</li>
            </ul>
          </div>

          <div className="rounded-lg border border-orange-800/40 bg-orange-950/20 p-3 text-xs space-y-2">
            <h3 className="font-semibold text-orange-300">Creator & Studio (R$ 149/mês)</h3>
            <ul className="space-y-1 text-[11px] text-zinc-300">
              <li>• Todos os recursos Pro</li>
              <li>• Loja Pública Personalizada</li>
              <li>• Clube de Assinaturas de Criador</li>
              <li>• Menor Taxa do Marketplace: 6%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

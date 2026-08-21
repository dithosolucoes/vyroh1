import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  Calendar,
  ExternalLink,
  Trash2,
  AlertTriangle,
  TrendingDown,
} from 'lucide-react';

export const StackView: React.FC = () => {
  const { subscriptions, openModal, deleteSubscription, showToast } = useApp();
  const [search, setSearch] = useState('');

  const filtered = subscriptions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalMonthlyUSD = subscriptions
    .filter((s) => s.currency === 'USD')
    .reduce((acc, s) => acc + (s.billingCycle === 'monthly' ? s.cost : s.cost / 12), 0);

  const totalMonthlyBRL = subscriptions
    .filter((s) => s.currency === 'BRL')
    .reduce((acc, s) => acc + (s.billingCycle === 'monthly' ? s.cost : s.cost / 12), 0);

  const estimatedTotalBRL = totalMonthlyBRL + totalMonthlyUSD * 5.75;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Stack & Assinaturas SaaS
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-purple-400 border border-purple-500/30 font-mono">
              {subscriptions.length} serviços
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Monitore seus custos recorrentes de infraestrutura, APIs de IA e ferramentas do dia a dia.
          </p>
        </div>

        <button
          onClick={() => openModal('add_subscription')}
          className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Ferramenta</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Custo Mensal Estimado</span>
          <div className="text-xl font-bold text-amber-400 font-mono">
            R$ {estimatedTotalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs text-[var(--text-muted)] font-normal"> /mês</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Despesas em Dólar (USD)</span>
          <div className="text-xl font-bold text-[var(--text-primary)] font-mono">
            ${totalMonthlyUSD.toFixed(2)}
            <span className="text-xs text-[var(--text-muted)] font-normal"> /mês</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0D11] border border-[var(--border)] space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-medium">Serviços Ativos</span>
          <div className="text-xl font-bold text-[var(--text-primary)] font-mono">
            {subscriptions.filter((s) => s.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Grid of Subscriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] hover:border-purple-500/30 transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{s.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121014] text-[var(--text-muted)] border border-[var(--border)] mt-1 inline-block">
                    {s.category.toUpperCase()}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {s.currency === 'USD' ? '$' : 'R$'} {s.cost.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {s.billingCycle === 'monthly' ? 'mensal' : 'anual'}
                  </div>
                </div>
              </div>

              {/* Renewal info */}
              <div className="p-2.5 rounded-lg bg-[#121014] text-xs text-[var(--text-secondary)] flex items-center justify-between border border-[var(--border)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Próxima renovação:</span>
                </span>
                <span className="font-mono text-[var(--text-primary)]">{s.renewalDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Ativo</span>
              </span>

              <button
                onClick={() => {
                  if (confirm(`Remover ${s.name} do controle de assinaturas?`)) {
                    deleteSubscription(s.id);
                  }
                }}
                className="text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

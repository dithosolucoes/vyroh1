import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Repeat,
  CheckCircle2,
  Zap,
  Shield,
  Star,
  Sparkles,
} from 'lucide-react';
import { SubscriptionPlan } from '../../types';

export const SubscriptionsView: React.FC = () => {
  const { currentUser, upgradePlan, showToast } = useApp();

  const plans = [
    {
      id: 'free' as SubscriptionPlan,
      name: 'Solo Free',
      price: 'R$ 0',
      period: 'grátis para sempre',
      description: 'Perfeito para experimentar o ecossistema Vyroh e organizar projetos iniciais.',
      features: [
        'Até 3 projetos ativos',
        'Até 10 itens no cofre técnico',
        'Cérebro IA básico (3 análises/mês)',
        'Acesso como comprador no marketplace',
        'Taxa de vendedor padrão (15%)',
      ],
      current: currentUser.plan === 'free',
      actionLabel: 'Plano Atual',
      highlight: false,
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: 'Solo Dev Pro',
      price: 'R$ 59',
      period: '/mês',
      description: 'Para o desenvolvedor solo profissional que vive de entregas rápidas.',
      features: [
        'Projetos e cofre 100% ILIMITADOS',
        'Cérebro IA ilimitado com Gemini 3.7 Flash',
        'Playground de Prompts com execuções infinitas',
        'Taxa de vendedor reduzida para 10%',
        'Exportação de dados em JSON/CSV sem travas',
        'Badge de Vendedor Verificado',
      ],
      current: currentUser.plan === 'pro',
      actionLabel: currentUser.plan === 'pro' ? 'Seu Plano Ativo' : 'Assinar Plano Pro',
      highlight: true,
    },
    {
      id: 'enterprise' as SubscriptionPlan,
      name: 'Studio Enterprise',
      price: 'R$ 149',
      period: '/mês',
      description: 'Para estúdios e desenvolvedores de alta performance com múltiplos clientes.',
      features: [
        'Tudo do Plano Pro',
        'Suporte a múltiplos membros de equipe',
        'Taxa de vendedor ultra-baixa (7%)',
        'MCPs avançados & Custom APIs',
        'Domínio próprio para loja de criador',
        'Atendimento prioritário via WhatsApp',
      ],
      current: currentUser.plan === 'enterprise',
      actionLabel: currentUser.plan === 'enterprise' ? 'Seu Plano Ativo' : 'Fazer Upgrade Enterprise',
      highlight: false,
    },
  ];

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    if (currentUser.plan === planId) {
      showToast('Você já está utilizando este plano!');
      return;
    }
    upgradePlan(planId);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-bright)] font-semibold">
          PLANOS & CAPACIDADE DO COFRE
        </span>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Turbine seu fluxo de trabalho solo
        </h1>
        <p className="text-xs lg:text-sm text-[var(--text-secondary)]">
          Sem amarras e sem taxas ocultas. Escolha o plano que melhor se adapta à sua escala.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 transition-all relative ${
              plan.highlight
                ? 'bg-gradient-to-b from-[#180E24] to-[#0F0D11] border-[var(--accent-bright)] shadow-2xl shadow-purple-950/40 ring-1 ring-[var(--accent-bright)]/30'
                : 'bg-[#0F0D11] border-[var(--border)]'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#6B21A8] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                Mais Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{plan.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 min-h-[32px]">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                <span className="text-xs text-[var(--text-muted)]">{plan.period}</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[var(--border)] text-xs">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={plan.current}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                plan.current
                  ? 'bg-[#121014] text-[var(--text-muted)] border border-[var(--border)] cursor-default'
                  : plan.highlight
                  ? 'bg-[#6B21A8] hover:bg-[#8B35D6] text-white shadow-md badge-glow'
                  : 'bg-[#121014] hover:bg-[#1A1620] text-[var(--text-primary)] border border-[var(--border-strong)]'
              }`}
            >
              {plan.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

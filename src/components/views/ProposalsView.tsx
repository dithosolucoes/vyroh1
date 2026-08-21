import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Copy,
  Sparkles,
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  clientName: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  date: string;
  tiers: {
    name: string;
    price: number;
    description: string;
    features: string[];
  }[];
}

const mockProposals: Proposal[] = [
  {
    id: 'prop_1',
    title: 'Plataforma SaaS B2B com Multi-tenancy',
    clientName: 'Alpha Logistics Tech',
    status: 'accepted',
    date: '2026-03-15',
    tiers: [
      {
        name: 'Essencial MVP',
        price: 18500,
        description: 'Entrega rápida com autenticação e painel operacional.',
        features: ['Next.js 15 Starter', 'Banco Postgres', 'Deploy Docker', 'Suporte 30 dias'],
      },
      {
        name: 'Profissional Completo',
        price: 28000,
        description: 'Sistema completo com IA integrada e relatórios avançados.',
        features: ['Tudo do Essencial', 'Agentes Gemini AI', 'Integração Stripe', 'Suporte 60 dias'],
      },
      {
        name: 'Enterprise Dedicado',
        price: 45000,
        description: 'Alta disponibilidade, CI/CD customizado e treinamento.',
        features: ['Tudo do Pro', 'Cluster Kubernetes', 'SLA 99.9%', 'Treinamento de time'],
      },
    ],
  },
  {
    id: 'prop_2',
    title: 'Pipeline de Automação de Leads com IA',
    clientName: 'Beta Growth Studio',
    status: 'sent',
    date: '2026-03-22',
    tiers: [
      {
        name: 'Pacote Único',
        price: 12000,
        description: 'Fluxo automatizado com webhooks e agentes de qualificação.',
        features: ['Webhook receptor', 'Gemini Flash analysis', 'Integração CRM', 'Dashboard de conversão'],
      },
    ],
  },
];

export const ProposalsView: React.FC = () => {
  const { showToast } = useApp();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(mockProposals[0]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Propostas & Contratos Comerciais
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-[#A79BC4] border border-[var(--border)] font-mono">
              Tier 2
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Modelos de propostas em 3 níveis de valor (Essencial / Pro / Enterprise) para fechar contratos de alto valor.
          </p>
        </div>

        <button
          onClick={() => showToast('Gerador de proposta em 3 níveis aberto!')}
          className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Proposta</span>
        </button>
      </div>

      {/* Grid of Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proposals List */}
        <div className="lg:col-span-5 space-y-3">
          {proposals.map((prop) => {
            const isSelected = selectedProposal?.id === prop.id;
            return (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-[#121014] border-[var(--accent-bright)] shadow-md'
                    : 'bg-[#0F0D11] hover:bg-[#121014] border-[var(--border)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{prop.title}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      prop.status === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {prop.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-[var(--text-secondary)]">Cliente: {prop.clientName}</div>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)] font-mono">
                  <span>{prop.date}</span>
                  <span>{prop.tiers.length} opções de preço</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Proposal Preview */}
        <div className="lg:col-span-7">
          {selectedProposal ? (
            <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border-strong)] space-y-6">
              <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{selectedProposal.title}</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Preparado para: <strong>{selectedProposal.clientName}</strong>
                  </p>
                </div>

                <button
                  onClick={() => showToast('Link da proposta copiado para envio ao cliente!')}
                  className="p-2 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link</span>
                </button>
              </div>

              {/* Tiers Grid */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  Opções de Contratação (3-Tiers Strategy):
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedProposal.tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        idx === 1
                          ? 'bg-[#16121B] border-[var(--accent-bright)] shadow-md'
                          : 'bg-[#121014] border-[var(--border)]'
                      }`}
                    >
                      <div className="space-y-2">
                        {idx === 1 && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#6B21A8] text-white">
                            Mais Recomendado
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">{tier.name}</h4>
                        <div className="text-base font-bold text-emerald-400 font-mono">
                          R$ {tier.price.toLocaleString('pt-BR')}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">{tier.description}</p>

                        <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                          {tier.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

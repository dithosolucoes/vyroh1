import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  Shield,
  DollarSign,
  Percent,
  Cpu,
  UserCheck,
  Tag,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AdminSystemConfig } from '../../types';

export const AdminConfigView: React.FC = () => {
  const { adminConfig, updateAdminConfig, currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'commissions' | 'pricing' | 'licenses' | 'kyc' | 'ai'>('commissions');
  const [formData, setFormData] = useState<AdminSystemConfig>(adminConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig(formData);
    showToast('Configurações da Seção 29 salvas e aplicadas em todo o ecossistema!');
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0F0D11] to-[#120D1A] border border-purple-500/40 space-y-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-purple-950 text-purple-300 border border-purple-500/40">
            SEÇÃO 29 • ENGINE CONFIGURÁVEL
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">Controle Administrativo Global</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
              <Shield className="w-7 h-7 text-purple-400" />
              <span>Painel de Regras & Governança da Plataforma</span>
            </h1>
            <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
              Como especificado na Seção 29, todas as regras de taxas de comissão (Fluxos A, B, C, D), preços de planos, limites de IA e tipos de licença são dinâmicas e sem hardcode.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-md shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Regras</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto pb-1 text-xs">
        {[
          { id: 'commissions', label: '1. Comissões (Fluxos A, B, C, D)', icon: Percent },
          { id: 'pricing', label: '2. Limites de Preço & Planos', icon: DollarSign },
          { id: 'licenses', label: '3. Tipos de Licença & Categorias', icon: Tag },
          { id: 'kyc', label: '4. Políticas KYC & Vendedor', icon: UserCheck },
          { id: 'ai', label: '5. Parâmetros do Motor IA', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg font-medium cursor-pointer transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-purple-400 text-purple-300 bg-[#121014]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border)] space-y-6">
        {/* TAB 1: Commissions */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Taxa de Comissão Retida pela Plataforma (%) por Fluxo de Monetização:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Fluxo A: Ativos Únicos (Prompts, Snippets)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.commissionRates.flow_a_asset}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRates: {
                          ...formData.commissionRates,
                          flow_a_asset: Number(e.target.value),
                        },
                      })
                    }
                    className="w-24 bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                  />
                  <span className="text-xs text-[var(--text-muted)]">% retido</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Fluxo B: Bundles & Pacotes Completos
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.commissionRates.flow_b_bundle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRates: {
                          ...formData.commissionRates,
                          flow_b_bundle: Number(e.target.value),
                        },
                      })
                    }
                    className="w-24 bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                  />
                  <span className="text-xs text-[var(--text-muted)]">% retido</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Fluxo C: Boilerplates & Starter Kits
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.commissionRates.flow_c_template}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRates: {
                          ...formData.commissionRates,
                          flow_c_template: Number(e.target.value),
                        },
                      })
                    }
                    className="w-24 bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                  />
                  <span className="text-xs text-[var(--text-muted)]">% retido</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Fluxo D: Assinaturas Recorrentes de Criador
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.commissionRates.flow_d_subscription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRates: {
                          ...formData.commissionRates,
                          flow_d_subscription: Number(e.target.value),
                        },
                      })
                    }
                    className="w-24 bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                  />
                  <span className="text-xs text-[var(--text-muted)]">% retido</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Pricing limits and Plans */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Limites de Preço do Marketplace e Valores de Planos:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Preço Mínimo Permitido por Ativo (R$)
                </label>
                <input
                  type="number"
                  value={formData.minPriceCents / 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minPriceCents: Number(e.target.value) * 100,
                    })
                  }
                  className="w-full bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Preço Máximo Permitido por Ativo (R$)
                </label>
                <input
                  type="number"
                  value={formData.maxPriceCents / 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPriceCents: Number(e.target.value) * 100,
                    })
                  }
                  className="w-full bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Preço Mensal do Plano PRO (R$)
                </label>
                <input
                  type="number"
                  value={formData.planPricing.proMonthlyCents / 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      planPricing: {
                        ...formData.planPricing,
                        proMonthlyCents: Number(e.target.value) * 100,
                      },
                    })
                  }
                  className="w-full bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Preço Mensal do Plano ENTERPRISE (R$)
                </label>
                <input
                  type="number"
                  value={formData.planPricing.enterpriseMonthlyCents / 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      planPricing: {
                        ...formData.planPricing,
                        enterpriseMonthlyCents: Number(e.target.value) * 100,
                      },
                    })
                  }
                  className="w-full bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Licenses */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Tipos de Licença Ativas no Marketplace:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.allowedLicenseTypes.map((lic, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#121014] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[var(--text-primary)] uppercase">
                    {lic.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                    Habilitado
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KYC */}
        {activeTab === 'kyc' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Políticas de Verificação & KYC para Vendedores:
            </h2>

            <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.kycRequirements.requireStripeConnect}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kycRequirements: {
                        ...formData.kycRequirements,
                        requireStripeConnect: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-[var(--text-primary)]">
                  Exigir conta ativa no Stripe Connect Express antes de permitir criação de anúncios
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.kycRequirements.requireDocumentVerification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kycRequirements: {
                        ...formData.kycRequirements,
                        requireDocumentVerification: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-[var(--text-primary)]">
                  Exigir validação de CPF / CNPJ e comprovante de titularidade bancária
                </span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 5: AI Engine Params */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Parâmetros do Motor Gemini AI:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Modelo Ativo
                </label>
                <input
                  type="text"
                  value={formData.aiEngineLimits.defaultModel}
                  disabled
                  className="w-full bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-muted)] font-mono"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Limite Mensal de Tokens (Plano Free)
                </label>
                <input
                  type="number"
                  value={formData.aiEngineLimits.maxMonthlyTokensPerFreeUser}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiEngineLimits: {
                        ...formData.aiEngineLimits,
                        maxMonthlyTokensPerFreeUser: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-[#050506] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[var(--border)]">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações Globais</span>
          </button>
        </div>
      </form>
    </div>
  );
};

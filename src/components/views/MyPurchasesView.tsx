import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageCheck,
  Download,
  ExternalLink,
  Key,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  FileText,
} from 'lucide-react';

export const MyPurchasesView: React.FC = () => {
  const { orders, setActiveView, showToast } = useApp();

  const handleDownload = (assetTitle: string) => {
    showToast(`Iniciando download do pacote criptografado: ${assetTitle}`);
  };

  const handleOpenGithub = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      showToast('Acesso liberado no repositório privado do GitHub!');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Minhas Compras & Biblioteca Digital
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-emerald-400 border border-emerald-500/30 font-mono">
              {orders.length} pedidos
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Acesse seus boilerplates comprados, chaves de licença e links de download vitalícios.
          </p>
        </div>

        <button
          onClick={() => setActiveView('marketplace')}
          className="bg-[#C2410C] hover:bg-[#EA580C] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all action-glow"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explorar Marketplace</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] space-y-4 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <PackageCheck className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{order.listingTitle}</h3>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    Pedido: {order.id} • Pago via Stripe Connect ({(order.paymentMethod ?? 'cartão').toUpperCase()})
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-bold text-emerald-400 font-mono">
                  R$ {(order.amountCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">{order.createdAt.split('T')[0]}</div>
              </div>
            </div>

            {/* License and Access Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.licenseKey && (
                <div className="p-3 rounded-xl bg-[#121014] border border-[var(--border)] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chave de Ativação / Licença:</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[var(--accent-bright)] select-all">
                    {order.licenseKey}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#121014] border border-[var(--border)] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tipo de Licença:</span>
                </div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  {order.licenseType?.toUpperCase() || 'COMERCIAL SOLO'}
                </div>
              </div>
            </div>

            {/* Actions: Download and Repo */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-[var(--text-muted)]">
                Status do pedido: <strong className="text-emerald-400 font-medium">Concluído & Disponível</strong>
              </div>

              <div className="flex items-center gap-2">
                {order.downloadUrl && (
                  <button
                    onClick={() => handleDownload(order.listingTitle)}
                    className="bg-[#121014] hover:bg-[#1A1620] text-[var(--text-primary)] border border-[var(--border-strong)] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Baixar Arquivos ZIP</span>
                  </button>
                )}

                {order.repoAccessUrl && (
                  <button
                    onClick={() => handleOpenGithub(order.repoAccessUrl)}
                    className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Acessar no GitHub</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="p-16 border border-dashed border-[var(--border)] rounded-2xl text-center text-xs text-[var(--text-muted)] space-y-3">
            <ShoppingBag className="w-8 h-8 mx-auto opacity-30 text-[var(--text-muted)]" />
            <p>Você ainda não realizou nenhuma compra no Marketplace Vyroh.</p>
          </div>
        )}
      </div>
    </div>
  );
};

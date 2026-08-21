import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';
import { ParticleCanvas } from './components/common/ParticleCanvas';
import { AllModals } from './components/modals/AllModals';

// Views
import { AuthView } from './components/views/AuthView';
import { LandingPageView } from './components/views/LandingPageView';
import { DashboardView } from './components/views/DashboardView';
import { ProjectsView } from './components/views/ProjectsView';
import { ProjectDetailView } from './components/views/ProjectDetailView';
import { PromptsView } from './components/views/PromptsView';
import { BoilerplatesView } from './components/views/BoilerplatesView';
import { MCPsView } from './components/views/MCPsView';
import { BrainView } from './components/views/BrainView';
import { ClientsView } from './components/views/ClientsView';
import { SOPsView } from './components/views/SOPsView';
import { StackView } from './components/views/StackView';
import { ProposalsView } from './components/views/ProposalsView';
import { MarketplaceView } from './components/views/MarketplaceView';
import { SellerDashboardView } from './components/views/SellerDashboardView';
import { SellerStoreView } from './components/views/SellerStoreView';
import { MyPurchasesView } from './components/views/MyPurchasesView';
import { SubscriptionsView } from './components/views/SubscriptionsView';
import { CommunityView } from './components/views/CommunityView';
import { AdminConfigView } from './components/views/AdminConfigView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeView, currentUser, setActiveView, openModal } = useApp();

  if (!isAuthenticated) {
    return <AuthView />;
  }

  if (activeView === 'landing') {
    return (
      <div className="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans">
        <LandingPageView />
        <AllModals />
        <Toast />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'projetos':
        return <ProjectsView />;
      case 'projeto_detalhe':
        return <ProjectDetailView />;
      case 'prompts':
        return <PromptsView />;
      case 'boilerplates':
        return <BoilerplatesView />;
      case 'mcps':
        return <MCPsView />;
      case 'cerebro':
        return <BrainView />;
      case 'clientes':
        return <ClientsView />;
      case 'sops':
        return <SOPsView />;
      case 'stack':
        return <StackView />;
      case 'propostas':
        return <ProposalsView />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'vender_dashboard':
        return <SellerDashboardView />;
      case 'loja_vendedor':
        return <SellerStoreView />;
      case 'minhas_compras':
        return <MyPurchasesView />;
      case 'assinaturas':
        return <SubscriptionsView />;
      case 'comunidade':
        return <CommunityView />;
      case 'admin_config':
      case 'admin_configuracoes':
        return <AdminConfigView />;
      case 'prompt_detalhe':
        return <PromptsView />;
      case 'vender':
        return <SellerDashboardView />;
      case 'configuracoes':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const getRoleBanner = () => {
    switch (currentUser.role) {
      case 'seller':
        return {
          title: 'Modo Vendedor (Creator Hub)',
          desc: 'Visão otimizada para monetização de prompts, boilerplates e serviços com repasses Stripe Connect.',
          badge: 'SELLER',
          color: 'border-[#C2410C]/40 bg-[#C2410C]/10 text-[#EA580C]',
          actionText: '+ Nova Listagem',
          onAction: () => openModal('add_listing'),
        };
      case 'buyer':
        return {
          title: 'Modo Comprador (Marketplace Explorer)',
          desc: 'Navegue pelos produtos digitais da comunidade, acesse sua biblioteca de compras e participe do fórum.',
          badge: 'BUYER',
          color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
          actionText: 'Explorar Vitrine',
          onAction: () => setActiveView('marketplace'),
        };
      case 'admin':
        return {
          title: 'Modo Administrador (Governança & Seção 29)',
          desc: 'Acesso às configurações dinâmicas de taxas de comissão (A, B, C, D), planos, licenças e triagem KYC.',
          badge: 'ADMIN',
          color: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
          actionText: 'Painel Seção 29',
          onAction: () => setActiveView('admin_configuracoes'),
        };
      default:
        return null;
    }
  };

  const roleBanner = getRoleBanner();

  return (
    <div className="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex overflow-x-hidden font-sans">
      {/* Subtle interactive particle canvas */}
      <ParticleCanvas />

      {/* Navigation Sidebar (domain-aware) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Header with domain breadcrumbs, search and profile */}
        <Header />

        {/* Role Context Bar if not standard owner */}
        {roleBanner && (
          <div className={`mx-4 lg:mx-8 mt-3 px-4 py-2 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150 ${roleBanner.color}`}>
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono px-1.5 py-0.5 rounded bg-black/30 text-[10px]">
                {roleBanner.badge}
              </span>
              <span className="font-semibold">{roleBanner.title}:</span>
              <span className="opacity-90 hidden sm:inline">{roleBanner.desc}</span>
            </div>
            <button
              onClick={roleBanner.onAction}
              className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 font-semibold text-[11px] transition-all cursor-pointer"
            >
              {roleBanner.actionText} →
            </button>
          </div>
        )}

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <AllModals />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

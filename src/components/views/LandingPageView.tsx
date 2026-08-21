import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Terminal,
  Layers,
  Cpu,
  Brain,
  ShoppingBag,
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  DollarSign,
  Code2,
  Sparkles,
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { setActiveView, setPortalDomain, theme, toggleTheme, isAuthenticated } = useApp();

  const handleEnterApp = (view: any = 'dashboard') => {
    setActiveView(view);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0B0B0D] text-[#F3EEFB]' : 'bg-[#FFFFFF] text-[#111827]'} font-sans transition-colors duration-200`}>
      {/* Top Banner */}
      <div className="bg-[#6B21A8] text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Vyroh Central Hub — O Backstage do Desenvolvedor Solo & Plataforma de Ativos de IA</span>
        <button
          onClick={() => handleEnterApp('cerebro')}
          className="underline font-bold hover:text-orange-200 ml-1 cursor-pointer"
        >
          Experimentar o Cérebro IA →
        </button>
      </div>

      {/* Navigation Bar */}
      <header className={`sticky top-0 z-40 w-full ${isDark ? 'bg-[#0B0B0D]/90 border-[#2D2338]' : 'bg-white/90 border-gray-200'} backdrop-blur-md border-b px-6 lg:px-12 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 100 110" aria-hidden="true">
              <line x1="20" y1="14" x2="50" y2="92" stroke="#6B21A8" strokeWidth="15" strokeLinecap="round" />
              <line x1="80" y1="14" x2="50" y2="92" stroke="#C2410C" strokeWidth="15" strokeLinecap="round" />
              <circle cx="50" cy="92" r="7" fill={isDark ? '#FFFFFF' : '#111827'} />
            </svg>
            <span className="text-xl font-bold tracking-tight">vyroh</span>
          </div>
          <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-mono font-medium ${isDark ? 'bg-[#1A1620] text-[#A79BC4] border border-[#2D2338]' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
            Hub v2.4
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <a href="#recursos" className="hover:text-[#C084FC] transition-colors">Recursos do Cofre</a>
          <a href="#cerebro" className="hover:text-[#C084FC] transition-colors">O Cérebro IA</a>
          <a href="#marketplace" className="hover:text-[#C084FC] transition-colors">Marketplace</a>
          <a href="#arquitetura" className="hover:text-[#C084FC] transition-colors">Stack & MCP</a>
          <a href="#precos" className="hover:text-[#C084FC] transition-colors">Planos</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleEnterApp('marketplace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${isDark ? 'border-[#C2410C]/40 text-[#EA580C] hover:bg-[#C2410C]/10' : 'border-orange-300 text-orange-700 hover:bg-orange-50'} transition-all cursor-pointer hidden sm:flex items-center gap-1.5`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Ver Vitrine</span>
          </button>

          <button
            onClick={() => handleEnterApp('dashboard')}
            className="bg-[#6B21A8] hover:bg-[#7E22CE] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md flex items-center gap-1.5"
          >
            <span>{isAuthenticated ? 'Abrir meu Cofre' : 'Acessar Plataforma'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-6 animate-in fade-in duration-300">
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span>Para o profissional que é uma empresa de um dono só</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mb-6">
          O cofre central que{' '}
          <span className="bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#EA580C] bg-clip-text text-transparent">
            guarda, pensa e monetiza
          </span>{' '}
          tudo o que você constrói.
        </h1>

        <p className={`text-base sm:text-lg ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} max-w-2xl leading-relaxed mb-8`}>
          Boilerplates, repositórios, prompts versionados, clientes, SOPs e servidores MCP unificados em torno de Projetos. Conectado ao Claude Code e pronto para vender no Marketplace.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <button
            onClick={() => {
              setPortalDomain('vault');
              setActiveView('dashboard');
            }}
            className="bg-[#6B21A8] hover:bg-[#7E22CE] text-white px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all shadow-lg hover:shadow-purple-900/30 flex items-center gap-2"
          >
            <span>Entrar no Cofre Solo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setPortalDomain('marketplace');
              setActiveView('marketplace');
            }}
            className={`px-6 py-3 rounded-xl text-sm font-semibold border ${isDark ? 'border-[#C2410C] text-[#EA580C] hover:bg-[#C2410C]/10' : 'border-orange-500 text-orange-600 hover:bg-orange-50'} transition-all cursor-pointer flex items-center gap-2`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explorar Marketplace</span>
          </button>
        </div>

        {/* Live Terminal & App Preview Mockup */}
        <div className={`w-full max-w-4xl rounded-2xl overflow-hidden border ${isDark ? 'border-[#2D2338] bg-[#121014] shadow-2xl' : 'border-gray-200 bg-gray-900 text-white shadow-xl'} text-left`}>
          {/* Mock Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0B0B0D] border-b border-[#2D2338]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="font-mono text-xs text-gray-400 flex items-center gap-2">
              <span>vyroh-hub --mcp-bridge: connected</span>
            </div>
            <div className="text-xs text-purple-400 font-mono">stdio: ready</div>
          </div>

          {/* Code & Vault Stats Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#0B0B0D] border border-[#2D2338] space-y-1.5">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4" />
                <span>Projetos como Hub</span>
              </div>
              <div className="text-gray-400 text-[11px]">Relações N:N com prompts, repositórios e fichas de clientes.</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0B0D] border border-[#2D2338] space-y-1.5">
              <div className="text-orange-400 font-bold flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                <span>O Cérebro IA</span>
              </div>
              <div className="text-gray-400 text-[11px]">Gera roadmaps passo a passo e detecta profissionais necessários.</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0B0D] border border-[#2D2338] space-y-1.5">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Stripe Connect</span>
              </div>
              <div className="text-gray-400 text-[11px]">4 fluxos de pagamento (Assinaturas, Produtos avulsos, Serviços).</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Portais Separados (Destaque Arquitetural) */}
      <section id="recursos" className={`py-16 px-6 lg:px-12 border-t ${isDark ? 'border-[#2D2338] bg-[#0F0D11]' : 'border-gray-100 bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Quatro Ambientes Dedicados. Zero Confusão.
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Cada contexto profissional possui navegação, regras e rotas 100% segregadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Portal 1: Cofre Solo */}
            <div
              onClick={() => {
                setPortalDomain('vault');
                setActiveView('dashboard');
              }}
              className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121014] border-[#6B21A8]/40 hover:border-[#6B21A8]' : 'bg-white border-purple-200 hover:border-purple-400'} shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#6B21A8]/20 border border-[#6B21A8]/40 flex items-center justify-center text-[#C084FC] mb-4 group-hover:scale-110 transition-transform">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Cofre Solo</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Dashboard, Projetos (Tabela/Kanban), Prompts versionados, Repositórios Boilerplate, Clientes CRM, SOPs operacionais e Servidores MCP.
                </p>
              </div>
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Acessar Cofre →
              </span>
            </div>

            {/* Portal 2: O Cérebro IA */}
            <div
              onClick={() => {
                setPortalDomain('vault');
                setActiveView('cerebro');
              }}
              className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121014] border-purple-500/40 hover:border-purple-400' : 'bg-white border-purple-200 hover:border-purple-400'} shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. O Cérebro IA</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Descreva qualquer objetivo de produto. O Cérebro cruza seus ativos existentes, desenha o roadmap de execução e indica se precisa de um especialista.
                </p>
              </div>
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Abrir Cérebro →
              </span>
            </div>

            {/* Portal 3: Marketplace & Creator Hub */}
            <div
              onClick={() => {
                setPortalDomain('marketplace');
                setActiveView('marketplace');
              }}
              className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121014] border-[#C2410C]/40 hover:border-[#C2410C]' : 'bg-white border-orange-200 hover:border-orange-400'} shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#C2410C]/20 border border-[#C2410C]/40 flex items-center justify-center text-[#EA580C] mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Marketplace</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Vitrine pública de produtos digitais, templates, prompts e assinaturas de criadores com checkout imediato e biblioteca permanente.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#EA580C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Ver Marketplace →
              </span>
            </div>

            {/* Portal 4: Seller Studio & Governança */}
            <div
              onClick={() => {
                setPortalDomain('seller');
                setActiveView('vender_dashboard');
              }}
              className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121014] border-emerald-500/40 hover:border-emerald-400' : 'bg-white border-emerald-200 hover:border-emerald-400'} shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">4. Seller Studio</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Transforme itens do seu cofre em produtos à venda em 1 clique. Conexão Stripe Connect Express para repasses diretos na sua conta.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Painel do Vendedor →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 29: Governança Dinâmica */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className={`p-8 sm:p-10 rounded-3xl border ${isDark ? 'bg-[#121014] border-[#2D2338]' : 'bg-purple-900 text-white'} flex flex-col md:flex-row items-center justify-between gap-8`}>
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sliders className="w-3.5 h-3.5" />
              <span>Governança Seção 29</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Regras de negócio como dados. Zero redeploys.
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-purple-100'}`}>
              Comissões dos 4 fluxos (A, B, C, D), preços de planos, limites de quotas de IA e exigências de KYC configuradas em tempo real pelo Admin.
            </p>
          </div>

          <button
            onClick={() => {
              setPortalDomain('admin');
              setActiveView('admin_configuracoes');
            }}
            className="bg-white text-purple-950 hover:bg-gray-100 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-lg transition-all"
          >
            Abrir Painel Admin →
          </button>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="precos" className={`py-16 px-6 lg:px-12 border-t ${isDark ? 'border-[#2D2338] bg-[#0B0B0D]' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Planos Claros e Sem Amarras</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-12`}>
            Comece gratuitamente no cofre solo e faça upgrade conforme seu volume de ativos crescer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Free */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121014] border-[#2D2338]' : 'bg-gray-50 border-gray-200'} flex flex-col justify-between`}>
              <div>
                <h4 className="font-bold text-lg mb-1">Free Solo</h4>
                <div className="text-2xl font-extrabold mb-4">R$ 0 <span className="text-xs font-normal text-gray-500">/mês</span></div>
                <p className="text-xs text-gray-400 mb-6">Ideal para organizar seus primeiros 10 projetos e prompts.</p>
                <ul className="space-y-2.5 text-xs text-gray-300 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Até 10 itens no cofre</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10 consultas de IA /mês</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compra no Marketplace</li>
                </ul>
              </div>
              <button
                onClick={() => handleEnterApp('dashboard')}
                className={`w-full py-2.5 rounded-xl border ${isDark ? 'border-[#2D2338] hover:bg-[#1A1620]' : 'border-gray-300 hover:bg-gray-100'} text-xs font-semibold cursor-pointer transition-all text-center`}
              >
                Começar Grátis
              </button>
            </div>

            {/* Pro Solo */}
            <div className={`p-6 rounded-2xl border-2 border-[#6B21A8] ${isDark ? 'bg-[#16121D]' : 'bg-purple-50/50'} relative flex flex-col justify-between shadow-xl`}>
              <div className="absolute -top-3 right-6 bg-[#6B21A8] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Mais Popular
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-purple-400">Pro Solo</h4>
                <div className="text-2xl font-extrabold mb-4">R$ 49 <span className="text-xs font-normal text-gray-400">/mês</span></div>
                <p className="text-xs text-gray-400 mb-6">Para o desenvolvedor que precisa de capacidade ilimitada e MCP.</p>
                <ul className="space-y-2.5 text-xs text-gray-300 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Itens ilimitados no cofre</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> 200 consultas de IA /mês</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Servidor MCP stdio / sse</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Exportação de Backup JSON</li>
                </ul>
              </div>
              <button
                onClick={() => handleEnterApp('dashboard')}
                className="w-full py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#7E22CE] text-white text-xs font-semibold cursor-pointer transition-all shadow-md text-center"
              >
                Assinar Pro Solo
              </button>
            </div>

            {/* Creator Studio */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121014] border-[#C2410C]/50' : 'bg-orange-50/40 border-orange-200'} flex flex-col justify-between`}>
              <div>
                <h4 className="font-bold text-lg mb-1 text-[#EA580C]">Creator Studio</h4>
                <div className="text-2xl font-extrabold mb-4">R$ 99 <span className="text-xs font-normal text-gray-400">/mês</span></div>
                <p className="text-xs text-gray-400 mb-6">Monetize seus boilerplates e cobre assinaturas de criador.</p>
                <ul className="space-y-2.5 text-xs text-gray-300 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#EA580C]" /> Vender no Marketplace</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#EA580C]" /> Repasses Stripe Connect</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#EA580C]" /> Loja Pública Personalizada</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#EA580C]" /> IA Sem Limites</li>
                </ul>
              </div>
              <button
                onClick={() => handleEnterApp('vender_dashboard')}
                className="w-full py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#EA580C] text-white text-xs font-semibold cursor-pointer transition-all shadow-md text-center"
              >
                Virar Criador
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 lg:px-12 border-t ${isDark ? 'border-[#2D2338] bg-[#050506]' : 'border-gray-200 bg-gray-100'} text-xs`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 100 110" aria-hidden="true">
              <line x1="20" y1="14" x2="50" y2="92" stroke="#6B21A8" strokeWidth="15" strokeLinecap="round" />
              <line x1="80" y1="14" x2="50" y2="92" stroke="#C2410C" strokeWidth="15" strokeLinecap="round" />
              <circle cx="50" cy="92" r="7" fill={isDark ? '#FFFFFF' : '#111827'} />
            </svg>
            <span className="font-bold text-sm">vyroh hub</span>
            <span className="text-gray-500">© 2026 Vyroh Systems Inc.</span>
          </div>

          <div className="flex items-center gap-6 text-gray-500">
            <button onClick={() => handleEnterApp('dashboard')} className="hover:text-purple-400 cursor-pointer">Cofre</button>
            <button onClick={() => handleEnterApp('marketplace')} className="hover:text-orange-400 cursor-pointer">Marketplace</button>
            <button onClick={() => handleEnterApp('cerebro')} className="hover:text-purple-400 cursor-pointer">Cérebro IA</button>
            <button onClick={() => handleEnterApp('admin_configuracoes')} className="hover:text-purple-400 cursor-pointer">Admin (Seção 29)</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

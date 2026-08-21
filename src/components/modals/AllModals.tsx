import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Terminal,
  Layers,
  Users,
  CheckSquare,
  CreditCard,
  ShoppingBag,
  FolderKanban,
  DollarSign,
  ShieldCheck,
  Sparkles,
  CreditCard as CardIcon,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import { MonetizationFlow, LicenseType } from '../../types';

export const AllModals: React.FC = () => {
  const {
    activeModal,
    closeModal,
    addProject,
    addPrompt,
    addBoilerplate,
    addClient,
    addSOP,
    addSubscription,
    addListing,
    checkout,
    selectedListingForCheckout,
    showToast,
    clients,
    prompts,
    boilerplates,
    setActiveView,
    setSelectedProjectId,
  } = useApp();

  // Project state
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projBudget, setProjBudget] = useState('');
  const [projDeadline, setProjDeadline] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projTags, setProjTags] = useState('Next.js, Postgres');

  // Prompt state
  const [promptTitle, setPromptTitle] = useState('');
  const [promptDesc, setPromptDesc] = useState('');
  const [promptCategory, setPromptCategory] = useState('arquitetura');
  const [promptContent, setPromptContent] = useState('');
  const [promptTags, setPromptTags] = useState('ia, agente');

  // Boilerplate state
  const [bpName, setBpName] = useState('');
  const [bpDesc, setBpDesc] = useState('');
  const [bpRepo, setBpRepo] = useState('https://github.com/developer/repo');
  const [bpClone, setBpClone] = useState('git clone https://github.com/developer/repo.git');
  const [bpStack, setBpStack] = useState('Next.js 15, PostgreSQL, Tailwind');

  // Client state
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // SOP state
  const [sopTitle, setSopTitle] = useState('');
  const [sopDesc, setSopDesc] = useState('');
  const [sopCategory, setSopCategory] = useState('deploy');
  const [sopMin, setSopMin] = useState('15');

  // Subscription state
  const [subName, setSubName] = useState('');
  const [subCost, setSubCost] = useState('20');
  const [subCycle, setSubCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subCurrency, setSubCurrency] = useState<'USD' | 'BRL'>('USD');
  const [subCat, setSubCat] = useState('AI & Models');

  // Listing state
  const [listTitle, setListTitle] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [listPrice, setListPrice] = useState('149');
  const [listFlow, setListFlow] = useState<MonetizationFlow>('flow_c_template');
  const [listCategory, setListCategory] = useState('boilerplates');
  const [listLicense, setListLicense] = useState<LicenseType>('commercial_solo');

  // Checkout flow state
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!activeModal) return null;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const newProj = addProject({
      name: projName.trim(),
      description: projDesc.trim(),
      status: 'active',
      tags: projTags.split(',').map((t) => t.trim()).filter(Boolean),
      budget: projBudget ? Number(projBudget) : undefined,
      deadline: projDeadline || undefined,
      clientName: projClient || undefined,
      promptIds: [],
      boilerplateIds: [],
    });

    closeModal();
    setSelectedProjectId(newProj.id);
    setActiveView('projeto_detalhe');
    showToast('Projeto criado com sucesso!');
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle.trim() || !promptContent.trim()) return;

    addPrompt({
      title: promptTitle.trim(),
      description: promptDesc.trim(),
      category: promptCategory,
      content: promptContent.trim(),
      variables: ['cliente', 'contexto'],
      tags: promptTags.split(',').map((t) => t.trim()).filter(Boolean),
      visibility: 'private',
    });

    closeModal();
    setActiveView('prompts');
    showToast('Prompt versionado e guardado no cofre!');
  };

  const handleCreateBoilerplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bpName.trim()) return;

    addBoilerplate({
      name: bpName.trim(),
      description: bpDesc.trim(),
      repoUrl: bpRepo.trim(),
      cloneCommand: bpClone.trim(),
      stack: bpStack.split(',').map((t) => t.trim()).filter(Boolean),
      visibility: 'private',
    });

    closeModal();
    setActiveView('boilerplates');
    showToast('Repositório indexado no cofre!');
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    addClient({
      name: clientName.trim(),
      company: clientCompany.trim(),
      email: clientEmail.trim(),
      phone: clientPhone.trim(),
      status: 'active',
      totalRevenue: 0,
      projectIds: [],
      notes: 'Cadastrado no CRM do Vyroh.',
    });

    closeModal();
    setActiveView('clientes');
    showToast('Cliente cadastrado com sucesso!');
  };

  const handleCreateSOP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sopTitle.trim()) return;

    addSOP({
      title: sopTitle.trim(),
      description: sopDesc.trim(),
      category: sopCategory,
      estimatedMinutes: Number(sopMin) || 15,
      steps: [
        { id: '1', title: 'Preparação do ambiente', completed: false, instructions: 'Conferir credenciais.' },
        { id: '2', title: 'Execução do deploy', completed: false, instructions: 'Rodar scripts de migração.' },
      ],
      tags: ['operacional'],
    });

    closeModal();
    setActiveView('sops');
    showToast('Playbook SOP criado!');
  };

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    addSubscription({
      name: subName.trim(),
      cost: Number(subCost) || 20,
      billingCycle: subCycle,
      currency: subCurrency,
      category: subCat,
      renewalDate: '2026-04-15',
      status: 'active',
    });

    closeModal();
    setActiveView('stack');
    showToast('Serviço adicionado ao monitor de custos!');
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listTitle.trim()) return;

    addListing({
      title: listTitle.trim(),
      description: listDesc.trim(),
      priceCents: (Number(listPrice) || 99) * 100,
      monetizationFlow: listFlow,
      category: listCategory,
      licenseType: listLicense,
      tags: ['starter', 'prod-ready'],
      assetType: 'boilerplate',
      repoAccessUrl: 'https://github.com/developer/private-repo',
    });

    closeModal();
    setActiveView('marketplace');
    showToast('Anúncio publicado no Marketplace Vyroh!');
  };

  const handleExecuteCheckout = () => {
    if (!selectedListingForCheckout) return;
    setIsProcessingCheckout(true);

    setTimeout(() => {
      checkout(selectedListingForCheckout.id, paymentMethod);
      setIsProcessingCheckout(false);
      setCheckoutSuccess(true);
      showToast('Pagamento confirmado e acesso liberado!');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg bg-[#0F0D11] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between bg-[#121014]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[var(--text-primary)]">
              {activeModal === 'add_project' && 'Novo Projeto Central'}
              {activeModal === 'add_prompt' && 'Guardar & Versionar Prompt'}
              {activeModal === 'add_boilerplate' && 'Indexar Repositório Boilerplate'}
              {activeModal === 'add_client' && 'Cadastrar Cliente no CRM'}
              {activeModal === 'add_sop' && 'Criar Playbook SOP'}
              {activeModal === 'add_subscription' && 'Cadastrar Assinatura SaaS'}
              {activeModal === 'add_listing' && 'Publicar Ativo no Marketplace'}
              {activeModal === 'checkout' && 'Checkout Seguro Stripe Connect'}
              {activeModal === 'add_anything' && 'O que você quer registrar no cofre?'}
            </span>
          </div>

          <button
            onClick={() => {
              setCheckoutSuccess(false);
              closeModal();
            }}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[#1A1620] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {/* ADD ANYTHING QUICK PICKER */}
          {activeModal === 'add_anything' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  closeModal();
                  setActiveView('projetos');
                  setTimeout(() => handleCreateProject as any, 100);
                }}
                className="p-4 rounded-xl bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer space-y-1"
              >
                <FolderKanban className="w-5 h-5 text-[var(--accent-bright)]" />
                <div className="font-semibold text-[var(--text-primary)]">Novo Projeto</div>
                <div className="text-[10px] text-[var(--text-muted)]">Eixo central de ativos</div>
              </button>

              <button
                onClick={() => {
                  closeModal();
                  setActiveView('prompts');
                }}
                className="p-4 rounded-xl bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer space-y-1"
              >
                <Terminal className="w-5 h-5 text-[#8B35D6]" />
                <div className="font-semibold text-[var(--text-primary)]">Salvar Prompt</div>
                <div className="text-[10px] text-[var(--text-muted)]">Com versionamento</div>
              </button>

              <button
                onClick={() => {
                  closeModal();
                  setActiveView('boilerplates');
                }}
                className="p-4 rounded-xl bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer space-y-1"
              >
                <Layers className="w-5 h-5 text-[#C2410C]" />
                <div className="font-semibold text-[var(--text-primary)]">Indexar Repo</div>
                <div className="text-[10px] text-[var(--text-muted)]">GitHub & Comandos</div>
              </button>

              <button
                onClick={() => {
                  closeModal();
                  setActiveView('marketplace');
                }}
                className="p-4 rounded-xl bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-left cursor-pointer space-y-1"
              >
                <ShoppingBag className="w-5 h-5 text-[#EA580C]" />
                <div className="font-semibold text-[var(--text-primary)]">Vender no Marketplace</div>
                <div className="text-[10px] text-[var(--text-muted)]">Monetizar ativos</div>
              </button>
            </div>
          )}

          {/* ADD PROJECT FORM */}
          {activeModal === 'add_project' && (
            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Nome do Projeto *</label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="Ex: SaaS de Gestão Jurídica"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Descrição / Escopo</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  rows={2}
                  placeholder="Ex: Sistema com banco PostgreSQL, agentes Gemini e frontend em Next.js..."
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">Orçamento (R$)</label>
                  <input
                    type="number"
                    value={projBudget}
                    onChange={(e) => setProjBudget(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">Prazo Estimado</label>
                  <input
                    type="text"
                    value={projDeadline}
                    onChange={(e) => setProjDeadline(e.target.value)}
                    placeholder="4 semanas"
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          )}

          {/* ADD PROMPT FORM */}
          {activeModal === 'add_prompt' && (
            <form onSubmit={handleCreatePrompt} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Título do Prompt *</label>
                <input
                  type="text"
                  required
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="Ex: Arquiteto de Banco de Dados Postgres"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Categoria</label>
                <select
                  value={promptCategory}
                  onChange={(e) => setPromptCategory(e.target.value)}
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                >
                  <option value="arquitetura">Arquitetura</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="vendas">Vendas / Copy</option>
                  <option value="gestao">Gestão</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Instrução / Conteúdo do Prompt *</label>
                <textarea
                  required
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  rows={5}
                  placeholder="Você é um especialista em PostgreSQL... Use variáveis no formato {{variavel}}"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] font-mono focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Salvar no Cofre
                </button>
              </div>
            </form>
          )}

          {/* ADD BOILERPLATE FORM */}
          {activeModal === 'add_boilerplate' && (
            <form onSubmit={handleCreateBoilerplate} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#1A1620] border border-[#6B21A8]/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Importação Inteligente do GitHub via API</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!bpRepo || !bpRepo.includes('github.com')) {
                      showToast('Digite uma URL válida do GitHub no campo abaixo.');
                      return;
                    }
                    try {
                      showToast('Consultando metadados do repositório...');
                      const res = await fetch('/api/github/import-repo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ repoUrl: bpRepo, customName: bpName }),
                      });
                      const data = await res.json();
                      if (data.success && data.metadata) {
                        setBpName(data.metadata.name || bpName);
                        setBpDesc(data.metadata.description || bpDesc);
                        setBpClone(data.metadata.cloneCommand || bpClone);
                        if (data.metadata.stack && data.metadata.stack.length > 0) {
                          setBpStack(data.metadata.stack.join(', '));
                        }
                        showToast('Metadados e stack sincronizados com sucesso!');
                      }
                    } catch (err) {
                      showToast('Repositório analisado com sucesso.');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#6B21A8] hover:bg-[#8B35D6] text-white font-semibold text-[11px] cursor-pointer transition-all shrink-0"
                >
                  ⚡ Auto-Detectar
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">URL do Repositório *</label>
                <input
                  type="url"
                  required
                  value={bpRepo}
                  onChange={(e) => {
                    setBpRepo(e.target.value);
                    setBpClone(`git clone ${e.target.value.replace(/\/$/, '')}.git`);
                  }}
                  placeholder="https://github.com/usuario/meu-boilerplate"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Nome do Repositório / Boilerplate *</label>
                <input
                  type="text"
                  required
                  value={bpName}
                  onChange={(e) => setBpName(e.target.value)}
                  placeholder="Ex: Next.js 15 + Supabase Starter"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Comando de Clone</label>
                <input
                  type="text"
                  value={bpClone}
                  onChange={(e) => setBpClone(e.target.value)}
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Stack Tecnológica (separada por vírgula)</label>
                <input
                  type="text"
                  value={bpStack}
                  onChange={(e) => setBpStack(e.target.value)}
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Indexar no Cofre
                </button>
              </div>
            </form>
          )}

          {/* ADD CLIENT FORM */}
          {activeModal === 'add_client' && (
            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Nome do Contato *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Carlos Mendes"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Empresa</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Ex: Nexus Log Tech"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">E-mail</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="carlos@nexus.com"
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          )}

          {/* ADD SOP FORM */}
          {activeModal === 'add_sop' && (
            <form onSubmit={handleCreateSOP} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Título do SOP / Procedimento *</label>
                <input
                  type="text"
                  required
                  value={sopTitle}
                  onChange={(e) => setSopTitle(e.target.value)}
                  placeholder="Ex: Checklist de Deploy em Produção"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Descrição</label>
                <textarea
                  value={sopDesc}
                  onChange={(e) => setSopDesc(e.target.value)}
                  rows={2}
                  placeholder="Passo a passo com testes de fumaça..."
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Criar SOP
                </button>
              </div>
            </form>
          )}

          {/* ADD SUBSCRIPTION FORM */}
          {activeModal === 'add_subscription' && (
            <form onSubmit={handleCreateSubscription} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Nome do Serviço SaaS *</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Ex: Supabase Pro"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">Valor</label>
                  <input
                    type="number"
                    value={subCost}
                    onChange={(e) => setSubCost(e.target.value)}
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] font-mono focus:border-[var(--accent-bright)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">Moeda</label>
                  <select
                    value={subCurrency}
                    onChange={(e) => setSubCurrency(e.target.value as any)}
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                  >
                    <option value="USD">Dólar (USD)</option>
                    <option value="BRL">Real (BRL)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          )}

          {/* ADD LISTING FORM */}
          {activeModal === 'add_listing' && (
            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Título do Ativo para Venda *</label>
                <input
                  type="text"
                  required
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  placeholder="Ex: Starter Kit Next.js 15 + Stripe B2B"
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-muted)]">Descrição Comercial</label>
                <textarea
                  value={listDesc}
                  onChange={(e) => setListDesc(e.target.value)}
                  rows={2}
                  placeholder="Explique o que vem incluso e o tempo economizado..."
                  className="w-full bg-[#121014] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] font-mono focus:border-[var(--accent-bright)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-muted)]">Fluxo de Monetização</label>
                  <select
                    value={listFlow}
                    onChange={(e) => setListFlow(e.target.value as any)}
                    className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                  >
                    <option value="flow_a_asset">Fluxo A (Ativo Único)</option>
                    <option value="flow_b_bundle">Fluxo B (Bundle Pacote)</option>
                    <option value="flow_c_template">Fluxo C (Boilerplate)</option>
                    <option value="flow_d_subscription">Fluxo D (Assinatura)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-[var(--text-muted)] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#C2410C] hover:bg-[#EA580C] text-white px-5 py-2 rounded-lg font-semibold action-glow"
                >
                  Publicar Anúncio
                </button>
              </div>
            </form>
          )}

          {/* CHECKOUT MODAL */}
          {activeModal === 'checkout' && selectedListingForCheckout && (
            <div className="space-y-5 text-xs">
              {!checkoutSuccess ? (
                <>
                  {/* Item Summary */}
                  <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050506] text-[#EA580C]">
                          {selectedListingForCheckout.category.toUpperCase()}
                        </span>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mt-1">
                          {selectedListingForCheckout.title}
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Vendedor: {selectedListingForCheckout.sellerName}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400 font-mono">
                          R$ {(selectedListingForCheckout.priceCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-primary)]">
                      Selecione o Método de Pagamento:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'pix'
                            ? 'bg-[#C2410C]/20 border-[#C2410C] text-[#EA580C] font-semibold'
                            : 'bg-[#121014] border-[var(--border)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>PIX Instantâneo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-[#C2410C]/20 border-[#C2410C] text-[#EA580C] font-semibold'
                            : 'bg-[#121014] border-[var(--border)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <CardIcon className="w-4 h-4" />
                        <span>Cartão de Crédito</span>
                      </button>
                    </div>
                  </div>

                  {/* Stripe Connect Escrow Guarantee */}
                  <div className="p-3 rounded-xl bg-[#050506] border border-[var(--border)] space-y-1 text-[11px] text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Transação Protegida via Stripe Connect Escrow</span>
                    </div>
                    <p>
                      O valor fica protegido até você confirmar o recebimento do código e das chaves de acesso.
                    </p>
                  </div>

                  {/* Execute Button */}
                  <button
                    onClick={handleExecuteCheckout}
                    disabled={isProcessingCheckout}
                    className="w-full bg-[#C2410C] hover:bg-[#EA580C] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-95 shadow-lg action-glow flex items-center justify-center gap-2"
                  >
                    {isProcessingCheckout ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Processando no Stripe...</span>
                      </>
                    ) : (
                      <span>
                        Pagar R$ {(selectedListingForCheckout.priceCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                /* Success screen */
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      Pagamento Aprovado com Sucesso!
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      O ativo foi adicionado à sua biblioteca "Minhas Compras".
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#121014] border border-[var(--border)] font-mono text-xs text-[var(--accent-bright)] select-all">
                    LICENÇA: VYROH-PRO-{Math.random().toString(36).substring(2, 9).toUpperCase()}
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutSuccess(false);
                      closeModal();
                      setActiveView('minhas_compras');
                    }}
                    className="w-full bg-[#6B21A8] text-white py-2.5 rounded-xl font-semibold text-xs cursor-pointer"
                  >
                    Ir para Minhas Compras
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

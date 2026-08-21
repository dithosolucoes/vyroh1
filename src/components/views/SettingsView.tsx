import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  Cpu,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  Lock,
  Save,
  ShieldCheck,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    exportVaultBackup,
    importVaultBackup,
    showToast,
    projects,
    prompts,
    boilerplates,
  } = useApp();

  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'anthropic' | 'ollama'>('gemini');
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);

  const handleExportBackup = () => {
    const backupJson = exportVaultBackup();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(backupJson);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vyroh_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup completo do cofre exportado com sucesso!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        const content = event.target?.result as string;
        const ok = importVaultBackup(content);
        if (ok) {
          showToast('Cofre restaurado a partir do arquivo JSON!');
        } else {
          showToast('Erro ao importar arquivo de backup.');
        }
      };
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferências de conta salvas!');
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-[var(--border)] pb-4">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Configurações do Cofre & Provedor IA
        </h1>
        <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
          Gerencie sua conta, motor de inteligência artificial e portabilidade dos seus dados.
        </p>
      </div>

      {/* Profile Section */}
      <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border)] space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
          <User className="w-4 h-4 text-[var(--accent-bright)]" />
          <span>Perfil do Usuário</span>
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-muted)]">Nome Completo</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[var(--text-muted)]">E-mail Cadastrado</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Salvar Perfil
            </button>
          </div>
        </form>
      </div>

      {/* AI Provider Section */}
      <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border)] space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Cpu className="w-4 h-4 text-[#8B35D6]" />
            <span>Motor de Inteligência Artificial</span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Servidor Seguro /api/gemini
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[var(--text-muted)]">Provedor Principal</label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value as any)}
              className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
            >
              <option value="gemini">Google Gemini AI (Recomendado - 3.7 Flash)</option>
              <option value="openai">OpenAI (GPT-4o)</option>
              <option value="anthropic">Anthropic (Claude 3.7 Sonnet)</option>
              <option value="ollama">Ollama (Modelo Local Offline)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[var(--text-muted)]">Modelo Ativo</label>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none font-mono"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Ultra-Rápido & Baixo Custo)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (Raciocínio Profundo)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Sovereignty & Portability (Anti lock-in) */}
      <div className="p-6 rounded-2xl bg-[#0F0D11] border border-[var(--border)] space-y-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Soberania de Dados & Anti-Lock-in</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Seus prompts, boilerplates e notas pertencem a você. Exporte ou restaure todo o seu cofre em um único arquivo JSON padrão.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-3">
            <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Download className="w-4 h-4 text-[var(--accent-bright)]" />
              <span>Exportar Backup Completo</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Gera um JSON contendo {projects.length} projetos, {prompts.length} prompts e {boilerplates.length} boilerplates.
            </p>
            <button
              onClick={handleExportBackup}
              className="w-full bg-[#1A1620] hover:bg-[#6B21A8] text-white py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
            >
              Baixar Arquivo JSON
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#121014] border border-[var(--border)] space-y-3">
            <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Restaurar de Backup JSON</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Selecione um arquivo de backup previamente exportado pelo Vyroh.
            </p>
            <label className="block w-full text-center bg-[#1A1620] hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all">
              <span>Selecionar Arquivo</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface MCPServer {
  id: string;
  name: string;
  command: string;
  args: string[];
  status: 'connected' | 'idle' | 'error';
  toolsCount: number;
  description: string;
}

const initialMCPs: MCPServer[] = [
  {
    id: 'mcp_postgres',
    name: 'PostgreSQL Database MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres', 'postgresql://user:pass@localhost:5432/vyroh'],
    status: 'connected',
    toolsCount: 6,
    description: 'Permite que o Gemini inspecione schemas, execute queries seguras e otimize índices.',
  },
  {
    id: 'mcp_github',
    name: 'GitHub Repositories MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    status: 'connected',
    toolsCount: 12,
    description: 'Acesso a issues, pull requests, commits e sincronização de boilerplates.',
  },
  {
    id: 'mcp_filesystem',
    name: 'Filesystem Local MCP',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/developer/projects'],
    status: 'connected',
    toolsCount: 8,
    description: 'Leitura e escrita de arquivos de configuração em projetos locais.',
  },
];

export const MCPsView: React.FC = () => {
  const { showToast } = useApp();
  const [mcps, setMcps] = useState<MCPServer[]>(initialMCPs);
  const [testingId, setTestingId] = useState<string | null>(null);

  const testConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      showToast('Servidor MCP respondendo com baixa latência (12ms)!');
    }, 600);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              MCPs & Skills (Model Context Protocol)
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1620] text-[#8B35D6] border border-[#6B21A8]/30 font-mono">
              Tier 2
            </span>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-0.5">
            Conecte ferramentas, bancos e repositórios diretamente ao contexto do Gemini para automação profunda.
          </p>
        </div>

        <button
          onClick={() => showToast('Configurador de novo servidor MCP!')}
          className="bg-[#6B21A8] hover:bg-[#8B35D6] text-[#F3EEFB] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Servidor MCP</span>
        </button>
      </div>

      {/* Grid of MCPs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mcps.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] hover:border-[var(--accent)] transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{m.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conectado • {m.toolsCount} ferramentas ativas</span>
                  </div>
                </div>

                <Cpu className="w-5 h-5 text-[#8B35D6]" />
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {m.description}
              </p>

              {/* Command line preview */}
              <div className="p-2.5 rounded-lg bg-[#050506] border border-[var(--border)] font-mono text-[11px] text-[var(--text-muted)] space-y-1">
                <div className="text-[10px] text-[var(--accent-bright)] font-semibold">Comando de Execução:</div>
                <div className="truncate">{m.command} {m.args.join(' ')}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs">
              <button
                onClick={() => testConnection(m.id)}
                disabled={testingId === m.id}
                className="text-[var(--accent-bright)] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingId === m.id ? 'animate-spin' : ''}`} />
                <span>{testingId === m.id ? 'Pingando...' : 'Testar Conexão'}</span>
              </button>

              <span className="text-[10px] font-mono text-[var(--text-muted)]">ID: {m.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

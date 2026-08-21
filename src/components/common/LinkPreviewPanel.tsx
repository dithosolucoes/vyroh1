"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, RefreshCw, Star, GitFork, CircleDot, Radio, Link2, Image as ImageIcon } from "lucide-react";

interface GithubRepoData {
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  defaultBranch: string;
  pushedAt: string;
  htmlUrl: string;
  openIssues: number;
  license: string | null;
  readmeExcerpt: string | null;
}

interface CheckResult {
  mode: "embed" | "github" | "card";
  url: string;
  meta?: { title: string; description: string; image: string | null };
}

export const LinkPreviewPanel: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [repoData, setRepoData] = useState<GithubRepoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/preview/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((r) => r.json())
      .then(async (data: CheckResult & { error?: string }) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setCheck(data);

        if (data.mode === "github") {
          const repoRes = await fetch("/api/preview/github", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });
          const repoJson = await repoRes.json();
          if (!cancelled) {
            if (repoJson.error) setError(repoJson.error);
            else setRepoData(repoJson.repo);
          }
        }
        if (!cancelled) setLoading(false);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message || "Falha ao carregar prévia");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, reloadKey]);

  const modeBadge = () => {
    if (!check) return null;
    if (check.mode === "embed")
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Radio className="w-2.5 h-2.5" /> ao vivo
        </span>
      );
    if (check.mode === "github")
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#6B21A8]/15 text-[#C084FC] border border-[#6B21A8]/30">
          <Link2 className="w-2.5 h-2.5" /> via API
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1620] text-[var(--text-muted)] border border-[var(--border)]">
        <ImageIcon className="w-2.5 h-2.5" /> captura
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl h-full bg-[#0F0D11] border-l border-[var(--border-strong)] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Barra de chrome */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)] bg-[#121014]">
          <div className="flex items-center gap-2 min-w-0">
            {modeBadge()}
            <span className="text-xs text-[var(--text-secondary)] truncate font-mono">{url}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              title="Atualizar"
              className="p-1.5 rounded-lg hover:bg-[#1A1620] text-[var(--text-muted)] hover:text-white cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir em nova aba"
              className="p-1.5 rounded-lg hover:bg-[#1A1620] text-[var(--text-muted)] hover:text-white cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              title="Fechar"
              className="p-1.5 rounded-lg hover:bg-[#1A1620] text-[var(--text-muted)] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)] font-mono">
              Verificando se o link permite pré-visualização...
            </div>
          )}

          {!loading && error && (
            <div className="p-6 text-center space-y-3">
              <p className="text-xs text-[var(--text-secondary)]">{error}</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#8B35D6] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir em nova aba
              </a>
            </div>
          )}

          {!loading && !error && check?.mode === "embed" && (
            <iframe
              key={reloadKey}
              src={url}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="Preview ao vivo"
            />
          )}

          {!loading && !error && check?.mode === "github" && repoData && (
            <div className="p-5 space-y-4 text-sm">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{repoData.fullName}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{repoData.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#121014] border border-[var(--border)]">
                  <Star className="w-3 h-3 text-amber-400" /> {repoData.stars.toLocaleString("pt-BR")}
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#121014] border border-[var(--border)]">
                  <GitFork className="w-3 h-3" /> {repoData.forks.toLocaleString("pt-BR")}
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#121014] border border-[var(--border)]">
                  <CircleDot className="w-3 h-3" /> {repoData.openIssues} issues
                </span>
                {repoData.language && (
                  <span className="px-2 py-1 rounded bg-[#121014] border border-[var(--border)]">{repoData.language}</span>
                )}
                {repoData.license && (
                  <span className="px-2 py-1 rounded bg-[#121014] border border-[var(--border)]">{repoData.license}</span>
                )}
              </div>

              {repoData.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {repoData.topics.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#6B21A8]/15 text-[#C084FC] border border-[#6B21A8]/25">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {repoData.readmeExcerpt && (
                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">README (prévia)</div>
                  <pre className="whitespace-pre-wrap text-[11px] text-[var(--text-secondary)] leading-relaxed font-mono max-h-96 overflow-y-auto">
                    {repoData.readmeExcerpt}
                  </pre>
                </div>
              )}
            </div>
          )}

          {!loading && !error && check?.mode === "card" && check.meta && (
            <div className="p-6 space-y-4">
              {check.meta.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={check.meta.image} alt="" className="w-full rounded-xl border border-[var(--border)]" />
              )}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{check.meta.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{check.meta.description}</p>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Este site não permite ser exibido dentro de outro sistema (proteção de segurança do próprio site). Use "Abrir em nova aba" pra interagir com ele.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

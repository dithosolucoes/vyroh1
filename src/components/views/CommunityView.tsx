import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquareCode,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  Sparkles,
  Tag,
  CheckCircle2,
  Send,
  User,
} from 'lucide-react';
export const CommunityView: React.FC = () => {
  const { communityTopics, createCommunityTopic, upvoteTopic, addTopicReply, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('Next.js, Postgres');
  const [isPosting, setIsPosting] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const filtered = communityTopics.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    await createCommunityTopic({
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      category: 'dev',
      tags: newPostTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
    showToast('Tópico publicado na comunidade Vyroh!');
  };

  const handleSendReply = (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    addTopicReply(postId, text.trim());
    setReplyTextMap({ ...replyTextMap, [postId]: '' });
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#140D1D] via-[#0F0D11] to-[#120F16] border border-[var(--border-strong)] space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#6B21A8]/20 text-[#A79BC4] border border-[#6B21A8]/30">
            COMUNIDADE TÉCNICA
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">Fase 4a • Fórum & Auto-Match IA</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
              <MessageSquareCode className="w-7 h-7 text-[var(--accent-bright)]" />
              <span>Fórum de Desenvolvedores Solo</span>
            </h1>
            <p className="text-xs lg:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
              Tire dúvidas de arquitetura, compartilhe prompts testados e receba sugestões instantâneas do motor de Auto-Match IA.
            </p>
          </div>

          <button
            onClick={() => setIsPosting(!isPosting)}
            className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isPosting ? 'Cancelar' : 'Novo Tópico'}</span>
          </button>
        </div>
      </div>

      {/* New Post Form Drawer */}
      {isPosting && (
        <form
          onSubmit={handleCreatePost}
          className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--accent)]/50 space-y-4 shadow-2xl animate-in fade-in duration-200"
        >
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Publicar Novo Tópico ou Dúvida</h2>

          <div className="space-y-1">
            <label className="text-xs text-[var(--text-muted)]">Título do Tópico</label>
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Ex: Como estruturar isolamento de schema PostgreSQL multi-tenant no Drizzle?"
              className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[var(--text-muted)]">Conteúdo / Detalhes do Problema</label>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
              placeholder="Descreva o cenário técnico, código ou prompt relevante..."
              className="w-full bg-[#121014] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[var(--text-muted)]">Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={newPostTags}
              onChange={(e) => setNewPostTags(e.target.value)}
              placeholder="Next.js, Postgres, Docker..."
              className="w-full bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#6B21A8] text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Publicar no Fórum
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0F0D11] p-3 rounded-xl border border-[var(--border)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar discussões, soluções de arquitetura..."
            className="w-full bg-[#121014] text-xs text-[var(--text-primary)] pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] focus:border-[var(--accent-bright)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['all', 'dev', 'marketing', 'design', 'business', 'ai', 'automation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1A1620] text-[var(--accent-bright)] font-semibold border border-[var(--accent)]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-[#0F0D11] border border-[var(--border)] space-y-4 shadow-lg"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--text-primary)]">{post.title}</h3>
                <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                  <span>por <strong>{post.authorName}</strong></span>
                  <span>•</span>
                  <span>{post.createdAt.split('T')[0]}</span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121014] text-[#A79BC4] border border-[var(--border)] uppercase">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* AI Auto-Match Recommendation Card */}
            {post.aiAnalysis?.summaryAnswer && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/30 to-[#121014] border border-[#6B21A8]/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-bright)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Match IA (Sugestão com base em Ativos do Ecossistema):</span>
                </div>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                  {post.aiAnalysis.summaryAnswer}
                </p>
              </div>
            )}

            {/* Tags and Upvote button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)] text-xs">
              <div className="flex flex-wrap gap-1">
                {post.tags.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-[#121014] text-[var(--text-muted)] text-[10px] font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => upvoteTopic(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#121014] hover:bg-[#1A1620] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-bright)] cursor-pointer transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono">{post.likesCount}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{post.replies.length} respostas</span>
                </div>
              </div>
            </div>

            {/* Replies section */}
            <div className="space-y-3 pt-2">
              {post.replies.map((reply) => (
                <div key={reply.id} className="p-3 rounded-xl bg-[#121014] border border-[var(--border)] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text-primary)]">{reply.authorName}</span>
                    <span className="font-mono">{reply.createdAt.split('T')[0]}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{reply.content}</p>
                </div>
              ))}

              {/* Reply input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={replyTextMap[post.id] || ''}
                  onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                  placeholder="Escrever uma resposta técnica..."
                  className="flex-1 bg-[#121014] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-bright)] focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply(post.id);
                  }}
                />
                <button
                  onClick={() => handleSendReply(post.id)}
                  className="bg-[#6B21A8] hover:bg-[#8B35D6] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Responder</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

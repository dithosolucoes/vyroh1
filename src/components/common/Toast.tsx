import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#121014] border border-[var(--accent)] text-[var(--text-primary)] shadow-2xl backdrop-blur-md max-w-md">
        <div className="w-6 h-6 rounded-full bg-[#6B21A8]/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-[var(--accent-bright)]" />
        </div>
        <p className="text-xs font-medium leading-tight flex-1">{toastMessage}</p>
        <button
          onClick={() => showToast('')}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParticleCanvas } from '../common/ParticleCanvas';
import { Sun, Moon } from 'lucide-react';
import { UserRole } from '../../types';

export const AuthView: React.FC = () => {
  const { login, switchRole, users, theme, toggleTheme } = useApp();
  const [email, setEmail] = useState('voce@empresa.com');
  const [password, setPassword] = useState('123456');
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [statusText, setStatusText] = useState('$ vyroh --status');
  const [isOpening, setIsOpening] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) return;

    setIsOpening(true);
    setStatusText('abrindo cofre central...');

    setTimeout(() => {
      // Find matching user or fallback to owner
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || users[0];
      login(matched.email, password);
    }, 450);
  };

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    setIsOpening(true);
    setStatusText(`autenticando via ${provider === 'github' ? 'GitHub' : 'Google'}...`);
    setTimeout(() => {
      if (provider === 'github') {
        const owner = users.find((u) => u.role === 'owner') || users[0];
        login(owner.email, '123456');
        switchRole('owner');
      } else {
        const seller = users.find((u) => u.role === 'seller') || users[1] || users[0];
        login(seller.email, '123456');
        switchRole('seller');
      }
    }, 450);
  };

  const handleQuickRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || users[0];
    setEmail(matched.email);
    setPassword('123456');
    setIsOpening(true);
    setStatusText(`acessando como ${matched.name} (${role})...`);
    setTimeout(() => {
      login(matched.email, '123456');
      switchRole(role);
    }, 400);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative min-h-screen ${
        isDark ? 'bg-[#0B0B0D] text-[#F3EEFB]' : 'bg-[#FFFFFF] text-[#111827]'
      } flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden select-none font-sans transition-colors duration-200`}
    >
      {/* Interactive Constellation / Particle Background */}
      <ParticleCanvas opacity={isDark ? 0.85 : 0.35} />

      {/* Top right theme toggle squircle button (exact match to screenshot) */}
      <button
        onClick={toggleTheme}
        className={`absolute top-5 right-5 z-30 w-9 h-9 rounded-xl ${
          isDark
            ? 'bg-[#121014] border border-[#2D2338] text-[#A79BC4] hover:text-white hover:border-[#6B21A8]'
            : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#9CA3AF]'
        } flex items-center justify-center cursor-pointer transition-all shadow-sm`}
        aria-label="Alternar tema claro/escuro"
        title="Alternar tema"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center gap-6 my-auto">
        {/* Brand & Subtitle Header */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <svg width="34" height="34" viewBox="0 0 100 110" aria-hidden="true" className="drop-shadow-sm">
              <line x1="20" y1="14" x2="50" y2="92" stroke="#6B21A8" strokeWidth="15" strokeLinecap="round" />
              <line x1="80" y1="14" x2="50" y2="92" stroke="#C2410C" strokeWidth="15" strokeLinecap="round" />
              <circle cx="50" cy="92" r="7" fill={isDark ? '#FFFFFF' : '#111827'} />
            </svg>
            <span className="text-3xl font-bold tracking-tight">vyroh</span>
          </div>

          {/* Subtitle */}
          <p
            className={`text-xs sm:text-sm ${
              isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'
            } max-w-xs leading-relaxed mb-3`}
          >
            O cofre que pensa com você.
            <br />
            Guarde, organize e venda o que já construiu.
          </p>

          {/* Terminal Command Line with Blinking Cursor */}
          <div className="font-mono text-xs flex items-center gap-1.5 h-6">
            <span className={isOpening ? (isDark ? 'text-[#C084FC]' : 'text-[#6B21A8]') : isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}>
              {statusText}
            </span>
            <span
              className={`w-2 h-3.5 ${
                isDark ? 'bg-[#9333EA]' : 'bg-[#6B21A8]'
              } cursor-blink inline-block`}
            />
          </div>
        </div>

        {/* Card Form */}
        <div
          className={`w-full ${
            isDark
              ? 'bg-[#121014] border border-[#2D2338] shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
              : 'bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
          } rounded-[20px] p-7 sm:p-8 transition-all`}
        >
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className={`text-xs font-medium ${isDark ? 'text-[#D1D5DB]' : 'text-[#374151]'}`}
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                placeholder="voce@empresa.com"
                autoComplete="email"
                className={`w-full ${
                  isDark
                    ? 'bg-[#0B0B0D] border-[#2D2338] text-[#F3EEFB] placeholder-[#4B5563] focus:border-[#6B21A8]'
                    : 'bg-white border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:border-[#6B21A8]'
                } border ${
                  emailError ? 'border-red-500 ring-1 ring-red-500' : ''
                } rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all`}
              />
              {emailError && <span className="text-[11px] text-red-500">Digite um e-mail válido.</span>}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className={`text-xs font-medium ${isDark ? 'text-[#D1D5DB]' : 'text-[#374151]'}`}
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Sua senha"
                autoComplete="current-password"
                className={`w-full ${
                  isDark
                    ? 'bg-[#0B0B0D] border-[#2D2338] text-[#F3EEFB] placeholder-[#4B5563] focus:border-[#6B21A8]'
                    : 'bg-white border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:border-[#6B21A8]'
                } border ${
                  passwordError ? 'border-red-500 ring-1 ring-red-500' : ''
                } rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all`}
              />
              {passwordError && <span className="text-[11px] text-red-500">Digite sua senha.</span>}
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={() => alert('Link de recuperação enviado com sucesso.')}
                className={`text-xs ${
                  isDark ? 'text-[#9CA3AF] hover:text-[#C084FC]' : 'text-[#6B7280] hover:text-[#6B21A8]'
                } cursor-pointer transition-colors`}
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isOpening}
              className="w-full bg-[#6B21A8] hover:bg-[#7E22CE] text-white font-medium text-sm py-2.5 px-4 rounded-xl cursor-pointer transition-all active:scale-[0.99] shadow-md hover:shadow-purple-900/20 flex items-center justify-center gap-2 mt-1"
            >
              <span>{isOpening ? 'Destravando...' : isSignUp ? 'Criar meu cofre' : 'Entrar no cofre'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-[#9CA3AF] my-1">
              <div className={`flex-1 h-px ${isDark ? 'bg-[#2D2338]' : 'bg-[#E5E7EB]'}`} />
              <span className={isDark ? 'text-[#6B7280]' : 'text-[#6B7280]'}>ou continue com</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-[#2D2338]' : 'bg-[#E5E7EB]'}`} />
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className={`w-full py-2.5 px-3 rounded-xl border ${
                  isDark
                    ? 'border-[#2D2338] bg-[#0B0B0D] hover:bg-[#1A1620] text-[#F3EEFB]'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#111827]'
                } text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
                <span>GitHub</span>
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className={`w-full py-2.5 px-3 rounded-xl border ${
                  isDark
                    ? 'border-[#2D2338] bg-[#0B0B0D] hover:bg-[#1A1620] text-[#F3EEFB]'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#111827]'
                } text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all`}
              >
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>
        </div>

        {/* Discrete bottom bar with role selector modal/toggle */}
        <div className="flex items-center justify-between w-full max-w-[400px] px-1 text-xs">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className={`${
              isDark ? 'text-[#9CA3AF] hover:text-[#C084FC]' : 'text-[#6B7280] hover:text-[#6B21A8]'
            } transition-colors cursor-pointer`}
          >
            {isSignUp ? 'Já tem cofre? Fazer login' : 'Criar novo cofre'}
          </button>

          <button
            type="button"
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className={`font-mono text-[11px] ${
              isDark ? 'text-[#6B7280] hover:text-[#C084FC]' : 'text-[#9CA3AF] hover:text-[#6B21A8]'
            } transition-colors cursor-pointer`}
          >
            {showRoleSelector ? '✕ fechar papéis' : '⚡ trocar papel demo'}
          </button>
        </div>

        {/* Optional Expandable Demo Roles Panel */}
        {showRoleSelector && (
          <div
            className={`w-full max-w-[400px] p-3 rounded-xl ${
              isDark ? 'bg-[#121014] border border-[#2D2338]' : 'bg-gray-50 border border-gray-200'
            } grid grid-cols-4 gap-2 animate-in fade-in zoom-in-95 duration-100`}
          >
            <button
              onClick={() => handleQuickRole('owner')}
              className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                isDark ? 'bg-[#0B0B0D] hover:bg-[#6B21A8]/20 border border-[#2D2338]' : 'bg-white hover:bg-purple-50 border border-gray-200'
              }`}
            >
              <div className="font-semibold text-xs text-purple-400">Owner</div>
              <div className="text-[9px] text-[#6B7280]">Cofre Solo</div>
            </button>
            <button
              onClick={() => handleQuickRole('seller')}
              className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                isDark ? 'bg-[#0B0B0D] hover:bg-[#C2410C]/20 border border-[#2D2338]' : 'bg-white hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <div className="font-semibold text-xs text-[#EA580C]">Seller</div>
              <div className="text-[9px] text-[#6B7280]">Vendas</div>
            </button>
            <button
              onClick={() => handleQuickRole('buyer')}
              className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                isDark ? 'bg-[#0B0B0D] hover:bg-emerald-500/20 border border-[#2D2338]' : 'bg-white hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              <div className="font-semibold text-xs text-emerald-400">Buyer</div>
              <div className="text-[9px] text-[#6B7280]">Compras</div>
            </button>
            <button
              onClick={() => handleQuickRole('admin')}
              className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                isDark ? 'bg-[#0B0B0D] hover:bg-purple-950 border border-[#2D2338]' : 'bg-white hover:bg-purple-50 border border-gray-200'
              }`}
            >
              <div className="font-semibold text-xs text-purple-300">Admin</div>
              <div className="text-[9px] text-[#6B7280]">Seção 29</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

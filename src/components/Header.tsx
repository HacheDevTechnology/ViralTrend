import React from 'react';
import { Flame, Sparkles, TrendingUp, BarChart2, Image, Bookmark, Crown, Key, Palette, HelpCircle, UserCheck, RefreshCw, Calendar, Zap } from 'lucide-react';
import { UserTier } from '../types';

interface HeaderProps {
  activeTab: 'trends' | 'generator' | 'analyzer' | 'visualCard' | 'saved';
  setActiveTab: (tab: 'trends' | 'generator' | 'analyzer' | 'visualCard' | 'saved') => void;
  savedCount: number;
  userTier: UserTier;
  onOpenPremiumModal: () => void;
  onRotateTheme: () => void;
  currentThemeName: string;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
  userEmail: string | null;
  onOpenScheduler: () => void;
  automationCredits: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  userTier,
  onOpenPremiumModal,
  onRotateTheme,
  currentThemeName,
  onOpenOnboarding,
  onOpenAuth,
  userEmail,
  onOpenScheduler,
  automationCredits,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-4 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg shadow-rose-500/20 text-white font-black shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-purple-300">
                  ViralGen <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase tracking-wider">AI Copilot</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Ahorra tiempo creando y publicando contenido listo para tus redes</p>
            </div>
          </div>

          {/* Quick Action Utilities: Theme Refresher, Spec Popup, Auth & Account Tier */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full md:w-auto">
            {/* Theme Refresher Button */}
            <button
              onClick={onRotateTheme}
              title="Cambiar estilo visual"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Palette className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Estilo:</span>
              <span className="text-white font-extrabold">{currentThemeName}</span>
              <RefreshCw className="w-3 h-3 text-amber-400 ml-0.5" />
            </button>

            {/* Spec & Onboarding Popup Button */}
            <button
              onClick={onOpenOnboarding}
              title="Ver cómo funciona para ayudarte"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">¿Cómo te ayudo?</span>
            </button>

            {/* Autopiloto Scheduler & Credits Button */}
            <button
              onClick={onOpenScheduler}
              title="Programador de publicaciones automáticas"
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Calendar className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Autopiloto</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-extrabold border border-amber-400/40">
                {automationCredits} ⚡
              </span>
            </button>

            {/* Login / Email Button */}
            <button
              onClick={onOpenAuth}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="max-w-[100px] truncate">{userEmail ? userEmail : 'Mi Cuenta'}</span>
            </button>

            {/* Account Tier Badge */}
            <button
              onClick={onOpenPremiumModal}
              className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 transition shadow-md whitespace-nowrap ${
                userTier === 'premium'
                  ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border-amber-500/40 text-amber-300 hover:border-amber-400'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {userTier === 'premium' ? (
                <>
                  <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>VIP Ilimitado</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Basic • <strong className="text-amber-300">Activar Key</strong></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="pb-3 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 w-fit mx-auto md:mx-0">
            <button
              id="tab-generator"
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'generator'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-rose-300" />
              <span>Crear Publicación</span>
            </button>

            <button
              id="tab-trends"
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'trends'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>Descubrir Ideas</span>
            </button>

            <button
              id="tab-analyzer"
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'analyzer'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-purple-300" />
              <span>Auditar Texto</span>
            </button>

            <button
              id="tab-visual-card"
              onClick={() => setActiveTab('visualCard')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'visualCard'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Image className="w-4 h-4 text-sky-300" />
              <span>Imagen / Tarjeta</span>
            </button>

            <button
              id="tab-saved"
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'saved'
                  ? 'bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Guardados</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

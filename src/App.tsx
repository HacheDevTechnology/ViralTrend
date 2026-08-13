import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TrendSearch } from './components/TrendSearch';
import { ViralGenerator } from './components/ViralGenerator';
import { ViralityAnalyzer } from './components/ViralityAnalyzer';
import { VisualCardGenerator } from './components/VisualCardGenerator';
import { SavedLibrary } from './components/SavedLibrary';
import { PremiumModal } from './components/PremiumModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { AutomationSchedulerModal } from './components/AutomationSchedulerModal';
import { TrendItem, Platform, SavedStatusItem, UserAccountInfo } from './types';
import { validatePremiumKey, INITIAL_USER_KEY } from './lib/keyAuth';
import { THEMES, getNextTheme, AppTheme } from './lib/themeManager';
import { getInitialCreditState, saveCreditState, CreditAccountState } from './lib/creditManager';
import { Flame, Sparkles, Heart, Crown, Key, CheckCircle2, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'trends' | 'generator' | 'analyzer' | 'visualCard' | 'saved'>('trends');
  
  // Theme Manager state ($3M USD Aesthetic)
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(THEMES[0]);

  const handleRotateTheme = () => {
    const next = getNextTheme(currentTheme.id);
    setCurrentTheme(next);
  };

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      const seen = localStorage.getItem('viralgen_onboarding_seen');
      return seen ? false : true; // Open on entry if never seen before
    } catch {
      return true;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('viralgen_user_email') || null;
    } catch {
      return null;
    }
  });

  // User Account & Premium Tier State
  const [account, setAccount] = useState<UserAccountInfo>(() => {
    try {
      const stored = localStorage.getItem('viralgen_user_account');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Fallback
    }
    return { tier: 'basic', email: userEmail || undefined };
  });

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState<boolean>(false);

  // Credit Account State for Autopiloto Scheduler
  const [creditState, setCreditState] = useState<CreditAccountState>(() => {
    return getInitialCreditState(account.tier);
  });

  const handleUpdateCreditState = (newState: CreditAccountState) => {
    setCreditState(newState);
    saveCreditState(newState);
  };

  useEffect(() => {
    try {
      localStorage.setItem('viralgen_user_account', JSON.stringify(account));
    } catch (e) {
      console.error('Error saving account info:', e);
    }
  }, [account]);

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('viralgen_onboarding_seen', 'true');
    } catch {
      // ignore
    }
  };

  const handleSaveAuth = (email: string) => {
    setUserEmail(email);
    setAccount(prev => ({ ...prev, email }));
    try {
      localStorage.setItem('viralgen_user_email', email);
    } catch {
      // ignore
    }
  };

  const handleActivateKey = (key: string): boolean => {
    const result = validatePremiumKey(key);
    if (result.isValid) {
      setAccount(prev => ({
        ...prev,
        tier: 'premium',
        activatedKey: key.trim().toUpperCase(),
        activatedAt: new Date().toISOString()
      }));
      return true;
    }
    return false;
  };

  const handleDowngradeToBasic = () => {
    setAccount(prev => ({ ...prev, tier: 'basic' }));
  };

  // State for passing selected trend to generator
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);

  // State for passing status text to visual card generator
  const [cardText, setCardText] = useState<string>('');
  const [cardPlatform, setCardPlatform] = useState<Platform>('twitter');

  // Local storage saved statuses
  const [savedStatuses, setSavedStatuses] = useState<SavedStatusItem[]>(() => {
    try {
      const stored = localStorage.getItem('viralgen_saved_statuses');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('viralgen_saved_statuses', JSON.stringify(savedStatuses));
    } catch (e) {
      console.error('Error persisting saved statuses:', e);
    }
  }, [savedStatuses]);

  const handleSelectTrendForGeneration = (trend: TrendItem) => {
    setSelectedTrend(trend);
    setActiveTab('generator');
  };

  const handleOpenVisualCard = (text: string, platform: Platform = 'twitter') => {
    setCardText(text);
    setCardPlatform(platform);
    setActiveTab('visualCard');
  };

  const handleSaveStatus = (item: SavedStatusItem) => {
    if (!savedStatuses.some(s => s.id === item.id || s.content === item.content)) {
      setSavedStatuses(prev => [item, ...prev]);
    }
  };

  const handleRemoveSavedStatus = (id: string) => {
    setSavedStatuses(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm('¿Estás seguro de vaciar toda tu colección de estados guardados?')) {
      setSavedStatuses([]);
    }
  };

  const handleUseImprovedText = (text: string) => {
    setCardText(text);
    setActiveTab('visualCard');
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgClass} text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white flex flex-col justify-between transition-colors duration-500`}>
      <div>
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedStatuses.length}
          userTier={account.tier}
          onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          onRotateTheme={handleRotateTheme}
          currentThemeName={currentTheme.name}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          userEmail={userEmail}
          onOpenScheduler={() => setIsSchedulerOpen(true)}
          automationCredits={creditState.credits}
        />

        {/* User Account Banner (Quick Key Activation for Basic users) */}
        {account.tier === 'basic' && (
          <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-600/10 border-b border-amber-500/20 py-2.5 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  User Basic
                </span>
                <span className="text-slate-300 font-medium">
                  Tu Key VIP para desbloquear <strong>User Premium</strong>: <code className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono font-bold select-all">{INITIAL_USER_KEY}</code>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleActivateKey(INITIAL_USER_KEY)}
                  className="px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold rounded-lg shadow-md transition flex items-center gap-1.5 text-[11px]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Activar Key Ahora</span>
                </button>
                <button
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white underline text-[11px]"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Premium Active Notice */}
        {account.tier === 'premium' && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>User Premium VIP Activo</strong> — Tienes acceso total ilimitado. Clave: <code className="font-mono text-emerald-200">{account.activatedKey}</code>
                </span>
              </div>
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="text-emerald-400 hover:text-emerald-200 underline text-[11px] font-semibold"
              >
                Gestionar Cuenta
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'trends' && (
            <TrendSearch
              onSelectTrendForGeneration={handleSelectTrendForGeneration}
            />
          )}

          {activeTab === 'generator' && (
            <ViralGenerator
              initialTrend={selectedTrend}
              onClearTrend={() => setSelectedTrend(null)}
              onOpenVisualCard={handleOpenVisualCard}
              onSaveStatus={handleSaveStatus}
              savedStatuses={savedStatuses}
              userTier={account.tier}
              onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
            />
          )}

          {activeTab === 'analyzer' && (
            <ViralityAnalyzer
              onUseImprovedText={handleUseImprovedText}
            />
          )}

          {activeTab === 'visualCard' && (
            <VisualCardGenerator
              initialText={cardText || 'La mejor forma de predecir el futuro en las redes sociales es creándolo con contenido auténtico y de alto valor.'}
              initialPlatform={cardPlatform}
            />
          )}

          {activeTab === 'saved' && (
            <SavedLibrary
              savedStatuses={savedStatuses}
              onRemoveStatus={handleRemoveSavedStatus}
              onClearAll={handleClearAllSaved}
              onOpenVisualCard={(text) => handleOpenVisualCard(text, 'twitter')}
            />
          )}
        </main>
      </div>

      {/* Account / Key Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        account={account}
        onActivateKey={handleActivateKey}
        onDowngradeToBasic={handleDowngradeToBasic}
      />

      {/* Onboarding Specs Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        account={account}
        onUpdateAccount={(updated) => {
          setAccount(prev => ({ ...prev, ...updated }));
          if (updated.email) {
            handleSaveAuth(updated.email);
          }
        }}
        userEmail={userEmail}
        onSaveAuth={handleSaveAuth}
      />

      {/* Autopiloto & Credits Scheduler Modal */}
      <AutomationSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        account={account}
        creditState={creditState}
        onUpdateCreditState={handleUpdateCreditState}
        onSaveStatus={handleSaveStatus}
        onOpenAuth={() => {
          setIsSchedulerOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-slate-400">ViralGen AI • Generador de Estados & Buscador de Tendencias</span>
          </div>

          <p className="flex items-center gap-1">
            Impulsado por <strong className="text-slate-300">Gemini 3.6 Flash</strong> & Algoritmo Criptográfico
          </p>
        </div>
      </footer>
    </div>
  );
}

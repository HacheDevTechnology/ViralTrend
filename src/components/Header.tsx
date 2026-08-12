import React from 'react';
import { Flame, Sparkles, TrendingUp, BarChart2, Image, Bookmark } from 'lucide-react';

interface HeaderProps {
  activeTab: 'trends' | 'generator' | 'analyzer' | 'visualCard' | 'saved';
  setActiveTab: (tab: 'trends' | 'generator' | 'analyzer' | 'visualCard' | 'saved') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-4 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('trends')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg shadow-rose-500/20 text-white font-black">
              <Flame className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-purple-300">
                  ViralGen <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase tracking-wider">AI Trends</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Generador de estados virales adaptados a tendencias en tiempo real</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 overflow-x-auto w-full md:w-auto scrollbar-none">
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
              <span>Buscador Tendencias</span>
            </button>

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
              <span>Generador Viral</span>
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
              <span>Auditor Viral</span>
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
              <span>Tarjeta Visual</span>
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
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40">
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

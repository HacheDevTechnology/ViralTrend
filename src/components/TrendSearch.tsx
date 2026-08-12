import React, { useState, useEffect } from 'react';
import { Search, Flame, Sparkles, TrendingUp, ExternalLink, ArrowRight, RefreshCw, Zap, Compass, CheckCircle2 } from 'lucide-react';
import { TrendItem, Category } from '../types';

interface TrendSearchProps {
  onSelectTrendForGeneration: (trend: TrendItem) => void;
}

const CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'all', label: 'Todas las Tendencias', icon: '🔥', color: 'from-amber-500 to-rose-500' },
  { id: 'tech_ai', label: 'IA & Tecnología', icon: '🤖', color: 'from-purple-500 to-indigo-500' },
  { id: 'humor_memes', label: 'Memes & Humor', icon: '😂', color: 'from-yellow-500 to-amber-500' },
  { id: 'fitness_health', label: 'Fitness & Salud', icon: '💪', color: 'from-emerald-500 to-teal-500' },
  { id: 'finance_business', label: 'Finanzas & Negocios', icon: '📈', color: 'from-blue-500 to-cyan-500' },
  { id: 'lifestyle_relationships', label: 'Estilo de Vida & Amor', icon: '❤️', color: 'from-rose-500 to-pink-500' },
  { id: 'pop_culture', label: 'Cultura Pop & Cine', icon: '🎬', color: 'from-fuchsia-500 to-purple-500' },
  { id: 'motivation', label: 'Motivación & Mente', icon: '🧠', color: 'from-orange-500 to-amber-500' },
  { id: 'news_curiosities', label: 'Noticias & Datos', icon: '📰', color: 'from-slate-500 to-gray-500' },
];

export const TrendSearch: React.FC<TrendSearchProps> = ({ onSelectTrendForGeneration }) => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('');
  const [copiedHook, setCopiedHook] = useState<string | null>(null);

  const fetchTrends = async (cat: Category = selectedCategory, query: string = searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch('/api/trends/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: cat, query }),
      });
      const data = await response.json();
      if (data.trends && Array.isArray(data.trends)) {
        setTrends(data.trends);
        setDataSource(data.source || 'gemini');
      }
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(selectedCategory, '');
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrends(selectedCategory, searchQuery);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHook(text);
    setTimeout(() => setCopiedHook(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Explorador de Tendencias Virales en Tiempo Real</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Descubre de qué está hablando el mundo <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400">
              y adáptalo a tus estados en segundos
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Nuestra IA analiza búsquedas en tiempo real, conversaciones virales y patrones de alto engagement para darte los mejores ángulos de publicación para Twitter, Instagram, TikTok y LinkedIn.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-slate-800/90 p-2 rounded-2xl border border-slate-700 shadow-inner">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="trend-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: Inteligencia Artificial, Gym, Relaciones, Finanzas, Trabajo remoto..."
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>

              <button
                id="search-trends-button"
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rastreando la web...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 fill-amber-300" />
                    <span>Buscar Tendencias</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span>Filtrar por tema o nicho:</span>
          {dataSource === 'gemini_grounded_search' && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Google Search Grounding activo
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-white border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trend Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 w-24 bg-slate-800 rounded-full"></div>
                <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
              </div>
              <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
              <div className="h-16 bg-slate-800/60 rounded-xl"></div>
              <div className="h-10 bg-slate-800/80 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : trends.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
          <Flame className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No se encontraron tendencias para esta búsqueda</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">Prueba cambiar los términos de búsqueda o seleccionar otra categoría.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="group relative flex flex-col justify-between bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-rose-500/5"
            >
              <div className="space-y-4">
                {/* Header Badge & Virality Gauge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-amber-300 border border-slate-700/60 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{CATEGORIES.find(c => c.id === trend.category)?.label || 'Tendencia'}</span>
                  </span>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{trend.viralityIndex}% Viral</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                  {trend.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-2xl border border-slate-800/60">
                  {trend.summary}
                </p>

                {/* Why it trends */}
                {trend.whyItTrends && (
                  <div className="text-[11px] text-slate-400 italic">
                    <strong className="text-slate-300 not-italic font-semibold">Gatillo Psicológico:</strong> {trend.whyItTrends}
                  </div>
                )}

                {/* Viral Angles */}
                {trend.viralAngles && trend.viralAngles.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ángulos Virales:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {trend.viralAngles.map((angle, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/50">
                          🎯 {angle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sample Hooks */}
                {trend.sampleHooks && trend.sampleHooks.length > 0 && (
                  <div className="space-y-1 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                      <span>💡 Ejemplo de Gancho:</span>
                      <button
                        onClick={() => copyToClipboard(trend.sampleHooks[0])}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                      >
                        {copiedHook === trend.sampleHooks[0] ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : 'Copiar'}
                      </button>
                    </span>
                    <p className="text-xs text-amber-200/90 font-medium italic">
                      "{trend.sampleHooks[0]}"
                    </p>
                  </div>
                )}

                {/* Grounded Sources */}
                {trend.groundedSources && trend.groundedSources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">Fuentes Web en Tiempo Real:</span>
                    <div className="flex flex-col gap-1">
                      {trend.groundedSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1.5 truncate hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action CTA */}
              <div className="pt-5 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectTrendForGeneration(trend)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all duration-300 group-hover:border-amber-500/30 border border-slate-700"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:text-white" />
                  <span>Generar Estado sobre esta Tendencia</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

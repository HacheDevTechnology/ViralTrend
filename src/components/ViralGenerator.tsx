import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Bookmark, RefreshCw, Send, SlidersHorizontal, Twitter, Instagram, Linkedin, MessageSquare, Flame, Wand2, Image, Layers, Share2, AlertCircle, Volume2 } from 'lucide-react';
import { Platform, Tone, RegionalStyle, TrendItem, GeneratedStatusOption, GenerateStatusRequest, GenerateStatusResponse, SavedStatusItem } from '../types';

import { getClientFallbackViralOptions } from '../data/fallbackGenerator';

interface ViralGeneratorProps {
  initialTrend?: TrendItem | null;
  onClearTrend?: () => void;
  onOpenVisualCard: (text: string, platform: Platform) => void;
  onSaveStatus: (item: SavedStatusItem) => void;
  savedStatuses: SavedStatusItem[];
}

const PLATFORMS: { id: Platform; label: string; icon: string; bg: string; text: string }[] = [
  { id: 'twitter', label: 'Twitter / X', icon: '𝕏', bg: 'bg-slate-800 text-white border-slate-700', text: 'text-white' },
  { id: 'instagram', label: 'Instagram', icon: '📸', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30', text: 'text-rose-400' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30', text: 'text-sky-400' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30', text: 'text-blue-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400' },
  { id: 'threads', label: 'Threads', icon: '🧵', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30', text: 'text-purple-400' },
  { id: 'facebook', label: 'Facebook', icon: '📘', bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', text: 'text-indigo-400' },
];

const TONES: { id: Tone; label: string; emoji: string }[] = [
  { id: 'relatable', label: 'Cotidiano / Relatable', emoji: '🤝' },
  { id: 'controversial', label: 'Opinión Impopular / Debate', emoji: '🔥' },
  { id: 'humorous', label: 'Humor & Sarcasmo', emoji: '😂' },
  { id: 'inspirational', label: 'Inspiracional / Éxito', emoji: '✨' },
  { id: 'educational', label: 'Educativo / Atajo', emoji: '💡' },
  { id: 'storytelling', label: 'Storytelling Personal', emoji: '📖' },
  { id: 'minimalist', label: 'Ultra Corto & Punzante', emoji: '⚡' },
  { id: 'urgency', label: 'Urgencia / FOMO', emoji: '🚨' },
];

const REGIONAL_STYLES: { id: RegionalStyle; label: string; flag: string }[] = [
  { id: 'general', label: 'Español Neutro', flag: '🌐' },
  { id: 'mexico', label: 'México', flag: '🇲🇽' },
  { id: 'argentina', label: 'Argentina', flag: '🇦🇷' },
  { id: 'espana', label: 'España', flag: '🇪🇸' },
  { id: 'colombia', label: 'Colombia', flag: '🇨🇴' },
  { id: 'spanglish', label: 'Spanglish / Gen-Z', flag: '⚡' },
];

const QUICK_TOPICS = [
  'Productividad & Burnout',
  'IA y Automatización',
  'Gym & Disciplina',
  'Dinero vs Experiencias',
  'Red Flags en Relaciones',
  'Trabajo Remoto',
  'Nostalgia 2000s',
  'Libertad Financiera'
];

export const ViralGenerator: React.FC<ViralGeneratorProps> = ({
  initialTrend,
  onClearTrend,
  onOpenVisualCard,
  onSaveStatus,
  savedStatuses,
}) => {
  const [topic, setTopic] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('twitter');
  const [selectedTone, setSelectedTone] = useState<Tone>('relatable');
  const [selectedRegional, setSelectedRegional] = useState<RegionalStyle>('general');
  const [emojiDensity, setEmojiDensity] = useState<'high' | 'medium' | 'low' | 'none'>('medium');
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [goal, setGoal] = useState<'virality' | 'comments' | 'saves' | 'shares' | 'followers'>('virality');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<GenerateStatusResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>('');

  useEffect(() => {
    if (initialTrend) {
      setTopic(initialTrend.title);
      if (initialTrend.sampleHooks && initialTrend.sampleHooks.length > 0) {
        setCustomInstructions(`Inspirado en esta idea: "${initialTrend.summary}"`);
      }
    }
  }, [initialTrend]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic && !initialTrend) {
      setErrorMsg('Escribe un tema o selecciona una tendencia primero.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload: GenerateStatusRequest = {
      topic: topic || initialTrend?.title || '',
      trendId: initialTrend?.id,
      trendTitle: initialTrend?.title,
      trendContext: initialTrend?.summary,
      platform: selectedPlatform,
      tone: selectedTone,
      regionalStyle: selectedRegional,
      goal,
      includeHashtags,
      emojiDensity,
      customInstructions,
    };

    try {
      const response = await fetch('/api/viral/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data: GenerateStatusResponse = await response.json();
      setResults(data);
    } catch (err: any) {
      console.warn('Network or server error during generation, using offline smart engine:', err);
      const fallbackData = getClientFallbackViralOptions(payload);
      setResults(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (opt: GeneratedStatusOption) => {
    const itemToSave: SavedStatusItem = {
      ...opt,
      savedAt: new Date().toISOString(),
      platform: selectedPlatform,
      topic: topic || initialTrend?.title || 'General',
      tone: selectedTone,
    };
    onSaveStatus(itemToSave);
  };

  const isSaved = (optId: string) => {
    return savedStatuses.some(s => s.id === optId || s.content === results?.options.find(o => o.id === optId)?.content);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Input Config Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Active Trend Banner */}
        {initialTrend && (
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
                <Flame className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Tendencia Seleccionada:</span>
                <h4 className="text-sm font-bold text-white">{initialTrend.title}</h4>
              </div>
            </div>
            {onClearTrend && (
              <button
                onClick={onClearTrend}
                className="text-xs text-slate-400 hover:text-rose-400 transition font-medium px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                Cambiar
              </button>
            )}
          </div>
        )}

        {/* Form Inputs Header */}
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-rose-400" />
            <span>Configura tu Publicación Viral</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Elige el tema, la red social, el tono y el slang regional para obtener copys optimizados algorítmicamente.
          </p>
        </div>

        {/* Main Topic Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>¿De qué quieres hablar? (Tema / Idea Central):</span>
            <span className="text-slate-500 text-[10px] font-normal">Soporta cualquier nicho</span>
          </label>
          <input
            id="generator-topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Odio trabajar 8 horas en oficina, las ventajas de la IA, el mito de las 5 AM..."
            className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
          />

          {/* Quick topic pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
            <span className="text-[10px] text-slate-500 font-semibold uppercase flex-shrink-0">Sugerencias:</span>
            {QUICK_TOPICS.map((qt, idx) => (
              <button
                key={idx}
                onClick={() => setTopic(qt)}
                className="text-[11px] bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl border border-slate-700/50 hover:border-slate-600 transition whitespace-nowrap"
              >
                + {qt}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            1. Red Social Objetivo:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {PLATFORMS.map((plat) => (
              <button
                key={plat.id}
                onClick={() => setSelectedPlatform(plat.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  selectedPlatform === plat.id
                    ? `${plat.bg} ring-2 ring-rose-500/50 shadow-md`
                    : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{plat.icon}</span>
                <span>{plat.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone & Vibe Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            2. Tono / Vibe del Estado:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTone(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all border ${
                  selectedTone === t.id
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                    : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slang / Regional & Tweaks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Regional Slang */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Slang Regional:
            </label>
            <select
              value={selectedRegional}
              onChange={(e) => setSelectedRegional(e.target.value as RegionalStyle)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rose-500"
            >
              {REGIONAL_STYLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.flag} {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              4. Objetivo Principal:
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rose-500"
            >
              <option value="virality">🔥 Máxima Viralidad / Compartidos</option>
              <option value="comments">💬 Generar Debate / Comentarios</option>
              <option value="saves">📌 Guardados / Formato Guía</option>
              <option value="followers">👤 Ganar Seguidores / Identidad</option>
            </select>
          </div>

          {/* Emoji density & Hashtags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              5. Emojis & Hashtags:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={emojiDensity}
                onChange={(e) => setEmojiDensity(e.target.value as any)}
                className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none"
              >
                <option value="high">😀 Emojis Altos</option>
                <option value="medium">🙂 Emojis Medios</option>
                <option value="low">😐 Emojis Mínimos</option>
                <option value="none">🚫 Sin Emojis</option>
              </select>

              <button
                type="button"
                onClick={() => setIncludeHashtags(!includeHashtags)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                  includeHashtags
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                #Hashtags
              </button>
            </div>
          </div>
        </div>

        {/* Custom instructions optional */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 block">
            Detalles adicionales o instrucciones opcionales:
          </label>
          <input
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Ej: Incluir pregunta al final, mencionar una experiencia propia, formato antes/después..."
            className="w-full px-3.5 py-2 bg-slate-800/50 border border-slate-700/80 rounded-xl text-slate-200 text-xs placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          id="generate-viral-status-button"
          onClick={() => handleGenerate()}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Optimizando algoritmos y creando estados virales...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>GENERAR 4 ESTADOS VIRALES AHORA</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && results.options && results.options.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  ⚡ 4 Variaciones Listas
                </span>
                <span className="text-xs text-slate-400">Tema: <strong className="text-white">{results.topicAnalyzed}</strong></span>
              </div>
              {results.idealPostingTimes && (
                <p className="text-xs text-slate-400 mt-1">
                  ⏰ <strong className="text-slate-300">Mejor horario para publicar:</strong> {results.idealPostingTimes}
                </p>
              )}
            </div>

            <button
              onClick={() => handleGenerate()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-semibold border border-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerar Variaciones</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.options.map((opt, idx) => (
              <div
                key={opt.id || idx}
                className="relative flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  {/* Card Header & Virality Meter */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30">
                      {opt.headline}
                    </span>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-black">
                      <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      <span>{opt.viralityScore}/100 Virabilidad</span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3 text-slate-100 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                    {editingIndex === idx ? (
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full min-h-[140px] bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none"
                      />
                    ) : (
                      opt.content
                    )}
                  </div>

                  {/* Thread parts preview if thread format */}
                  {opt.threadParts && opt.threadParts.length > 0 && (
                    <div className="space-y-1.5 pl-2 border-l-2 border-amber-500/40">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Partes del Hilo ({opt.threadParts.length}):</span>
                      {opt.threadParts.map((tp, tpIdx) => (
                        <p key={tpIdx} className="text-xs text-slate-300 bg-slate-800/40 p-2 rounded-xl">
                          {tpIdx + 1}/ {tp}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Hashtags */}
                  {opt.hashtags && opt.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opt.hashtags.map((h, hIdx) => (
                        <span key={hIdx} className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Virality Reasoning Explanation */}
                  <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                    <strong className="text-slate-300 font-semibold">¿Por qué es viral?</strong> {opt.viralityReasoning}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(editingIndex === idx ? editedText : opt.content, opt.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition"
                    >
                      {copiedId === opt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Estado</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSaveStatus(opt)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        isSaved(opt.id)
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved(opt.id) ? 'Guardado' : 'Guardar'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenVisualCard(opt.content, selectedPlatform)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs transition"
                  >
                    <Image className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tarjeta Visual</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

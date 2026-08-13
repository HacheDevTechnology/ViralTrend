import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Bookmark, RefreshCw, Send, SlidersHorizontal, Twitter, Instagram, Linkedin, MessageSquare, Flame, Wand2, Image, Layers, Share2, AlertCircle, Volume2, Globe, Film, Mail, Mic, Newspaper, Zap, Lock } from 'lucide-react';
import { Platform, Tone, RegionalStyle, TrendItem, GeneratedStatusOption, GenerateStatusRequest, GenerateStatusResponse, SavedStatusItem, UserTier, ContentTypeCategory, UserAccountInfo } from '../types';
import { detectLanguage, DetectedLanguage } from '../lib/languageDetector';
import { getClientFallbackViralOptions } from '../data/fallbackGenerator';
import { shareToSocial, SOCIAL_SHARE_OPTIONS } from '../lib/socialShare';

interface ViralGeneratorProps {
  initialTrend?: TrendItem | null;
  onClearTrend?: () => void;
  onOpenVisualCard: (text: string, platform: Platform) => void;
  onSaveStatus: (item: SavedStatusItem) => void;
  savedStatuses: SavedStatusItem[];
  userAccount?: UserAccountInfo;
  onIncrementGenerations?: () => void;
  onOpenPremiumModal?: () => void;
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

const CONTENT_TYPES: { id: ContentTypeCategory; label: string; icon: any; badge: string; desc: string }[] = [
  { id: 'social_post', label: 'Post Corto Redes', icon: MessageSquare, badge: 'Standard', desc: 'Frases punzantes, hooks y reflexiones directas' },
  { id: 'reels_shorts', label: 'Guion TikTok / Reels', icon: Film, badge: 'Video 0-30s', desc: 'Estructura visual con tiempos de retención' },
  { id: 'carousel', label: 'Diapositivas Carrusel', icon: Layers, badge: 'Infográfico', desc: 'Laminas paso a paso para guardar' },
  { id: 'thread', label: 'Hilo de Conversación', icon: Twitter, badge: 'Twitter/Threads', desc: 'Secuencia estructurada punto por punto' },
  { id: 'newsletter', label: 'Email Newsletter', icon: Mail, badge: 'Inbox High-Open', desc: 'Asunto de alto click-through y cuerpo' },
  { id: 'podcast_hook', label: 'Intro & Podcast Hook', icon: Mic, badge: 'Audio / YouTube', desc: 'Apertura de programa y escaleta de temas' },
  { id: 'press_release', label: 'Nota de Prensa Viral', icon: Newspaper, badge: 'Lanzamiento', desc: 'Comunicado estilizado para medios y blogs' },
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
  userAccount,
  onIncrementGenerations,
  onOpenPremiumModal,
}) => {
  const [topic, setTopic] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<ContentTypeCategory>('social_post');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('twitter');
  const [selectedTone, setSelectedTone] = useState<Tone>('relatable');
  const [selectedRegional, setSelectedRegional] = useState<RegionalStyle>('general');
  const [emojiDensity, setEmojiDensity] = useState<'high' | 'medium' | 'low' | 'none'>('medium');
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [goal, setGoal] = useState<'virality' | 'comments' | 'saves' | 'shares' | 'followers'>('virality');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const [detectedLang, setDetectedLang] = useState<DetectedLanguage>({ code: 'auto', name: 'Auto-Detección', flag: '🌐', confidence: 100 });

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<GenerateStatusResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto detect language on topic change
  useEffect(() => {
    const detected = detectLanguage(topic);
    setDetectedLang(detected);
  }, [topic]);

  useEffect(() => {
    if (initialTrend) {
      setTopic(initialTrend.title);
      if (initialTrend.sampleHooks && initialTrend.sampleHooks.length > 0) {
        setCustomInstructions(`Inspirado en esta idea: "${initialTrend.summary}"`);
      }
    }
  }, [initialTrend]);

  const isBasicLimitReached = userAccount?.tier === 'basic' && (userAccount?.dailyGenerationsCount || 0) >= (userAccount?.maxDailyBasicLimit || 3);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic && !initialTrend) {
      setErrorMsg('Escribe un tema o selecciona una tendencia primero.');
      return;
    }

    if (isBasicLimitReached) {
      if (onOpenPremiumModal) onOpenPremiumModal();
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload: GenerateStatusRequest = {
      topic: topic || initialTrend?.title || '',
      trendId: initialTrend?.id,
      trendTitle: initialTrend?.title,
      trendContext: initialTrend?.summary,
      contentTypeCategory: selectedContentType,
      detectedLanguage: detectedLang.name,
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
      if (onIncrementGenerations) onIncrementGenerations();
    } catch (err: any) {
      console.warn('Network or server error during generation, using offline smart engine:', err);
      const fallbackData = getClientFallbackViralOptions(payload);
      setResults(fallbackData);
      if (onIncrementGenerations) onIncrementGenerations();
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

        {/* User Usage Limit Indicator for Basic Users */}
        {userAccount?.tier === 'basic' && (
          <div className="p-3 bg-slate-950 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">
                Uso diario <strong>User Basic</strong>: <strong className="text-amber-300">{userAccount.dailyGenerationsCount} / {userAccount.maxDailyBasicLimit}</strong> solicitudes hoy
              </span>
            </div>

            <button
              onClick={onOpenPremiumModal}
              className="text-[11px] px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/30 transition flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> Desbloquear Ilimitado
            </button>
          </div>
        )}

        {/* Form Inputs Header */}
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-rose-400" />
            <span>¿Qué quieres publicar hoy?</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Escribe una idea o tema. Yo me encargo de redactar las mejores opciones para tus redes en segundos.
          </p>
        </div>

        {/* Multi-Content Type Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            1. Categoría de Contenido:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {CONTENT_TYPES.map((ct) => {
              const IconComp = ct.icon;
              const isSel = selectedContentType === ct.id;
              return (
                <button
                  key={ct.id}
                  onClick={() => setSelectedContentType(ct.id)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                    isSel
                      ? 'bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-purple-600/20 border-rose-500/60 ring-2 ring-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${isSel ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {ct.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{ct.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ct.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Topic Input with Auto Language Detector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>2. Tema o Idea Principal:</span>
            </label>

            {/* Auto Language Detector Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[11px]">
              <Globe className="w-3 h-3 text-amber-400" />
              <span className="text-slate-400">Idioma:</span>
              <span className="font-bold text-amber-300">{detectedLang.flag} {detectedLang.name}</span>
            </div>
          </div>

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
            3. Red Social Objetivo:
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

        {/* Tone & Regional Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Tono de Voz:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((tn) => (
                <button
                  key={tn.id}
                  onClick={() => setSelectedTone(tn.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                    selectedTone === tn.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{tn.emoji}</span>
                  <span className="truncate">{tn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Regional Slang Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Modismo Regional / Slang:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REGIONAL_STYLES.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegional(reg.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                    selectedRegional === reg.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                      : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{reg.flag}</span>
                  <span>{reg.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800">
          {errorMsg && (
            <p className="text-rose-400 text-xs mb-3 flex items-center gap-1 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </p>
          )}

          <button
            id="btn-generate-status"
            onClick={() => handleGenerate()}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-black text-white text-base shadow-xl transition-all flex items-center justify-center gap-3 ${
              isBasicLimitReached
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:opacity-90'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Redactando tus publicaciones...</span>
              </>
            ) : isBasicLimitReached ? (
              <>
                <Lock className="w-5 h-5" />
                <span>Límite Diario Alcanzado - Activa tu Key VIP</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Crear Opciones para Redes Sociales</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Generated Options Output */}
      {results && results.options && results.options.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Resultados Generados ({results.options.length} Variantes)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {results.topicAnalyzed} {results.detectedLangInfo ? `• Idioma: ${results.detectedLangInfo}` : ''}
              </p>
            </div>

            <div className="px-3 py-1 bg-slate-800 rounded-xl border border-slate-700 text-xs text-amber-300 font-bold">
              ⏰ Hora Ideal: {results.idealPostingTimes}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.options.map((opt, idx) => {
              const saved = isSaved(opt.id);

              return (
                <div
                  key={opt.id || idx}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-4 transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                        {opt.headline}
                      </span>
                      
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <span>Puntaje: {opt.viralityScore}/100</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-normal text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                      {opt.content}
                    </div>

                    {opt.threadParts && opt.threadParts.length > 0 && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Secuencia del Hilo:</span>
                        {opt.threadParts.map((tp, tIdx) => (
                          <p key={tIdx} className="text-xs text-purple-200">{tp}</p>
                        ))}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 italic">
                      💡 {opt.viralityReasoning}
                    </p>

                    {/* Social Share Intent Buttons */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Publicar Directamente a Red Social:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SOCIAL_SHARE_OPTIONS.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => shareToSocial(s.id, opt.content)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 ${s.color}`}
                            title={`Abrir ventana de publicación en ${s.label}`}
                          >
                            <span>{s.icon}</span>
                            <span>{s.label.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyToClipboard(opt.content, opt.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      {copiedId === opt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenVisualCard(opt.content, selectedPlatform)}
                        className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 transition flex items-center gap-1.5"
                      >
                        <Image className="w-3.5 h-3.5" />
                        <span>Tarjeta Visual</span>
                      </button>

                      <button
                        onClick={() => handleSave(opt)}
                        className={`p-2 rounded-xl border text-xs font-bold transition ${
                          saved
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

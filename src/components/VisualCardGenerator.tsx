import React, { useState, useRef } from 'react';
import { Image, Download, Copy, Check, Sparkles, User, ShieldCheck, Heart, Repeat, MessageCircle, Share2, Layers } from 'lucide-react';
import { Platform } from '../types';

interface VisualCardGeneratorProps {
  initialText?: string;
  initialPlatform?: Platform;
}

type CardStyle = 'twitter_dark' | 'neon_sunset' | 'glass_minimal' | 'story_vertical' | 'clean_white';

export const VisualCardGenerator: React.FC<VisualCardGeneratorProps> = ({
  initialText = 'Si sigues haciendo esto manualmente en 2026, estás regalando tu tiempo y energía. Automatiza tus procesos o quédate atrás.',
  initialPlatform = 'twitter',
}) => {
  const [text, setText] = useState<string>(initialText);
  const [authorName, setAuthorName] = useState<string>('Creador Viral');
  const [handle, setHandle] = useState<string>('@creador_viral');
  const [cardStyle, setCardStyle] = useState<CardStyle>('twitter_dark');
  const [likesCount, setLikesCount] = useState<string>('14.2K');
  const [retweetsCount, setRetweetsCount] = useState<string>('3.8K');
  const [copied, setCopied] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const copyTextOnly = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/20 text-sky-300 rounded-2xl border border-sky-500/30">
            <Image className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Creador de Tarjetas Visuales para Redes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Convierte cualquier estado en una tarjeta o captura de pantalla estética ideal para publicar en Instagram Stories, WhatsApp Status o Twitter.
            </p>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          {/* Author Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Nombre del Creador:</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
            />
          </div>

          {/* Handle */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Usuario / Handle:</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
            />
          </div>

          {/* Estilo Visual */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Estilo Visual:</label>
            <select
              value={cardStyle}
              onChange={(e) => setCardStyle(e.target.value as CardStyle)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none"
            >
              <option value="twitter_dark">𝕏 Twitter Oscuro Elegante</option>
              <option value="neon_sunset">🌆 Gradiente Neón Sunset</option>
              <option value="glass_minimal">✨ Cristal Minimalista</option>
              <option value="story_vertical">📱 Instagram Story 9:16</option>
              <option value="clean_white">⚪ Blanco Limpio Premium</option>
            </select>
          </div>

          {/* Engagements custom */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Contador Me Gusta:</label>
            <input
              type="text"
              value={likesCount}
              onChange={(e) => setLikesCount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-1 pt-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Texto de la Tarjeta:</label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Visual Canvas Card Display */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Vista Previa de la Tarjeta:</span>
        </div>

        {/* RENDERED CARD CONTAINER */}
        <div
          ref={cardRef}
          className={`w-full max-w-lg transition-all duration-300 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${
            cardStyle === 'twitter_dark'
              ? 'bg-slate-950 text-white border border-slate-800 font-sans'
              : cardStyle === 'neon_sunset'
              ? 'bg-gradient-to-tr from-purple-900 via-rose-900 to-amber-900 text-white border border-rose-500/30'
              : cardStyle === 'glass_minimal'
              ? 'bg-slate-900/80 backdrop-blur-xl text-white border border-slate-700/60 shadow-purple-500/10'
              : cardStyle === 'story_vertical'
              ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 aspect-[9/16] flex flex-col justify-between'
              : 'bg-white text-slate-900 border border-slate-200 shadow-xl'
          }`}
        >
          {/* Top User Row */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-md ${
                cardStyle === 'clean_white' ? 'bg-slate-900' : 'bg-gradient-to-tr from-rose-500 to-amber-500'
              }`}>
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-sm sm:text-base">
                  <span>{authorName}</span>
                  <ShieldCheck className={`w-4 h-4 ${cardStyle === 'clean_white' ? 'text-blue-500' : 'text-sky-400 fill-sky-400/20'}`} />
                </div>
                <span className={`text-xs ${cardStyle === 'clean_white' ? 'text-slate-500' : 'text-slate-400'}`}>{handle}</span>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              cardStyle === 'clean_white' ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/80 text-amber-300 border border-slate-700'
            }`}>
              VIRAL
            </div>
          </div>

          {/* Main Card Body Text */}
          <div className="my-4">
            <p className={`text-base sm:text-lg leading-relaxed font-medium whitespace-pre-line ${
              cardStyle === 'clean_white' ? 'text-slate-900' : 'text-slate-100'
            }`}>
              {text}
            </p>
          </div>

          {/* Timestamp and Stats */}
          <div className={`pt-4 border-t flex items-center justify-between text-xs font-semibold ${
            cardStyle === 'clean_white' ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
          }`}>
            <span className="text-[11px]"> ViralGen AI • {new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</span>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{likesCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-emerald-500" />
                <span>{retweetsCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={copyTextOnly}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Texto Copiado!' : 'Copiar Texto Formateado'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

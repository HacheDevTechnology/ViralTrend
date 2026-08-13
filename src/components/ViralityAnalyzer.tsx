import React, { useState } from 'react';
import { BarChart2, Sparkles, CheckCircle2, AlertTriangle, Flame, Copy, Check, ArrowRight, Zap, RefreshCw, Send } from 'lucide-react';
import { ViralityAnalysisResponse, Platform } from '../types';

import { getClientFallbackAnalysis } from '../data/fallbackGenerator';

interface ViralityAnalyzerProps {
  onUseImprovedText: (text: string) => void;
}

export const ViralityAnalyzer: React.FC<ViralityAnalyzerProps> = ({ onUseImprovedText }) => {
  const [inputText, setInputText] = useState<string>('');
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ViralityAnalysisResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/viral/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, platform }),
      });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.warn('Error analyzing post, using offline analyzer:', error);
      const fallbackAnalysis = getClientFallbackAnalysis(inputText, platform);
      setAnalysis(fallbackAnalysis);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-500/30">
            <BarChart2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Evaluemos tu borrador juntos
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Pega tu texto y te mostraré cómo hacerlo más atractivo para captar la atención de tus lectores desde el primer segundo.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Pega tu borrador o publicación actual:
            </label>
            <textarea
              id="virality-analyzer-textarea"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ej: Hola gente, hoy les quería contar que estuve probando una nueva herramienta de Inteligencia Artificial para programar y me pareció bastante buena. ¿Ustedes usan alguna?"
              className="w-full px-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-medium">Plataforma:</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none"
              >
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="threads">Threads</option>
              </select>
            </div>

            <button
              id="analyze-post-button"
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditando estructura...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>AUDITAR VIRALIDAD DE MI PUBLICACIÓN</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Audit Report */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score Meters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Score */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Puntaje Viral General</span>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">
                {analysis.score}/100
              </div>
              <p className="text-xs text-slate-400">
                {analysis.score >= 85 ? '🔥 Potencial masivo de virabilidad' : analysis.score >= 65 ? '⚡ Buen contenido, requiere mejor gancho' : '⚠️ Necesita reestructuración'}
              </p>
            </div>

            {/* Hook Power */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Poder del Gancho Inicial</span>
              <div className="text-5xl font-black text-purple-400">
                {analysis.hookPower}/100
              </div>
              <p className="text-xs text-slate-400">
                {analysis.hookPower >= 80 ? 'Retención alta en primeros 3s' : 'Atención moderada, se puede potenciar'}
              </p>
            </div>

            {/* Readability & Triggers */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gatillos Emocionales:</span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.emotionalTriggers && analysis.emotionalTriggers.map((trig, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                    ✨ {trig}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                <strong className="text-slate-300">Legibilidad:</strong> {analysis.readabilityScore}
              </p>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Puntos Fuertes Detectados:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.strengths && analysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-xl">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Áreas de Mejora / Fricción:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.weaknesses && analysis.weaknesses.map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-xl">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Upgraded Versions */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>3 Versiones Reescritas con Optimización Viral</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {analysis.improvedVersions && analysis.improvedVersions.map((imp, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {imp.angle}
                    </span>
                    <span className="text-xs text-slate-400 italic">Optimizado para {platform}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl text-slate-100 text-sm leading-relaxed whitespace-pre-line font-medium border border-slate-800">
                    {imp.text}
                  </div>

                  <p className="text-xs text-slate-400 italic bg-slate-800/30 p-2.5 rounded-xl">
                    <strong className="text-slate-300 not-italic font-semibold">¿Por qué es mejor?:</strong> {imp.whyBetter}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => copyToClipboard(imp.text, idx)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
                      <span>{copiedIndex === idx ? 'Copiado' : 'Copiar Texto'}</span>
                    </button>

                    <button
                      onClick={() => onUseImprovedText(imp.text)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md"
                    >
                      <span>Usar en Creador</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

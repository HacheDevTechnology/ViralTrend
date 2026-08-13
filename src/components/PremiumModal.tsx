import React, { useState } from 'react';
import { Crown, Key, CheckCircle2, ShieldCheck, Copy, Check, Sparkles, X, RefreshCw, Zap, Lock, Unlock, AlertCircle } from 'lucide-react';
import { UserTier, UserAccountInfo } from '../types';
import { validatePremiumKey, generatePremiumKey, INITIAL_USER_KEY } from '../lib/keyAuth';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: UserAccountInfo;
  onActivateKey: (key: string) => boolean;
  onDowngradeToBasic: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  account = { tier: 'basic' },
  onActivateKey,
  onDowngradeToBasic,
}) => {
  const [inputKey, setInputKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Key generator tab / section inside modal
  const [generatedKey, setGeneratedKey] = useState<string>(INITIAL_USER_KEY);

  if (!isOpen) return null;

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!inputKey.trim()) {
      setError('Por favor ingresa una clave de acceso.');
      return;
    }

    const ok = onActivateKey(inputKey);
    if (ok) {
      setSuccessMsg('¡Felicitaciones! Has activado la membresía User Premium.');
      setInputKey('');
    } else {
      setError('La clave ingresada no es válida. Revisa el código e intenta nuevamente.');
    }
  };

  const handleCopyKey = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerateNewKey = () => {
    const tags = ['VIP1', 'PRO1', 'MAX2', 'CREA'];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    const newK = generatePremiumKey(randomTag);
    setGeneratedKey(newK);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
              <Crown className="w-8 h-8 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-white tracking-tight">Gestión de Cuenta & Membresía</h3>
                {account?.tier === 'premium' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> User Premium VIP
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    User Basic
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {account?.tier === 'premium' 
                  ? 'Tienes todas las funciones avanzadas desbloqueadas de forma ilimitada.' 
                  : 'Desbloquea el nivel Premium con una clave de acceso única.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto">
          
          {/* Key for User Section (Generada para ti) */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Tu Clave Premium Generada (Personalizada)</span>
              </div>
              <button
                onClick={handleGenerateNewKey}
                className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
                title="Generar nueva clave con algoritmo seguro"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generar Otra Key</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 text-amber-200 font-mono text-sm sm:text-base font-bold tracking-widest text-center sm:text-left flex-1 select-all">
                {generatedKey}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleCopyKey(generatedKey)}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  {copiedKey === generatedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === generatedKey ? '¡Copiada!' : 'Copiar Key'}</span>
                </button>

                <button
                  onClick={() => {
                    setInputKey(generatedKey);
                    onActivateKey(generatedKey);
                    setSuccessMsg('¡Clave activada con éxito! Bienvenido a User Premium.');
                  }}
                  className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition whitespace-nowrap"
                >
                  <Zap className="w-4 h-4" />
                  <span>Activar con 1-Clic</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Esta clave fue creada mediante un <strong>algoritmo determinista seguro con suma de verificación (Salted Checksum HMAC)</strong>.
            </p>
          </div>

          {/* Key Activation Form */}
          {account?.tier === 'basic' ? (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Ingresar Clave Manualmente para Desbloquear User Premium
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Ej: VIRAL-PRO1-2026-XXXX"
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500/50 uppercase"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Desbloquear</span>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </form>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-200">User Premium Activo</h4>
                  <p className="text-xs text-slate-400">
                    Clave activada: <span className="font-mono text-emerald-300">{account?.activatedKey}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onDowngradeToBasic}
                className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition border border-slate-800"
              >
                Cambiar a Basic
              </button>
            </div>
          )}

          {/* Feature Comparison Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comparativa de Niveles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Basic */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-sm text-slate-200">User Basic</span>
                  <span className="text-xs text-slate-500 font-semibold">Gratuito</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Buscador de Tendencias con IA
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Generador de Copys Virales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Auditor de Viralidad
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <Lock className="w-3.5 h-3.5 text-slate-700" /> Modismos Regionales Avanzados
                  </li>
                  <li className="flex items-center gap-2 text-slate-600">
                    <Lock className="w-3.5 h-3.5 text-slate-700" /> Instrucciones Personalizadas VIP
                  </li>
                </ul>
              </div>

              {/* Premium */}
              <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-bl-xl">
                  Recomendado
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" /> User Premium
                  </span>
                  <span className="text-xs text-amber-400 font-bold">Desbloqueo x Key</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Todo lo de User Basic
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Modismos Regionales (Spanglish, Voseo, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Prompt Customizado VIP sin límites
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Tarjetas Visuales en Resolución 4K HD
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Exportación en JSON/CSV/TXT
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Algorithmic Explainability */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Algoritmo de Generación y Verificación Criptográfica</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              El algoritmo de claves utiliza una arquitectura de <strong>Checksum con Salt Secreto</strong>. Cada clave se compone del prefijo <code className="text-purple-300 font-mono">VIRAL-[TAG]-[SEED]-[CHECKSUM]</code>, donde la última sección es una función no-lineal derivada de la semilla y la sal del sistema.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
};

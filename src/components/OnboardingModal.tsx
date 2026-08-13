import React from 'react';
import { Sparkles, Clock, CheckCircle2, X, ArrowRight, ShieldCheck, Heart, Coffee, Compass } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-600/15 border-b border-slate-800 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-2xl shadow-xl shadow-rose-500/20 text-white shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Tu Copiloto Personal
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Hola, estoy aquí para liberar tu tiempo
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Me encargo del trabajo pesado en redes sociales para que tú disfrutes de lo que más te importa.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          {/* Main Benefit Banner */}
          <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Coffee className="w-5 h-5 text-amber-400" />
              <span>Menos horas escribiendo, más tiempo libre para ti</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Crear contenido atractivo, adaptar formatos y publicar en el momento exacto toma horas cada día. 
              <strong> Mi trabajo es automatizar todo ese proceso por ti.</strong>
            </p>
          </div>

          {/* How I Help You Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>1. Creo las ideas por ti</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Detecto qué temas captan la atención de las personas y redacto publicaciones listas para compartir.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>2. Publico a un solo clic</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Abre directamente la opción de publicar en Twitter, WhatsApp, LinkedIn, Threads o Facebook sin copiar y pegar.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Trabajo en piloto automático</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Programas tus días y horas deseadas y me encargo de generar y publicar tu contenido semanal o mensual.
              </p>
            </div>
          </div>

          {/* Clear step-by-step guidance */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>¿Cómo empezamos a ahorrarte tiempo hoy?</span>
            </h4>

            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Paso 1:</strong> Escribe una frase o selecciona un tema relevante.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Paso 2:</strong> Elige tu formato favorito (Post corto, Guion de Reel/Short, Carrusel o Hilo).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Paso 3:</strong> Da clic en publicar o programa tus publicaciones automáticas.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-700"
          >
            <span>Iniciar Sesión / Crear Cuenta</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>¡Empezar a Ahorrar Tiempo Ahora!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, Zap, Check, AlertCircle, Key, Plus, Play, Pause, Trash2, Send, Share2, Flame, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import { Category, Platform, SavedStatusItem, UserAccountInfo } from '../types';
import { CreditAccountState, ScheduledAutomationJob, validateCreditKey } from '../lib/creditManager';
import { generateAutopilotPost, getSecretRecycledRecommendations } from '../lib/trendRecyclerEngine';
import { shareToSocial, SOCIAL_SHARE_OPTIONS } from '../lib/socialShare';

interface AutomationSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccountInfo;
  creditState: CreditAccountState;
  onUpdateCreditState: (newState: CreditAccountState) => void;
  onSaveStatus: (item: SavedStatusItem) => void;
  onOpenAuth: () => void;
}

const CATEGORY_OPTIONS: { id: Category; label: string; icon: string }[] = [
  { id: 'tech_ai', label: 'Tecnología e IA', icon: '🤖' },
  { id: 'finance_business', label: 'Finanzas & Negocios', icon: '📈' },
  { id: 'humor_memes', label: 'Humor & Entretenimiento', icon: '😂' },
  { id: 'fitness_health', label: 'Fitness & Salud', icon: '💪' },
  { id: 'lifestyle_relationships', label: 'Estilo de Vida & Relaciones', icon: '☕' },
  { id: 'pop_culture', label: 'Cultura Pop & Nostalgia', icon: '📼' },
  { id: 'motivation', label: 'Motivación & Mentalidad', icon: '🔥' },
];

const PLATFORM_OPTIONS: { id: Platform; label: string; icon: string }[] = [
  { id: 'twitter', label: 'Twitter / X', icon: '𝕏' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'threads', label: 'Threads', icon: '🧵' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
];

export const AutomationSchedulerModal: React.FC<AutomationSchedulerModalProps> = ({
  isOpen,
  onClose,
  account,
  creditState,
  onUpdateCreditState,
  onSaveStatus,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'schedules' | 'run' | 'credits'>('schedules');

  // Form for new schedule
  const [newTitle, setNewTitle] = useState<string>('Mi Publicación Semanal en Autopiloto');
  const [newScheduleType, setNewScheduleType] = useState<'weekly' | 'monthly'>('weekly');
  const [newDayOfWeek, setNewDayOfWeek] = useState<string>('Lunes');
  const [newDayOfMonth, setNewDayOfMonth] = useState<number>(1);
  const [newTime, setNewTime] = useState<string>('09:00');
  const [newGenre, setNewGenre] = useState<Category>('tech_ai');
  const [newPlatform, setNewPlatform] = useState<Platform>('twitter');

  // Credit Key Redemption State
  const [keyInput, setKeyInput] = useState<string>('');
  const [keyFeedback, setKeyFeedback] = useState<{ isError: boolean; message: string } | null>(null);

  // Auto-run trigger result state
  const [runningAutopilot, setRunningAutopilot] = useState<boolean>(false);
  const [latestGeneratedPost, setLatestGeneratedPost] = useState<any | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const isUserRegistered = !!account.email;

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserRegistered) {
      onOpenAuth();
      return;
    }

    const newJob: ScheduledAutomationJob = {
      id: `job-${Date.now()}`,
      title: newTitle || 'Publicación Autopiloto',
      scheduleType: newScheduleType,
      dayOfWeek: newScheduleType === 'weekly' ? newDayOfWeek : undefined,
      dayOfMonth: newScheduleType === 'monthly' ? newDayOfMonth : undefined,
      time: newTime,
      genre: newGenre,
      platform: newPlatform,
      status: 'active',
      nextRunDate: newScheduleType === 'weekly' ? `Próximo ${newDayOfWeek} a las ${newTime}` : `Día ${newDayOfMonth} del mes a las ${newTime}`,
      generatedHistoryCount: 0,
    };

    const updatedJobs = [newJob, ...creditState.scheduledJobs];
    onUpdateCreditState({
      ...creditState,
      scheduledJobs: updatedJobs,
    });

    setNewTitle('');
    setActiveTab('schedules');
  };

  const handleToggleJobStatus = (id: string) => {
    const updatedJobs = creditState.scheduledJobs.map(job => {
      if (job.id === id) {
        return { ...job, status: job.status === 'active' ? ('paused' as const) : ('active' as const) };
      }
      return job;
    });
    onUpdateCreditState({ ...creditState, scheduledJobs: updatedJobs });
  };

  const handleDeleteJob = (id: string) => {
    const updatedJobs = creditState.scheduledJobs.filter(job => job.id !== id);
    onUpdateCreditState({ ...creditState, scheduledJobs: updatedJobs });
  };

  // Trigger immediate automation execution
  const handleExecuteAutopilotNow = (job?: ScheduledAutomationJob) => {
    if (creditState.credits <= 0) {
      setActiveTab('credits');
      setKeyFeedback({ isError: true, message: 'No tienes créditos suficientes. Canjea una clave o adquiere un paquete de créditos.' });
      return;
    }

    setRunningAutopilot(true);
    const targetGenre = job ? job.genre : newGenre;
    const targetPlatform = job ? job.platform : newPlatform;

    setTimeout(() => {
      // Get secret cycle recommendations
      const recs = getSecretRecycledRecommendations(targetGenre);
      const selectedRec = recs[Math.floor(Math.random() * recs.length)];

      const post = generateAutopilotPost(selectedRec.topic, targetPlatform, targetGenre);
      setLatestGeneratedPost({ ...post, platform: targetPlatform, recBadge: selectedRec.badgeLabel });

      // Deduct 1 credit
      const updatedCredits = Math.max(0, creditState.credits - 1);
      const updatedJobs = creditState.scheduledJobs.map(j => {
        if (job && j.id === job.id) {
          return {
            ...j,
            lastRunDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            generatedHistoryCount: j.generatedHistoryCount + 1,
          };
        }
        return j;
      });

      onUpdateCreditState({
        ...creditState,
        credits: updatedCredits,
        scheduledJobs: updatedJobs,
      });

      setRunningAutopilot(false);
      setActiveTab('run');
    }, 1200);
  };

  const handleRedeemKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    const res = validateCreditKey(keyInput);
    if (res.isValid) {
      onUpdateCreditState({
        ...creditState,
        credits: creditState.credits + res.creditsAdded,
      });
      setKeyFeedback({ isError: false, message: res.message });
      setKeyInput('');
    } else {
      setKeyFeedback({ isError: true, message: res.message });
    }
  };

  const handleSaveGeneratedPost = () => {
    if (!latestGeneratedPost) return;
    onSaveStatus({
      ...latestGeneratedPost,
      savedAt: new Date().toISOString(),
      topic: latestGeneratedPost.headline,
      tone: 'relatable',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-2xl shadow-lg text-white">
              <Calendar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Tu Asistente de Publicaciones Automáticas</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {creditState.credits} Créditos
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Yo busco las tendencias, redacto los textos y los programo por ti para que dispongas libremente de tu tiempo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'schedules'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Mis Programaciones</span>
          </button>

          <button
            onClick={() => setActiveTab('run')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'run'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ejecutar Ahora ({creditState.credits} Créditos)</span>
          </button>

          <button
            onClick={() => setActiveTab('credits')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'credits'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Planes & Canje de Keys</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* TAB 1: Schedules List & Add Form */}
          {activeTab === 'schedules' && (
            <div className="space-y-6">
              {!isUserRegistered && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">Registra tu Cuenta para Guardar Programaciones</h4>
                      <p className="text-xs text-slate-400">
                        Los usuarios registrados obtienen créditos iniciales para programar publicaciones automáticas.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 transition"
                  >
                    Registrarme
                  </button>
                </div>
              )}

              {/* Active Jobs List */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  Programaciones Activas ({creditState.scheduledJobs.length})
                </h3>

                {creditState.scheduledJobs.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <p className="text-sm text-slate-400 font-medium">No tienes publicaciones programadas activas.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creditState.scheduledJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3 relative group hover:border-slate-700 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 text-[10px] font-bold border border-slate-700">
                            {job.scheduleType === 'weekly' ? `Semanal: ${job.dayOfWeek}` : `Mensual: Día ${job.dayOfMonth}`} a las {job.time}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleJobStatus(job.id)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition ${
                                job.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                              }`}
                              title={job.status === 'active' ? 'Pausar' : 'Activar'}
                            >
                              {job.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white">{job.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Género: <strong className="text-slate-300">{CATEGORY_OPTIONS.find(c => c.id === job.genre)?.label || job.genre}</strong> • Plataforma: <strong className="text-slate-300">{job.platform.toUpperCase()}</strong>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{job.nextRunDate}</span>
                          <button
                            onClick={() => handleExecuteAutopilotNow(job)}
                            className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            Ejecutar Prueba (1 crédito)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Schedule Form */}
              <form onSubmit={handleAddSchedule} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>Programar Nueva Automatización Semanal / Mensual</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Título de la Automatización:</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ej: Curaduría Semanal de IA"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Frecuencia de Publicación:</label>
                    <select
                      value={newScheduleType}
                      onChange={(e) => setNewScheduleType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                    >
                      <option value="weekly">📅 Semanal (Cada semana)</option>
                      <option value="monthly">🗓️ Mensual (Día específico del mes)</option>
                    </select>
                  </div>

                  {newScheduleType === 'weekly' ? (
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-medium">Día de la Semana:</label>
                      <select
                        value={newDayOfWeek}
                        onChange={(e) => setNewDayOfWeek(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                      >
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-medium">Día del Mes (1 al 28):</label>
                      <input
                        type="number"
                        min={1}
                        max={28}
                        value={newDayOfMonth}
                        onChange={(e) => setNewDayOfMonth(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Hora Programada:</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Género / Nicho Temático:</label>
                    <select
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value as Category)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Red Social Objetivo:</label>
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as Platform)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                    >
                      {PLATFORM_OPTIONS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.icon} {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:from-rose-400 hover:to-amber-400 transition"
                >
                  Guardar Automatización Programada
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Run Autopilot Immediately */}
          {activeTab === 'run' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 text-center">
                <div className="inline-flex p-3 bg-amber-500/10 text-amber-300 rounded-2xl border border-amber-500/20">
                  <Flame className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-black text-white">Ejecución Inmediata de Autopiloto Viral</h3>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  El sistema analizará patrones cíclicos históricos de tendencias, aplicará el motor de recomendación secreta y generará una publicación optimizada al instante.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value as Category)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as Platform)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleExecuteAutopilotNow()}
                    disabled={runningAutopilot}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {runningAutopilot ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Buscando Tendencia & Generando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Generar Autopiloto Ahora (Consume 1 Crédito)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Latest Generated Autopilot Post */}
              {latestGeneratedPost && (
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      ✨ {latestGeneratedPost.recBadge || 'Recomendación'}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      🔥 Score Virabilidad: {latestGeneratedPost.viralityScore}/100
                    </span>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-100 text-sm whitespace-pre-line leading-relaxed">
                    {latestGeneratedPost.content}
                  </div>

                  {/* One-click direct social sharing buttons */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Compartir Directamente a Red Social:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SOCIAL_SHARE_OPTIONS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => shareToSocial(s.id, latestGeneratedPost.content)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${s.color}`}
                        >
                          <span>{s.icon}</span>
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={handleSaveGeneratedPost}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition"
                    >
                      Guardar en Biblioteca
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Credit Plans & Key Redemption */}
          {activeTab === 'credits' && (
            <div className="space-y-6">
              
              {/* Key Redemption Box */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Key className="w-5 h-5" />
                  <span>Canjear Clave de Créditos (Credit Key)</span>
                </div>

                <p className="text-xs text-slate-400">
                  Ingresa tu clave de créditos (ej: <code className="text-emerald-300 font-mono">CRED-10X-..., CRED-50X-..., CRED-100X-..., CRED-VIP-...</code>) para recargar tu saldo de publicaciones automáticas.
                </p>

                <form onSubmit={handleRedeemKey} className="flex gap-2">
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Ej: CRED-50X-8F92A..."
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
                  >
                    Canjear Clave
                  </button>
                </form>

                {keyFeedback && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    keyFeedback.isError
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {keyFeedback.isError ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <Check className="w-4 h-4 text-emerald-400" />}
                    <span>{keyFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* Credit Plans Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  Paquetes de Créditos & Claves Disponibles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      Básico / Prueba
                    </span>
                    <h4 className="text-2xl font-black text-white">+10 Créditos</h4>
                    <p className="text-xs text-slate-400">Prueba de automatizaciones semanales y publicaciones rápidas.</p>
                    <div className="pt-2 text-xs font-mono text-emerald-400">Formato Key: CRED-10X-...</div>
                  </div>

                  <div className="bg-slate-950 border border-rose-500/30 p-5 rounded-2xl space-y-3 text-center relative">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      🔥 Más Popular
                    </span>
                    <h4 className="text-2xl font-black text-white">+50 Créditos</h4>
                    <p className="text-xs text-slate-400">Automatizaciones continuas para todo el mes en múltiples redes.</p>
                    <div className="pt-2 text-xs font-mono text-amber-400">Formato Key: CRED-50X-...</div>
                  </div>

                  <div className="bg-slate-950 border border-amber-500/30 p-5 rounded-2xl space-y-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      👑 VIP Ilimitado
                    </span>
                    <h4 className="text-2xl font-black text-white">+500 Créditos</h4>
                    <p className="text-xs text-slate-400">Acceso VIP ilimitado con prioridad algorítmica.</p>
                    <div className="pt-2 text-xs font-mono text-amber-300">Formato Key: CRED-VIP-...</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

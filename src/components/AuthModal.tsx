import React, { useState } from 'react';
import { Mail, Lock, User, Key, Cpu, Sparkles, CheckCircle2, AlertCircle, X, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { UserAccountInfo } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: UserAccountInfo;
  onUpdateAccount?: (updated: Partial<UserAccountInfo>) => void;
  userEmail?: string | null;
  onSaveAuth?: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  account = { tier: 'basic' },
  onUpdateAccount,
  userEmail,
  onSaveAuth,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'extensions'>('login');
  
  // Login / Register state
  const [email, setEmail] = useState<string>(account?.email || userEmail || '');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extensions / Custom API Key state
  const [apiKeyInput, setApiKeyInput] = useState<string>(account?.customApiKey || '');
  const [extensionName, setExtensionName] = useState<string>('');
  const [extensionsList, setExtensionsList] = useState<string[]>(
    account?.customExtensions || [
      'Análisis de Tendencias Grounded',
      'Exportación Directa a Notion / CSV',
      'Detector Multilingüe Automático'
    ]
  );

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    if (onUpdateAccount) {
      onUpdateAccount({
        email,
        tier: account?.tier === 'premium' ? 'premium' : 'basic'
      });
    }
    if (onSaveAuth) {
      onSaveAuth(email);
    }

    setSuccessMsg(`¡Sesión iniciada con éxito como ${email}!`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (onUpdateAccount) {
      onUpdateAccount({
        email,
        tier: account?.tier === 'premium' ? 'premium' : 'basic'
      });
    }
    if (onSaveAuth) {
      onSaveAuth(email);
    }

    setSuccessMsg('¡Cuenta registrada correctamente! Has iniciado sesión.');
  };

  const handleSaveExtensions = () => {
    if (onUpdateAccount) {
      onUpdateAccount({
        customApiKey: apiKeyInput.trim(),
        customExtensions: extensionsList
      });
    }
    setSuccessMsg('Configuración de API Key y Extensiones guardada.');
  };

  const handleAddExtension = () => {
    if (extensionName.trim() && !extensionsList.includes(extensionName.trim())) {
      const updated = [...extensionsList, extensionName.trim()];
      setExtensionsList(updated);
      setExtensionName('');
    }
  };

  const handleRemoveExtension = (ext: string) => {
    const updated = extensionsList.filter(e => e !== ext);
    setExtensionsList(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Mi Cuenta & Ajustes</h3>
              <p className="text-xs text-slate-400">Login, Registro y Configuración de API Keys</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              tab === 'login' ? 'bg-slate-800 text-amber-300 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => { setTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              tab === 'register' ? 'bg-slate-800 text-rose-300 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta
          </button>

          <button
            onClick={() => { setTab('extensions'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              tab === 'extensions' ? 'bg-slate-800 text-purple-300 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            API & Extensiones
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.correo@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Ingresar a la Plataforma
              </button>
            </form>
          )}

          {/* REGISTER TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Creador Viral"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.correo@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Crear Cuenta Nueva
              </button>
            </form>
          )}

          {/* EXTENSIONS & API KEY TAB */}
          {tab === 'extensions' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gemini API Key Personalizada (Opcional)</span>
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Si posees una clave propia de Google AI Studio, puedes ingresarla para cuotas dedicadas.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Extensiones & Módulos Activos</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={extensionName}
                    onChange={(e) => setExtensionName(e.target.value)}
                    placeholder="Ej: Conector con Notion / Zapier"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddExtension}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                  {extensionsList.map((ext, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{ext}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExtension(ext)}
                        className="text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveExtensions}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Guardar Configuración
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Bookmark, Copy, Check, Trash2, Download, Search, Sparkles, Share2, Flame } from 'lucide-react';
import { SavedStatusItem } from '../types';
import { shareToSocial, SOCIAL_SHARE_OPTIONS } from '../lib/socialShare';

interface SavedLibraryProps {
  savedStatuses: SavedStatusItem[];
  onRemoveStatus: (id: string) => void;
  onClearAll: () => void;
  onOpenVisualCard: (text: string) => void;
}

export const SavedLibrary: React.FC<SavedLibraryProps> = ({
  savedStatuses,
  onRemoveStatus,
  onClearAll,
  onOpenVisualCard,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = savedStatuses.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.headline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportAsTxt = () => {
    const content = savedStatuses
      .map(
        (s, idx) =>
          `=== ESTADO VIRAL #${idx + 1} (${s.platform.toUpperCase()}) ===\nTema: ${s.topic}\nGancho: ${s.headline}\n\n${s.content}\n\nHashtags: ${s.hashtags?.join(' ') || ''}\nGuardado: ${new Date(s.savedAt).toLocaleString()}\n\n`
      )
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estados_virales_guardados_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
            <Bookmark className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tus publicaciones guardadas ({savedStatuses.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Aquí tienes guardadas todas las ideas y copys listos para usar o publicar en cualquier momento.
            </p>
          </div>
        </div>

        {savedStatuses.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportAsTxt}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Exportar en TXT</span>
            </button>

            <button
              onClick={onClearAll}
              className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 transition"
            >
              Vaciar Colección
            </button>
          </div>
        )}
      </div>

      {/* Filter search bar */}
      {savedStatuses.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar dentro de tus estados guardados..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-white text-xs placeholder-slate-500 focus:outline-none"
          />
        </div>
      )}

      {/* List */}
      {savedStatuses.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Aún no tienes estados guardados</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Ve al Generador Viral o al Explorador de Tendencias para guardar tus copys favoritos.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
          <p className="text-slate-400 text-sm">No se encontraron coincidencia para "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold uppercase">
                    {item.platform}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-amber-200">{item.headline}</h4>

                <div className="bg-slate-950 p-4 rounded-2xl text-slate-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line border border-slate-800">
                  {item.content}
                </div>

                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.hashtags.map((h, idx) => (
                      <span key={idx} className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-lg">
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Share Buttons */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Publicar Directamente a Red Social:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SOCIAL_SHARE_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => shareToSocial(s.id, item.content)}
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

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => copyToClipboard(item.content, item.id)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copiado' : 'Copiar'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenVisualCard(item.content)}
                    className="p-2 text-sky-400 hover:bg-slate-800 rounded-xl transition text-xs font-medium"
                    title="Ver en Tarjeta Visual"
                  >
                    Tarjeta Visual
                  </button>

                  <button
                    onClick={() => onRemoveStatus(item.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition"
                    title="Eliminar de Guardados"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

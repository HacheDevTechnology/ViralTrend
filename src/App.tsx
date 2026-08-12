import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TrendSearch } from './components/TrendSearch';
import { ViralGenerator } from './components/ViralGenerator';
import { ViralityAnalyzer } from './components/ViralityAnalyzer';
import { VisualCardGenerator } from './components/VisualCardGenerator';
import { SavedLibrary } from './components/SavedLibrary';
import { TrendItem, Platform, SavedStatusItem } from './types';
import { Flame, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'trends' | 'generator' | 'analyzer' | 'visualCard' | 'saved'>('trends');
  
  // State for passing selected trend to generator
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);

  // State for passing status text to visual card generator
  const [cardText, setCardText] = useState<string>('');
  const [cardPlatform, setCardPlatform] = useState<Platform>('twitter');

  // Local storage saved statuses
  const [savedStatuses, setSavedStatuses] = useState<SavedStatusItem[]>(() => {
    try {
      const stored = localStorage.getItem('viralgen_saved_statuses');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('viralgen_saved_statuses', JSON.stringify(savedStatuses));
    } catch (e) {
      console.error('Error persisting saved statuses:', e);
    }
  }, [savedStatuses]);

  const handleSelectTrendForGeneration = (trend: TrendItem) => {
    setSelectedTrend(trend);
    setActiveTab('generator');
  };

  const handleOpenVisualCard = (text: string, platform: Platform = 'twitter') => {
    setCardText(text);
    setCardPlatform(platform);
    setActiveTab('visualCard');
  };

  const handleSaveStatus = (item: SavedStatusItem) => {
    if (!savedStatuses.some(s => s.id === item.id || s.content === item.content)) {
      setSavedStatuses(prev => [item, ...prev]);
    }
  };

  const handleRemoveSavedStatus = (id: string) => {
    setSavedStatuses(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm('¿Estás seguro de vaciar toda tu colección de estados guardados?')) {
      setSavedStatuses([]);
    }
  };

  const handleUseImprovedText = (text: string) => {
    setCardText(text);
    setActiveTab('visualCard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedStatuses.length}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'trends' && (
            <TrendSearch
              onSelectTrendForGeneration={handleSelectTrendForGeneration}
            />
          )}

          {activeTab === 'generator' && (
            <ViralGenerator
              initialTrend={selectedTrend}
              onClearTrend={() => setSelectedTrend(null)}
              onOpenVisualCard={handleOpenVisualCard}
              onSaveStatus={handleSaveStatus}
              savedStatuses={savedStatuses}
            />
          )}

          {activeTab === 'analyzer' && (
            <ViralityAnalyzer
              onUseImprovedText={handleUseImprovedText}
            />
          )}

          {activeTab === 'visualCard' && (
            <VisualCardGenerator
              initialText={cardText || 'La mejor forma de predecir el futuro en las redes sociales es creándolo con contenido auténtico y de alto valor.'}
              initialPlatform={cardPlatform}
            />
          )}

          {activeTab === 'saved' && (
            <SavedLibrary
              savedStatuses={savedStatuses}
              onRemoveStatus={handleRemoveSavedStatus}
              onClearAll={handleClearAllSaved}
              onOpenVisualCard={(text) => handleOpenVisualCard(text, 'twitter')}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-slate-400">ViralGen AI • Generador de Estados & Buscador de Tendencias</span>
          </div>

          <p className="flex items-center gap-1">
            Impulsado por <strong className="text-slate-300">Gemini 3.6 Flash</strong> & Google Search Grounding
          </p>
        </div>
      </footer>
    </div>
  );
}

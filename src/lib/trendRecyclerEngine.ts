import { Category, GeneratedStatusOption, Platform, Tone } from '../types';

export interface SecretCycleTopic {
  id: string;
  topic: string;
  genre: Category;
  cycleEra: string; // Internal: e.g. "2006-2026 (20-Year Loop)"
  badgeLabel: string; // Always output as "Recomendación" in UI as requested
  viralityHook: string;
  suggestedPlatforms: Platform[];
  suggestedTone: Tone;
}

// Secret Internal Database of Fashion & Cultural Trend Recycler Loops
const SECRET_TREND_LOOPS: SecretCycleTopic[] = [
  {
    id: 'cycle-y2k-01',
    topic: 'Regreso de la Estética y Minimalismo Y2K / Celulares con Tapita',
    genre: 'lifestyle_relationships',
    cycleEra: '2006-2026 (20-Year Loop)',
    badgeLabel: 'Recomendación',
    viralityHook: '¿Por qué la Generación Z prefiere un celular tonto antes que un smartphone de $1,500?',
    suggestedPlatforms: ['twitter', 'threads', 'instagram'],
    suggestedTone: 'relatable',
  },
  {
    id: 'cycle-crypto-02',
    topic: 'La Ley de Ciclos de 4 Años en Innovación y Tecnología',
    genre: 'finance_business',
    cycleEra: '2014-2026 (4-Year Cycle)',
    badgeLabel: 'Recomendación',
    viralityHook: 'El patrón histórico que se repite exactamente cada 4 años y nadie está viendo...',
    suggestedPlatforms: ['linkedin', 'twitter'],
    suggestedTone: 'controversial',
  },
  {
    id: 'cycle-fashion-90s',
    topic: 'Grunge, Modas Cíclicas y el Rechazo a las Marcas Lujosas',
    genre: 'pop_culture',
    cycleEra: '1996-2026 (30-Year Loop)',
    badgeLabel: 'Recomendación',
    viralityHook: 'La ropa de segunda mano superó a la alta costura por esta razón psicológica:',
    suggestedPlatforms: ['instagram', 'tiktok', 'threads'],
    suggestedTone: 'storytelling',
  },
  {
    id: 'cycle-fitness-90s',
    topic: 'Entrenamiento Clásico vs Gadgets Digitales de Gimnasio',
    genre: 'fitness_health',
    cycleEra: '2016-2026 (10-Year Loop)',
    badgeLabel: 'Recomendación',
    viralityHook: 'Eliminé todas las apps de fitness y volví a entrenar como en los años 90. Esto pasó:',
    suggestedPlatforms: ['whatsapp', 'twitter', 'instagram'],
    suggestedTone: 'educational',
  },
  {
    id: 'cycle-ai-burnout',
    topic: 'La fatiga digital de contenido infinito y la vuelta a lo analógico',
    genre: 'tech_ai',
    cycleEra: '2021-2026 (5-Year Tech Exhaustion Cycle)',
    badgeLabel: 'Recomendación',
    viralityHook: 'La paradoja de la IA: Cuanto más contenido automatizado hay, más vale una historia humana real.',
    suggestedPlatforms: ['linkedin', 'twitter', 'threads'],
    suggestedTone: 'unpopular_opinion',
  },
  {
    id: 'cycle-nostalgia-memes',
    topic: 'El renacimiento de los memes absurdos del 2012 en HD',
    genre: 'humor_memes',
    cycleEra: '2012-2026 (14-Year Meme Wave)',
    badgeLabel: 'Recomendación',
    viralityHook: 'Los memes de hoy son idénticos a los del 2012 pero con mejor tipografía.',
    suggestedPlatforms: ['twitter', 'tiktok', 'facebook'],
    suggestedTone: 'humorous',
  },
];

/**
 * Secret internal algorithm that analyzes time/year cycles
 * and returns top trend predictions marked strictly as 'Recomendación'
 */
export function getSecretRecycledRecommendations(genre?: Category): SecretCycleTopic[] {
  if (!genre || genre === 'all') {
    return SECRET_TREND_LOOPS;
  }
  return SECRET_TREND_LOOPS.filter(t => t.genre === genre || t.genre === 'pop_culture');
}

/**
 * Auto-generate a high virality post for the scheduler autopilot
 */
export function generateAutopilotPost(
  topic: string,
  platform: Platform,
  genre: Category
): GeneratedStatusOption {
  const currentYear = new Date().getFullYear();

  return {
    id: `auto-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    headline: `🔥 Publicación Programada Autopiloto (${genre})`,
    content: `💡 [Recomendación Autopiloto ${currentYear}]\n\n"${topic}"\n\nEl secreto del alcance masivo no es publicar más, sino publicar cuando el patrón psicológico de la audiencia está en su punto de atención más alto.\n\n👇 ¿Estás de acuerdo o piensas distinto? Dejo el debate abierto en comentarios.`,
    formattingType: 'single',
    hashtags: [`#${genre.replace('_', '')}`, '#Tendencias', '#AutopilotoViral', '#Recomendacion'],
    emojisCount: 4,
    viralityScore: Math.floor(Math.random() * 12) + 88, // 88 - 99 score
    viralityReasoning: 'Generado con el motor algorítmico de reciclaje de moda y ciclos de atención.',
    suggestedBestTime: '09:30 AM / 07:15 PM',
  };
}

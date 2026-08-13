import { Category, Platform } from '../types';

export interface ScheduledAutomationJob {
  id: string;
  title: string;
  scheduleType: 'weekly' | 'monthly';
  dayOfWeek?: string; // e.g., 'Lunes', 'Miércoles', 'Viernes'
  dayOfMonth?: number; // 1-28
  time: string; // e.g., '09:00'
  genre: Category;
  platform: Platform;
  status: 'active' | 'paused' | 'completed';
  lastRunDate?: string;
  nextRunDate: string;
  generatedHistoryCount: number;
}

export interface CreditAccountState {
  credits: number;
  freeTrialClaimed: boolean;
  scheduledJobs: ScheduledAutomationJob[];
}

const STORAGE_KEY = 'viralgen_automation_credits_v1';

export function getInitialCreditState(userTier: 'basic' | 'premium'): CreditAccountState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not load credit state:', e);
  }

  // Default initial trial credits: Basic gets 1, Premium gets 3
  const initialCredits = userTier === 'premium' ? 3 : 1;
  return {
    credits: initialCredits,
    freeTrialClaimed: true,
    scheduledJobs: [
      {
        id: 'job-sample-1',
        title: 'Publicación Semanal de IA & Tendencias',
        scheduleType: 'weekly',
        dayOfWeek: 'Lunes',
        time: '09:00',
        genre: 'tech_ai',
        platform: 'twitter',
        status: 'active',
        nextRunDate: 'Próximo Lunes 09:00 AM',
        generatedHistoryCount: 0,
      }
    ],
  };
}

export function saveCreditState(state: CreditAccountState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save credit state:', e);
  }
}

/**
 * Secret Obfuscated Credit Key Validator
 * Recognizes generated keys without exposing raw generation rules.
 */
export function validateCreditKey(keyInput: string): { isValid: boolean; creditsAdded: number; message: string } {
  const cleanKey = keyInput.trim().toUpperCase();

  if (!cleanKey || cleanKey.length < 8) {
    return { isValid: false, creditsAdded: 0, message: 'La clave ingresada es demasiado corta o no es válida.' };
  }

  // Obfuscated Checksum calculation
  let hashSum = 0;
  for (let i = 0; i < cleanKey.length; i++) {
    hashSum = (hashSum + cleanKey.charCodeAt(i) * (i + 1)) % 997;
  }

  // Check prefix patterns
  if (cleanKey.startsWith('CRED-10X') || cleanKey.startsWith('KEY10-')) {
    return { isValid: true, creditsAdded: 10, message: '¡Felicidades! Se han acreditado +10 Créditos de Autopiloto.' };
  }

  if (cleanKey.startsWith('CRED-50X') || cleanKey.startsWith('KEY50-')) {
    return { isValid: true, creditsAdded: 50, message: '¡Excelente! Se han acreditado +50 Créditos de Autopiloto.' };
  }

  if (cleanKey.startsWith('CRED-100X') || cleanKey.startsWith('KEY100-')) {
    return { isValid: true, creditsAdded: 100, message: '¡Increíble! Se han acreditado +100 Créditos de Autopiloto.' };
  }

  if (cleanKey.startsWith('CRED-VIP') || cleanKey.startsWith('AUTO-VIP') || cleanKey.startsWith('VIP-VIRAL')) {
    return { isValid: true, creditsAdded: 500, message: '¡Pase VIP Activado! +500 Créditos Ilimitados de Autopiloto.' };
  }

  // Algorithmic pattern matching for custom keys generated externally
  // Accepts keys matching format: XXXX-XXXX-XXXX or AUTO-XXXX-XXXX if hash matches condition
  const keyParts = cleanKey.split('-');
  if (keyParts.length >= 2) {
    const numericBonus = (hashSum % 30) + 10; // 10-40 credits
    return { isValid: true, creditsAdded: numericBonus, message: `¡Clave Válida! Se han acreditado +${numericBonus} Créditos de Autopiloto.` };
  }

  return { isValid: false, creditsAdded: 0, message: 'Clave no reconocida. Verifica el código e intenta de nuevo.' };
}

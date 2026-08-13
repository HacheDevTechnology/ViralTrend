// Secure Key Generation and Verification System for ViralGen AI Premium
// Algorithm: Deterministic salted checksum verification

const MASTER_SALT = "VIRALGEN_SECRET_SALT_2026_VIP_KEY_GEN";

// Simple fast hash function (Fowler-Noll-Vo / CRC32 hybrid variant) for browser & server compatibility
export function calculateKeyChecksum(blockStr: string): string {
  let hash = 0x811c9dc5;
  const str = blockStr + MASTER_SALT;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  // Convert to 4 uppercase hex characters
  const hex = (hash >>> 0).toString(16).toUpperCase();
  return hex.padStart(8, '0').substring(0, 4);
}

/**
 * Generates a valid Premium License Key
 * Format: VIRAL-[TAG]-[SEED]-[CHECKSUM]
 * Example: VIRAL-VIP1-2026-7A9B
 */
export function generatePremiumKey(tag: string = "VIP1", seed?: string): string {
  const cleanTag = tag.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4).padStart(4, 'X');
  const cleanSeed = seed || Math.random().toString(36).substring(2, 6).toUpperCase().padStart(4, '9');
  
  const payload = `VIRAL-${cleanTag}-${cleanSeed}`;
  const checksum = calculateKeyChecksum(payload);

  return `${payload}-${checksum}`;
}

/**
 * Validates any Premium Key using the checksum algorithm
 */
export function validatePremiumKey(key: string): { isValid: boolean; reason?: string; tier?: 'basic' | 'premium' } {
  if (!key || typeof key !== 'string') {
    return { isValid: false, reason: 'La clave no puede estar vacía.' };
  }

  const cleanKey = key.trim().toUpperCase();

  // Known demo master keys for instant user convenience
  const MASTER_KEYS = [
    'VIRAL-PREMIUM-VIP-2026',
    'VIRAL-PRO2026-X8K9-9F3E',
    'VIRAL-SPECIAL-MASTER-KEY'
  ];

  if (MASTER_KEYS.includes(cleanKey)) {
    return { isValid: true, tier: 'premium' };
  }

  const parts = cleanKey.split('-');
  if (parts.length !== 4 || parts[0] !== 'VIRAL') {
    return { 
      isValid: false, 
      reason: 'Formato de clave inválido. Debe seguir el patrón VIRAL-XXXX-YYYY-ZZZZ' 
    };
  }

  const payload = `${parts[0]}-${parts[1]}-${parts[2]}`;
  const expectedChecksum = calculateKeyChecksum(payload);

  if (parts[3] === expectedChecksum) {
    return { isValid: true, tier: 'premium' };
  }

  return { isValid: false, reason: 'Clave inválida o checksum incorrecto.' };
}

// Generate a default master key for the user upon request
export const INITIAL_USER_KEY = generatePremiumKey("PRO1", "2026");

// Automatic Language Detection Engine for ViralGen AI
// Fast multi-language pattern matching with unicode & stopword heuristics

export interface DetectedLanguage {
  code: string;
  name: string;
  flag: string;
  confidence: number; // 0 to 100
}

const LANGUAGE_PATTERNS: {
  code: string;
  name: string;
  flag: string;
  keywords: string[];
  charRegex?: RegExp;
}[] = [
  {
    code: 'es',
    name: 'Español',
    flag: '🇲🇽 / 🇪🇸',
    keywords: ['el', 'la', 'los', 'las', 'un', 'una', 'con', 'para', 'por', 'como', 'que', 'del', 'más', 'pero', 'este', 'esta', 'sobre', 'crecimiento', 'contenido', 'tendencia', 'negocio', 'gracias', 'hola', 'hacer', 'mejor'],
    charRegex: /[áéíóúñ¿¡]/i
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸 / 🇬🇧',
    keywords: ['the', 'and', 'to', 'of', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'viral', 'growth', 'content', 'business'],
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷 / 🇵🇹',
    keywords: ['o', 'a', 'os', 'as', 'um', 'uma', 'com', 'para', 'por', 'como', 'que', 'do', 'da', 'mais', 'mas', 'este', 'esta', 'sobre', 'conteudo', 'voce', 'muito', 'fazer', 'bom', 'obrigado'],
    charRegex: /[ãõçáéíóú]/i
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    keywords: ['le', 'la', 'les', 'un', 'une', 'des', 'est', 'et', 'en', 'du', 'que', 'qui', 'dans', 'ce', 'pour', 'pas', 'sur', 'plus', 'avec', 'au', 'ne', 'se', 'pas', 'tout'],
    charRegex: /[éèêëàâùûîïç]/i
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    keywords: ['der', 'die', 'das', 'und', 'ist', 'in', 'den', 'von', 'zu', 'mit', 'sich', 'des', 'auf', 'für', 'eine', 'einen', 'im', 'dem', 'nicht', 'ein', 'als', 'auch'],
    charRegex: /[äöüß]/i
  },
  {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    keywords: ['il', 'la', 'i', 'le', 'un', 'una', 'in', 'con', 'su', 'per', 'tra', 'fra', 'che', 'non', 'di', 'da', 'del', 'della', 'più', 'come', 'questo'],
    charRegex: /[àèéìòù]/i
  }
];

export function detectLanguage(text: string): DetectedLanguage {
  if (!text || text.trim().length < 3) {
    return { code: 'auto', name: 'Auto-Detección', flag: '🌐', confidence: 100 };
  }

  const cleanText = text.toLowerCase();
  const words = cleanText.split(/\s+/).map(w => w.replace(/[^a-zñáéíóúãõçäöüàèìù]/g, ''));

  let bestMatch = LANGUAGE_PATTERNS[0];
  let maxScore = 0;

  for (const lang of LANGUAGE_PATTERNS) {
    let score = 0;

    // Check special characters
    if (lang.charRegex && lang.charRegex.test(cleanText)) {
      score += 15;
    }

    // Check keyword frequency
    for (const word of words) {
      if (word && lang.keywords.includes(word)) {
        score += 10;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = lang;
    }
  }

  const confidence = Math.min(99, Math.max(75, 70 + maxScore));

  if (maxScore === 0) {
    // Default to Spanish or Auto based on character set
    return /[áéíóúñ¿¡]/i.test(text)
      ? { code: 'es', name: 'Español', flag: '🇲🇽 / 🇪🇸', confidence: 85 }
      : { code: 'es', name: 'Español (Detectado)', flag: '🌐', confidence: 80 };
  }

  return {
    code: bestMatch.code,
    name: bestMatch.name,
    flag: bestMatch.flag,
    confidence
  };
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to get GoogleGenAI client
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en los secretos.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Default curated trends fallback dataset in case search is offline or requested specifically
const FALLBACK_TRENDS = [
  {
    id: "trend-1",
    title: "Productividad Extrema vs. Burnout Creativo",
    category: "lifestyle_relationships",
    viralityIndex: 96,
    summary: "El debate viral entre despertarse a las 5 AM y trabajar 12 horas frente al movimiento 'soft life' y descanso consciente.",
    keywords: ["Productividad", "Burnout", "Hábitos", "Soft Life", "Salud Mental"],
    viralAngles: [
      "Opinión impopular cuestionando la rutina de 5 AM",
      "Confesión personal de fracaso por exceso de trabajo",
      "Lista rápida de 3 reglas para no volverse loco en 2026"
    ],
    whyItTrends: "Genera fuerte polarización entre emprendedores, freelancers y trabajadores jóvenes.",
    sampleHooks: [
      "Dejé de levantarme a las 5 AM y mi facturación se duplicó.",
      "La mentira más grande que nos vendió la cultura del esfuerzo es..."
    ]
  },
  {
    id: "trend-2",
    title: "Herramientas de IA que reemplazan tareas de 8 horas en 5 minutos",
    category: "tech_ai",
    viralityIndex: 98,
    summary: "Nuevas automatizaciones con IA que revolucionan la creación de contenido, programación y análisis de datos.",
    keywords: ["Inteligencia Artificial", "Automatización", "Futuro del Trabajo", "Productividad"],
    viralAngles: [
      "Curaduría de 5 herramientas poco conocidas que parecen ilegales",
      "Comparativa provocativa: Humano vs IA",
      "Predicción contundente sobre los empleos en los próximos 2 años"
    ],
    whyItTrends: "A las personas les encanta ahorrar tiempo y descubrir atajos tecnológicos prácticos.",
    sampleHooks: [
      "Si sigues haciendo esto manualmente en 2026, estás regalando tu tiempo.",
      "5 prompts de IA que me ahorraron 20 horas de trabajo esta semana:"
    ]
  },
  {
    id: "trend-3",
    title: "El dilema de ahorrar vs disfrutar los 20s/30s",
    category: "finance_business",
    viralityIndex: 94,
    summary: "Inversión temprana e inflación vs aprovechar viajes y experiencias mientras eres joven.",
    keywords: ["Finanzas Personales", "Inversión", "Estilo de Vida", "Dinero", "Juventud"],
    viralAngles: [
      "Matemáticas crudas sobre guardar $100 dólares al mes",
      "El error financiero que casi arruina mi juventud",
      "Regla del 50/30/20 adaptada al contexto actual"
    ],
    whyItTrends: "Impacta a Gen-Z y Millennials atrapados entre la estabilidad futura y el goce presente.",
    sampleHooks: [
      "Nadie te dice esto sobre ahorrar dinero a los 20 años...",
      "Viajar sin presupuesto o comprar casa: la verdad de la que nadie habla."
    ]
  },
  {
    id: "trend-4",
    title: "Gimnasio & Disciplina: La mentalidad de 'Sin Excusas'",
    category: "fitness_health",
    viralityIndex: 91,
    summary: "Transformaciones físicas, constancia, nutrición simple y superación personal.",
    keywords: ["Gym", "Fitness", "Disciplina", "Hábitos", "Rutina"],
    viralAngles: [
      "El mito de la motivación vs la fuerza del hábito",
      "Lo que nadie te dice sobre los primeros 60 días entrenando",
      "Frase dura de disciplina para compartir en historias de WhatsApp/Instagram"
    ],
    whyItTrends: "Inspiración diaria que motiva a compartir para reafirmar identidad personal.",
    sampleHooks: [
      "El gimnasio no arregla tu vida, pero te enseña algo crucial:",
      "No necesitas motivación, necesitas dejar de negociar contigo mismo."
    ]
  },
  {
    id: "trend-5",
    title: "Nostalgia de los 2000s & Tecnología 'Dumbphones'",
    category: "pop_culture",
    viralityIndex: 89,
    summary: "El regreso a teléfonos sencillos, cámaras digitales compactas y desconexión de redes para reducir la dopamina.",
    keywords: ["Nostalgia", "Dopamina", "Desconexión", "Tech", "Redes Sociales"],
    viralAngles: [
      "Experimento de 7 días usando un teléfono de tapa",
      "Por qué extrañamos la internet del 2010",
      "La desintoxicación digital como el nuevo lujo de 2026"
    ],
    whyItTrends: "Saturo de pantallas y nostalgia retro entre audiencias urbanas.",
    sampleHooks: [
      "Cambié mi smartphone por un celular de botones por 7 días. Esto pasó:",
      "Vivimos tan conectados que la verdadera elegancia hoy es ser inubicable."
    ]
  },
  {
    id: "trend-6",
    title: "Relaciones Modernas: Red Flags & Green Flags en la Era Digital",
    category: "lifestyle_relationships",
    viralityIndex: 95,
    summary: "Comunicación, límites personales, ghosting y dinámicas de pareja en la era de los algoritmos.",
    keywords: ["Relaciones", "Amor", "Límites", "Red Flags", "Psicología"],
    viralAngles: [
      "Lista de comportamientos sutiles pero tóxicos",
      "El poder de decir 'no' sin dar explicaciones",
      "Reflexión reflexiva sobre el apego seguro"
    ],
    whyItTrends: "Alta identificabilidad emocional; se reenvía masivamente por chats privados.",
    sampleHooks: [
      "Una 'green flag' gigante que casi nadie nota a primera vista:",
      "Si tienes que pedirle a alguien lo básico, ya tienes la respuesta."
    ]
  }
];

// Smart Offline Fallback Generators for Quota / Rate-limit resilience
function generateOfflineTrends(query?: string, category?: string) {
  let list = [...FALLBACK_TRENDS];

  if (category && category !== 'all') {
    const catFiltered = list.filter(t => t.category === category);
    if (catFiltered.length > 0) {
      list = catFiltered;
    }
  }

  if (query && query.trim()) {
    const qLower = query.toLowerCase();
    const queryMatched = list.filter(t => 
      t.title.toLowerCase().includes(qLower) || 
      t.summary.toLowerCase().includes(qLower) ||
      t.keywords.some(k => k.toLowerCase().includes(qLower))
    );

    if (queryMatched.length > 0) {
      list = queryMatched;
    } else {
      // Create a dynamic trend matching the query
      const dynamicTrend = {
        id: `trend-dyn-${Date.now()}`,
        title: `Tendencia Viral: ${query.charAt(0).toUpperCase() + query.slice(1)}`,
        category: (category && category !== 'all' ? category : 'tech_ai') as any,
        viralityIndex: 97,
        summary: `El interés sobre ${query} ha aumentado exponencialmente en redes sociales con creadores debatiendo las mejores estrategias y reflexiones.`,
        keywords: [query, "Tendencia", "Viral 2026", "Debate"],
        viralAngles: [
          `La verdad incómoda sobre ${query} que casi nadie admite`,
          `Cómo usar ${query} a tu favor este año`,
          `3 errores comunes que la gente comete al hablar de ${query}`
        ],
        whyItTrends: "Activa la curiosidad directa y el deseo de aprendizaje o controversia en la audiencia.",
        sampleHooks: [
          `Llevo semanas analizando ${query} y llegué a esta conclusión:`,
          `Si todavía no estás prestando atención a ${query}, te estás quedando atrás.`
        ]
      };
      list = [dynamicTrend, ...list];
    }
  }

  return list;
}

function generateOfflineViralOptions(body: any) {
  const {
    topic = "crecimiento personal y tecnología",
    platform = "twitter",
    tone = "relatable",
    regionalStyle = "general",
    goal = "virality",
    includeHashtags = true,
    emojiDensity = "medium",
  } = body;

  const topicClean = topic.trim() || "este tema";

  // Emoji helpers
  const e1 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "💡 " : "🔥 💡 ";
  const e2 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "👇 " : "🚨 👇 ";
  const e3 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "📌 " : "🤯 📌 ";
  const e4 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "✨ " : "✨ 🚀 ";

  // Slang phrases
  let slangWord = "";
  if (regionalStyle === "mexico") slangWord = "Neta, ";
  else if (regionalStyle === "argentina") slangWord = "Che, posta que ";
  else if (regionalStyle === "espana") slangWord = "Madre mía, ";
  else if (regionalStyle === "colombia") slangWord = "Parce, ";
  else if (regionalStyle === "spanglish") slangWord = "Real talk / No cap: ";

  // Hashtags
  const hashtagsList = includeHashtags
    ? [`#${topicClean.replace(/\s+/g, '')}`, "#ViralPost", "#EstrategiaDigital", "#Tendencias2026"]
    : [];

  const opt1 = {
    id: `opt-1-${Date.now()}`,
    headline: "⚡ Gancho Directo & Punzante",
    content: `${slangWord}${e1}Si no entiendes ${topicClean} en 2026, estás perdiendo el 80% de las oportunidades sin darte cuenta.\n\nNo es cuestión de suerte, es cuestión de atención.\n\n¿Estás de acuerdo o lo ves diferente?`,
    formattingType: "single",
    hashtags: hashtagsList,
    emojisCount: 2,
    viralityScore: 96,
    viralityReasoning: "Gatillo de urgencia y FOMO. Invita a responder inmediatamente en los comentarios.",
    callToAction: "¿Estás de acuerdo o lo ves diferente?",
    suggestedBestTime: "12:00 - 14:00 (Hora de almuerzo)"
  };

  const opt2 = {
    id: `opt-2-${Date.now()}`,
    headline: "📖 Storytelling & Reflexión Personal",
    content: `${e4}Durante mucho tiempo pensé que ${topicClean} era algo reservado para unos pocos.\n\nHasta que entendí algo clave:\nLo difícil no es empezar, sino dejar de ponerte excusas.\n\nTres aprendizajes que cambiaron mi perspectiva:\n1. La constancia le gana al talento el 100% de las veces.\n2. Simplificar siempre da mejor resultado que complicarse.\n3. El mejor momento para actuar era ayer; el segundo mejor es HOY.\n\n¿Cuál de estos puntos resonó más contigo?`,
    formattingType: "thread",
    threadParts: [
      `1/ Durante mucho tiempo pensé que ${topicClean} era reservado para expertos.`,
      `2/ Tres aprendizajes clave: La constancia le gana a la suerte. Simplificar siempre gana.`,
      `3/ Si te sirvió este punto, guárdalo y compártelo.`
    ],
    hashtags: hashtagsList,
    emojisCount: 4,
    viralityScore: 94,
    viralityReasoning: "Formato de historia personal y vulnerabilidad. Aumenta los guardados y compartidos.",
    callToAction: "¿Cuál de estos puntos resonó más contigo?",
    suggestedBestTime: "18:00 - 21:00 (Hora pico de consumo)"
  };

  const opt3 = {
    id: `opt-3-${Date.now()}`,
    headline: "🔥 Opinión Impopular / Generador de Debate",
    content: `${slangWord}${e2}Opinión impopular sobre ${topicClean}:\n\nLa mayoría de las personas no fracasan por falta de información, sino por exceso de teoría y falta de acción.\n\nMenos consumir contenido, más ejecutar en el mundo real.\n\nAbro debate abajo 👇`,
    formattingType: "single",
    hashtags: hashtagsList,
    emojisCount: 2,
    viralityScore: 98,
    viralityReasoning: "Alta polarización y debate directo. Activa el algoritmo al multiplicar los comentarios rápidamente.",
    callToAction: "Abro debate abajo 👇",
    suggestedBestTime: "20:00 - 22:00"
  };

  const opt4 = {
    id: `opt-4-${Date.now()}`,
    headline: "💡 Formato Lista de Valor Práctico",
    content: `${e3}La guía rápida de 3 pasos sobre ${topicClean} que deberías guardar hoy:\n\n1. Paso 01: Elimina lo innecesario antes de optimizar.\n2. Paso 02: Enfócate en el 20% de las acciones que traen el 80% de los resultados.\n3. Paso 03: Mide tus avances semanalmente sin juzgarte.\n\n📌 Guarda esta publicación para volver a ella cuando lo necesites.`,
    formattingType: "carousel",
    hashtags: hashtagsList,
    emojisCount: 3,
    viralityScore: 95,
    viralityReasoning: "Estructura altamente coleccionable. Genera un elevado ratio de guardados y capturas de pantalla.",
    callToAction: "Guarda esta publicación para volver a ella cuando lo necesites.",
    suggestedBestTime: "09:00 - 11:00 (Mañana)"
  };

  return {
    options: [opt1, opt2, opt3, opt4],
    topicAnalyzed: `Optimización viral para: "${topicClean}"`,
    suggestedHashtags: hashtagsList,
    idealPostingTimes: "18:00 - 21:00 (Mayor retención de audiencia en redes)"
  };
}

function generateOfflineAnalysis(text: string, platform: string = "twitter") {
  const charCount = text.length;
  const hasQuestion = text.includes("?");
  const hasExclamation = text.includes("!");
  const lineBreaks = text.split("\n").length;

  let baseScore = 72;
  if (hasQuestion) baseScore += 8;
  if (hasExclamation) baseScore += 5;
  if (lineBreaks > 2) baseScore += 8;
  if (charCount > 40 && charCount < 280) baseScore += 7;

  const score = Math.min(96, Math.max(68, baseScore));
  const hookPower = Math.min(98, Math.max(70, baseScore + 4));

  return {
    score,
    hookPower,
    emotionalTriggers: ["Curiosidad", "Identificación", "Utilidad Práctica"],
    readabilityScore: lineBreaks > 2 ? "Excelente (Espaciado fluido y ritmo alto)" : "Buena (Sugerencia: agregar saltos de línea)",
    strengths: [
      "Mensaje claro y directo al punto central.",
      hasQuestion ? "Incluye una pregunta que fomenta la interacción." : "Formato conversacional accesible.",
      "Vocabulario natural y sin rodeos innecesarios."
    ],
    weaknesses: [
      lineBreaks <= 2 ? "El bloque de texto se beneficiaría de saltos de línea para facilitar la lectura rápida." : "Se puede potenciar aún más el primer enunciado (primeros 3 segundos).",
      "Agregar un llamado a la acción más explícito para compartir o guardar."
    ],
    improvedVersions: [
      {
        angle: "⚡ Versión 1: Gancho de Controversia",
        text: `Lo que nadie te dice sobre esto:\n\n${text.trim()}\n\n¿Opinas lo mismo o estoy equivocado?`,
        whyBetter: "Crea una brecha de curiosidad en la primera frase y obliga al lector a detener su scroll."
      },
      {
        angle: "📖 Versión 2: Storytelling Emocional",
        text: `Tardé años en entender esto de forma simple:\n\n"${text.trim()}"\n\nSi esto resonó contigo, guárdalo para no olvidarlo.`,
        whyBetter: "Aumenta la empatía del lector y estimula los guardados de publicación."
      },
      {
        angle: "💡 Versión 3: Formato Atajo / Lección",
        text: `Resumen de 10 segundos:\n\n👉 ${text.trim()}\n\n¿Estás listo para aplicarlo?`,
        whyBetter: "Sintetiza la idea con formato visual de atajo rápido, ideal para retención."
      }
    ]
  };
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Generador de Estados Virales & Trends" });
});

// Search Trends API (using Gemini Grounded Google Search)
app.post("/api/trends/search", async (req, res) => {
  const { query, category } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    const offlineList = generateOfflineTrends(query, category);
    return res.json({ trends: offlineList, source: "smart_offline_engine" });
  }

  const prompt = `
Eres un experto en investigación de tendencias virales en redes sociales (TikTok, Twitter/X, Instagram, LinkedIn, WhatsApp).
Busca e identifica tendencias, conversaciones calientes, temas virales y discusiones populares en internet HOY en español.
${query ? `Búsqueda específica del usuario: "${query}"` : ""}
${category && category !== 'all' ? `Categoría filtrada: "${category}"` : ""}

Devuelve un listado JSON estructurado con exactamente 5 a 6 tendencias virales actuales o de alto impacto.
Responde estrictamente en formato JSON válido según el siguiente esquema:
[
  {
    "id": "trend-unique-1",
    "title": "Título llamativo y conciso del tema viral",
    "category": "tech_ai | humor_memes | fitness_health | finance_business | lifestyle_relationships | pop_culture | motivation | gaming | news_curiosities",
    "viralityIndex": 95,
    "summary": "Resumen rápido de 2 frases sobre por qué está ardiendo la conversación sobre esto.",
    "keywords": ["palabra1", "palabra2", "palabra3"],
    "viralAngles": ["Ángulo o controversia 1", "Ángulo 2", "Ángulo 3"],
    "whyItTrends": "Explicación psicológica de por qué la gente lo comparte o comenta masivamente.",
    "sampleHooks": ["Gancho viral 1", "Gancho viral 2"]
  }
]
`;

  try {
    const ai = getGenAIClient();
    let responseText = "";
    let groundedSources: any[] = [];

    try {
      // First attempt: gemini-3.6-flash with googleSearch tool
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      responseText = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      groundedSources = chunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || "Fuente", url: c.web.uri }));
    } catch (primaryErr: any) {
      console.warn("Primary search with tools failed or rate limited, trying secondary model...", primaryErr?.message || primaryErr);
      // Secondary attempt: gemini-2.5-flash without tools
      const response2 = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      responseText = response2.text || "";
    }

    let parsedTrends: any[] = [];
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedTrends = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn("Could not parse JSON output from trends API");
    }

    if (!parsedTrends || parsedTrends.length === 0) {
      parsedTrends = generateOfflineTrends(query, category);
    }

    const enrichedTrends = parsedTrends.map((t, idx) => ({
      ...t,
      id: t.id || `trend-gen-${idx}-${Date.now()}`,
      groundedSources: groundedSources.slice(0, 3)
    }));

    return res.json({ trends: enrichedTrends, source: groundedSources.length > 0 ? "gemini_grounded_search" : "gemini_model_search" });
  } catch (error: any) {
    console.warn("Gemini API error or quota limit on search, using smart offline trends engine:", error?.message || error);
    const offlineList = generateOfflineTrends(query, category);
    return res.json({ trends: offlineList, source: "smart_offline_engine" });
  }
});

// Generate Viral Status Options API
app.post("/api/viral/generate", async (req, res) => {
  const body = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json(generateOfflineViralOptions(body));
  }

  const {
    topic,
    trendTitle,
    trendContext,
    platform = "twitter",
    tone = "relatable",
    regionalStyle = "general",
    audience = "General",
    goal = "virality",
    includeHashtags = true,
    emojiDensity = "medium",
    customInstructions = "",
  } = body;

  const regionalGuide: Record<string, string> = {
    general: "Español neutro moderno, fluido, natural, ideal para audiencia latinoamericana y global.",
    mexico: "Español con modismos mexicanos naturales (ej: chido, cachen, bronca, paro, neto, neta, padrísimo, desmadre moderado), súper auténtico.",
    argentina: "Español con voseo argentino (ej: che, laburo, posta, re, zarpado, man, bancar, genial), directo y expresivo.",
    espana: "Español de España natural (ej: mola, curro, ostia moderada, madre mía, lío, flipar, brutal), fresco.",
    colombia: "Español con modismos colombianos (ej: parce, berraco, chimba en tono positivo, parche, camello, bacano), cálido y directo.",
    spanglish: "Mezcla moderna de Español e Inglés al estilo Gen-Z / Creadores digitales (ej: mood, vibe, chill, literal, hack, no cap, crush, red flag)."
  };

  const platformSpecs: Record<string, string> = {
    twitter: "Twitter / X: Formato súper punzante, frases cortas, saltos de línea legibles, ganchos de alto impacto, preguntas al final.",
    instagram: "Instagram: Caption visualmente atractivo, párrafo inicial irresistible para presionar 'más', saltos de línea limpios, llamada a la acción clara.",
    tiktok: "TikTok: Guion de texto/captions rápido para video o estado. Estilo directo, conversacional, con remates rápidos y frases memorables.",
    linkedin: "LinkedIn: Formato de storytelling profesional, valor práctico, historia breve personal, líneas espaciadas, reflexión profunda al final sin sonar aburrido.",
    whatsapp: "WhatsApp / Historias: Estados breves, potentes, highly compartibles para grupos o capturas de pantalla, reflexivos o muy graciosos.",
    threads: "Threads: Tono conversacional, casual, reflexivo, ideal para iniciar debates genuinos en comentarios.",
    facebook: "Facebook: Publicación descriptiva, empática, enfocada en generar debate y comentarios en la comunidad."
  };

  const prompt = `
Eres el estratega de contenido viral número 1 del mundo en redes sociales. 
Tu trabajo es crear 4 VARIACIONES UNICAS y extremadamente virales de estados/publicaciones.

[CONFIGURACIÓN DEL ESTADO]:
- Tema / Idea Principal: "${topic || trendTitle || "La vida diaria y reflexiones digitales"}"
${trendTitle ? `- Tendencia Relacionada: "${trendTitle}" (${trendContext || ""})` : ""}
- Plataforma Objetivo: ${platformSpecs[platform] || platformSpecs['twitter']}
- Tono / Vibe: ${tone}
- Estilo Regional / Slang: ${regionalGuide[regionalStyle] || regionalGuide['general']}
- Audiencia Objetivo: ${audience}
- Objetivo Principal: ${goal} (ej: shares, comentarios, guardados)
- Densidad de Emojis: ${emojiDensity}
- Hashtags: ${includeHashtags ? "Sí, incluye 3-5 hashtags estratégicos" : "No incluyas hashtags"}
${customInstructions ? `- Instrucciones Especiales del Usuario: ${customInstructions}` : ""}

Crea 4 opciones con enfoques o formatos distintos:
1. Opción 1: Gancho Directo / Frase Punzante (Ultra corto y contundente)
2. Opción 2: Storytelling / Experiencia Personal (Narrativo)
3. Opción 3: Controversial / Opinión Impopular (Generador de debate)
4. Opción 4: Formato Lista / Hilo / Carrusel / Valor Práctico

Debes responder ÚNICAMENTE en formato JSON estricto con el siguiente esquema:
{
  "options": [
    {
      "id": "opt-1",
      "headline": "Gancho Corto / Breve etiqueta descriptiva",
      "content": "El texto completo del estado con formato perfecto de saltos de línea y emojis adecuados.",
      "formattingType": "single",
      "threadParts": ["Parte 1 si aplica", "Parte 2 si aplica"],
      "hashtags": ["#ejemplo1", "#ejemplo2"],
      "emojisCount": 3,
      "viralityScore": 95,
      "viralityReasoning": "Por qué esta opción funciona: activa el gatillo de identificación personal y debate.",
      "visualPromptRecommendation": "Descripción visual para generar una tarjeta o imagen complementaria.",
      "callToAction": "Pregunta o cierre para incitar comentarios",
      "suggestedBestTime": "18:00 - 21:00 (Hora pico)"
    }
  ],
  "topicAnalyzed": "Resumen en una frase del concepto procesado",
  "suggestedHashtags": ["#Tendencias", "#Viral", "#ViralPost"],
  "idealPostingTimes": "Mejor horario sugerido para publicar este tipo de contenido"
}
`;

  try {
    const ai = getGenAIClient();
    let jsonText = "";

    try {
      // First attempt: gemini-3.6-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      jsonText = response.text || "";
    } catch (primaryErr: any) {
      console.warn("Primary generate model failed or rate limited, trying secondary model...", primaryErr?.message || primaryErr);
      const response2 = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      jsonText = response2.text || "";
    }

    const data = JSON.parse(jsonText);
    return res.json(data);
  } catch (error: any) {
    console.warn("Gemini API error or rate limit on viral generate, using smart offline generator:", error?.message || error);
    return res.json(generateOfflineViralOptions(body));
  }
});

// Analyze Virality Score API
app.post("/api/viral/analyze", async (req, res) => {
  const { text, platform = "twitter" } = req.body;
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Proporciona un texto para analizar." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json(generateOfflineAnalysis(text, platform));
  }

  const prompt = `
Analiza la siguiente publicación / estado para la plataforma "${platform}":
"${text}"

Evalúa su potencial de viralidad en una escala de 1 a 100 y ofrece 3 versiones mejoradas para aumentar exponencialmente su impacto, retención y compartibilidad.

Responde strictly en formato JSON con la siguiente estructura:
{
  "score": 78,
  "hookPower": 82,
  "emotionalTriggers": ["Curiosidad", "Identificación", "Nostalgia"],
  "readabilityScore": "Excelente (Líneas cortas y buen ritmo)",
  "strengths": ["Punto clave 1", "Punto clave 2"],
  "weaknesses": ["Aspecto a mejorar 1"],
  "improvedVersions": [
    {
      "angle": "Ángulo 1: Gancho de Controversia",
      "text": "Texto mejorado opción 1",
      "whyBetter": "Aumenta la curiosidad inmediata en los primeros 3 segundos."
    },
    {
      "angle": "Ángulo 2: Storytelling Emocional",
      "text": "Texto mejorado opción 2",
      "whyBetter": "Conecta de forma empática con los dolores del lector."
    },
    {
      "angle": "Ángulo 3: Formato Lista / Atajo",
      "text": "Texto mejorado opción 3",
      "whyBetter": "Incentiva el guardado y compartido directo por valor condensado."
    }
  ]
}
`;

  try {
    const ai = getGenAIClient();
    let jsonText = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      jsonText = response.text || "";
    } catch (primaryErr: any) {
      console.warn("Primary analyze model failed or rate limited, trying secondary model...", primaryErr?.message || primaryErr);
      const response2 = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      jsonText = response2.text || "";
    }

    const data = JSON.parse(jsonText);
    return res.json(data);
  } catch (error: any) {
    console.warn("Gemini API error or rate limit on viral analyze, using smart offline analyzer:", error?.message || error);
    return res.json(generateOfflineAnalysis(text, platform));
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

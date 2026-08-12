import { GenerateStatusResponse, ViralityAnalysisResponse } from '../types';

export function getClientFallbackViralOptions(body: any): GenerateStatusResponse {
  const {
    topic = "crecimiento personal y tecnología",
    regionalStyle = "general",
    includeHashtags = true,
    emojiDensity = "medium",
  } = body;

  const topicClean = topic.trim() || "este tema";

  const e1 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "💡 " : "🔥 💡 ";
  const e2 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "👇 " : "🚨 👇 ";
  const e3 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "📌 " : "🤯 📌 ";
  const e4 = emojiDensity === "none" ? "" : emojiDensity === "low" ? "✨ " : "✨ 🚀 ";

  let slangWord = "";
  if (regionalStyle === "mexico") slangWord = "Neta, ";
  else if (regionalStyle === "argentina") slangWord = "Che, posta que ";
  else if (regionalStyle === "espana") slangWord = "Madre mía, ";
  else if (regionalStyle === "colombia") slangWord = "Parce, ";
  else if (regionalStyle === "spanglish") slangWord = "Real talk / No cap: ";

  const hashtagsList = includeHashtags
    ? [`#${topicClean.replace(/\s+/g, '')}`, "#ViralPost", "#EstrategiaDigital", "#Tendencias2026"]
    : [];

  return {
    options: [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      }
    ],
    topicAnalyzed: `Optimización viral para: "${topicClean}"`,
    suggestedHashtags: hashtagsList,
    idealPostingTimes: "18:00 - 21:00 (Mayor retención de audiencia en redes)"
  };
}

export function getClientFallbackAnalysis(text: string, platform: string = "twitter"): ViralityAnalysisResponse {
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

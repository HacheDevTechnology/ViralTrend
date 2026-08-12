import { TrendItem, Category } from '../types';

export const FALLBACK_CLIENT_TRENDS: TrendItem[] = [
  {
    id: "trend-c1",
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
    id: "trend-c2",
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
    id: "trend-c3",
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
    id: "trend-c4",
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
    id: "trend-c5",
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
    whyItTrends: "Saturación de pantallas y nostalgia retro entre audiencias urbanas.",
    sampleHooks: [
      "Cambié mi smartphone por un celular de botones por 7 días. Esto pasó:",
      "Vivimos tan conectados que la verdadera elegancia hoy es ser inubicable."
    ]
  },
  {
    id: "trend-c6",
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

export function getClientFallbackTrends(cat?: Category, query?: string): TrendItem[] {
  let list = [...FALLBACK_CLIENT_TRENDS];

  if (cat && cat !== 'all') {
    const filtered = list.filter(t => t.category === cat);
    if (filtered.length > 0) list = filtered;
  }

  if (query && query.trim()) {
    const qLower = query.toLowerCase();
    const matched = list.filter(t =>
      t.title.toLowerCase().includes(qLower) ||
      t.summary.toLowerCase().includes(qLower) ||
      t.keywords.some(k => k.toLowerCase().includes(qLower))
    );

    if (matched.length > 0) {
      list = matched;
    } else {
      const dynamicTrend: TrendItem = {
        id: `trend-dyn-${Date.now()}`,
        title: `Tendencia Viral: ${query.charAt(0).toUpperCase() + query.slice(1)}`,
        category: (cat && cat !== 'all' ? cat : 'tech_ai') as any,
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

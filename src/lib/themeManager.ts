export interface AppTheme {
  id: string;
  name: string;
  badge: string;
  bgClass: string;
  headerAccent: string;
  buttonPrimary: string;
  borderAccent: string;
}

export const THEMES: AppTheme[] = [
  {
    id: 'obsidian_cyber',
    name: 'Obsidian Cyberpunk ⚡',
    badge: 'Ciberpunk $3M USD',
    bgClass: 'bg-slate-950',
    headerAccent: 'from-amber-500 via-rose-500 to-purple-600',
    buttonPrimary: 'from-amber-500 via-rose-500 to-purple-600',
    borderAccent: 'border-amber-500/40'
  },
  {
    id: 'velvet_gold',
    name: 'Velvet Gold VIP 👑',
    badge: 'Lujo Dorado',
    bgClass: 'bg-zinc-950',
    headerAccent: 'from-amber-400 via-yellow-500 to-amber-600',
    buttonPrimary: 'from-amber-400 to-yellow-600',
    borderAccent: 'border-yellow-500/50'
  },
  {
    id: 'emerald_pro',
    name: 'Emerald Matrix 💚',
    badge: 'Esmeralda Cripto',
    bgClass: 'bg-neutral-950',
    headerAccent: 'from-emerald-400 via-teal-500 to-cyan-600',
    buttonPrimary: 'from-emerald-500 to-teal-600',
    borderAccent: 'border-emerald-500/40'
  },
  {
    id: 'sunset_glow',
    name: 'Crimson Sunset 🌆',
    badge: 'Neón Atardecer',
    bgClass: 'bg-stone-950',
    headerAccent: 'from-rose-500 via-pink-600 to-indigo-600',
    buttonPrimary: 'from-rose-500 to-pink-600',
    borderAccent: 'border-rose-500/40'
  }
];

export function getNextTheme(currentThemeId: string): AppTheme {
  const currentIndex = THEMES.findIndex(t => t.id === currentThemeId);
  if (currentIndex === -1 || currentIndex === THEMES.length - 1) {
    return THEMES[0];
  }
  return THEMES[currentIndex + 1];
}


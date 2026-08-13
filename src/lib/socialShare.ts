import { Platform } from '../types';

export function shareToSocial(platform: Platform | 'telegram', text: string, title?: string) {
  const encodedText = encodeURIComponent(text);
  let url = '';

  switch (platform) {
    case 'twitter':
      url = `https://twitter.com/intent/tweet?text=${encodedText}`;
      break;
    case 'whatsapp':
      url = `https://api.whatsapp.com/send?text=${encodedText}`;
      break;
    case 'linkedin':
      url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
      break;
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`;
      break;
    case 'threads':
      url = `https://www.threads.net/intent/post?text=${encodedText}`;
      break;
    case 'telegram':
      url = `https://t.me/share/url?text=${encodedText}`;
      break;
    case 'instagram':
    case 'tiktok':
    default:
      // For platforms without direct text web intent (like IG or TikTok), copy text and notify
      navigator.clipboard.writeText(text);
      if (platform === 'instagram') {
        url = 'https://www.instagram.com/';
      } else if (platform === 'tiktok') {
        url = 'https://www.tiktok.com/upload';
      } else {
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
      }
      break;
  }

  // Open in a new tab/popup
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
}

export const SOCIAL_SHARE_OPTIONS: { id: Platform | 'telegram'; label: string; icon: string; color: string }[] = [
  { id: 'twitter', label: '𝕏 Twitter', icon: '𝕏', color: 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/30' },
  { id: 'threads', label: 'Threads', icon: '🧵', color: 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30' },
  { id: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30' },
  { id: 'telegram', label: 'Telegram', icon: '✈️', color: 'bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border-sky-500/30' },
  { id: 'instagram', label: 'Instagram (Copiar)', icon: '📸', color: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-rose-500/30' },
];

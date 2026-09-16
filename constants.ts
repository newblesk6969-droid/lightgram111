import type { MessageStyle, ThemeName } from './types';

export const THEME_NAMES: ThemeName[] = ['purple', 'bw', 'red', 'green', 'blue', 'pink'];

export const MESSAGE_STYLES: MessageStyle[] = [
  'default',
  'kitten',
  'neon',
  'anime',
  'retro',
  'cosmos',
  'glitch',
];

export const STICKERS = [
  { id: 's1', emoji: '🐱' },
  { id: 's2', emoji: '🐶' },
  { id: 's3', emoji: '🦊' },
  { id: 's4', emoji: '🐼' },
  { id: 's5', emoji: '🐸' },
  { id: 's6', emoji: '🦄' },
  { id: 's7', emoji: '💖' },
  { id: 's8', emoji: '🔥' },
  { id: 's9', emoji: '⭐' },
  { id: 's10', emoji: '🎉' },
  { id: 's11', emoji: '🌈' },
  { id: 's12', emoji: '🚀' },
];

export const AVATAR_GRADIENTS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
];

export function getAvatarGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatChatListTime(ts: number): string {
  const now = new Date();
  const d = new Date(ts);
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return formatTime(ts);
  if (isYesterday) return 'Вчера';
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);

  let result = '+7';
  if (digits.length > 1) result += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) result += ') ' + digits.slice(4, 7);
  if (digits.length >= 7) result += '-' + digits.slice(7, 9);
  if (digits.length >= 9) result += '-' + digits.slice(9, 11);

  return result;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('7') && digits[1] === '9';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const ADJECTIVES = ['Cosmic', 'Neon', 'Turbo', 'Hyper', 'Cyber', 'Mega', 'Ultra', 'Quantum', 'Crystal', 'Lunar'];
const NOUNS = ['Tiger', 'Falcon', 'Wolf', 'Phoenix', 'Dragon', 'Ninja', 'Panda', 'Lion', 'Hawk', 'Coder'];

export function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}${num}`;
}

export function generateDisplayName(): string {
  const names = ['Алекс', 'Мария', 'Дмитрий', 'Анна', 'Иван', 'Елена', 'Максим', 'Ольга', 'Сергей', 'Юлия'];
  return names[Math.floor(Math.random() * names.length)];
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      resolve(Math.round(audio.duration));
    });
    audio.addEventListener('error', () => resolve(0));
  });
}

import {
  Webhook,
  Eye,
  Cat,
  PawPrint,
  Bug,
  Droplet,
  Zap,
  Heart,
  Flame,
  Crown,
  type LucideIcon,
} from 'lucide-react';
import type { EmojiStatus } from '@/types';

interface StatusMeta {
  icon: LucideIcon;
  color: string;
  animation: string;
}

const STATUS_MAP: Record<Exclude<EmojiStatus, 'none'>, StatusMeta> = {
  spiderman: { icon: Webhook, color: '#ef4444', animation: 'esPulse 1.8s ease-in-out infinite' },
  deadpool: { icon: Eye, color: '#991b1b', animation: 'esPulse 2s ease-in-out infinite' },
  cat: { icon: Cat, color: '#f472b6', animation: 'esWiggle 1.5s ease-in-out infinite' },
  dog: { icon: PawPrint, color: '#f59e0b', animation: 'esBounce 1.2s ease-in-out infinite' },
  spider: { icon: Bug, color: '#a855f7', animation: 'esCrawl 1s ease-in-out infinite' },
  blood: { icon: Droplet, color: '#dc2626', animation: 'esDrip 1.8s ease-in-out infinite' },
  lightning: { icon: Zap, color: '#22d3ee', animation: 'esFlash 0.8s ease-in-out infinite' },
  heart: { icon: Heart, color: '#ec4899', animation: 'esBeat 1.2s ease-in-out infinite' },
  flame: { icon: Flame, color: '#f97316', animation: 'esFlame 1s ease-in-out infinite' },
  crown: { icon: Crown, color: '#fbbf24', animation: 'esShine 2s ease-in-out infinite' },
};

interface EmojiStatusIconProps {
  status: EmojiStatus;
  size?: number;
}

export function EmojiStatusIcon({ status, size = 16 }: EmojiStatusIconProps) {
  if (status === 'none') return null;
  const meta = STATUS_MAP[status];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex shrink-0 align-middle"
      style={{ color: meta.color, animation: meta.animation }}
    >
      <Icon size={size} strokeWidth={2.5} />
    </span>
  );
}

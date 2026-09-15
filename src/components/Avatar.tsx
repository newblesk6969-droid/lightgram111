import { getAvatarGradient, getInitials } from '@/constants';

interface AvatarProps {
  id: string;
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function Avatar({ id, name, src, size = 48, className = '', ring = false }: AvatarProps) {
  const gradient = getAvatarGradient(id);
  const initials = getInitials(name || '?');

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${ring ? 'ring-2 ring-theme/50' : ''} ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-white shrink-0 ${ring ? 'ring-2 ring-theme/50' : ''} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

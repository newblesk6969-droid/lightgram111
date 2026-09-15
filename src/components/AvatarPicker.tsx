import { useState, useRef, type ReactNode } from 'react';
import { Camera, X } from 'lucide-react';
import { Avatar } from './Avatar';

interface AvatarPickerProps {
  id: string;
  name: string;
  currentSrc?: string | null;
  onChange: (src: string | null) => void;
}

export function AvatarPicker({ id, name, currentSrc, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <Avatar id={id} name={name} src={currentSrc} size={100} ring />
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-theme flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 active:scale-95"
          aria-label="Change avatar"
        >
          <Camera size={18} />
        </button>
        {currentSrc && (
          <button
            onClick={() => onChange(null)}
            className="absolute top-0 right-0 w-7 h-7 rounded-full bg-error/80 flex items-center justify-center text-white shadow-lg"
            aria-label="Remove avatar"
          >
            <X size={14} />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl border border-theme/20"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

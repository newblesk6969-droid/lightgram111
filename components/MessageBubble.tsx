import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, FileText, Music } from 'lucide-react';
import type { Message } from '@/types';
import { formatTime, formatDuration, formatFileSize, STICKERS } from '@/constants';
import { t } from '@/i18n';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const styleClass = getStyleClass(message.style);
  const isKitten = message.style === 'kitten';
  const isAnime = message.style === 'anime';
  const isCosmos = message.style === 'cosmos';

  if (message.type === 'sticker') {
    const sticker = STICKERS.find((s) => s.id === message.stickerId);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
      >
        <div className="text-6xl select-none">{sticker?.emoji ?? '🎨'}</div>
      </motion.div>
    );
  }

  if (message.type === 'file') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 px-1`}
      >
        <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'}`}>
          <a
            href={message.imageUrl ?? undefined}
            download={message.fileName ?? undefined}
            className={`relative rounded-2xl px-4 py-3 ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'} ${styleClass} flex items-center gap-3 no-underline`}
          >
            <FileText size={28} className={isKitten ? 'text-pink-700' : 'text-theme'} />
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${isKitten ? 'text-pink-900' : ''}`}>
                {message.fileName}
              </p>
              <p className={`text-xs ${isKitten ? 'text-pink-700' : 'text-ink-muted'}`}>
                {message.fileSize ? formatFileSize(message.fileSize) : ''}
              </p>
            </div>
          </a>
          <p className={`text-xs text-ink-faint mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 px-1`}
    >
      <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Kitten ears above bubble */}
        {isKitten && <KittenEars />}

        {/* Anime decorative element */}
        {isAnime && <AnimeDeco isOwn={isOwn} />}

        <div
          className={`relative rounded-2xl px-4 py-2.5 ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'} ${styleClass}`}
        >
          {renderContent(message, isOwn, isKitten)}
        </div>

        {/* Kitten paws below bubble */}
        {isKitten && <KittenPaws />}

        {/* Cosmos stars */}
        {isCosmos && <CosmosStars />}

        <p className={`text-xs text-ink-faint mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

function renderContent(message: Message, _isOwn: boolean, isKitten: boolean) {
  const textColor = isKitten ? 'text-pink-900' : '';
  const neonText = message.style === 'neon' ? 'style-neon-text' : '';

  switch (message.type) {
    case 'image':
      return (
        <div className="space-y-1">
          <img
            src={message.imageUrl ?? ''}
            alt="pic"
            className="rounded-xl max-w-full max-h-60 object-cover"
          />
          {message.text && <p className={`text-sm ${textColor} ${neonText}`}>{message.text}</p>}
        </div>
      );

    case 'voice':
      return <VoiceMessage url={message.imageUrl} duration={message.voiceDuration ?? 0} isKitten={isKitten} />;

    case 'audio':
      return <AudioPlayer url={message.imageUrl} title={message.audioTitle ?? 'Audio'} duration={message.audioDuration ?? 0} isKitten={isKitten} />;

    default:
      return (
        <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${textColor} ${neonText}`}>
          {message.text}
        </p>
      );
  }
}

function VoiceMessage({ url, duration, isKitten }: { url: string | null; duration: number; isKitten: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.addEventListener('loadedmetadata', () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setActualDuration(Math.round(audio.duration));
      }
    });
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener('ended', () => {
      setPlaying(false);
      setCurrentTime(0);
    });
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [url]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || actualDuration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * actualDuration;
    setCurrentTime(pct * actualDuration);
  };

  const progress = actualDuration > 0 ? currentTime / actualDuration : 0;

  const btnBase = isKitten ? 'bg-pink-400 text-white' : 'bg-white/25 text-white';
  const trackBg = isKitten ? 'bg-pink-200' : 'bg-white/25';
  const trackFill = isKitten ? 'bg-pink-600' : 'bg-cyan-300';
  const timeColor = isKitten ? 'text-pink-800' : 'text-white/80';

  return (
    <div className="min-w-[220px] max-w-[260px] py-1">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${btnBase}`}
        >
          {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div
            onClick={seek}
            className={`h-2 rounded-full overflow-hidden cursor-pointer ${trackBg}`}
          >
            <div
              className={`h-full rounded-full transition-all duration-200 ${trackFill}`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className={`text-xs font-mono tabular-nums ${timeColor}`}>
              {formatDuration(currentTime)}
            </span>
            <span className={`text-xs font-mono tabular-nums ${timeColor}`}>
              {formatDuration(actualDuration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer({ url, title, duration, isKitten }: { url: string | null; title: string; duration: number; isKitten: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.addEventListener('loadedmetadata', () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setActualDuration(audio.duration);
      }
    });
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener('ended', () => {
      setPlaying(false);
      setCurrentTime(0);
    });
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [url]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const progress = actualDuration > 0 ? currentTime / actualDuration : 0;

  return (
    <div className={`min-w-[200px] ${isKitten ? 'text-pink-900' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={toggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
            isKitten ? 'bg-pink-400 text-white' : 'bg-theme text-white'
          }`}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate flex items-center gap-1.5 ${isKitten ? 'text-pink-900' : ''}`}>
            <Music size={14} className="shrink-0" />
            {title}
          </p>
          <p className={`text-xs ${isKitten ? 'text-pink-700' : 'text-ink-muted'}`}>
            {formatDuration(currentTime)} / {formatDuration(actualDuration)}
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div
        className={`h-1.5 rounded-full overflow-hidden cursor-pointer ${isKitten ? 'bg-pink-200' : 'bg-theme/20'}`}
        onClick={(e) => {
          if (!audioRef.current) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          audioRef.current.currentTime = pct * actualDuration;
        }}
      >
        <div
          className={`h-full rounded-full transition-all ${isKitten ? 'bg-pink-500' : 'bg-theme'}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

function KittenEars() {
  return (
    <div className="flex gap-2 mb-[-4px] ml-4">
      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-pink-400"
      />
      <motion.div
        animate={{ rotate: [5, -5, 5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-pink-400"
      />
    </div>
  );
}

function KittenPaws() {
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="flex gap-1 mt-[-2px] mr-2 justify-end text-sm"
    >
      🐾
    </motion.div>
  );
}

function AnimeDeco({ isOwn }: { isOwn: boolean }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className={`text-lg mb-1 ${isOwn ? 'text-right' : 'text-left'}`}
    >
      {isOwn ? '💕' : '✨'}
    </motion.div>
  );
}

function CosmosStars() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${1.5 + Math.random()}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function getStyleClass(style: string): string {
  const base = 'bg-theme text-white';
  switch (style) {
    case 'kitten':
      return 'style-kitten kitten-bubble';
    case 'neon':
      return 'style-neon text-white bg-bg-card';
    case 'anime':
      return 'style-anime text-ink';
    case 'retro':
      return 'style-retro text-white';
    case 'cosmos':
      return 'style-cosmos text-white cosmos-bubble';
    case 'glitch':
      return 'style-glitch text-white';
    default:
      return base;
  }
}

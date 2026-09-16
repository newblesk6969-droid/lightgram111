import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Image as ImageIcon,
  Sticker,
  Mic,
  Paperclip,
  ArrowLeft,
  X,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/AppContext';
import { t } from '@/i18n';
import { Avatar } from './Avatar';
import { EmojiStatusIcon } from './EmojiStatusIcon';
import { MessageBubble } from './MessageBubble';
import { STICKERS, fileToBase64, getAudioDuration, formatFileSize } from '@/constants';

interface ChatWindowProps {
  chatId: string;
  onBack: () => void;
  isMobile: boolean;
}

export function ChatWindow({ chatId, onBack, isMobile }: ChatWindowProps) {
  const { data, currentUser, sendMessage } = useApp();
  const [text, setText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [showAttach, setShowAttach] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chat = data.chats.find((c) => c.id === chatId);
  const otherUser = chat
    ? data.users.find((u) => u.id === chat.participantIds.find((id) => id !== currentUser?.id))
    : null;

  const messages = data.messages
    .filter((m) => m.chatId === chatId)
    .sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!chat || !otherUser || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-24 h-24 rounded-3xl bg-theme/10 flex items-center justify-center mb-4">
          <Send size={40} className="text-theme" />
        </div>
        <h3 className="font-semibold text-lg text-ink-muted">{t('no_chat_selected')}</h3>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim() || !chatId) return;
    sendMessage(chatId, 'text', text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleSendSticker = (stickerId: string) => {
    if (!chatId) return;
    sendMessage(chatId, 'sticker', '', { stickerId });
    setShowStickers(false);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !chatId) return;
    setShowAttach(false);

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        sendMessage(chatId, 'image', '', { imageUrl: base64 });
      } else if (file.type.startsWith('audio/')) {
        const base64 = await fileToBase64(file);
        const duration = await getAudioDuration(base64);
        sendMessage(chatId, 'audio', '', {
          audioTitle: file.name,
          audioDuration: duration,
          imageUrl: base64,
          fileName: file.name,
          fileSize: file.size,
        });
      } else {
        const base64 = await fileToBase64(file);
        sendMessage(chatId, 'file', '', {
          fileName: file.name,
          fileSize: file.size,
          imageUrl: base64,
        });
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (blob.size > 0 && chatId) {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = reader.result as string;
            const duration = await getAudioDuration(base64);
            sendMessage(chatId, 'voice', '', {
              voiceDuration: duration || recordTime,
              imageUrl: base64,
            });
          };
          reader.readAsDataURL(blob);
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordTime(0);
      recordTimerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch {
      setMicError(t('mic_permission_denied'));
      setTimeout(() => setMicError(null), 3000);
    }
  };

  const handleStopRecording = (cancel: boolean) => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (cancel) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = () => {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        };
        mediaRecorderRef.current.stop();
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col h-full bg-bg-base">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-theme/10 glass z-20">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-ink-muted hover:text-ink hover:bg-bg-hover transition-all shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <Avatar id={otherUser.id} name={otherUser.displayName} src={otherUser.avatar} size={42} ring />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate flex items-center gap-1">{otherUser.displayName}<EmojiStatusIcon status={otherUser.emojiStatus ?? 'none'} size={16} /></p>
          <p className="text-xs text-theme truncate">@{otherUser.username}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-success">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          {t('online')}
        </div>
      </div>

      {/* Mic error */}
      <AnimatePresence>
        {micError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2 bg-error/10 text-error text-sm text-center"
          >
            {micError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Avatar id={otherUser.id} name={otherUser.displayName} src={otherUser.avatar} size={80} ring />
            <p className="mt-4 font-semibold flex items-center gap-1.5">{otherUser.displayName}<EmojiStatusIcon status={otherUser.emojiStatus ?? 'none'} size={18} /></p>
            <p className="text-sm text-theme">@{otherUser.username}</p>
            <p className="mt-2 text-sm text-ink-muted max-w-xs">{t('no_chats_hint')}</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUser.id} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Sticker picker */}
      <AnimatePresence>
        {showStickers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t border-theme/10 glass p-4 grid grid-cols-6 gap-3"
          >
            {STICKERS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSendSticker(s.id)}
                className="text-4xl p-2 rounded-xl hover:bg-bg-card transition-all active:scale-90"
              >
                {s.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attach options */}
      <AnimatePresence>
        {showAttach && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t border-theme/10 glass p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-ink-muted">{t('attach_file')}</p>
              <button onClick={() => setShowAttach(false)} className="text-ink-faint hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-bg-card border border-bg-hover hover:border-theme/30 transition-all active:scale-95"
              >
                <ImageIcon size={28} className="text-theme" />
                <span className="text-sm font-medium">{t('photo')}</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-bg-card border border-bg-hover hover:border-theme/30 transition-all active:scale-95"
              >
                <Paperclip size={28} className="text-theme" />
                <span className="text-sm font-medium">{t('file')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Composer */}
      <div className="px-3 py-3 border-t border-theme/10 glass">
        {isRecording ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStopRecording(true)}
              className="w-11 h-11 rounded-full bg-error/20 flex items-center justify-center text-error transition-all active:scale-90"
            >
              <Trash2 size={20} />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error animate-pulse" />
              <span className="text-sm font-mono text-ink-muted">
                {Math.floor(recordTime / 60)}:{(recordTime % 60).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 flex items-center gap-0.5 h-6 ml-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-error/50 rounded-full"
                    style={{
                      height: `${30 + Math.sin(i + recordTime) * 40 + 30}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => handleStopRecording(false)}
              className="w-11 h-11 rounded-full bg-theme flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex gap-1">
              <ComposerButton
                icon={<Paperclip size={20} />}
                onClick={() => { setShowAttach(!showAttach); setShowStickers(false); }}
                active={showAttach}
              />
              <ComposerButton
                icon={<Sticker size={20} />}
                onClick={() => { setShowStickers(!showStickers); setShowAttach(false); }}
                active={showStickers}
              />
              <ComposerButton icon={<Mic size={20} />} onClick={handleStartRecording} />
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('type_message')}
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl bg-bg-card border border-bg-hover text-ink placeholder:text-ink-faint text-sm resize-none max-h-32 transition-all focus:border-theme focus:outline-none focus:ring-2 focus:ring-theme/20"
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="w-11 h-11 rounded-full bg-theme flex items-center justify-center text-white shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100"
            >
              <Send size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ComposerButton({ icon, onClick, active }: { icon: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
        active ? 'bg-theme/20 text-theme' : 'text-ink-muted hover:text-ink hover:bg-bg-card'
      }`}
    >
      {icon}
    </button>
  );
}

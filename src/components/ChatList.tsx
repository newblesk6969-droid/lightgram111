import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, MessageCircle, X, UserPlus } from 'lucide-react';
import { useApp } from '@/AppContext';
import { t } from '@/i18n';
import { formatChatListTime } from '@/constants';
import { Avatar } from './Avatar';
import type { Chat, MessageType } from '@/types';

interface ChatListProps {
  onOpenSidebar: () => void;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({ onOpenSidebar, selectedChatId, onSelectChat }: ChatListProps) {
  const { data, currentUser, searchUsers, findOrCreateChat } = useApp();
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const myChats = useMemo(() => {
    if (!currentUser) return [];
    return data.chats
      .filter((c) => c.participantIds.includes(currentUser.id))
      .map((chat) => {
        const otherId = chat.participantIds.find((id) => id !== currentUser.id)!;
        const otherUser = data.users.find((u) => u.id === otherId);
        const lastMsg = data.messages
          .filter((m) => m.chatId === chat.id)
          .sort((a, b) => b.timestamp - a.timestamp)[0];
        return { chat, otherUser, lastMsg };
      })
      .filter((c) => c.otherUser)
      .sort((a, b) => {
        const aT = a.lastMsg?.timestamp ?? a.chat.createdAt;
        const bT = b.lastMsg?.timestamp ?? b.chat.createdAt;
        return bT - aT;
      });
  }, [data.chats, data.users, data.messages, currentUser]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchUsers(query);
  }, [query, searchUsers]);

  const showSearch = searchFocused && query.trim().length > 0;

  const handleSelectUser = (userId: string) => {
    const chat = findOrCreateChat(userId);
    if (chat) {
      onSelectChat(chat.id);
      setQuery('');
      setSearchFocused(false);
    }
  };

  if (!currentUser) return null;

  const getPreview = (lastMsgType?: MessageType, lastMsgText?: string, otherUsername?: string) => {
    if (!lastMsgText && !lastMsgType) return `@${otherUsername}`;
    if (lastMsgType === 'image') return '🖼️ Фото';
    if (lastMsgType === 'sticker') return '🎨 Стикер';
    if (lastMsgType === 'voice') return '🎤 Голосовое';
    if (lastMsgType === 'audio') return '🎵 Аудиозапись';
    if (lastMsgType === 'file') return '📎 Файл';
    return lastMsgText ?? '';
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onOpenSidebar}
            className="w-10 h-10 rounded-xl bg-bg-card flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold flex-1">{t('sidebar_all_chats')}</h1>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-bg-card border border-bg-hover text-ink placeholder:text-ink-faint text-sm transition-all focus:border-theme focus:outline-none focus:ring-2 focus:ring-theme/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chat list / Search results */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-ink-faint">
                  <Search size={32} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">{t('no_results')}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-ink-faint px-3 py-2 uppercase tracking-wider">
                    {t('user_found')}
                  </p>
                  {searchResults.map((user) => (
                    <motion.button
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleSelectUser(user.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-bg-card transition-colors text-left"
                    >
                      <Avatar id={user.id} name={user.displayName} src={user.avatar} size={48} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user.displayName}</p>
                        <p className="text-sm text-theme truncate">@{user.username}</p>
                      </div>
                      <UserPlus size={20} className="text-theme" />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : myChats.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center px-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-theme/10 flex items-center justify-center mb-4">
                <MessageCircle size={36} className="text-theme" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{t('no_chats')}</h3>
              <p className="text-sm text-ink-muted max-w-xs">{t('no_chats_hint')}</p>
            </motion.div>
          ) : (
            <motion.div
              key="chats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {myChats.map(({ chat, otherUser, lastMsg }) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  otherUserName={otherUser!.displayName}
                  otherUserAvatar={otherUser!.avatar}
                  otherUserId={otherUser!.id}
                  otherUsername={otherUser!.username}
                  lastMsgText={lastMsg?.text ?? ''}
                  lastMsgType={lastMsg?.type}
                  lastMsgTime={lastMsg?.timestamp ?? chat.createdAt}
                  selected={chat.id === selectedChatId}
                  onClick={() => onSelectChat(chat.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ChatListItemProps {
  chat: Chat;
  otherUserName: string;
  otherUserAvatar: string | null;
  otherUserId: string;
  otherUsername: string;
  lastMsgText: string;
  lastMsgType?: MessageType;
  lastMsgTime: number;
  selected: boolean;
  onClick: () => void;
}

function ChatListItem({
  otherUserName,
  otherUserAvatar,
  otherUserId,
  otherUsername,
  lastMsgText,
  lastMsgType,
  lastMsgTime,
  selected,
  onClick,
}: ChatListItemProps) {
  const preview = () => {
    if (!lastMsgText && !lastMsgType) return `@${otherUsername}`;
    if (lastMsgType === 'image') return '🖼️ Фото';
    if (lastMsgType === 'sticker') return '🎨 Стикер';
    if (lastMsgType === 'voice') return '🎤 Голосовое';
    if (lastMsgType === 'audio') return '🎵 Аудиозапись';
    if (lastMsgType === 'file') return '📎 Файл';
    return lastMsgText;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
        selected ? 'bg-theme/15' : 'hover:bg-bg-card'
      }`}
    >
      <Avatar id={otherUserId} name={otherUserName} src={otherUserAvatar} size={52} ring={selected} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold truncate">{otherUserName}</p>
          <span className="text-xs text-ink-faint shrink-0">{formatChatListTime(lastMsgTime)}</span>
        </div>
        <p className="text-sm text-ink-muted truncate">{preview()}</p>
      </div>
    </button>
  );
}

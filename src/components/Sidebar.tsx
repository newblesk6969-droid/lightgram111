import { motion } from 'framer-motion';
import { MessageCircle, Users, Settings, LogOut, X, Sparkles } from 'lucide-react';
import { useApp } from '@/AppContext';
import { t } from '@/i18n';
import { Avatar } from './Avatar';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activeView: string;
  onOpenChats: () => void;
  onOpenGroups: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function Sidebar({
  open,
  onClose,
  activeView,
  onOpenChats,
  onOpenGroups,
  onOpenSettings,
  onLogout,
}: SidebarProps) {
  const { currentUser, data } = useApp();
  if (!currentUser) return null;

  const chatCount = data.chats.filter((c) => c.participantIds.includes(currentUser.id)).length;

  const menuItems: { key: string; label: string; icon: React.ReactNode; badge?: number; onClick: () => void }[] = [
    { key: 'chatList', label: t('sidebar_all_chats'), icon: <MessageCircle size={22} />, badge: chatCount, onClick: onOpenChats },
    { key: 'groups', label: t('sidebar_groups'), icon: <Users size={22} />, onClick: onOpenGroups },
    { key: 'settings', label: t('sidebar_settings'), icon: <Settings size={22} />, onClick: onOpenSettings },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-bg-surface z-50 flex flex-col border-r border-theme/10"
      >
        {/* Header */}
        <div className="p-4 border-b border-theme/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">LightGram</span>
            </div>
            <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 p-2">
            <Avatar id={currentUser.id} name={currentUser.displayName} src={currentUser.avatar} size={48} ring />
            <div className="min-w-0">
              <p className="font-semibold truncate">{currentUser.displayName}</p>
              <p className="text-sm text-theme truncate">@{currentUser.username}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all ${
                activeView === item.key
                  ? 'bg-theme/15 text-ink'
                  : 'text-ink-muted hover:bg-bg-card hover:text-ink'
              }`}
            >
              <span className={activeView === item.key ? 'text-theme' : ''}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-theme/20 text-theme">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-theme/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-error/80 hover:bg-error/10 transition-all"
          >
            <LogOut size={22} />
            {t('sidebar_logout')}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

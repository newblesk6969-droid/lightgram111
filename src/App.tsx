import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './AppContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Sidebar } from './components/Sidebar';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';

type Screen = 'welcome' | 'auth';
type View = 'chatList' | 'chat' | 'settings' | 'groups';

function AppContent() {
  const { currentUser, logout } = useApp();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<View>('chatList');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setSelectedChatId(null);
    setView('chatList');
  }, [currentUser?.id]);

  if (!currentUser) {
    return (
      <AnimatePresence mode="wait">
        {screen === 'welcome' ? (
          <motion.div key="welcome" exit={{ opacity: 0 }}>
            <WelcomeScreen onStart={() => setScreen('auth')} />
          </motion.div>
        ) : (
          <motion.div key="auth" exit={{ opacity: 0 }}>
            <AuthScreen onBack={() => setScreen('welcome')} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const handleLogout = () => {
    logout();
    setScreen('welcome');
    setDrawerOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setView('chat');
  };

  const handleBackToList = () => {
    setView('chatList');
    setSelectedChatId(null);
  };

  const handleOpenSettings = () => {
    setView('settings');
    setDrawerOpen(false);
  };

  const handleOpenGroups = () => {
    setView('groups');
    setDrawerOpen(false);
  };

  const handleOpenChats = () => {
    setView('chatList');
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Drawer (left slide-in menu) */}
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeView={view}
        onOpenChats={handleOpenChats}
        onOpenGroups={handleOpenGroups}
        onOpenSettings={handleOpenSettings}
        onLogout={handleLogout}
      />

      {/* Main area — only one view visible at a time on mobile */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Chat List — base layer */}
          {view === 'chatList' && (
            <motion.div
              key="chatList"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex"
            >
              <div className="w-full flex flex-col">
                <ChatList
                  onOpenSidebar={() => setDrawerOpen(true)}
                  selectedChatId={selectedChatId}
                  onSelectChat={handleSelectChat}
                />
              </div>
            </motion.div>
          )}

          {/* Chat Window — slides in from right */}
          {view === 'chat' && selectedChatId && (
            <motion.div
              key="chat"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag={isMobile ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 120) handleBackToList();
              }}
              className="absolute inset-0 flex"
            >
              <ChatWindow
                chatId={selectedChatId}
                onBack={handleBackToList}
                isMobile={isMobile}
              />
            </motion.div>
          )}

          {/* Settings — slides in from right */}
          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag={isMobile ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 120) handleOpenChats();
              }}
              className="absolute inset-0 flex flex-col"
            >
              <SettingsScreen onBack={handleOpenChats} />
            </motion.div>
          )}

          {/* Groups placeholder */}
          {view === 'groups' && (
            <motion.div
              key="groups"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag={isMobile ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 120) handleOpenChats();
              }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-theme/10 flex items-center justify-center mb-4">
                <span className="text-4xl">👥</span>
              </div>
              <h3 className="font-semibold text-lg text-ink-muted">Группы</h3>
              <p className="text-sm text-ink-faint mt-1 max-w-xs">
                {currentUser.language === 'en' ? 'Group chats coming soon' : 'Групповые чаты скоро появятся'}
              </p>
              <button
                onClick={handleOpenChats}
                className="mt-6 px-6 py-3 rounded-2xl bg-theme text-white font-medium transition-all hover:scale-105 active:scale-95"
              >
                {currentUser.language === 'en' ? 'Back' : 'Назад'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

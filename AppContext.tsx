import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type {
  AppData,
  User,
  Chat,
  Message,
  MessageStyle,
  ThemeName,
  Language,
  MessageType,
} from './types';
import {
  generateId,
  generateUsername,
  generateDisplayName,
} from './constants';
import { setLanguage as setI18nLang } from './i18n';

const STORAGE_KEY = 'lightgram_data_v2';

const emptyData: AppData = {
  users: [],
  chats: [],
  messages: [],
  session: { userId: null },
};

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as AppData;
    return {
      users: (parsed.users ?? []).map((u) => ({ ...u, emojiStatus: u.emojiStatus ?? 'none' })),
      chats: parsed.chats ?? [],
      messages: parsed.messages ?? [],
      session: parsed.session ?? { userId: null },
    };
  } catch {
    return emptyData;
  }
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

interface SendMessageExtra {
  imageUrl?: string;
  stickerId?: string;
  voiceDuration?: number;
  audioTitle?: string;
  audioDuration?: number;
  fileName?: string;
  fileSize?: number;
}

interface AppContextValue {
  data: AppData;
  currentUser: User | null;
  registerByEmail: (email: string, password: string, username: string, displayName: string) => { success: boolean; error?: string };
  registerByPhone: (phone: string, password: string, username: string, displayName: string) => { success: boolean; error?: string };
  loginByEmail: (email: string, password: string) => { success: boolean; error?: string };
  loginByPhone: (phone: string, password: string) => { success: boolean; error?: string };
  loginByOAuth: (provider: 'google' | 'github') => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  findOrCreateChat: (otherUserId: string) => Chat | null;
  sendMessage: (chatId: string, type: MessageType, text: string, extra?: SendMessageExtra) => void;
  searchUsers: (query: string) => User[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const currentUser = data.session.userId
    ? data.users.find((u) => u.id === data.session.userId) ?? null
    : null;

  useEffect(() => {
    if (currentUser) {
      setI18nLang(currentUser.language);
      document.documentElement.setAttribute('data-theme', currentUser.theme);
    } else {
      setI18nLang('ru');
      document.documentElement.setAttribute('data-theme', 'purple');
    }
  }, [currentUser?.language, currentUser?.theme, currentUser]);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => updater(prev));
  }, []);

  const registerByEmail = useCallback(
    (email: string, password: string, username: string, displayName: string): { success: boolean; error?: string } => {
      const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
      if (!email || !password || !cleanUsername || !displayName) {
        return { success: false, error: 'auth_error_fields' };
      }
      let errorMsg: string | null = null;
      setData((prev) => {
        if (prev.users.some((u) => u.email === email)) {
          errorMsg = 'auth_error_exists';
          return prev;
        }
        if (prev.users.some((u) => u.username === cleanUsername)) {
          errorMsg = 'auth_error_username_exists';
          return prev;
        }
        const newUser: User = {
          id: generateId(),
          email,
          phone: null,
          password,
          username: cleanUsername,
          displayName: displayName.trim(),
          bio: '',
          birthDate: '',
          avatar: null,
          preferredStyle: 'default',
          theme: 'purple',
          language: 'ru',
          emojiStatus: 'none',
          createdAt: Date.now(),
          oauthProvider: null,
        };
        return { ...prev, users: [...prev.users, newUser], session: { userId: newUser.id } };
      });
      return errorMsg ? { success: false, error: errorMsg } : { success: true };
    },
    []
  );

  const registerByPhone = useCallback(
    (phone: string, password: string, username: string, displayName: string): { success: boolean; error?: string } => {
      const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
      if (!phone || !password || !cleanUsername || !displayName) {
        return { success: false, error: 'auth_error_fields' };
      }
      let errorMsg: string | null = null;
      setData((prev) => {
        if (prev.users.some((u) => u.phone === phone)) {
          errorMsg = 'auth_error_exists';
          return prev;
        }
        if (prev.users.some((u) => u.username === cleanUsername)) {
          errorMsg = 'auth_error_username_exists';
          return prev;
        }
        const newUser: User = {
          id: generateId(),
          email: null,
          phone,
          password,
          username: cleanUsername,
          displayName: displayName.trim(),
          bio: '',
          birthDate: '',
          avatar: null,
          preferredStyle: 'default',
          theme: 'purple',
          language: 'ru',
          emojiStatus: 'none',
          createdAt: Date.now(),
          oauthProvider: null,
        };
        return { ...prev, users: [...prev.users, newUser], session: { userId: newUser.id } };
      });
      return errorMsg ? { success: false, error: errorMsg } : { success: true };
    },
    []
  );

  const loginByEmail = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      let errorMsg: string | null = null;
      setData((prev) => {
        const user = prev.users.find((u) => u.email === email && u.password === password);
        if (!user) {
          errorMsg = 'auth_error_credentials';
          return prev;
        }
        return { ...prev, session: { userId: user.id } };
      });
      return errorMsg ? { success: false, error: errorMsg } : { success: true };
    },
    []
  );

  const loginByPhone = useCallback(
    (phone: string, password: string): { success: boolean; error?: string } => {
      let errorMsg: string | null = null;
      setData((prev) => {
        const user = prev.users.find((u) => u.phone === phone && u.password === password);
        if (!user) {
          errorMsg = 'auth_error_credentials';
          return prev;
        }
        return { ...prev, session: { userId: user.id } };
      });
      return errorMsg ? { success: false, error: errorMsg } : { success: true };
    },
    []
  );

  const loginByOAuth = useCallback((provider: 'google' | 'github') => {
    const username = generateUsername().toLowerCase();
    const displayName = generateDisplayName();
    setData((prev) => {
      let finalUsername = username;
      let suffix = 1;
      while (prev.users.some((u) => u.username === finalUsername)) {
        finalUsername = `${username}${suffix}`;
        suffix++;
      }
      const newUser: User = {
        id: generateId(),
        email: `${finalUsername}@${provider}.oauth`,
        phone: null,
        password: null,
        username: finalUsername,
        displayName,
        bio: '',
        birthDate: '',
        avatar: null,
        preferredStyle: 'default',
        theme: 'purple',
        language: 'ru',
        emojiStatus: 'none',
        createdAt: Date.now(),
        oauthProvider: provider,
      };
      return { ...prev, users: [...prev.users, newUser], session: { userId: newUser.id } };
    });
  }, []);

  const logout = useCallback(() => {
    setData((prev) => ({ ...prev, session: { userId: null } }));
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      setData((prev) => {
        if (!prev.session.userId) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === prev.session.userId ? { ...u, ...updates } : u
          ),
        };
      });
    },
    []
  );

  const findOrCreateChat = useCallback(
    (otherUserId: string): Chat | null => {
      const currentId = data.session.userId;
      if (!currentId || currentId === otherUserId) return null;

      const existing = data.chats.find(
        (c) =>
          !c.isGroup &&
          c.participantIds.includes(currentId) &&
          c.participantIds.includes(otherUserId)
      );
      if (existing) return existing;

      const newChat: Chat = {
        id: generateId(),
        participantIds: [currentId, otherUserId],
        createdAt: Date.now(),
        isGroup: false,
        groupName: null,
      };
      setData((prev) => ({ ...prev, chats: [...prev.chats, newChat] }));
      return newChat;
    },
    [data.session.userId, data.chats]
  );

  const sendMessage = useCallback(
    (chatId: string, type: MessageType, text: string, extra?: SendMessageExtra) => {
      setData((prev) => {
        const sender = prev.users.find((u) => u.id === prev.session.userId);
        if (!sender) return prev;

        const newMessage: Message = {
          id: generateId(),
          chatId,
          senderId: sender.id,
          type,
          text,
          style: sender.preferredStyle,
          timestamp: Date.now(),
          imageUrl: extra?.imageUrl ?? null,
          stickerId: extra?.stickerId ?? null,
          voiceDuration: extra?.voiceDuration ?? null,
          audioTitle: extra?.audioTitle ?? null,
          audioDuration: extra?.audioDuration ?? null,
          fileName: extra?.fileName ?? null,
          fileSize: extra?.fileSize ?? null,
        };
        return { ...prev, messages: [...prev.messages, newMessage] };
      });
    },
    []
  );

  const searchUsers = useCallback(
    (query: string): User[] => {
      const cleaned = query.replace(/^@/, '').toLowerCase().trim();
      if (!cleaned) return [];
      const currentId = data.session.userId;
      return data.users.filter(
        (u) =>
          u.id !== currentId &&
          (u.username.toLowerCase().includes(cleaned) ||
            u.displayName.toLowerCase().includes(cleaned))
      );
    },
    [data.users, data.session.userId]
  );

  const value: AppContextValue = {
    data,
    currentUser,
    registerByEmail,
    registerByPhone,
    loginByEmail,
    loginByPhone,
    loginByOAuth,
    logout,
    updateProfile,
    findOrCreateChat,
    sendMessage,
    searchUsers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

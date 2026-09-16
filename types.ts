export type MessageStyle =
  | 'default'
  | 'kitten'
  | 'neon'
  | 'anime'
  | 'retro'
  | 'cosmos'
  | 'glitch';

export type ThemeName = 'purple' | 'bw' | 'red' | 'green' | 'blue' | 'pink';

export type Language = 'ru' | 'en';

export type MessageType = 'text' | 'image' | 'sticker' | 'voice' | 'audio' | 'file';

export type EmojiStatus =
  | 'none'
  | 'spiderman'
  | 'deadpool'
  | 'cat'
  | 'dog'
  | 'spider'
  | 'blood'
  | 'lightning'
  | 'heart'
  | 'flame'
  | 'crown';

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  password: string | null;
  username: string;
  displayName: string;
  bio: string;
  birthDate: string;
  avatar: string | null;
  preferredStyle: MessageStyle;
  theme: ThemeName;
  language: Language;
  emojiStatus: EmojiStatus;
  createdAt: number;
  oauthProvider: string | null;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  text: string;
  style: MessageStyle;
  timestamp: number;
  imageUrl: string | null;
  stickerId: string | null;
  voiceDuration: number | null;
  audioTitle: string | null;
  audioDuration: number | null;
  fileName: string | null;
  fileSize: number | null;
}

export interface Chat {
  id: string;
  participantIds: [string, string];
  createdAt: number;
  isGroup: boolean;
  groupName: string | null;
}

export interface Session {
  userId: string | null;
}

export interface AppData {
  users: User[];
  chats: Chat[];
  messages: Message[];
  session: Session;
}

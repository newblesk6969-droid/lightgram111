import type { Language } from './types';

type Dict = Record<string, { ru: string; en: string }>;

const dict: Dict = {
  // Welcome
  welcome_title: { ru: 'LightGram', en: 'LightGram' },
  welcome_subtitle: { ru: 'Премиальный мессенджер нового поколения', en: 'Premium messenger of the new generation' },
  welcome_start: { ru: 'Начать', en: 'Get Started' },

  // Auth
  auth_signin: { ru: 'Вход', en: 'Sign In' },
  auth_signup: { ru: 'Регистрация', en: 'Sign Up' },
  auth_email: { ru: 'Электронная почта', en: 'Email' },
  auth_password: { ru: 'Пароль', en: 'Password' },
  auth_phone: { ru: 'Номер телефона', en: 'Phone number' },
  auth_username: { ru: 'Имя пользователя', en: 'Username' },
  auth_display_name: { ru: 'Отображаемое имя', en: 'Display name' },
  auth_login_btn: { ru: 'Войти', en: 'Sign In' },
  auth_register_btn: { ru: 'Зарегистрироваться', en: 'Register' },
  auth_google: { ru: 'Войти через Google', en: 'Continue with Google' },
  auth_github: { ru: 'Войти через GitHub', en: 'Continue with GitHub' },
  auth_or: { ru: 'или', en: 'or' },
  auth_have_account: { ru: 'Уже есть аккаунт? Войти', en: 'Already have an account? Sign in' },
  auth_no_account: { ru: 'Нет аккаунта? Зарегистрироваться', en: 'No account? Sign up' },
  auth_error_credentials: { ru: 'Неверный email или пароль', en: 'Wrong email or password' },
  auth_error_exists: { ru: 'Пользователь с таким email уже существует', en: 'User with this email already exists' },
  auth_error_username_exists: { ru: 'Этот @username уже занят', en: 'This @username is already taken' },
  auth_error_fields: { ru: 'Заполните все поля', en: 'Fill in all fields' },
  auth_error_phone: { ru: 'Введите корректный номер телефона', en: 'Enter a valid phone number' },
  auth_tab_email: { ru: 'По Email', en: 'By Email' },
  auth_tab_phone: { ru: 'По телефону', en: 'By Phone' },

  // Sidebar / Drawer
  sidebar_all_chats: { ru: 'Все чаты', en: 'All Chats' },
  sidebar_groups: { ru: 'Группы', en: 'Groups' },
  sidebar_settings: { ru: 'Настройки', en: 'Settings' },
  sidebar_logout: { ru: 'Выйти из аккаунта', en: 'Log Out' },
  sidebar_profile: { ru: 'Профиль', en: 'Profile' },
  sidebar_drawer_title: { ru: 'Меню', en: 'Menu' },

  // Chat list
  search_placeholder: { ru: 'Поиск по @username…', en: 'Search by @username…' },
  no_chats: { ru: 'Чатов пока нет', en: 'No chats yet' },
  no_chats_hint: { ru: 'Найдите пользователя по @username, чтобы начать беседу', en: 'Find a user by @username to start a conversation' },
  user_found: { ru: 'Найден пользователь', en: 'User found' },
  start_chat: { ru: 'Начать чат', en: 'Start chat' },
  no_results: { ru: 'Ничего не найдено', en: 'Nothing found' },

  // Chat
  type_message: { ru: 'Введите сообщение…', en: 'Type a message…' },
  no_chat_selected: { ru: 'Выберите чат, чтобы начать общение', en: 'Select a chat to start messaging' },
  online: { ru: 'в сети', en: 'online' },
  offline: { ru: 'не в сети', en: 'offline' },
  recording: { ru: 'Запись…', en: 'Recording…' },
  cancel: { ru: 'Отмена', en: 'Cancel' },
  mic_permission_denied: { ru: 'Нет доступа к микрофону', en: 'Microphone access denied' },
  attach_file: { ru: 'Прикрепить файл', en: 'Attach file' },

  // Settings
  settings_title: { ru: 'Настройки', en: 'Settings' },
  settings_profile: { ru: 'Профиль', en: 'Profile' },
  settings_appearance: { ru: 'Оформление', en: 'Appearance' },
  settings_language: { ru: 'Язык интерфейса', en: 'Interface language' },
  settings_theme: { ru: 'Цветовая тема', en: 'Color theme' },
  settings_message_style: { ru: 'Стиль твоих сообщений', en: 'Your message style' },
  settings_message_style_desc: {
    ru: 'Выбранный стиль применяется ко всем вашим исходящим сообщениям',
    en: 'The selected style applies to all your outgoing messages',
  },
  settings_edit_avatar: { ru: 'Сменить аватар', en: 'Change avatar' },
  settings_bio: { ru: 'О себе', en: 'Bio' },
  settings_birth_date: { ru: 'Дата рождения', en: 'Birth date' },
  settings_save: { ru: 'Сохранить', en: 'Save' },
  settings_saved: { ru: 'Сохранено!', en: 'Saved!' },
  settings_back: { ru: 'Назад', en: 'Back' },

  // Themes
  theme_purple: { ru: 'Чёрно-фиолетовая', en: 'Black & Purple' },
  theme_bw: { ru: 'Чёрно-белая', en: 'Black & White' },
  theme_red: { ru: 'Красная', en: 'Red' },
  theme_green: { ru: 'Зелёная', en: 'Green' },
  theme_blue: { ru: 'Синяя', en: 'Blue' },
  theme_pink: { ru: 'Розовая', en: 'Pink' },

  // Message styles
  style_default: { ru: 'Стандартный', en: 'Default' },
  style_kitten: { ru: 'Котята', en: 'Kittens' },
  style_neon: { ru: 'Неоновый', en: 'Neon' },
  style_anime: { ru: 'Аниме', en: 'Anime' },
  style_retro: { ru: 'Ретро-вейв', en: 'Retro-wave' },
  style_cosmos: { ru: 'Космос', en: 'Cosmos' },
  style_glitch: { ru: 'Глитч', en: 'Glitch' },

  // Misc
  back: { ru: 'Назад', en: 'Back' },
  send: { ru: 'Отправить', en: 'Send' },
  you: { ru: 'Вы', en: 'You' },
  today: { ru: 'Сегодня', en: 'Today' },
  yesterday: { ru: 'Вчера', en: 'Yesterday' },
  file: { ru: 'Файл', en: 'File' },
  voice_message: { ru: 'Голосовое сообщение', en: 'Voice message' },
  audio_track: { ru: 'Аудиозапись', en: 'Audio track' },
  photo: { ru: 'Фото', en: 'Photo' },
  sticker_label: { ru: 'Стикер', en: 'Sticker' },

  // Groups placeholder
  groups_soon: { ru: 'Групповые чаты скоро появятся', en: 'Group chats coming soon' },
};

let currentLang: Language = 'ru';

export function setLanguage(lang: Language) {
  currentLang = lang;
}

export function getLanguage(): Language {
  return currentLang;
}

export function t(key: keyof typeof dict): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[currentLang] ?? entry.ru;
}

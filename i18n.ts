import type { Language } from './types';

type Dict = Record<string, string>;

const ru: Dict = {
  welcome_title: 'LightGram',
  welcome_subtitle: 'Премиальный мессенджер нового поколения',
  welcome_start: 'Начать',
  back: 'Назад',

  auth_signin: 'Вход',
  auth_signup: 'Регистрация',
  auth_tab_email: 'Email',
  auth_tab_phone: 'Телефон',
  auth_email: 'Email',
  auth_password: 'Пароль',
  auth_display_name: 'Имя',
  auth_username: 'Username',
  auth_login_btn: 'Войти',
  auth_register_btn: 'Создать аккаунт',
  auth_or: 'или',
  auth_google: 'Войти через Google',
  auth_github: 'Войти через GitHub',

  auth_error_fields: 'Заполните все поля',
  auth_error_exists: 'Пользователь с такими данными уже существует',
  auth_error_username_exists: 'Это имя пользователя уже занято',
  auth_error_credentials: 'Неверный email или пароль',
  auth_error_phone: 'Неверный номер телефона',

  sidebar_all_chats: 'Все чаты',
  sidebar_groups: 'Группы',
  sidebar_settings: 'Настройки',
  sidebar_logout: 'Выйти',

  search_placeholder: 'Поиск чатов и пользователей',
  no_results: 'Ничего не найдено',
  user_found: 'Пользователи',
  no_chats: 'Пока нет чатов',
  no_chats_hint: 'Найдите пользователя через поиск, чтобы начать диалог',
  no_chat_selected: 'Чат не выбран',

  online: 'в сети',
  type_message: 'Сообщение...',
  attach_file: 'Прикрепить файл',
  photo: 'Фото',
  file: 'Файл',
  mic_permission_denied: 'Нет доступа к микрофону',

  settings_title: 'Настройки',
  settings_profile: 'Профиль',
  settings_bio: 'О себе',
  settings_birth_date: 'Дата рождения',
  settings_save: 'Сохранить',
  settings_saved: 'Сохранено!',
  settings_language: 'Язык',
  settings_theme: 'Тема оформления',
  settings_message_style: 'Стиль сообщений',
  settings_message_style_desc: 'Выберите стиль, который будут видеть ваши собеседники',

  theme_purple: 'Неон',
  theme_bw: 'Чёрно-белая',
  theme_red: 'Красная',
  theme_green: 'Зелёная',
  theme_blue: 'Синяя',
  theme_pink: 'Розовая',

  style_default: 'По умолчанию',
  style_kitten: 'Котёнок',
  style_neon: 'Неон',
  style_anime: 'Аниме',
  style_retro: 'Ретро',
  style_cosmos: 'Космос',
  style_glitch: 'Глитч',

  settings_emoji_status: 'Премиум-статус',
  settings_emoji_status_desc: 'Анимированный значок рядом с вашим именем',
  status_none: 'Нет',
  status_spiderman: 'Человек-паук',
  status_deadpool: 'Дэдпул',
  status_cat: 'Котик',
  status_dog: 'Пёс',
  status_spider: 'Паук',
  status_blood: 'Кровь',
  status_lightning: 'Молния',
  status_heart: 'Сердце',
  status_flame: 'Пламя',
  status_crown: 'Корона',
};

const en: Dict = {
  welcome_title: 'LightGram',
  welcome_subtitle: 'Premium messenger of the new generation',
  welcome_start: 'Get Started',
  back: 'Back',

  auth_signin: 'Sign In',
  auth_signup: 'Sign Up',
  auth_tab_email: 'Email',
  auth_tab_phone: 'Phone',
  auth_email: 'Email',
  auth_password: 'Password',
  auth_display_name: 'Name',
  auth_username: 'Username',
  auth_login_btn: 'Sign In',
  auth_register_btn: 'Create Account',
  auth_or: 'or',
  auth_google: 'Sign in with Google',
  auth_github: 'Sign in with GitHub',

  auth_error_fields: 'Please fill in all fields',
  auth_error_exists: 'A user with these credentials already exists',
  auth_error_username_exists: 'This username is already taken',
  auth_error_credentials: 'Invalid email or password',
  auth_error_phone: 'Invalid phone number',

  sidebar_all_chats: 'All Chats',
  sidebar_groups: 'Groups',
  sidebar_settings: 'Settings',
  sidebar_logout: 'Log Out',

  search_placeholder: 'Search chats and users',
  no_results: 'No results found',
  user_found: 'Users',
  no_chats: 'No chats yet',
  no_chats_hint: 'Find a user via search to start a conversation',
  no_chat_selected: 'No chat selected',

  online: 'online',
  type_message: 'Message...',
  attach_file: 'Attach file',
  photo: 'Photo',
  file: 'File',
  mic_permission_denied: 'Microphone access denied',

  settings_title: 'Settings',
  settings_profile: 'Profile',
  settings_bio: 'Bio',
  settings_birth_date: 'Date of Birth',
  settings_save: 'Save',
  settings_saved: 'Saved!',
  settings_language: 'Language',
  settings_theme: 'Theme',
  settings_message_style: 'Message Style',
  settings_message_style_desc: 'Choose the style your chat partners will see',

  theme_purple: 'Neon',
  theme_bw: 'Black & White',
  theme_red: 'Red',
  theme_green: 'Green',
  theme_blue: 'Blue',
  theme_pink: 'Pink',

  style_default: 'Default',
  style_kitten: 'Kitten',
  style_neon: 'Neon',
  style_anime: 'Anime',
  style_retro: 'Retro',
  style_cosmos: 'Cosmos',
  style_glitch: 'Glitch',

  settings_emoji_status: 'Premium Status',
  settings_emoji_status_desc: 'Animated icon next to your name everywhere',
  status_none: 'None',
  status_spiderman: 'Spider-Man',
  status_deadpool: 'Deadpool',
  status_cat: 'Cat',
  status_dog: 'Dog',
  status_spider: 'Spider',
  status_blood: 'Blood',
  status_lightning: 'Lightning',
  status_heart: 'Heart',
  status_flame: 'Flame',
  status_crown: 'Crown',
};

let currentLang: Language = 'ru';

const dicts: Record<Language, Dict> = { ru, en };

export function setLanguage(lang: Language): void {
  currentLang = lang;
}

export function t(key: string): string {
  return dicts[currentLang][key] ?? dicts.ru[key] ?? key;
}

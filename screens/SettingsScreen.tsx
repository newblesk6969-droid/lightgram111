import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Palette, Globe, Cat, Zap, Sword, Music, Orbit, Cpu, Sparkles, Save } from 'lucide-react';
import { EmojiStatusIcon } from '@/components/EmojiStatusIcon';
import { useApp } from '@/AppContext';
import { t, setLanguage as setI18nLang } from '@/i18n';
import { THEME_NAMES, MESSAGE_STYLES } from '@/constants';
import { Avatar } from '@/components/Avatar';
import { AvatarPicker } from '@/components/AvatarPicker';
import type { MessageStyle, ThemeName, Language, EmojiStatus } from '@/types';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { currentUser, updateProfile } = useApp();
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '');
  const [username, setUsername] = useState(currentUser?.username ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate ?? '');
  const [avatar, setAvatar] = useState<string | null>(currentUser?.avatar ?? null);
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSave = () => {
    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
    updateProfile({
      displayName: displayName.trim(),
      username: cleanUsername,
      bio: bio.trim(),
      birthDate,
      avatar,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSetLanguage = (lang: Language) => {
    setI18nLang(lang);
    updateProfile({ language: lang });
  };

  const handleSetTheme = (theme: ThemeName) => {
    document.documentElement.setAttribute('data-theme', theme);
    updateProfile({ theme });
  };

  const handleSetStatus = (status: EmojiStatus) => {
    updateProfile({ emojiStatus: status });
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
        <h1 className="text-xl font-bold">{t('settings_title')}</h1>
      </div>

      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
          {/* Profile section */}
          <Section title={t('settings_profile')}>
            <div className="flex flex-col items-center gap-4 py-4">
              <AvatarPicker
                id={currentUser.id}
                name={displayName || currentUser.displayName}
                currentSrc={avatar}
                onChange={setAvatar}
              />
              <div className="w-full space-y-3">
                <Field label={t('auth_display_name')}>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="settings-input"
                  />
                </Field>
                <Field label={t('auth_username')}>
                  <div className="flex items-center rounded-xl bg-bg-card border border-bg-hover focus-within:border-theme focus-within:ring-2 focus-within:ring-theme/20 transition-all">
                    <span className="pl-3.5 mr-2 py-2.5 text-sm font-semibold select-none text-purple-400">@</span>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 pr-3.5 py-2.5 bg-transparent border-0 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                    />
                  </div>
                </Field>
                <Field label={t('settings_bio')}>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="settings-input resize-none"
                    placeholder="..."
                  />
                </Field>
                <Field label={t('settings_birth_date')}>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="settings-input"
                  />
                </Field>
              </div>
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-2xl bg-theme text-white font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Save size={18} />
                {saved ? t('settings_saved') : t('settings_save')}
              </button>
            </div>
          </Section>

          {/* Language */}
          <Section title={t('settings_language')} icon={<Globe size={20} />}>
            <div className="flex gap-3 p-4">
              <ToggleCard
                active={currentUser.language === 'ru'}
                onClick={() => handleSetLanguage('ru')}
                label="Русский"
              />
              <ToggleCard
                active={currentUser.language === 'en'}
                onClick={() => handleSetLanguage('en')}
                label="English"
              />
            </div>
          </Section>

          {/* Theme */}
          <Section title={t('settings_theme')} icon={<Palette size={20} />}>
            <div className="grid grid-cols-3 gap-3 p-4">
              {THEME_NAMES.map((theme) => (
                <ThemeCard
                  key={theme}
                  theme={theme}
                  active={currentUser.theme === theme}
                  onClick={() => handleSetTheme(theme)}
                />
              ))}
            </div>
          </Section>

          {/* Premium Emoji Status */}
          <Section
            title={t('settings_emoji_status')}
            icon={<Sparkles size={20} />}
            description={t('settings_emoji_status_desc')}
          >
            <div className="grid grid-cols-5 gap-2 p-4">
              {STATUS_LIST.map((status) => (
                <StatusCard
                  key={status}
                  status={status}
                  active={currentUser.emojiStatus === status}
                  onClick={() => handleSetStatus(status)}
                />
              ))}
            </div>
          </Section>

          {/* Message style */}
          <Section
            title={t('settings_message_style')}
            icon={<Sparkles size={20} />}
            description={t('settings_message_style_desc')}
            highlight
          >
            <div className="grid grid-cols-2 gap-3 p-4">
              {MESSAGE_STYLES.map((style) => (
                <StyleCard
                  key={style}
                  style={style}
                  active={currentUser.preferredStyle === style}
                  onClick={() => handleSetStyle(style)}
                />
              ))}
            </div>
          </Section>
        </div>

        <style>{`
          .settings-input {
            width: 100%;
            padding: 0.625rem 0.875rem;
            border-radius: 0.75rem;
            background: rgb(var(--bg-card));
            border: 1px solid rgb(var(--bg-hover));
            color: rgb(var(--ink));
            font-size: 0.875rem;
            transition: all 0.2s;
          }
          .settings-input:focus {
            outline: none;
            border-color: rgb(var(--theme-accent));
            box-shadow: 0 0 0 2px rgb(var(--theme-accent) / 0.2);
          }
          .settings-input::placeholder { color: rgb(var(--ink-faint)); }
        `}</style>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  description,
  highlight,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl bg-bg-surface border ${highlight ? 'border-theme/30 glow-border' : 'border-theme/10'}`}
    >
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-theme">{icon}</span>}
          <h2 className="font-bold text-lg">{title}</h2>
        </div>
        {description && <p className="text-sm text-ink-muted mt-1.5 ml-7">{description}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-ink-muted mb-1.5 block uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function ToggleCard({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 rounded-2xl font-medium text-sm transition-all border-2 ${
        active
          ? 'border-theme bg-theme/15 text-ink'
          : 'border-bg-hover text-ink-muted hover:text-ink hover:border-theme/30'
      }`}
    >
      {label}
    </button>
  );
}

const THEME_SWATCHES: Record<ThemeName, string> = {
  purple: 'linear-gradient(135deg, #1a1a2e, #7c3aed)',
  bw: 'linear-gradient(135deg, #000, #fff)',
  red: 'linear-gradient(135deg, #2a0a0a, #ef4444)',
  green: 'linear-gradient(135deg, #0a2a10, #22c55e)',
  blue: 'linear-gradient(135deg, #0a1525, #3b82f6)',
  pink: 'linear-gradient(135deg, #2a0a1a, #ec4899)',
};

function ThemeCard({ theme, active, onClick }: { theme: ThemeName; active: boolean; onClick: () => void }) {
  const labels: Record<ThemeName, string> = {
    purple: t('theme_purple'),
    bw: t('theme_bw'),
    red: t('theme_red'),
    green: t('theme_green'),
    blue: t('theme_blue'),
    pink: t('theme_pink'),
  };

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden transition-all ${active ? 'ring-2 ring-theme' : ''}`}
    >
      <div className="h-16 w-full" style={{ background: THEME_SWATCHES[theme] }} />
      <div className="px-2 py-2 bg-bg-card">
        <p className="text-xs font-medium text-center truncate">{labels[theme]}</p>
      </div>
      {active && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-theme flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      )}
    </button>
  );
}

const STYLE_META: Record<MessageStyle, { icon: React.ReactNode; label: string }> = {
  default: { icon: <Sparkles size={18} />, label: t('style_default') },
  kitten: { icon: <Cat size={18} />, label: t('style_kitten') },
  neon: { icon: <Zap size={18} />, label: t('style_neon') },
  anime: { icon: <Sword size={18} />, label: t('style_anime') },
  retro: { icon: <Music size={18} />, label: t('style_retro') },
  cosmos: { icon: <Orbit size={18} />, label: t('style_cosmos') },
  glitch: { icon: <Cpu size={18} />, label: t('style_glitch') },
};

function StyleCard({ style, active, onClick }: { style: MessageStyle; active: boolean; onClick: () => void }) {
  const meta = STYLE_META[style];

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden transition-all ${active ? 'ring-2 ring-theme scale-[1.02]' : 'hover:scale-[1.01]'}`}
    >
      <div className="p-4 bg-bg-card flex items-center justify-center min-h-[80px]">
        <div className={`rounded-2xl px-3 py-2 text-xs ${getStylePreview(style)}`}>
          {style === 'kitten' ? '🐱 Привет!' : style === 'anime' ? '✨ Привет!' : 'Привет!'}
        </div>
      </div>
      <div className={`px-3 py-2 flex items-center gap-2 ${active ? 'bg-theme/15' : 'bg-bg-surface'}`}>
        <span className={active ? 'text-theme' : 'text-ink-muted'}>{meta.icon}</span>
        <span className={`text-xs font-medium ${active ? 'text-ink' : 'text-ink-muted'}`}>{meta.label}</span>
        {active && <Check size={14} className="text-theme ml-auto" />}
      </div>
    </button>
  );
}

const STATUS_LIST: EmojiStatus[] = [
  'none', 'spiderman', 'deadpool', 'cat', 'dog',
  'spider', 'blood', 'lightning', 'heart', 'flame', 'crown',
];

function StatusCard({ status, active, onClick }: { status: EmojiStatus; active: boolean; onClick: () => void }) {
  const labels: Record<EmojiStatus, string> = {
    none: t('status_none'),
    spiderman: t('status_spiderman'),
    deadpool: t('status_deadpool'),
    cat: t('status_cat'),
    dog: t('status_dog'),
    spider: t('status_spider'),
    blood: t('status_blood'),
    lightning: t('status_lightning'),
    heart: t('status_heart'),
    flame: t('status_flame'),
    crown: t('status_crown'),
  };
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all border ${
        active ? 'border-theme bg-theme/15 ring-2 ring-theme' : 'border-bg-hover hover:border-theme/30 hover:bg-bg-card'
      }`}
    >
      <div className="h-7 flex items-center justify-center">
        {status === 'none' ? (
          <span className="text-xs text-ink-faint">—</span>
        ) : (
          <EmojiStatusIcon status={status} size={22} />
        )}
      </div>
      <span className={`text-[10px] leading-tight text-center ${active ? 'text-ink' : 'text-ink-muted'}`}>
        {labels[status]}
      </span>
      {active && (
        <Check size={12} className="absolute top-1 right-1 text-theme" />
      )}
    </button>
  );
}

function getStylePreview(style: MessageStyle): string {
  switch (style) {
    case 'kitten':
      return 'style-kitten';
    case 'neon':
      return 'style-neon text-white bg-bg-card';
    case 'anime':
      return 'style-anime text-ink';
    case 'retro':
      return 'style-retro text-white';
    case 'cosmos':
      return 'style-cosmos text-white';
    case 'glitch':
      return 'style-glitch text-white';
    default:
      return 'bg-theme text-white';
  }
}

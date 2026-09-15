import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Phone, AtSign, User, ArrowLeft, AlertCircle, Chrome, Github } from 'lucide-react';
import { useApp } from '@/AppContext';
import { t } from '@/i18n';
import { formatPhone, isValidPhone, isValidEmail } from '@/constants';

type AuthMode = 'login' | 'register';
type AuthTab = 'email' | 'phone';

export function AuthScreen({ onBack }: { onBack: () => void }) {
  const { loginByEmail, loginByPhone, registerByEmail, registerByPhone, loginByOAuth } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [tab, setTab] = useState<AuthTab>('email');
  const [error, setError] = useState<string | null>(null);

  // Shared fields
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  // Email fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Phone fields
  const [phone, setPhone] = useState('+7 (');
  const [phonePassword, setPhonePassword] = useState('');

  const handleSubmit = () => {
    setError(null);

    if (mode === 'login') {
      if (tab === 'email') {
        if (!email || !password) {
          setError(t('auth_error_fields'));
          return;
        }
        const res = loginByEmail(email, password);
        if (!res.success) setError(t(res.error as string));
      } else {
        if (!phone || !phonePassword) {
          setError(t('auth_error_fields'));
          return;
        }
        if (!isValidPhone(phone)) {
          setError(t('auth_error_phone'));
          return;
        }
        const res = loginByPhone(phone, phonePassword);
        if (!res.success) setError(t(res.error as string));
      }
    } else {
      // Register
      if (tab === 'email') {
        if (!email || !password || !username || !displayName) {
          setError(t('auth_error_fields'));
          return;
        }
        if (!isValidEmail(email)) {
          setError(t('auth_error_fields'));
          return;
        }
        const res = registerByEmail(email, password, username, displayName);
        if (!res.success) setError(t(res.error as string));
      } else {
        if (!phone || !phonePassword || !username || !displayName) {
          setError(t('auth_error_fields'));
          return;
        }
        if (!isValidPhone(phone)) {
          setError(t('auth_error_phone'));
          return;
        }
        const res = registerByPhone(phone, phonePassword, username, displayName);
        if (!res.success) setError(t(res.error as string));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-theme/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-theme/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">{t('back')}</span>
        </button>

        <div className="glass rounded-3xl p-8 border border-theme/20 shadow-2xl">
          {/* Mode toggle */}
          <div className="flex gap-2 p-1 bg-bg-card rounded-2xl mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                mode === 'login'
                  ? 'bg-theme text-white shadow-lg'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {t('auth_signin')}
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                mode === 'register'
                  ? 'bg-theme text-white shadow-lg'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {t('auth_signup')}
            </button>
          </div>

          {/* Tab toggle (email / phone) */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => { setTab('email'); setError(null); }}
              className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all border ${
                tab === 'email'
                  ? 'border-theme bg-theme/10 text-ink'
                  : 'border-bg-hover text-ink-muted hover:text-ink'
              }`}
            >
              {t('auth_tab_email')}
            </button>
            <button
              onClick={() => { setTab('phone'); setError(null); }}
              className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all border ${
                tab === 'phone'
                  ? 'border-theme bg-theme/10 text-ink'
                  : 'border-bg-hover text-ink-muted hover:text-ink'
              }`}
            >
              {t('auth_tab_phone')}
            </button>
          </div>

          <div className="space-y-4">
            {/* Registration-only fields */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <InputField
                    icon={<AtSign size={18} />}
                    placeholder="@username"
                    value={username}
                    onChange={setUsername}
                  />
                  <InputField
                    icon={<User size={18} />}
                    placeholder={t('auth_display_name')}
                    value={displayName}
                    onChange={setDisplayName}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email or Phone */}
            {tab === 'email' ? (
              <InputField
                icon={<Mail size={18} />}
                type="email"
                placeholder={t('auth_email')}
                value={email}
                onChange={setEmail}
              />
            ) : (
              <InputField
                icon={<Phone size={18} />}
                type="tel"
                placeholder="+7 (9XX) XXX-XX-XX"
                value={phone}
                onChange={(v) => setPhone(formatPhone(v))}
              />
            )}

            {/* Password */}
            <InputField
              icon={<Lock size={18} />}
              type="password"
              placeholder={t('auth_password')}
              value={tab === 'email' ? password : phonePassword}
              onChange={tab === 'email' ? setPassword : setPhonePassword}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            />

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-xl px-3 py-2"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-theme text-white font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              {mode === 'login' ? t('auth_login_btn') : t('auth_register_btn')}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-theme/20" />
            <span className="text-xs text-ink-faint">{t('auth_or')}</span>
            <div className="flex-1 h-px bg-theme/20" />
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3">
            <button
              onClick={() => loginByOAuth('google')}
              className="w-full py-3 rounded-2xl bg-bg-card border border-bg-hover font-medium text-sm flex items-center justify-center gap-3 transition-all hover:bg-bg-hover hover:border-theme/30 active:scale-[0.98]"
            >
              <Chrome size={20} className="text-theme" />
              {t('auth_google')}
            </button>
            <button
              onClick={() => loginByOAuth('github')}
              className="w-full py-3 rounded-2xl bg-bg-card border border-bg-hover font-medium text-sm flex items-center justify-center gap-3 transition-all hover:bg-bg-hover hover:border-theme/30 active:scale-[0.98]"
            >
              <Github size={20} className="text-theme" />
              {t('auth_github')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

function InputField({ icon, placeholder, value, onChange, type = 'text', onKeyDown }: InputFieldProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-card border border-bg-hover text-ink placeholder:text-ink-faint transition-all focus:border-theme focus:outline-none focus:ring-2 focus:ring-theme/20"
      />
    </div>
  );
}

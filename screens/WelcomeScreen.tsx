import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { t } from '@/i18n';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-theme/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-2xl animate-pulse-glow">
            <Sparkles size={56} className="text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl font-bold tracking-tight text-glow"
        >
          {t('welcome_title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-4 text-lg text-ink-muted max-w-sm"
        >
          {t('welcome_subtitle')}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          onClick={onStart}
          className="mt-12 px-10 py-4 rounded-2xl bg-theme text-white font-semibold text-lg flex items-center gap-3 shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
        >
          {t('welcome_start')}
          <ArrowRight size={22} />
        </motion.button>
      </motion.div>
    </div>
  );
}

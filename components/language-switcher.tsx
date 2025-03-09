"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const selectLanguage = (lang: 'en' | 'de') => {
    setLanguage(lang);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
        className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all flex items-center gap-2"
        aria-label={t('language')}
      >
        <Globe size={20} />
        <span className="hidden md:inline">{language === 'en' ? 'EN' : 'DE'}</span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={() => selectLanguage('en')}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  language === 'en' 
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                {t('english')}
              </button>
              <button
                onClick={() => selectLanguage('de')}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  language === 'de' 
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                {t('german')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";

export function Navigation() {
  const { t } = useLanguage();

  return (
    <motion.nav 
      className="sticky top-0 p-6 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 z-50 border-b border-white/20 dark:border-slate-700/20"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-mono relative group">
          <span>MF</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <div className="hidden md:flex gap-8">
          <Link href="/about" className="nav-link">{t('nav.about')}</Link>
          <Link href="/about-you" className="nav-link">{t('nav.aboutYou')}</Link>
          <Link href="/tetris" className="nav-link">{t('nav.tetris')}</Link>
          <Link href="/terminal" className="nav-link">{t('nav.terminal')}</Link>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="md:hidden text-current">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
} 
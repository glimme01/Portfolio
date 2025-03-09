"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setCookie, getCookie } from '@/utils/cookies';

type Language = 'en' | 'de';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.aboutYou': 'About You',
    'nav.tetris': 'Tetris',
    'nav.terminal': 'Terminal',
    
    // Home page
    'home.title': 'MORITZ FREUND',
    'home.subtitle': 'Gaming is a passion, but Coding is a lifestyle. Creating digital experiences that stand out.',
    'home.role.developer': 'DEVELOPER.',
    'home.role.gamer': 'GAMER.',
    'home.role.student': 'STUDENT.',
    'home.contact': 'GET IN TOUCH',
    'home.contactText': 'Interested in working together? I\'m always open to new opportunities and collaborations.',
    
    // About page
    'about.title': 'ABOUT ME',
    'about.description1': 'My focus is on building sleek designs with eye-catching animations. Right now, I\'m diving into Next.js and TSX, leveling up my skills along the way.',
    'about.description2': 'This website is a work in progress—kind of like me. So, if you spot something funky, just pretend it\'s a feature, not a bug.',
    'about.description3': 'I\'m a 13-year-old developer, gamer, and tech enthusiast with a passion for creating web experiences that stand out!',
    'about.hobbies': 'When I\'m not coding...',
    'about.biking': 'Biking',
    'about.skating': 'Ice Skating',
    'about.studying': '(hopefully) Studying',
    'about.coding': 'Coding',
    
    // Common
    'language': 'Language',
    'english': 'English',
    'german': 'German',
  },
  de: {
    // Navigation
    'nav.about': 'Über mich',
    'nav.aboutYou': 'Über dich',
    'nav.tetris': 'Tetris',
    'nav.terminal': 'Terminal',
    
    // Home page
    'home.title': 'MORITZ FREUND',
    'home.subtitle': 'Gaming ist eine Leidenschaft, aber Coding ist ein Lebensstil. Ich erschaffe digitale Erlebnisse, die herausstechen.',
    'home.role.developer': 'ENTWICKLER.',
    'home.role.gamer': 'GAMER.',
    'home.role.student': 'SCHÜLER.',
    'home.contact': 'KONTAKT',
    'home.contactText': 'Interesse an einer Zusammenarbeit? Ich bin immer offen für neue Möglichkeiten und Kooperationen.',
    
    // About page
    'about.title': 'ÜBER MICH',
    'about.description1': 'Mein Fokus liegt auf dem Erstellen eleganter Designs mit auffälligen Animationen. Derzeit vertiefe ich mich in Next.js und TSX und verbessere meine Fähigkeiten.',
    'about.description2': 'Diese Website ist noch in Arbeit—genau wie ich. Falls du etwas Seltsames entdeckst, betrachte es einfach als Feature, nicht als Bug.',
    'about.description3': 'Ich bin ein 13-jähriger Entwickler, Gamer und Technik-Enthusiast mit einer Leidenschaft für die Erstellung von Web-Erlebnissen, die herausstechen!',
    'about.hobbies': 'Wenn ich nicht code...',
    'about.biking': 'Radfahren',
    'about.skating': 'Eislaufen',
    'about.studying': '(hoffentlich) Lernen',
    'about.coding': 'Programmieren',
    
    // Common
    'language': 'Sprache',
    'english': 'Englisch',
    'german': 'Deutsch',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  
  useEffect(() => {
    // Load language preference from cookie on mount
    const savedLanguage = getCookie('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'de') {
        setLanguageState('de');
        setCookie('language', 'de');
      }
    }
  }, []);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setCookie('language', lang);
  };
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
"use client";

import { useState, useEffect } from 'react';
import { setCookie, getCookie } from '@/utils/cookies';
import { motion } from 'framer-motion';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = getCookie('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);
  
  const handleAccept = () => {
    setCookie('cookiesAccepted', 'true');
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <motion.div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md p-4 glass rounded-lg z-50 border border-white/20 dark:border-slate-700/20"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <p className="mb-4">
        This website uses cookies to enhance your browsing experience.
      </p>
      <div className="flex gap-2">
        <button 
          onClick={handleAccept}
          className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
        >
          Accept
        </button>
        <button 
          onClick={() => setShowBanner(false)}
          className="px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Decline
        </button>
      </div>
    </motion.div>
  );
} 
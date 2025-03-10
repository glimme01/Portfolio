"use client";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 bg-white/10 dark:bg-slate-900/10 backdrop-blur-sm border-t border-white/10 dark:border-slate-700/10">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm sm:text-base">© {new Date().getFullYear()} Moritz Freund. All rights reserved.</p>
        <p className="text-xs sm:text-sm mt-2 text-slate-600 dark:text-slate-400">
          Built with Next.js, Tailwind CSS, and Framer Motion
        </p>
      </div>
    </footer>
  );
} 
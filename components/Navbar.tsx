"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

// Animation variants
const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Mobile menu animation variants
const mobileMenuVariants = {
  closed: { 
    opacity: 0,
    y: -20,
    pointerEvents: "none" as "none"
  },
  open: { 
    opacity: 1,
    y: 0,
    pointerEvents: "auto" as "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav
      className="sticky top-0 p-6 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 z-50 border-b border-white/20 dark:border-slate-700/20"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-mono relative group">
          <span>MF</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <div className="hidden md:flex gap-8">
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/about-you" className="nav-link">About-You</Link>
          <Link href="/tetris" className="nav-link">Tetris</Link> 
          <Link href="/terminal" className="nav-link">Terminal</Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            className="md:hidden text-current"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <motion.div 
        className="md:hidden absolute top-full left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 border-b border-white/20 dark:border-slate-700/20"
        initial="closed"
        animate={mobileMenuOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
      >
        <div className="flex flex-col space-y-4">
          <Link 
            href="/about" 
            className="text-lg font-medium py-2 px-4 hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/about-you" 
            className="text-lg font-medium py-2 px-4 hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            About-You
          </Link>
          <Link 
            href="/tetris" 
            className="text-lg font-medium py-2 px-4 hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tetris
          </Link>
          <Link 
            href="/terminal" 
            className="text-lg font-medium py-2 px-4 hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Terminal
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
} 
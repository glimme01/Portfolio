"use client";
import { Terminal, Code2, User, GamepadIcon, Github, Linkedin, Mail, Youtube } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeBackground } from "@/components/three-background";
import { Card3D } from "@/components/card-3d";

// Animation variants
const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const titleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const roleVariants = {
  hidden: { x: -60, opacity: 0 },
  visible: (custom: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: custom * 0.2,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  })
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.15 + 0.8,
      ease: "easeOut"
    }
  })
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 overflow-hidden">
      <ThreeBackground />

      {/* Navigation */}
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="mb-16 relative"
        >
          <h1 className="title-text text-6xl md:text-8xl font-bold mb-6 tracking-wider">
            MORITZ FREUND
          </h1>
          <p className="text-xl font-medium max-w-xl">
            Gaming is a passion, but Coding is a lifestyle. Creating digital experiences that stand out.
          </p>
        </motion.div>

        <div className="space-y-8 mb-20">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={roleVariants}
            className="flex items-center gap-6"
          >
            <Code2 size={36} />
            <span className="role-text text-4xl md:text-5xl font-bold">DEVELOPER.</span>
          </motion.div>
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={roleVariants}
            className="flex items-center gap-6"
          >
            <GamepadIcon size={36} />
            <span className="role-text text-4xl md:text-5xl font-bold">GAMER.</span>
          </motion.div>
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={roleVariants}
            className="flex items-center gap-6"
          >
            <User size={36} />
            <span className="role-text text-4xl md:text-5xl font-bold">STUDENT.</span>
          </motion.div>
        </div>

      

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6 font-mono">GET IN TOUCH</h2>
          <p className="max-w-xl mx-auto mb-8">
            Interested in working together? I'm always open to new opportunities and collaborations.
          </p>
          <div className="flex justify-center gap-8">
            <motion.a 
              href="https://github.com/glimme01" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-3 glass rounded-full"
            >
              <Github size={24} />
            </motion.a>
            <motion.a 
              href="https://www.youtube.com/@glimme01" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-3 glass rounded-full"
            >
              <Youtube size={24} />
            </motion.a>
            <motion.a 
              href="mailto:contact.moritzfreund@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-3 glass rounded-full"
            >
              <Mail size={24} />
            </motion.a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
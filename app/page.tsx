"use client";
import { Code2, User, GamepadIcon, Github, Youtube, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ThreeBackground } from "@/components/three-background";
import { Card3D } from "@/components/card-3d";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-12 sm:pb-20 relative z-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="mb-10 sm:mb-16 relative"
        >
          <h1 className="title-text text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 tracking-wider">
            MORITZ FREUND
          </h1>
          <p className="text-lg sm:text-xl font-medium max-w-xl">
            Gaming is a passion, but Coding is a lifestyle. Creating digital experiences that stand out.
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-20">
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={roleVariants}
            className="flex items-center gap-4 sm:gap-6"
          >
            <Code2 size={28} className="sm:w-9 sm:h-9" />
            <span className="role-text text-3xl sm:text-4xl md:text-5xl font-bold">DEVELOPER.</span>
          </motion.div>
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={roleVariants}
            className="flex items-center gap-4 sm:gap-6"
          >
            <GamepadIcon size={28} className="sm:w-9 sm:h-9" />
            <span className="role-text text-3xl sm:text-4xl md:text-5xl font-bold">GAMER.</span>
          </motion.div>
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={roleVariants}
            className="flex items-center gap-4 sm:gap-6"
          >
            <User size={28} className="sm:w-9 sm:h-9" />
            <span className="role-text text-3xl sm:text-4xl md:text-5xl font-bold">STUDENT.</span>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-mono">GET IN TOUCH</h2>
          <p className="max-w-xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            Interested in working together? I'm always open to new opportunities and collaborations.
          </p>
          <div className="flex justify-center gap-6 sm:gap-8">
            <motion.a 
              href="https://github.com/glimme01" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-2 sm:p-3 glass rounded-full"
              aria-label="GitHub Profile"
            >
              <Github size={20} className="sm:w-6 sm:h-6" />
            </motion.a>
            <motion.a 
              href="https://www.youtube.com/@glimme01" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-2 sm:p-3 glass rounded-full"
              aria-label="YouTube Channel"
            >
              <Youtube size={20} className="sm:w-6 sm:h-6" />
            </motion.a>
            <motion.a 
              href="mailto:contact.moritzfreund@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="p-2 sm:p-3 glass rounded-full"
              aria-label="Email Contact"
            >
              <Mail size={20} className="sm:w-6 sm:h-6" />
            </motion.a>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
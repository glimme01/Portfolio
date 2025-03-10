"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GamepadIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeBackground } from "@/components/three-background";
import { Card3D } from "@/components/card-3d";
import { TetrisGame } from "@/components/tetris-game";
import { useInView } from "framer-motion";
import { useRef } from "react"; 
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Tetris() {
  const gameRef = useRef(null);
  const infoRef = useRef(null);
  const gameInView = useInView(gameRef, { once: true, amount: 0.3 });
  const infoInView = useInView(infoRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <ThreeBackground />
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <GamepadIcon size={32} className="text-indigo-500 dark:text-indigo-400" />
            <h1 className="title-text text-5xl md:text-6xl">TETRIS</h1>
          </div>
          
          <p className="text-xl max-w-3xl">
            A classic game reimagined with modern web technologies. Use the arrow keys to move and rotate pieces.
            Try to complete as many lines as possible to increase your score!
          </p>
        </motion.div>

        <motion.div
          ref={gameRef}
          style={{
            opacity: gameInView ? 1 : 0,
            transform: gameInView ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
          }}
          className="mb-16"
        >
          <Card3D className="p-8 rounded-lg">
            <TetrisGame />
          </Card3D>
        </motion.div>

        <motion.div
          ref={infoRef}
          style={{
            opacity: infoInView ? 1 : 0,
            transform: infoInView ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.4s"
          }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">How to Play</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Controls</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">←→</span>
                  <span>Move left/right</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">↓</span>
                  <span>Soft drop</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">↑</span>
                  <span>Rotate piece</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">Space</span>
                  <span>Hard drop</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">P</span>
                  <span>Pause game</span>
                </li>
              </ul>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Scoring</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>1 line:</span>
                  <span className="font-mono">40 × level</span>
                </li>
                <li className="flex justify-between">
                  <span>2 lines:</span>
                  <span className="font-mono">100 × level</span>
                </li>
                <li className="flex justify-between">
                  <span>3 lines:</span>
                  <span className="font-mono">300 × level</span>
                </li>
                <li className="flex justify-between">
                  <span>4 lines:</span>
                  <span className="font-mono">1200 × level</span>
                </li>
                <li className="mt-4 text-sm">
                  Every 10 lines cleared increases your level and game speed!
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
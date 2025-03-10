"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Github, Linkedin, Mail, Bike, BookOpen, Gamepad2, Laptop } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeBackground } from "@/components/three-background";
import { Card3D } from "@/components/card-3d";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 overflow-hidden">
      <ThreeBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-12 sm:pb-20 relative z-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="title-text text-6xl mb-8">ABOUT ME</h1>
          
          <ScrollAnimation delay={0.2}>
            <Card3D>
              <div className="glass p-8 rounded-lg">
                <p className="text-xl leading-relaxed">
                  My focus is on building sleek designs with eye-catching animations. 🚀 Right now, I'm diving into Next.js and TSX, leveling up my skills along the way.
                </p>
                <p className="text-xl mt-4 leading-relaxed">
                  This website is a work in progress—kind of like me. 😅 So, if you spot something funky, just pretend it's a feature, not a bug. 🐛
                </p>
                <p className="text-xl mt-4 font-bold">
                  I'm a 13-year-old developer, gamer, and tech enthusiast with a passion for creating web experiences that stand out! 💻✨
                </p>
              </div>
            </Card3D>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <ScrollAnimation delay={0.3}>
              <Card3D>
                <div className="glass p-8 rounded-lg">
                  <h2 className="text-3xl font-bold mb-6">When I'm not coding...</h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                        <Bike size={32} className="text-indigo-500" />
                      </div>
                      <h3 className="text-xl font-bold">Biking</h3>
                      <p className="mt-2">Exploring trails and city streets</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <path d="M3.9 8.58h16.2M3.9 15.42h16.2M4 12h16"></path>
                          <path d="M15.5 5.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"></path>
                          <path d="M11.5 18.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Ice Skating</h3>
                      <p className="mt-2">Gliding on ice during winter</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                        <BookOpen size={32} className="text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold">Studying</h3>
                      <p className="mt-2">(hopefully) Learning new things</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                        <Gamepad2 size={32} className="text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold">Gaming</h3>
                      <p className="mt-2">Playing and creating games</p>
                    </div>
                  </div>
                </div>
              </Card3D>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.4} direction="left">
              <Card3D>
                <div className="glass p-8 rounded-lg">
                  <h2 className="text-3xl font-bold mb-6">My Tech Journey</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center">
                        <Code2 size={24} className="text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Web Development</h3>
                        <p className="mt-1">
                          Started with HTML & CSS, now exploring React, Next.js, and TypeScript to create interactive web experiences.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-500/20 flex-shrink-0 flex items-center justify-center">
                        <Laptop size={24} className="text-pink-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Current Projects</h3>
                        <p className="mt-1">
                          Building this portfolio site, creating small games, and experimenting with 3D animations using Three.js.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-500/20 flex-shrink-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                          <path d="M12 22v-5"></path>
                          <path d="M9 8V2"></path>
                          <path d="M15 8V2"></path>
                          <path d="M12 8a4 4 0 0 0-4 4v6h8v-6a4 4 0 0 0-4-4Z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Future Goals</h3>
                        <p className="mt-1">
                          Learning more about game development, AI, and creating applications that help other young developers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </ScrollAnimation>
          </div>
          
        
        </motion.div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
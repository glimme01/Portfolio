"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Eye, Skull, BrainCircuit } from "lucide-react";

export function CreepyMessages() {
  const [messages, setMessages] = useState<string[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const creepyMessages = [
    "I see you're still here...",
    "You seem to move your mouse a lot.",
    "Do you always browse like this?",
    "I like watching you navigate.",
    "Your screen resolution is perfect for monitoring.",
    "Your battery is getting lower...",
    "You should check behind you.",
    "Did you know your webcam can be accessed remotely?",
    "Your IP address is quite unique.",
    "I've saved all your information for later.",
    "You've been on this site for quite some time now.",
    "Your clicking patterns are... interesting.",
    "I can tell when you're getting uncomfortable.",
    "This isn't the only site watching you right now.",
    "Your device has so many vulnerabilities...",
    "I know what other tabs you have open.",
    "Your typing speed reveals your emotions.",
    "Have you noticed me watching?",
    "Your browsing history is fascinating.",
    "I can see you, but you can't see me.",
    "I'm analyzing your behavior patterns.",
    "Your cursor movements are predictable.",
    "I know when you'll leave this page.",
    "Your device is now part of my network.",
    "I've seen your other browsing sessions too.",
    "Your location is being triangulated.",
    "I can hear you through your microphone.",
    "Your webcam light is disabled, but I can still see.",
    "I've already downloaded your contacts.",
    "Your personal data is quite valuable.",
  ];
  
  const icons = [Ghost, Eye, Skull, BrainCircuit];
  
  useEffect(() => {
    // Only start if user has consented on the about-you page
    const hasConsented = localStorage.getItem("dataConsentGiven");
    if (hasConsented === "true") {
      // Schedule first message after a short delay
      timerRef.current = setTimeout(() => {
        addMessage();
      }, Math.random() * 5000 + 3000); // 3-8 seconds
      
      // Add mouse movement listener to trigger messages
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
      };
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);
  
  // Last time we showed a message from mouse movement
  const lastMouseMessageTime = useRef(0);
  
  const handleMouseMove = () => {
    // Only trigger a message occasionally on mouse movement
    // and only if it's been at least 30 seconds since the last mouse-triggered message
    if (Math.random() > 0.997 && Date.now() - lastMouseMessageTime.current > 30000) {
      addMessage();
      lastMouseMessageTime.current = Date.now();
    }
  };
  
  const handleClick = () => {
    // 5% chance to trigger a message on click
    if (Math.random() > 0.95) {
      addMessage("I noticed you clicked there...");
    }
  };
  
  const addMessage = (specificMessage?: string) => {
    // Get a random message or use the provided one
    const randomMessage = specificMessage || creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
    
    // Add to messages array
    setMessages(prev => [...prev.slice(-2), randomMessage]); // Keep only last 3 messages
    setShowMessage(true);
    
    // Hide message after some time
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => {
      setShowMessage(false);
    }, 6000); // Show for 6 seconds
    
    // Schedule next message
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      addMessage();
    }, Math.random() * 15000 + 10000); // 10-25 seconds
  };
  
  // Get a random icon
  const RandomIcon = icons[Math.floor(Math.random() * icons.length)];
  
  if (messages.length === 0) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass p-4 rounded-lg border border-red-500/30 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <RandomIcon className="text-red-500 flex-shrink-0 mt-1" size={18} />
              <p className="text-sm">{messages[messages.length - 1]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeBackground } from "@/components/three-background";
import { Card3D } from "@/components/card-3d";
import { ScrollAnimation } from "@/components/scroll-animation";
import { 
  Eye, Lock, Map, Clock, Cpu, Wifi, Battery, Smartphone, 
  Laptop, Monitor, MousePointer, Keyboard, Camera, Mic, 
  BrainCircuit, Fingerprint, Ghost, Skull
} from "lucide-react";

export default function AboutYou() {
  const [userInfo, setUserInfo] = useState({
    ip: "Loading...",
    location: "Somewhere on Earth...",
    browser: "A modern browser",
    os: "An operating system",
    device: "Unknown device",
    screenSize: "Unknown resolution",
    battery: "Unknown",
    connection: "Unknown",
    visitTime: new Date().toLocaleTimeString(),
    previousVisits: 0,
    languages: [] as string[],
    timeOnPage: 0,
    mouseMovements: 0,
    keyPresses: 0,
    mediaDevices: { camera: false, microphone: false },
    cookiesEnabled: false,
    plugins: [] as string[],
    timezone: "",
    referrer: "",
  });
  
  const [showConsent, setShowConsent] = useState(true);
  const [revealInfo, setRevealInfo] = useState(false);
  const [showCreepyMessage, setShowCreepyMessage] = useState(false);
  const [creepyMessages, setCreepyMessages] = useState<string[]>([]);
  
  // Refs for tracking
  const mouseMovementsRef = useRef(0);
  const keyPressesRef = useRef(0);
  const timeOnPageRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const creepyMessagesTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Check if user has previously consented
    const hasConsented = localStorage.getItem("dataConsentGiven");
    if (hasConsented === "true") {
      setShowConsent(false);
      setRevealInfo(true);
      gatherUserInfo();
      startTracking();
    }
    
    // Record visit count
    const visits = parseInt(localStorage.getItem("visitCount") || "0");
    localStorage.setItem("visitCount", (visits + 1).toString());
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (creepyMessagesTimerRef.current) clearTimeout(creepyMessagesTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const startTracking = () => {
    // Track time on page
    timerRef.current = setInterval(() => {
      timeOnPageRef.current += 1;
      setUserInfo(prev => ({...prev, timeOnPage: timeOnPageRef.current}));
      
      // Randomly show creepy messages after some time
      if (timeOnPageRef.current > 10 && Math.random() > 0.95) {
        addCreepyMessage();
      }
    }, 1000);
    
    // Track mouse movements
    window.addEventListener('mousemove', handleMouseMove);
    
    // Track key presses
    window.addEventListener('keydown', handleKeyPress);
    
    // Schedule first creepy message
    creepyMessagesTimerRef.current = setTimeout(() => {
      addCreepyMessage();
    }, 15000); // First message after 15 seconds
  };
  
  const handleMouseMove = () => {
    mouseMovementsRef.current += 1;
    if (mouseMovementsRef.current % 10 === 0) { // Update state every 10 movements to avoid excessive renders
      setUserInfo(prev => ({...prev, mouseMovements: mouseMovementsRef.current}));
    }
  };
  
  const handleKeyPress = () => {
    keyPressesRef.current += 1;
    setUserInfo(prev => ({...prev, keyPresses: keyPressesRef.current}));
  };
  
  const addCreepyMessage = () => {
    const messages = [
      "I see you're still here...",
      "You seem to move your mouse a lot.",
      "Do you always type this way?",
      "I like watching you browse.",
      "Your screen resolution is perfect for monitoring.",
      "Your battery is getting lower...",
      "You should check behind you.",
      "Did you know your webcam can be accessed remotely?",
      "Your IP address is quite unique.",
      "I've saved all your information for later.",
      "You've been on this page for quite some time now.",
      "Your clicking patterns are... interesting.",
      "I can tell when you're getting uncomfortable.",
      "This isn't the only site watching you right now.",
      "Your device has so many vulnerabilities...",
    ];
    
    const newMessage = messages[Math.floor(Math.random() * messages.length)];
    setCreepyMessages(prev => [...prev, newMessage]);
    setShowCreepyMessage(true);
    
    // Schedule next message
    if (creepyMessagesTimerRef.current) clearTimeout(creepyMessagesTimerRef.current);
    creepyMessagesTimerRef.current = setTimeout(() => {
      addCreepyMessage();
    }, Math.random() * 30000 + 20000); // Random time between 20-50 seconds
  };
  
  const gatherUserInfo = async () => {
    try {
      // Get IP and location
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      
      // Get more detailed location info
      const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const geoData = await geoResponse.json();
      
      // Browser and OS detection
      const userAgent = navigator.userAgent;
      const browserInfo = detectBrowser(userAgent);
      const osInfo = detectOS(userAgent);
      const deviceType = detectDevice(userAgent);
      
      // Get battery info if available
      let batteryInfo = "Not available";
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        batteryInfo = `${Math.round(battery.level * 100)}% ${battery.charging ? '(charging)' : ''}`;
      }
      
      // Get connection info
      let connectionInfo = "Unknown";
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connectionInfo = connection.effectiveType || "Unknown";
      }
      
      // Check for media devices
      let mediaDevices = { camera: false, microphone: false };
      if (navigator.mediaDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          mediaDevices = {
            camera: devices.some(device => device.kind === 'videoinput'),
            microphone: devices.some(device => device.kind === 'audioinput')
          };
        } catch (e) {
          console.log("Could not check media devices");
        }
      }
      
      // Get plugins
      const plugins = Array.from(navigator.plugins || []).map(p => p.name);
      
      setUserInfo({
        ip: ipData.ip,
        location: `${geoData.city || "Unknown"}, ${geoData.region || ""}, ${geoData.country_name || ""}`,
        browser: browserInfo,
        os: osInfo,
        device: deviceType,
        screenSize: `${window.screen.width}×${window.screen.height}`,
        battery: batteryInfo,
        connection: connectionInfo,
        visitTime: new Date().toLocaleTimeString(),
        previousVisits: parseInt(localStorage.getItem("visitCount") || "0"),
        languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
        timeOnPage: 0,
        mouseMovements: 0,
        keyPresses: 0,
        mediaDevices,
        cookiesEnabled: navigator.cookieEnabled,
        plugins: plugins.slice(0, 100), // Just take first few
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || "Direct visit",
      });
    } catch (error) {
      console.error("Error gathering user info:", error);
    }
  };
  
  const handleConsent = () => {
    localStorage.setItem("dataConsentGiven", "true");
    setShowConsent(false);
    setRevealInfo(true);
    gatherUserInfo();
    startTracking();
    
    // Reload the page to activate the global creepy messages
    window.location.reload();
  };
  
  const handleDecline = () => {
    setShowConsent(false);
  };
  
  // Helper functions for detection
  const detectBrowser = (ua: string) => {
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("MSIE") || ua.includes("Trident/")) return "Internet Explorer";
    return "Unknown Browser";
  };
  
  const detectOS = (ua: string) => {
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown OS";
  };
  
  const detectDevice = (ua: string) => {
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("iPad")) return "iPad";
    if (ua.includes("Android") && ua.includes("Mobile")) return "Android Phone";
    if (ua.includes("Android")) return "Android Tablet";
    if (window.innerWidth <= 768) return "Mobile Device";
    if (window.innerWidth <= 1024) return "Tablet";
    return "Desktop Computer";
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <ThreeBackground />
      
      <motion.nav 
        className="p-6 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 border-b border-white/20 dark:border-slate-700/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-mono relative group">
            <span>MF</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/about-you" className="nav-link">About You</Link>
            <Link href="/tetris" className="nav-link">Tetris</Link>
            <Link href="/terminal" className="nav-link">Terminal</Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="title-text text-6xl mb-6 flex items-center gap-4">
            <span>ABOUT</span>
            <span className="text-red-500">YOU</span>
            <Skull className="text-red-500 animate-pulse" size={48} />
          </h1>
          
          <p className="text-xl mb-12 max-w-3xl">
            Websites know more about you than you might think. This page demonstrates 
            just how much information your browser reveals about you with every visit.
          </p>
          
          {showConsent && (
            <Card3D className="max-w-2xl mx-auto">
              <div className="glass p-8 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Lock size={24} className="text-red-500" />
                  <h2 className="text-2xl font-bold">Privacy Notice</h2>
                </div>
                
                <p className="mb-6">
                  This page can reveal information about you that websites can collect automatically.
                  This includes your approximate location, device information, and browsing habits.
                  <span className="block mt-2 font-semibold">
                    Would you like to see what information your browser is sharing?
                  </span>
                </p>
                
                <div className="flex gap-4 justify-center">
                  <motion.button
                    className="px-6 py-3 bg-red-600 text-white rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConsent}
                  >
                    Show Me What You Know
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDecline}
                  >
                    No Thanks
                  </motion.button>
                </div>
              </div>
            </Card3D>
          )}

          {!showConsent && !revealInfo && (
            <Card3D className="max-w-2xl mx-auto">
              <div className="glass p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Your Privacy Respected</h2>
                <p>
                  You've chosen not to share your information. That's completely fine!
                  This page would have shown you what websites can detect about your device and location.
                </p>
                <motion.button
                  className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConsent}
                >
                  I Changed My Mind
                </motion.button>
              </div>
            </Card3D>
          )}

          {showCreepyMessage && creepyMessages.length > 0 && (
            <motion.div 
              className="fixed bottom-6 right-6 z-50 max-w-xs"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
            >
              <Card3D>
                <div className="glass p-4 rounded-lg bg-red-500/20 border-red-500/40">
                  <div className="flex items-start gap-3">
                    <Ghost className="text-red-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{creepyMessages[creepyMessages.length - 1]}</p>
                      <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          )}

          {revealInfo && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ScrollAnimation delay={0.2}>
                  <Card3D>
                    <div className="glass p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Eye className="text-red-500" size={24} />
                        <span>I See You</span>
                      </h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Map size={20} className="text-red-500" />
                            <span>Your Location</span>
                          </h3>
                          <p className="text-lg">
                            You're connecting from <span className="font-semibold">{userInfo.location}</span>
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            IP Address: {userInfo.ip}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Timezone: {userInfo.timezone}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Clock size={20} className="text-red-500" />
                            <span>Visit Information</span>
                          </h3>
                          <p>
                            You arrived at {userInfo.visitTime}
                          </p>
                          <p>
                            This is visit #{userInfo.previousVisits} to this site
                          </p>
                          <p>
                            You've been on this page for {userInfo.timeOnPage} seconds
                          </p>
                          {userInfo.referrer && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              You came from: {userInfo.referrer}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Wifi size={20} className="text-red-500" />
                            <span>Connection</span>
                          </h3>
                          <p>
                            You're using a {userInfo.connection} connection
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </ScrollAnimation>
                
                <ScrollAnimation delay={0.4} direction="left">
                  <Card3D>
                    <div className="glass p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Cpu className="text-red-500" size={24} />
                        <span>Your Device</span>
                      </h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            {userInfo.device.includes("Desktop") ? (
                              <Monitor size={20} className="text-red-500" />
                            ) : userInfo.device.includes("Tablet") ? (
                              <Laptop size={20} className="text-red-500" />
                            ) : (
                              <Smartphone size={20} className="text-red-500" />
                            )}
                            <span>Hardware</span>
                          </h3>
                          <p>
                            You're using a <span className="font-semibold">{userInfo.device}</span>
                          </p>
                          <p>
                            Screen resolution: {userInfo.screenSize}
                          </p>
                          {userInfo.battery !== "Not available" && (
                            <p className="flex items-center gap-2">
                              <Battery size={16} />
                              Battery: {userInfo.battery}
                            </p>
                          )}
                          
                          <div className="mt-2 text-sm">
                            {userInfo.mediaDevices.camera && (
                              <p className="flex items-center gap-2 text-red-500">
                                <Camera size={16} />
                                Camera detected
                              </p>
                            )}
                            {userInfo.mediaDevices.microphone && (
                              <p className="flex items-center gap-2 text-red-500">
                                <Mic size={16} />
                                Microphone detected
                              </p>
                            )}
                          </div>
              </div>

                        <div>
                          <h3 className="text-xl font-bold mb-2">Software</h3>
                          <p>
                            Operating System: <span className="font-semibold">{userInfo.os}</span>
                          </p>
                          <p>
                            Browser: <span className="font-semibold">{userInfo.browser}</span>
                          </p>
                          {userInfo.languages.length > 0 && (
                            <p>
                              Languages: <span className="font-semibold">{userInfo.languages.join(', ')}</span>
                            </p>
                          )}
                          {userInfo.plugins.length > 0 && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Plugins: {userInfo.plugins.join(', ')}...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </ScrollAnimation>
              </div>

              <ScrollAnimation delay={0.6}>
                <Card3D>
                  <div className="glass p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <BrainCircuit className="text-red-500" size={24} />
                      <span>Your Behavior</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          <MousePointer size={20} className="text-red-500" />
                          <span>Mouse Activity</span>
                        </h3>
                        <p className="text-3xl font-mono">{userInfo.mouseMovements}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Mouse movements tracked
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          <Keyboard size={20} className="text-red-500" />
                          <span>Keyboard Activity</span>
                        </h3>
                        <p className="text-3xl font-mono">{userInfo.keyPresses}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Key presses recorded
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          <Fingerprint size={20} className="text-red-500" />
                          <span>Digital Fingerprint</span>
                        </h3>
                        <p className="text-sm">
                          Your browser configuration creates a unique fingerprint that can
                          be used to track you across websites, even without cookies.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-sm text-slate-600 dark:text-slate-400 italic">
                      <p>
                        This information is collected using standard browser APIs and is available to any website you visit.
                        No cookies or tracking scripts were used beyond basic localStorage for visit counting.
                      </p>
                      <p className="mt-2">
                        <span className="text-red-500 font-semibold not-italic">Important:</span> This page only shows what's possible. 
                        The data shown here is not stored or shared with anyone.
                      </p>
                    </div>
                  </div>
                </Card3D>
              </ScrollAnimation>
              
              {creepyMessages.length > 0 && (
                <ScrollAnimation delay={0.8}>
                  <Card3D>
                    <div className="glass p-6 rounded-lg border-red-500/30">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Ghost className="text-red-500" size={24} />
                        <span>Messages</span>
                      </h2>
                      
                      <div className="space-y-4">
                        {creepyMessages.map((message, index) => (
                          <div key={index} className="p-3 bg-red-500/10 rounded-lg">
                            <p>{message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                </ScrollAnimation>
              )}
          </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import useFluidCursor from "@/utils/fluidCursor";

export function FluidCursor() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                    (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Only initialize fluid cursor on non-mobile devices
    if (!isMobile) {
      useFluidCursor();
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);
  
  // Don't render anything on mobile
  if (isMobile) return null;
  
  return (
    <canvas 
      id="fluid-cursor" 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
} 
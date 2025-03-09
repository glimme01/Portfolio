"use client";

import { ReactNode, useRef } from "react";
import { useInView } from "framer-motion";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export function ScrollAnimation({
  children,
  delay = 0,
  direction = "up",
  distance = 50,
  threshold = 0.3,
  className = "",
  once = true,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  
  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { y: 0, x: distance },
    right: { y: 0, x: -distance },
  };
  
  const { x, y } = directionMap[direction];
  
  const styles = {
    opacity: isInView ? 1 : 0,
    transform: isInView 
      ? "translate(0, 0)" 
      : `translate(${x}px, ${y}px)`,
    transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
  };
  
  return (
    <div ref={ref} style={styles} className={className}>
      {children}
    </div>
  );
} 
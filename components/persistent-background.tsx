"use client";

import { usePathname } from 'next/navigation';
import { ThreeBackground } from './three-background';
import { useEffect, useState } from 'react';

export function PersistentBackground() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // This ensures the component only renders on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return <ThreeBackground key="persistent-background" />;
} 
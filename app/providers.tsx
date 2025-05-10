"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { LanguageProvider } from "@/contexts/language-context";
import dynamic from 'next/dynamic';

const ErrorBoundary = dynamic(() => import('@/components/error-boundary').then(mod => mod.ErrorBoundary), {
  ssr: false
});

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
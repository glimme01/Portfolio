import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CreepyMessages = dynamic(() => import('@/components/creepy-messages').then(mod => mod.CreepyMessages), {
  ssr: false,
  loading: () => null
});

const CookieBanner = dynamic(() => import('@/components/cookie-banner').then(mod => mod.CookieBanner), {
  ssr: false,
  loading: () => null
});

const PersistentBackground = dynamic(() => import('@/components/persistent-background').then(mod => mod.PersistentBackground), {
  ssr: false,
  loading: () => null
});

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'Moritz Freund - Portfolio',
  description: 'Personal portfolio of Moritz Freund - Developer, Gamer, Student',
  keywords: ['developer', 'portfolio', 'web development', 'gaming', 'student'],
  authors: [{ name: 'Moritz Freund' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://moritzfreund.com',
    title: 'Moritz Freund - Portfolio',
    description: 'Personal portfolio of Moritz Freund - Developer, Gamer, Student',
    siteName: 'Moritz Freund Portfolio'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moritz Freund - Portfolio',
    description: 'Personal portfolio of Moritz Freund - Developer, Gamer, Student',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Providers>
          <Suspense fallback={null}>
            <PersistentBackground />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <CreepyMessages />
          </Suspense>
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
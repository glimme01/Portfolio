import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { CreepyMessages } from '@/components/creepy-messages';
import { CookieBanner } from '@/components/cookie-banner';
import { PersistentBackground } from '@/components/persistent-background';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
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
  }
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
      </head>
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Providers>
          <PersistentBackground />
          {children}
          <CreepyMessages />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
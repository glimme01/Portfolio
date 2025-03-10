import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { CreepyMessages } from '@/components/creepy-messages';
import { CookieBanner } from '@/components/cookie-banner';
import { PersistentBackground } from '@/components/persistent-background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Moritz Freund - Portfolio',
  description: 'Personal portfolio of Moritz Freund - Developer, Gamer, Student',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
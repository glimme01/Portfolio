import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { CreepyMessages } from '@/components/creepy-messages';
import { CookieBanner } from '@/components/cookie-banner';
import { PersistentBackground } from '@/components/persistent-background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Moritz Freund | Developer & Gamer',
  description: 'Personal portfolio showcasing my projects and skills as a developer and gaming enthusiast.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
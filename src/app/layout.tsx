import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Athlete Origins — Daily Sports Guessing Game',
  description:
    'Guess today\'s mystery athlete from progressive clues about their origins, career, and background. A new athlete every day.',
  keywords: ['sports', 'quiz', 'guessing game', 'daily', 'wordle', 'athlete', 'sports trivia'],
  authors: [{ name: 'Athlete Origins' }],
  openGraph: {
    title: 'Athlete Origins',
    description: 'Guess today\'s mystery athlete. A new puzzle every day.',
    url: 'https://athleteoriginsgame.com',
    siteName: 'Athlete Origins',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Athlete Origins',
    description: 'Guess today\'s mystery athlete. A new puzzle every day.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Athlete Origins',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F2F7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

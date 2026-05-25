import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Renaldo Semma D. | Creative Designer & AI Visual Specialist',
  description: 'Personal Portfolio of Renaldo Semma Dasilva — Creative Designer & AI Visual Specialist. Graphic design, video editing, and AI-driven visual exploration.',
  keywords: ['creative designer', 'AI visual', 'graphic designer', 'video editor', 'portfolio', 'Renaldo Semma Dasilva'],
  authors: [{ name: 'Renaldo Semma Dasilva' }],
  openGraph: {
    title: 'Renaldo Semma D. | Creative Designer & AI Visual Specialist',
    description: 'Creative Designer & AI Visual Specialist. Graphic design, video editing, and AI-driven visual exploration.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renaldo Semma D. | Creative Designer & AI Visual Specialist',
    description: 'Creative Designer & AI Visual Specialist. Graphic design, video editing, and AI-driven visual exploration.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body 
        className={`${inter.className} bg-black text-white antialiased`}
        suppressHydrationWarning={true} 
      >
        {children}
      </body>
    </html>
  );
}

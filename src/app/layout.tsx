// Ganti isi layout.tsx default dengan ini

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Renaldo Semma D. | Designer & AI Visual',
  description: 'Personal Portfolio Creative Designer & AI Visual',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Atur background utama menjadi gelap */}
      <body 
        className={`${inter.className} bg-black text-white antialiased`}
        // >>> TAMBAHKAN INI <<<
        suppressHydrationWarning={true} 
      >
        {children}
      </body>
    </html>
  );
}

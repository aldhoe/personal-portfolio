import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { client } from '@/lib/sanity';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    name,
    jobTitle,
    "seo": seo {
      metaTitle,
      metaDescription,
      "ogImage": ogImage.asset->url
    }
  }`);

  const defaultTitle = 'Renaldo Semma D. | Creative Designer & AI Visual Specialist';
  const defaultDesc = 'Personal Portfolio of Renaldo Semma Dasilva — Creative Designer & AI Visual Specialist. Graphic design, video editing, and AI-driven visual exploration.';
  
  const title = settings?.seo?.metaTitle || (settings ? `${settings.name} | ${settings.jobTitle}` : defaultTitle);
  const description = settings?.seo?.metaDescription || defaultDesc;
  const ogImage = settings?.seo?.ogImage || '/images/profile-dark-bg.jpg';

  return {
    metadataBase: new URL('https://renaldosemmadasilva.com'),
    title,
    description,
    keywords: ['creative designer', 'AI visual', 'graphic designer', 'video editor', 'portfolio', 'Renaldo Semma Dasilva'],
    authors: [{ name: settings?.name || 'Renaldo Semma Dasilva' }],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
        <Analytics />
      </body>
    </html>
  );
}

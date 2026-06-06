import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { createClient } from '@sanity/client';

const inter = Inter({ subsets: ['latin'] });

// Separate uncached client for metadata — ensures fresh data from Sanity
const metaClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await metaClient.fetch(
    `*[_type == "siteSettings"][0]{
      name,
      jobTitle,
      "seo": seo {
        metaTitle,
        metaDescription,
        "ogImage": ogImage.asset->url
      }
    }`,
    {},
    { next: { revalidate: 60 } }
  );

  const defaultTitle = 'Renaldo Semma D. | Creative Designer & AI Visual Specialist';
  const defaultDesc = 'Personal Portfolio of Renaldo Semma Dasilva — Creative Designer & AI Visual Specialist. Graphic design, video editing, and AI-driven visual exploration.';
  
  const title = settings?.seo?.metaTitle || (settings ? `${settings.name} | ${settings.jobTitle}` : defaultTitle);
  const description = settings?.seo?.metaDescription || defaultDesc;
  const ogImage = settings?.seo?.ogImage || '/images/profile-dark-bg.jpg';

  return {
    metadataBase: new URL('https://renaldodasilva.com'),
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

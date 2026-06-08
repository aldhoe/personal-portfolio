import React from 'react';
import { client } from '@/lib/sanity';
import ClientPageManager from '@/components/ClientPageManager';
import { DataProvider } from '@/providers/DataProvider';
import { ProjectData } from '@/types/sanity';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  // Await searchParams as required in Next.js 15
  const params = await searchParams;
  const projectSlug = typeof params.project === 'string' ? params.project : null;

  // We set cache tags and revalidate options
  const fetchOptions = { next: { revalidate: 60, tags: ['sanity'] } };

  // Fetch all CMS data server-side
  const [settings, experiences, testimonials, portfolioData] = await Promise.all([
    client.fetch(`*[_type == "siteSettings"][0] {
      name,
      jobTitle,
      isOpenToWork,
      profileImageUrl,
      "cvFileUrl": cvFile.asset->url,
      contactInfo[] {
        type,
        label,
        url
      },
      summaryParagraphs,
      summaryQuote,
      skills,
      tools[] {
        name,
        iconUrl,
        "sanityIcon": icon.asset->url
      },
      languages[] {
        name,
        proficiencyLevel
      },
      education[] {
        institution,
        degree,
        year
      },
      socialLinks[] {
        name,
        iconUrl,
        "sanityIcon": icon.asset->url,
        url,
        bgColor
      },
      ctaTitle,
      ctaDescription
    }`, {}, fetchOptions),

    client.fetch(`*[_type == "experience"] | order(order asc) {
      jobTitle,
      company,
      startYear,
      endYear,
      description,
      responsibilities,
      order
    }`, {}, fetchOptions),

    client.fetch(`*[_type == "testimonial"] | order(order asc) {
      name,
      role,
      content,
      avatarUrl,
      "avatarSanity": avatar.asset->url,
      rating,
      order
    }`, {}, fetchOptions),

    client.fetch(`*[_type == "portfolioCategory"] | order(order asc) {
      category,
      "items": items[]-> {
        title,
        slug,
        description,
        subtitle,
        toolsUsed,
        "imageUrl": imageUrl.asset->url,
        "lqip": imageUrl.asset->metadata.lqip,
        coverCaption,
        videoUrl,
        liveLink,
        type,
        "images": galleryImages[] {
          "imageUrl": imageUrl,
          "sanityImage": image.asset->url,
          "lqip": image.asset->metadata.lqip,
          caption
        }
      }
    }`, {}, fetchOptions)
  ]);

  // Merge avatar sources for testimonials
  const mergedTestimonials = (testimonials || []).map((t: any) => ({
    ...t,
    avatarUrl: t.avatarUrl || t.avatarSanity || undefined,
  }));

  // Find the initial project if deep linked via URL
  let initialProject: ProjectData | null = null;
  if (projectSlug && portfolioData) {
    for (const cat of portfolioData) {
      const match = cat.items?.find((p: ProjectData) => p.slug?.current === projectSlug);
      if (match) {
        initialProject = match;
        break;
      }
    }
  }

  // Compile data for context
  const initialData = {
    siteSettings: settings || null,
    experiences: experiences || [],
    testimonials: mergedTestimonials,
    portfolioData: portfolioData || []
  };

  return (
    <DataProvider initialData={initialData}>
      <ClientPageManager initialProject={initialProject} />
    </DataProvider>
  );
}
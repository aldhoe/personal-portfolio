import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: 'gqh8oeu3', // Ganti ini (ambil dari studio/sanity.config.ts)
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skBZOob4NhhGGGNYJjN6MJgQlsaEdkyAE1a853CgZRsF5jNpbIzGHpBOTSIwaRpQsWJl5whFKlWyLUrdFeyCb3AQrO2Y6PK0W5GH0K8afbn7I7FGGJMSdnBJ6y2TRefjr6mlYoM84qk4ezjE7tdSzDj0aXORaSlj0hjOXM3poDjQ3yJr49C3',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/quote/', '/admin/'],
      },
    ],
    sitemap: 'https://leaseflex.io/sitemap.xml',
  };
}

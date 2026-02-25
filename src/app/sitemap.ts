import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://leaseflex.io';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/offer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/landlords`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Blog & SEO content
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/break-lease`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/break-lease/cost-to-break-a-lease`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/break-lease/what-happens-if-you-break-a-lease`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/break-lease/moving-for-job-lease-not-over`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/break-lease/roommate-moved-out`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/break-lease/breakup-lease`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/break-lease/how-to-get-out-of-a-lease-legally`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/break-lease/lease-takeover`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/cost-to-move-apartments`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/can-landlord-raise-rent-mid-lease`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/what-happens-if-you-cant-afford-rent`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Legal
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}

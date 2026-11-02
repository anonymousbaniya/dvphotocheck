import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dvphotocheck.tech';
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = [
    '',
    '/crop',
    '/checker',
    '/eligibility',
    '/checklist',
    '/vault',
    '/guides',
    '/guides/photo-requirements',
    '/guides/how-to-apply',
    '/guides/check-results',
    '/guides/ds-260',
    '/guides/documents',
    '/guides/interview',
    '/guides/visa-bulletin',
    '/guides/scam-warning',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route.startsWith('/guides') ? 'monthly' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/guides') ? 0.8 : 0.9,
  }));
}


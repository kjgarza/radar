import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { RadarService } from '@/core/services/radar.service';

// Required for static export
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const radarService = RadarService.getInstance();
  const editions = radarService.getAllEditions();

  // Static routes
  const routes = ['', '/about', '/editions'].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic edition routes
  const editionRoutes = editions.map((edition) => ({
    url: `${siteConfig.url}/edition/${edition.id}`,
    lastModified: new Date(edition.releaseDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...editionRoutes];
}

import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://veilstudio.io/sitemap.xml',
      'https://veilstudio.io/veilpix/sitemap.xml',
    ],
  }
}

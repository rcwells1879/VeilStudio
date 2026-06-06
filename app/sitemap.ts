import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const lastModified = new Date('2026-06-06')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://veilstudio.io/',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://veilstudio.io/security/',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://veilstudio.io/veilpix/',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://veilstudio.io/veilpix/blog/',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://veilstudio.io/veilpix/privacy/',
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: 'https://veilstudio.io/veilpix/terms/',
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: 'https://veilstudio.io/veilchat/',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}

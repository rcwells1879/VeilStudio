import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const siteLastModified = new Date('2026-07-20')
const veilPixLastModified = new Date('2026-07-24')
const veilPixContentLastModified = new Date('2026-07-14')
const veilPixTermsLastModified = new Date('2026-07-13')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://veilstudio.io/',
      lastModified: siteLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://veilstudio.io/security/',
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://veilstudio.io/veilpix/',
      lastModified: veilPixLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://veilstudio.io/veilpix/blog/',
      lastModified: veilPixContentLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://veilstudio.io/veilpix/privacy/',
      lastModified: veilPixContentLastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: 'https://veilstudio.io/veilpix/terms/',
      lastModified: veilPixTermsLastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: 'https://veilstudio.io/veilchat/',
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}

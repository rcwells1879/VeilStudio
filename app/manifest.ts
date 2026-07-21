import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VeilStudio',
    short_name: 'VeilStudio',
    description: 'Privacy-focused AI image, video, chat, and workflow tools.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030a19',
    theme_color: '#030a19',
    icons: [
      {
        src: '/brand/veil-v-mark-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/brand/veil-v-mark-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

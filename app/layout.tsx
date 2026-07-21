import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://veilstudio.io'),
  applicationName: 'VeilStudio',
  title: 'VeilStudio - Private AI Image, Video, and Chat Tools',
  description: 'VeilStudio builds privacy-focused AI tools for image editing, video generation, intelligent chat, and custom workflows.',
  keywords: [
    'AI image editor',
    'AI video generator',
    'text-to-image',
    'text-to-video',
    'image-to-video',
    'reference-to-video',
    'AI creative tools',
    'custom AI workflows',
    'AI photo editing',
    'private AI tools',
    'VeilPix',
    'VeilChat'
  ],
  authors: [{ name: 'VeilStudio' }],
  creator: 'VeilStudio',
  publisher: 'VeilStudio',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/brand/veil-v-mark-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/brand/veil-v-mark-192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/brand/veil-v-apple-touch.png', type: 'image/png', sizes: '180x180' }],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://veilstudio.io/',
    title: 'VeilStudio - Private AI Image, Video, and Chat Tools',
    description: 'Create and edit AI images, generate video, use private AI chat, and build custom AI workflows with VeilStudio.',
    siteName: 'VeilStudio',
    images: [
      {
        url: '/brand/veil-studio-social-card.jpg',
        width: 1200,
        height: 630,
        alt: 'VeilStudio written in warm script within a hand-painted cosmic frame',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeilStudio - Private AI Image, Video, and Chat Tools',
    description: 'Privacy-focused AI image editing, video generation, intelligent chat, and custom workflows.',
    images: ['/brand/veil-studio-social-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-dark-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://veilstudio.io'),
  title: 'VeilStudio - Private AI Image, Video, and Chat Tools',
  description: 'VeilStudio builds privacy-focused AI apps including VeilPix for AI image editing, text-to-image generation, Wan 2.7 text-to-video, image-to-video, reference-to-video, and planned Seedance 2.0 support.',
  keywords: [
    'AI image editor',
    'AI video generator',
    'text-to-image',
    'text-to-video',
    'image-to-video',
    'reference-to-video',
    'Wan 2.7',
    'Seedance 2.0',
    'AI photo editing',
    'private AI tools',
    'VeilPix',
    'VeilChat'
  ],
  authors: [{ name: 'VeilStudio' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://veilstudio.io/',
    title: 'VeilStudio - Private AI Image, Video, and Chat Tools',
    description: 'Create and edit AI images, generate Wan 2.7 video from text or reference media, and use privacy-focused AI chat tools from VeilStudio. Seedance 2.0 support is planned soon.',
    siteName: 'VeilStudio',
    images: [
      {
        url: '/images/morphic/hero-aether.png',
        width: 1672,
        height: 941,
        alt: 'VeilStudio private AI creative tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeilStudio - Private AI Image, Video, and Chat Tools',
    description: 'AI image editing, text-to-image, Wan 2.7 text-to-video, image-to-video, reference-to-video, and private AI chat tools.',
    images: ['/images/morphic/hero-aether.png'],
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

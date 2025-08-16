import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VeilStudio - Your AI, Your Keys, Your Control',
  description: 'VeilStudio develops powerful, beautiful AI-integrated applications with privacy and security as core principles.',
  keywords: ['AI', 'Privacy', 'Security', 'Local Models', 'API Keys', 'Machine Learning'],
  authors: [{ name: 'VeilStudio' }],
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
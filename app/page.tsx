import Navigation from '@/components/Navigation'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <ContactSection />
      <Footer />
    </main>
  )
}
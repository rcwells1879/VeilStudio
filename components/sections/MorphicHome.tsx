'use client'

/* eslint-disable @next/next/no-img-element */

import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  ImagePlus,
  KeyRound,
  Menu,
  Send,
  Shield,
  Sparkles,
  Waves,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'

type NavigationItem = {
  name: string
  href: string
  isDropdown?: boolean
}

type Feature = {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  href?: string
  cta?: string
}

type FormStatus = {
  type: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

type FormData = {
  fullName: string
  email: string
  phone: string
  message: string
}

const contactEndpoint = 'https://formspree.io/f/xdkdvdol'
const heroAether = '/images/morphic/hero-aether.png'
const creationTide = '/images/morphic/creation-tide.png'
const workflowEstuary = '/images/morphic/workflow-estuary.png'
const fireflyPulse = '/images/morphic/firefly-pulse.gif'
const fireflyPoster = '/images/morphic/firefly-pulse-poster.png'

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Apps', href: '#', isDropdown: true },
  { name: 'Security', href: 'https://veilstudio.io/security/' },
  { name: 'Contact', href: '/#contact' },
]

const appsDropdownItems = [
  {
    name: 'VeilChat',
    href: 'https://veilstudio.io/veilchat/',
    description: 'AI-powered chat application',
  },
  {
    name: 'VeilPix',
    href: 'https://veilstudio.io/veilpix/',
    description: 'AI image and video generation',
  },
]

const featureRows: Feature[] = [
  {
    icon: Shield,
    eyebrow: 'Private by design',
    title: 'Total Privacy',
    description:
      'Run workflows with local models like Ollama and LM Studio so creative data stays on your machine.',
    href: '/security',
    cta: 'Security architecture',
  },
  {
    icon: ImagePlus,
    eyebrow: 'Visual creation',
    title: 'Image and Video Creation',
    description:
      'Use VeilPix for AI photo editing, text-to-image creation, reference-driven video, and image-to-video workflows.',
    href: 'https://veilstudio.io/veilpix/',
    cta: 'Open VeilPix',
  },
  {
    icon: Workflow,
    eyebrow: 'Flexible workflows',
    title: 'Flexible AI Workflows',
    description:
      'Move from creative generation to AI chat, research, and task execution while keeping control of models, keys, and data.',
    href: 'https://veilstudio.io/veilchat/',
    cta: 'Open VeilChat',
  },
]

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Apps', href: 'https://veilstudio.io/veilchat/index.html' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Documentation', href: '#docs' },
  ],
  company: [
    { name: 'About', href: 'https://veilstudio.io/security/' },
    { name: 'Blog', href: 'https://veilstudio.io/veilpix/blog/' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact', href: '#contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Security', href: '/security' },
  ],
}

const socialLinks = [
  { name: 'GitHub', icon: GithubMark, href: 'https://github.com/rcwells1879/' },
  { name: 'Facebook', icon: FacebookMark, href: 'https://www.facebook.com/profile.php?id=61580840610800' },
  { name: 'LinkedIn', icon: LinkedInMark, href: 'https://www.linkedin.com/company/veilstudio1/' },
  { name: 'Google', icon: GoogleMark, href: 'https://share.google/hOcx0JGyOS8D4FTqR' },
]

const easing = [0.22, 1, 0.36, 1] as const

const MorphicImage = dynamic(() => import('@/components/morphic/MorphicImage'), {
  ssr: false,
  loading: () => null,
})

function GithubMark({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.2c-5.5 0-9.9 4.4-9.9 9.9 0 4.4 2.9 8.1 6.8 9.4.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8V21c0 .3.2.6.7.5 4-1.3 6.8-5 6.8-9.4.1-5.5-4.4-9.9-9.8-9.9Z"
      />
    </svg>
  )
}

function FacebookMark({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.6 21.7v-8.3h2.8l.4-3.2h-3.2V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.6c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.2H7.1v3.2H10v8.3h3.6Z"
      />
    </svg>
  )
}

function LinkedInMark({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.3 8.7H3.1v10.5h3.2V8.7ZM4.7 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Zm15.9 9.7c0-2.8-1.5-4.8-4.1-4.8-1.9 0-2.8 1-3.2 1.7h-.1V8.7h-3.1v10.5h3.2V14c0-1.4.3-2.8 2-2.8s1.8 1.6 1.8 2.9v5.1h3.2v-6Z"
      />
    </svg>
  )
}

function GoogleMark({ size = 22 }: { size?: number }) {
  return (
    <span className="google-mark" aria-hidden="true" style={{ width: size, height: size }}>
      G
    </span>
  )
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.75, ease: easing, delay }}
    >
      {children}
    </motion.div>
  )
}

function animatedY(prefersReducedMotion: boolean | null, value: MotionValue<string>) {
  return prefersReducedMotion ? '0px' : value
}

function FireflyLoop() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="firefly-loop">
      <img
        src={prefersReducedMotion ? fireflyPoster : fireflyPulse}
        alt="A close firefly glowing in a dark coastal forest"
      />
    </div>
  )
}

function MorphicScene({
  src,
  alt,
  imageAspect,
  intensity,
}: {
  src: string
  alt: string
  imageAspect: number
  intensity?: number
}) {
  return (
    <div className="morphic-scene">
      <img className="morphic-static-source" src={src} alt={alt} />
      <MorphicImage src={src} alt="" imageAspect={imageAspect} intensity={intensity} />
    </div>
  )
}

function SiteHeader() {
  const [appsOpen, setAppsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false)

  return (
    <header className="site-header">
      <Link className="brand-link" href="/" aria-label="VeilStudio home">
        <span>Veil</span>Studio
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) =>
          item.isDropdown ? (
            <div className="nav-dropdown" key={item.name}>
              <button
                className="nav-button"
                type="button"
                aria-expanded={appsOpen}
                onClick={() => setAppsOpen((open) => !open)}
              >
                {item.name}
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              {appsOpen && (
                <div className="dropdown-menu">
                  {appsDropdownItems.map((app) => (
                    <a key={app.name} href={app.href} onClick={() => setAppsOpen(false)}>
                      <strong>{app.name}</strong>
                      <span>{app.description}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a key={item.name} href={item.href}>
              {item.name}
            </a>
          ),
        )}
      </nav>

      <button
        className="mobile-toggle"
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item) =>
            item.isDropdown ? (
              <div key={item.name}>
                <button
                  type="button"
                  className="mobile-apps-toggle"
                  aria-expanded={mobileAppsOpen}
                  onClick={() => setMobileAppsOpen((open) => !open)}
                >
                  {item.name}
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                {mobileAppsOpen && (
                  <div className="mobile-app-links">
                    {appsDropdownItems.map((app) => (
                      <a
                        key={app.name}
                        href={app.href}
                        onClick={() => {
                          setMobileOpen(false)
                          setMobileAppsOpen(false)
                        }}
                      >
                        {app.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
                {item.name}
              </a>
            ),
          )}
        </nav>
      )}
    </header>
  )
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const artY = useTransform(scrollYProgress, [0, 1], ['0px', '88px'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0px', '-32px'])

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      <motion.div className="hero-art" style={{ y: animatedY(prefersReducedMotion, artY) }}>
        <MorphicScene
          src={heroAether}
          alt="A coastal forest scene where a figure releases luminous creative energy into the sky"
          imageAspect={1672 / 941}
          intensity={1.15}
        />
      </motion.div>
      <div className="hero-scrim" />

      <motion.div className="hero-copy" style={{ y: animatedY(prefersReducedMotion, copyY) }}>
        <p className="eyebrow">Your AI, Your Keys, Your Control</p>
        <h1>VeilStudio</h1>
        <p className="hero-lede">
          Private creative AI for image editing, video generation, and intelligent chat workflows.
          Build with the models and keys you choose.
        </p>
        <div className="hero-actions" aria-label="VeilStudio applications">
          <a className="action action-primary" href="https://veilstudio.io/veilpix/">
            VeilPix Image & Video
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a className="action action-secondary" href="https://veilstudio.io/veilchat/">
            VeilChat beta
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </motion.div>

      <div className="hero-current">
        <span>Image</span>
        <span>Video</span>
        <span>Chat</span>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="section section-about" id="about">
      <div className="section-grid">
        <Reveal className="section-copy">
          <p className="eyebrow">Private Creative AI</p>
          <h2>Creative tools that feel expansive without giving up control.</h2>
          <p>
            VeilStudio builds privacy-focused AI applications for image editing, text-to-image
            creation, video generation, and intelligent chat. The interface feels like a living
            studio: local, tactile, and open to experimentation.
          </p>
          <div className="signal-row">
            <span>
              <KeyRound size={18} aria-hidden="true" />
              Local keys
            </span>
            <span>
              <Waves size={18} aria-hidden="true" />
              Flowing media
            </span>
            <span>
              <Sparkles size={18} aria-hidden="true" />
              Creative control
            </span>
          </div>
        </Reveal>

        <Reveal className="image-field" delay={0.12}>
          <FireflyLoop />
        </Reveal>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="section section-features" id="features">
      <Reveal className="section-heading">
        <p className="eyebrow">Why Choose VeilStudio</p>
        <h2>Privacy, creation, and flexible workflows in one quiet system.</h2>
      </Reveal>

      <div className="feature-composition">
        <Reveal className="feature-image">
          <MorphicScene
            src={creationTide}
            alt="Waterlike frames of image and video forming in a tidal cave"
            imageAspect={1448 / 1086}
            intensity={1}
          />
        </Reveal>

        <div className="feature-list">
          {featureRows.map((feature, index) => (
            <Reveal className="feature-row" key={feature.title} delay={index * 0.08}>
              <feature.icon size={24} aria-hidden="true" />
              <div>
                <p className="feature-eyebrow">{feature.eyebrow}</p>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.href && (
                  <a href={feature.href}>
                    {feature.cta}
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const artY = useTransform(scrollYProgress, [0, 1], ['-36px', '36px'])

  return (
    <section className="workflow-band" ref={sectionRef}>
      <motion.div className="workflow-art" style={{ y: animatedY(prefersReducedMotion, artY) }}>
        <MorphicScene
          src={workflowEstuary}
          alt="Branching luminous paths moving across a forest estuary toward ocean mist"
          imageAspect={1672 / 941}
          intensity={0.85}
        />
      </motion.div>
      <div className="workflow-overlay" />
      <Reveal className="workflow-copy">
        <p className="eyebrow">From first spark to finished workflow</p>
        <h2>Move through visual generation, conversation, and execution without leaving the studio.</h2>
        <p>
          VeilPix and VeilChat are connected surfaces, not isolated destinations. The product links
          stay familiar while the page moves with a calmer, more dimensional rhythm.
        </p>
      </Reveal>
    </section>
  )
}

function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>({
    type: 'idle',
    message: '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus({ type: 'loading', message: 'Sending message...' })

    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setStatus({
          type: 'success',
          message: "Message sent successfully. We'll get back to you soon.",
        })
        setFormData({ fullName: '', email: '', phone: '', message: '' })
        return
      }

      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' })
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      })
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <Reveal className="contact-heading">
        <p className="eyebrow">Ask Us Anything</p>
        <h2>Tell us what you want to build.</h2>
        <p>We offer custom chatbot solutions for startups, apps, and privacy-focused teams.</p>
      </Reveal>

      <Reveal className="contact-shell" delay={0.1}>
        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </label>
          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </label>
          <label className="span-two">
            Phone Number
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number (optional)"
            />
          </label>
          <label className="span-two">
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your project or ask us anything..."
              rows={6}
              required
            />
          </label>

          {status.type !== 'idle' && (
            <div className={`form-status form-status-${status.type}`} aria-live="polite">
              {status.type === 'success' && <CheckCircle size={18} aria-hidden="true" />}
              {status.message}
            </div>
          )}

          <button className="submit-button" type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Sending...' : 'Send Message'}
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </Reveal>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="brand-link" href="/">
          <span>Veil</span>Studio
        </Link>
        <p>
          Developing privacy-focused AI applications for image editing, video generation, chat, and
          creative workflows.
        </p>
        <div className="social-links">
          {socialLinks.map((item) => (
            <a key={item.name} href={item.href} aria-label={item.name}>
              <item.icon size={22} />
            </a>
          ))}
        </div>
      </div>

      {Object.entries(footerLinks).map(([group, links]) => (
        <div className="footer-column" key={group}>
          <h2>{group}</h2>
          {links.map((link) => (
            <a key={link.name} href={link.href}>
              {link.name}
            </a>
          ))}
        </div>
      ))}

      <p className="copyright">© {new Date().getFullYear()} VeilStudio. All rights reserved.</p>
    </footer>
  )
}

export default function MorphicHome() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <WorkflowSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import type { CSSProperties } from 'react'

type SiteLink = {
  name: string
  href: string
  finale?: boolean
}

const menuLinks: SiteLink[] = [
  { name: 'VeilPix', href: 'https://veilstudio.io/veilpix/' },
  { name: 'VeilChat', href: 'https://veilstudio.io/veilchat/' },
  { name: 'About us', href: '#about', finale: true },
  { name: 'Blog', href: 'https://veilstudio.io/veilpix/blog/' },
  { name: 'Security', href: '/security/' },
  { name: 'Privacy', href: 'https://veilstudio.io/veilpix/privacy/' },
  { name: 'Terms', href: 'https://veilstudio.io/veilpix/terms/' },
  { name: 'Contact', href: '#contact', finale: true },
]

const footerGroups: Array<{ name: string; links: SiteLink[] }> = [
  {
    name: 'Products',
    links: [
      { name: 'VeilPix', href: 'https://veilstudio.io/veilpix/' },
      { name: 'VeilChat', href: 'https://veilstudio.io/veilchat/' },
    ],
  },
  {
    name: 'Company',
    links: [
      { name: 'About us', href: '#about', finale: true },
      { name: 'Blog', href: 'https://veilstudio.io/veilpix/blog/' },
      { name: 'Security', href: '/security/' },
      { name: 'Contact', href: '#contact', finale: true },
    ],
  },
  {
    name: 'Legal',
    links: [
      { name: 'Privacy policy', href: 'https://veilstudio.io/veilpix/privacy/' },
      { name: 'Terms of service', href: 'https://veilstudio.io/veilpix/terms/' },
    ],
  },
  {
    name: 'Connect',
    links: [
      { name: 'GitHub', href: 'https://github.com/rcwells1879/' },
      { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61580840610800' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/company/veilstudio1/' },
      { name: 'Google', href: 'https://share.google/hOcx0JGyOS8D4FTqR' },
    ],
  },
]

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VeilStudio',
  url: 'https://veilstudio.io/',
  logo: 'https://veilstudio.io/brand/veil-v-mark-512.png',
  description:
    'VeilStudio develops privacy-focused AI applications for image editing, video generation, chat, and custom workflows.',
  sameAs: [
    'https://github.com/rcwells1879/',
    'https://www.facebook.com/profile.php?id=61580840610800',
    'https://www.linkedin.com/company/veilstudio1/',
  ],
}

function LinkList({ links }: { links: SiteLink[] }) {
  return links.map((link) => (
    <a key={link.name} href={link.href} data-scroll-finale={link.finale ? '' : undefined}>
      {link.name}
    </a>
  ))
}

export default function ScrollWorldHome() {
  return (
    <div className="scroll-world-home">
      <header className="preview-header" data-site-header>
        <Link className="preview-brand brand-mark-link" href="/" aria-label="VeilStudio home">
          <Image src="/brand/veil-v-mark-192.png" alt="" width={48} height={48} priority />
          <span className="sr-only">VeilStudio</span>
        </Link>

        <div className="site-links-control">
          <button
            className="site-links-toggle"
            type="button"
            aria-label="Open VeilStudio links"
            aria-expanded="false"
            aria-controls="site-links-panel"
            data-links-toggle
          >
            <span aria-hidden="true">•••</span>
          </button>
          <nav
            className="site-links-panel"
            id="site-links-panel"
            aria-label="VeilStudio links"
            data-links-panel
            hidden
          >
            <LinkList links={menuLinks} />
          </nav>
        </div>
      </header>

      <main id="scroll-world" className="scroll-world" aria-label="VeilStudio animated story">
        <div className="world-progress" aria-hidden="true"><span /></div>
        <div className="world-stage" aria-hidden="true">
          <div
            className="world-segment world-segment--scene world-segment--initial"
            data-id="02-observatory-study"
            style={{ '--object-position': '32% 48%' } as CSSProperties}
          >
            <picture>
              <source
                media="(max-width: 600px)"
                srcSet="/media/scroll-world/posters/02-observatory-study-m.webp"
              />
              <img
                src="/media/scroll-world/posters/02-observatory-study.webp"
                alt=""
                width="1280"
                height="720"
                decoding="async"
                fetchPriority="high"
                draggable="false"
              />
            </picture>
          </div>
        </div>
        <div className="world-copy" aria-live="polite">
          <article
            className="scene-copy scene-copy--right scene-copy--initial is-interactive"
            data-scene-copy="0"
            style={{ '--scene-accent': '#9fd5c2' } as CSSProperties}
            aria-hidden="false"
          >
            <h1>VeilStudio</h1>
            <p className="scene-copy__tagline">Imagine. Build. Transform.</p>
            <p className="scene-copy__body">
              Private creative AI for image editing, video generation, and intelligent chat
              workflows. Build with the models and keys you choose.
            </p>
            <div className="scene-copy__actions">
              <a href="https://veilstudio.io/veilpix/">VeilPix Image &amp; Video</a>
              <a href="https://veilstudio.io/veilchat/">VeilChat beta</a>
            </div>
          </article>
        </div>
        <nav className="world-route" aria-label="Jump to a scene" />
        <div className="world-hint" aria-hidden="true">
          <span>Scroll to wander</span>
          <i />
        </div>

        <div className="world-finale" aria-hidden="true" inert>
          <div className="world-finale__inner">
            <section className="finale-contact" id="contact" aria-labelledby="finale-contact-title">
              <div className="finale-contact__heading">
                <p>Start a conversation</p>
                <h2 id="finale-contact-title">Tell us what you want to build.</h2>
              </div>

              <form className="contact-form" data-contact-form>
                <label>
                  Full name
                  <input type="text" name="name" autoComplete="name" placeholder="Enter your full name" required />
                </label>
                <label>
                  Email address
                  <input type="email" name="email" autoComplete="email" placeholder="Enter your email address" required />
                </label>
                <label className="contact-form__wide">
                  Phone number
                  <input type="tel" name="phone" autoComplete="tel" placeholder="Enter your phone number (optional)" />
                </label>
                <label className="contact-form__wide">
                  Message
                  <textarea name="message" rows={4} placeholder="Tell us about your project or ask us anything..." required />
                </label>
                <input className="contact-form__trap" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <p className="contact-form__status" data-contact-status role="status" aria-live="polite" />
                <button type="submit">
                  <span>Send message</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </form>
            </section>

            <footer className="finale-footer" id="about" data-finale-footer>
              <div className="finale-footer__brand">
                <Image src="/brand/veil-v-mark-192.png" alt="" width={34} height={34} />
                <p>Privacy-focused AI tools for creating, communicating, and building with control.</p>
              </div>
              <nav className="finale-footer__links" aria-label="Footer navigation">
                {footerGroups.map((group) => (
                  <div key={group.name}>
                    <h2>{group.name}</h2>
                    <LinkList links={group.links} />
                  </div>
                ))}
              </nav>
              <p className="finale-footer__copyright">© {new Date().getFullYear()} VeilStudio</p>
            </footer>
          </div>
        </div>

        <div className="world-track" aria-hidden="true" />

        <section className="seo-copy" data-scroll-world-seo>
          <h2>VeilStudio private AI image, video, and chat tools</h2>
          <p>Imagine. Build. Transform.</p>
          <p>
            VeilStudio develops privacy-focused creative AI for image editing, video generation,
            intelligent chat, and custom workflows.
          </p>
          <p>
            <a href="https://veilstudio.io/veilpix/">VeilPix image and video creation</a>
            <a href="https://veilstudio.io/veilchat/">VeilChat private AI chat</a>
          </p>

          <article>
            <h2>Image and video creation</h2>
            <p>
              Use VeilPix for AI photo editing, text-to-image creation, reference-driven video,
              and image-to-video workflows.
            </p>
            <a href="https://veilstudio.io/veilpix/">Open VeilPix</a>
          </article>

          <article>
            <h2>Flexible AI workflows</h2>
            <p>
              Move from creative generation to AI chat, research, and task execution while keeping
              control of models, keys, and data.
            </p>
            <a href="https://veilstudio.io/veilchat/">Open VeilChat</a>
          </article>

          <article>
            <h2>About VeilStudio</h2>
            <p>
              VeilStudio builds privacy-focused AI applications for creators, startups, apps, and
              teams that want capable tools without giving up control.
            </p>
            <LinkList links={menuLinks} />
          </article>
        </section>
      </main>

      <Script src="/scroll-world/scroll-world.js?v=20260721-1" strategy="afterInteractive" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </div>
  )
}

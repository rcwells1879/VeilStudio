# GEMINI.md

Agent guidance for the VeilStudio website repo. Same scope and conventions as `CLAUDE.md`.

## Project

Marketing / landing site for VeilStudio at [veilstudio.io](https://veilstudio.io). Statically exported Next.js site published to Cloudflare Pages through GitHub Actions.

**Tagline**: "Your AI, Your Keys, Your Control"
**Pillars**: Total Privacy (local models — Ollama, LM Studio), Limitless Flexibility (BYOK), Agentic Power.
**Apps in nav/footer**: VeilChat, VeilPix — hosted at `veilstudio.io/veilchat/` and `veilstudio.io/veilpix/`.

## Stack

- **Next.js** `^15.4.1` (App Router, `output: 'export'`) — `next.config.js`
- **React** `^18.3.1`
- **TypeScript** `^5.8.3` (strict, `@/*` path alias to repo root) — `tsconfig.json`
- **Tailwind CSS** `^3.4.16` — `tailwind.config.js`
- **ESLint** `^9.20.0` (flat config, `next/core-web-vitals`) — `eslint.config.js`
- **Icons**: `lucide-react` + local `components/ui/GoogleIcon.tsx`
- **Font**: Inter (Tailwind default sans)
- **Contact form**: Formspree (`https://formspree.io/f/xdkdvdol`, POSTed directly from the client)
- **Node**: `22.23.4`, matching `.nvmrc`, package engines and the Pages application build.

## Directory Layout

```
app/
  api/contact/route.ts   # Resend-based handler (unused in prod — see note)
  security/page.tsx      # /security page
  globals.css
  layout.tsx
  page.tsx               # Home: Navigation + Hero + Features + ContactSection + Footer
components/
  Navigation.tsx         # Sticky nav with Apps dropdown (VeilChat, VeilPix)
  sections/
    Hero.tsx
    Features.tsx
    ContactSection.tsx   # Formspree submission
    Footer.tsx
  ui/
    Button.tsx
    Card.tsx
    Container.tsx
    GoogleIcon.tsx
public/images/           # Hero1.png, Hero2.png, Hero3.png
.github/workflows/deploy.yml
docs/legacy/cpanel.yml.example  # Archived, never execute or restore as active configuration
next.config.js
tailwind.config.js
tsconfig.json
eslint.config.js
```

There is **no** `/lib` or `/styles` directory — global CSS lives in `app/globals.css`.

## Design System

- **Background**: `#121212` (`dark-950` in Tailwind)
- **Primary gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` → `bg-gradient-primary`
- **Orange gradient** (secondary CTAs): `linear-gradient(135deg, #ff8a80 0%, #ff5722 100%)` → `bg-gradient-orange`
- **Custom utilities**: `gradient-text`, `section-padding`, `btn-primary`, `btn-secondary` (Tailwind + `app/globals.css`)
- **Animations**: `fade-in`, `slide-up`, `glow` (defined in `tailwind.config.js`)
- Mobile-first, high-contrast, accessible semantic HTML.

## Commands

Run from the repo root:

- `npm install` / `npm ci`
- `npm run dev` — starts Next dev on an auto-assigned port (`--port 0`)
- `npm run build` — produces static export in `out/`
- `npm run start` — serves the production build
- `npm run lint` — ESLint
- `npm run type-check` — `tsc --noEmit`
- `npm run kill-ports` / `npm run clean-dev` — free ports 3000–3003 and 55000–56000, then run dev

## Deployment / CI-CD

- Active workflow: `.github/workflows/deploy.yml`, job `deploy`.
- Triggers: pushes to `main`, manual dispatch and existing app repository dispatches.
- `actions/checkout@v4` checks out the three app sources; dispatched app commits remain pinned by the existing payload.
- `actions/setup-node@v4` installs application build Node **22.23.4**. This is separate from the action's internal JavaScript runtime.
- Locked installs and static builds feed `scripts/assemble-cloudflare-pages.mjs`; `cloudflare/wrangler-action@v3` publishes the combined Pages artifact.
- Keep the existing credentials, action versions and permissions. Never print secrets or substitute the retired FTP workflow.
- Run `npm run type-check`, `npm run test:scroll-world` and `npm run build` before publishing. Verify the terminal Pages result and public assets.
- cPanel is no longer used. Its config and editor guide are archived in `docs/legacy/` and must not be executed or reactivated.

## Important Behaviors / Gotchas

- `next.config.js` sets `output: 'export'` + `images.unoptimized: true`. The build emits a fully static site; there is **no Node runtime in production**.
- `app/api/contact/route.ts` (Resend integration) exists in the source tree but **does not run in the deployed site** because of the static export. The live contact form posts directly to Formspree from `components/sections/ContactSection.tsx`. Treat the API route as dead/standby code unless you're migrating off static export.
- Hardcoded external URLs live in `components/Navigation.tsx` (apps dropdown) and `components/sections/Footer.tsx` (social + product links). Update them there if brand links change.
- Security content for `/security` is defined inline in `app/security/page.tsx`.

## Working Guidelines

- Keep the design dark-themed, minimalist, and mobile-first.
- Prefer extending existing `ui/` primitives (`Button`, `Card`, `Container`) over bespoke markup.
- Never introduce server-only features (dynamic API routes, middleware, server actions) without first removing `output: 'export'` and updating the deploy target — the current static Pages artifact cannot run them.
- Do not weaken privacy messaging or add analytics/tracking cookies.

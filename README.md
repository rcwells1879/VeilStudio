# VeilStudio Website

Marketing / landing site for VeilStudio at [veilstudio.io](https://veilstudio.io).
Statically exported Next.js site assembled with VeilPix and VeilChat, then published to Cloudflare Pages by GitHub Actions.

**Tagline**: _Your AI, Your Keys, Your Control_

## Stack

- Next.js `^15.4.1` (App Router) with static export (`output: 'export'`)
- React `^18.3.1`, TypeScript `^5.8.3`
- Tailwind CSS `^3.4.16` (Inter font, dark theme, custom gradients)
- ESLint `^9.20.0` flat config (`next/core-web-vitals`)
- Icons: `lucide-react`
- Contact form: Formspree (client-side POST)
- Node `22.23.4` (supported range `>=22.23.4 <23`; pinned in `.nvmrc` and CI)

## Getting Started

Use Node 22.23.4. With nvm, run `nvm use` before installing dependencies.

```bash
git clone https://github.com/rcwells1879/VeilStudio.git
cd VeilStudio
npm ci
npm run dev
```

Dev server opens on an auto-assigned port (`next dev --port 0`).

### Build

```bash
npm run build    # outputs static site to ./out
```

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (auto-assigned port) |
| `npm run build` | Static export to `out/` |
| `npm run start` | Serve production build (unused in prod — we static-export) |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run kill-ports` | Free dev ports 3000–3003 and 55000–56000 |
| `npm run clean-dev` | Kill ports then start dev |

## Project Structure

```
app/
  api/contact/route.ts   # Resend handler (present but inert — see Deployment note)
  security/page.tsx      # /security page
  globals.css
  layout.tsx
  page.tsx               # Home page composition
components/
  Navigation.tsx         # Sticky nav + Apps dropdown (VeilChat, VeilPix)
  sections/              # Hero, Features, ContactSection, Footer
  ui/                    # Button, Card, Container, GoogleIcon
public/images/           # Hero1.png, Hero2.png, Hero3.png
.github/workflows/deploy.yml
next.config.js
tailwind.config.js
tsconfig.json
eslint.config.js
```

## Design

- **Background**: `#121212` (`dark-950`)
- **Primary gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` → `bg-gradient-primary`
- **Secondary gradient (orange)**: `linear-gradient(135deg, #ff8a80 0%, #ff5722 100%)` → `bg-gradient-orange`
- **Custom utilities**: `gradient-text`, `section-padding`, `btn-primary`, `btn-secondary`
- **Animations**: `fade-in`, `slide-up`, `glow` (see `tailwind.config.js`)
- Mobile-first, dark theme, high-contrast semantic HTML

## Contact Form (Formspree)

The live contact form POSTs directly to Formspree from the client in
`components/sections/ContactSection.tsx`. To swap to a different form:

1. Create a form at [formspree.io](https://formspree.io) and note the form ID.
2. Update the endpoint in `components/sections/ContactSection.tsx`:
   ```ts
   const formspreeResponse = await fetch('https://formspree.io/f/YOUR_FORM_ID', { ... })
   ```

> ℹ️ `app/api/contact/route.ts` (Resend integration) exists in the tree but is
> inert in production because the site is static-exported — Pages serves the built assets without a Node
> runtime. Keep or remove depending on your future plans.

## Deployment (GitHub Actions to Cloudflare Pages)

The active workflow is `.github/workflows/deploy.yml`, job `deploy`. Pushes to
`main`, manual dispatch, and the existing app repository dispatch events use:

1. `actions/checkout@v4` to check out VeilStudio, VeilPix and VeilChat.
2. `actions/setup-node@v4` to install application build Node **22.23.4**.
3. Locked installs and static builds for all three apps.
4. `scripts/assemble-cloudflare-pages.mjs` to combine the outputs.
5. The existing `cloudflare/wrangler-action@v3` Pages publication.

The Node installed for `npm`, builds and tests is separate from a GitHub action's
internal JavaScript runtime. This update changes the application build version;
action versions, permissions and credentials are unchanged.

The workflow uses the existing `VEILPIX_READ_TOKEN`, `VITE_CLERK_PUBLISHABLE_KEY`,
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and `GITHUB_TOKEN` settings.
No FTP credentials or cPanel host are part of this release path.

Before publishing, run `npm run type-check`, `npm run test:scroll-world` and
`npm run build` under Node 22.23.4. Confirm the completed Pages run and public
assets before reporting a release live. App repository dispatches bind the app
checkout to their requested source commit; preserve that behavior.

### Retired cPanel instructions

cPanel is no longer used. Its former configuration is archived at
`docs/legacy/cpanel.yml.example`; the old editor/FTP guide is
`docs/legacy/vscode-cpanel-guide.md`. Both are historical references, not setup
or deployment instructions. Do not restore them to an active cPanel path.

## Configuration Notes

`next.config.js`:

```js
const nextConfig = {
  output: 'export',      // generates static files in out/
  trailingSlash: true,   // directory-style static URLs
  images: { unoptimized: true, domains: [] },
}
```

Because of `output: 'export'`:

- API routes / middleware / server actions **do not run** in production.
- All pages are fully pre-rendered at build time.
- Next.js image optimization is disabled.

## Troubleshooting

- **Pages release failed**: inspect the failed GitHub Actions step; do not replace the active workflow with the archived FTP instructions.
- **Changes not live**: hard-refresh the browser; clear Cloudflare cache if applicable.
- **Form submissions failing**: check the Formspree dashboard; verify the form ID in `ContactSection.tsx` matches.
- **ESLint "unescaped entities" errors**: use `&apos;` or swap quote style in JSX.

## Resources

- Next.js: <https://nextjs.org/docs>
- Tailwind CSS: <https://tailwindcss.com/docs>
- Formspree: <https://formspree.io/docs>
- Cloudflare Pages: <https://developers.cloudflare.com/pages/>

## License

Private and proprietary to VeilStudio. All rights reserved.

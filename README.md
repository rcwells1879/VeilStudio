# VeilStudio Website

Marketing / landing site for VeilStudio at [veilstudio.io](https://veilstudio.io).
Statically exported Next.js site deployed to cPanel via GitHub Actions.

**Tagline**: _Your AI, Your Keys, Your Control_

## Stack

- Next.js `^15.4.1` (App Router) with static export (`output: 'export'`)
- React `^18.3.1`, TypeScript `^5.8.3`
- Tailwind CSS `^3.4.16` (Inter font, dark theme, custom gradients)
- ESLint `^9.20.0` flat config (`next/core-web-vitals`)
- Icons: `lucide-react`
- Contact form: Formspree (client-side POST)
- Node `>=18`

## Getting Started

Requires Node 18+.

```bash
git clone https://github.com/rcwells1879/VeilStudio.git
cd VeilStudio
npm install
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
> inert in production because the site is static-exported — cPanel has no Node
> runtime. Keep or remove depending on your future plans.

## Deployment (GitHub Actions → cPanel via FTP)

Defined in `.github/workflows/deploy.yml`. Pushes to `main` trigger:

1. `actions/checkout@v3`
2. `actions/setup-node@v3` (Node 18, npm cache)
3. `npm ci`
4. `npm run build`
5. `SamKirkland/FTP-Deploy-Action@v4.3.4` uploads `./out/` → `/public_html/`

The FTP step excludes `veilchat/**` and `apps/**` on the server so sibling
sub-apps at `veilstudio.io/veilchat/` and `veilstudio.io/apps/...` are not
wiped on deploy.

### Required GitHub Secrets

Add these under **Settings → Secrets and variables → Actions**:

- `FTP_SERVER` — cPanel server hostname or IP
- `FTP_USERNAME` — cPanel FTP user
- `FTP_PASSWORD` — cPanel FTP password

### Hosting Additional Apps at Subdirectories

To deploy a separate app at e.g. `veilstudio.io/veilchat/`:

1. Upload that app's build into `/public_html/veilchat/` (manually or via its own workflow).
2. It will remain untouched on subsequent site deploys thanks to the exclude list above.

> `.cpanel.yml` is **legacy** and not used by the active deployment pipeline.

## Configuration Notes

`next.config.js`:

```js
const nextConfig = {
  output: 'export',      // generates static files in out/
  trailingSlash: true,   // required for cPanel-style static hosting
  images: { unoptimized: true, domains: [] },
}
```

Because of `output: 'export'`:

- API routes / middleware / server actions **do not run** in production.
- All pages are fully pre-rendered at build time.
- Next.js image optimization is disabled.

## Troubleshooting

- **FTP timeout on deploy**: verify `FTP_SERVER` (try the IP), credentials, and that your host permits FTP from GitHub's IP range.
- **Changes not live**: hard-refresh the browser; clear Cloudflare cache if applicable.
- **Form submissions failing**: check the Formspree dashboard; verify the form ID in `ContactSection.tsx` matches.
- **ESLint "unescaped entities" errors**: use `&apos;` or swap quote style in JSX.

## Resources

- Next.js: <https://nextjs.org/docs>
- Tailwind CSS: <https://tailwindcss.com/docs>
- Formspree: <https://formspree.io/docs>
- FTP Deploy Action: <https://github.com/SamKirkland/FTP-Deploy-Action>

## License

Private and proprietary to VeilStudio. All rights reserved.

# Browser implementation review — September 14, 2026

Scope: VeilStudio homepage, Security page, shared navigation/footer, scroll controller, and static-export configuration. VeilPix's Contact URL and consuming links were inspected in its owning repository; its complete application and VeilChat were not audited. No upstream source was copied or changed.

## Confirmed defects fixed locally

| Defect | Evidence and correction |
| --- | --- |
| First picture freezes after arrival | Reproduced React hydration error #418 in Chromium, Firefox, and WebKit. The async controller mutated server-rendered markup before hydration; React could replace those nodes while the controller retained detached references. A client component now loads the script after hydration and initializes it on subsequent mounts. Cleanup cancels listeners, animation frames, timers, media requests, and video URLs on unmount. |
| VeilPix Contact link opens the first scene | VeilPix correctly uses `https://veilstudio.io/#contact`. The homepage previously never resolved incoming fragments. Startup and hash changes now position the document at the finale and immediately reveal its controls. Repeated local clicks work and preserve link modifier behavior. |
| About and Contact share a fixed overlay | About now positions the overlay's footer; Contact resets its independent scroll position. Focus follows the destination without opening the mobile keyboard. |
| Contact disappears on resize | Layout preserves rendered progress instead of using a scroll offset the browser may already have clamped. Reduced-motion CSS now uses zero transition duration: its previous tiny universal transition briefly retained the old track height in Firefox. |
| Incorrect background while video is unavailable | Direct Contact navigation uses the finale's final still while waiting for a decoded video frame. |
| Invisible controls remain reachable | Hidden scene copy and faded header/scene navigation are now inert, consistent with the existing finale behavior. |
| Dead Security footer links | Removed placeholder destinations for nonexistent Features, Pricing, Documentation, and Careers sections; corrected Contact, About, privacy, terms, and product links. |
| Mobile compatibility details | Added accessible navigation button names/expanded states, 16px mobile form text, and fallback spacing for browsers without small-viewport units. |

## Validation

The final production export was served locally over HTTP. Playwright ran against installed Chrome and Edge, bundled Chromium and Firefox, and WebKit on Windows.

| Browser / engine | 1440×900 | 390×844 | 320×568, reduced motion | Delayed controller + blocked video |
| --- | --- | --- | --- | --- |
| Chrome | Pass | Pass | Pass | Pass |
| Edge | Pass | Pass | Pass | Pass |
| Chromium | Pass | Pass | Pass | Pass |
| Firefox | Pass | Pass | Pass | Pass |
| WebKit | Pass | Pass | Pass | Pass |

Each viewport suite checked cold Contact entry, returning to Home, selecting Creation, menu Contact navigation, landscape/portrait resizing, About-to-Contact navigation, form failure with retained input, successful form reset, two Security-to-home round trips, browser back/forward, and absence of uncaught page errors. Form requests were intercepted locally; no messages were sent. Homepage horizontal overflow was checked. An additional Security check found no overflowing text at 320px and confirmed the mobile navigation opens. Desktop and mobile Contact screenshots were visually inspected.

`npm run build`, `npm run type-check`, `npm run lint`, and all 13 `npm run test:scroll-world` regression tests passed. The final build also ran its own lint/type validation. Browser scripts and screenshots are local QA artifacts under `.codex/` and must stay out of commits.

## Remaining work and limits

- Physical iPhone/iPad Safari and Android testing remains necessary for hardware video decoding, low-power playback restrictions, the virtual keyboard, and dynamic browser toolbars. WebKit on Windows and touch-enabled viewport tests do not certify those devices. The matrix does not cover every historical browser version.
- JavaScript-disabled users still cannot reach the animated Contact form. A static accessible fallback would improve resilience if scripts are disabled or blocked. This was verified with JavaScript disabled.
- Live Formspree acceptance and email delivery were not tested. The automated checks cover the site's success/error behavior using intercepted responses.
- Security-page claims such as “0 Days,” “Third-Party Access: None,” and universal local-only storage need a separate product-specific accuracy review. This browser audit did not establish those claims; the homepage contact form itself sends information to Formspree.
- `app/api/contact/route.ts` is an unused Resend implementation and is not provided by the static Pages artifact. The current homepage uses Formspree directly. Remove or clearly document that legacy route before someone tries to reuse it as a deployed endpoint.
- The build reports outdated Browserslist data and deprecation of `next lint`; dependency/tooling maintenance remains separate from these runtime fixes.

## Publication status

Local production build: passed. No commit or push was made. No combined GitHub Actions/Cloudflare deployment was triggered. Live `/`, `/veilpix/`, and `/veilchat/` have not been verified against these changes. Existing README and AGENTS changes were preserved.

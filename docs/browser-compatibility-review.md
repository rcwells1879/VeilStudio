# Browser implementation review

## November 8, 2026: scroll-world reliability and skill research

### Skill versions checked

The installed `scroll-world/SKILL.md` and `references/scrub-engine.js` are byte-for-byte identical to the current **cth9191 hardened fork**, whose plugin manifest is **0.2.0**. Its latest repository commit is `ab91586599f784bc0b9d803a4c96ee25ffdf9eb6` (July 9, 2026). There is no newer copy in that fork to install.

The original **oso95** project has advanced to **0.8.0**. Its latest repository commit is `71cc36d3bb150248ae36a2c552f9cbf88802a79c` (July 29, 2026). Changes include Codex still generation, native portrait mobile chains, generation-provider choices, camera-style selection, and seam-review guidance. Comparing its current player against our installed reference found no newer failed-download recovery or frame-presentation solution. Replacing VeilStudio's customized player with it would also restore whole-file blob downloads and lose site-specific Contact navigation and cleanup behavior. No installed skill files were changed.

Primary sources:

- [Hardened fork](https://github.com/cth9191/scroll-world), [0.2.0 manifest](https://github.com/cth9191/scroll-world/blob/ab91586599f784bc0b9d803a4c96ee25ffdf9eb6/plugins/scroll-world/.claude-plugin/plugin.json).
- [Original project at the reviewed commit](https://github.com/oso95/scroll-world/tree/71cc36d3bb150248ae36a2c552f9cbf88802a79c), [0.8.0 manifest](https://github.com/oso95/scroll-world/blob/71cc36d3bb150248ae36a2c552f9cbf88802a79c/.claude-plugin/plugin.json).
- [Video frame callbacks](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback) report a frame sent to the compositor and its media timestamp. They are a better presentation signal than merely assigning `currentTime`, but their delivery must not be the only way to reveal a paused, hidden video. The [completed-seek event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event) provides the fallback signal used here.
- [Seekable ranges](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable) describe where a media element can seek. Production returned HTTP 206 and the requested 1,024-byte range for `conn-03-04.mp4`; native progressive loading remains appropriate here.
- [CSS scroll timelines](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) can move visual effects off the main thread. Inference for this implementation: changing the timeline alone would not repair failed video downloads, media promises, or decoded-frame handoffs.

### Reproduction and changes

A local browser reproduction began at `/#contact`, jumped backward to `conn-03-04`, and returned HTTP 503 for that clip's first request. The previous player made exactly one request and left the section permanently on its poster. With the fix, a fresh element retries the clip and reaches the requested frame on the second request.

Additional weaknesses found by inspection were offscreen clips competing for seeks, unbounded mobile `play()` warm-up promises, and revealing an old frame on a return visit. The player now:

- Loads the destination first, then visible crossfade clips and immediate neighbors; all six small posters are prepared on mount.
- Prioritizes visible seeks and prepares adjacent endpoints after the visible decoder is free. Distant loaded clips no longer seek in the background.
- Retries failed clips up to three total attempts with backoff, ignores events from detached elements, and permits another attempt after connectivity returns.
- Bounds mobile warm-up at 1.8 seconds; an expired promise cannot complete a later warm-up.
- Checks frame position before revealing a clip, with both frame callbacks and a completed-seek fallback. The fallback was added after the Firefox phone stress test reached the correct video time but withheld a new frame callback while the video was hidden. It gives the browser a paint opportunity before revealing the decoded frame.
- Reconciles scroll position on a back/forward-cache return and cancels media timers and callbacks on cleanup.

The controller asset URL is versioned `20261108-1`. Existing scene artwork and delivery encodes were retained; their GOP sizes are already 8 on desktop and 4 on phones. Existing README and untracked operator files were preserved.

### Validation and publication

The final exported runtime was verified to match the source. Browser scripts, downloaded reference copies, and screenshots remain local under `.codex/`.

| Check | Result |
| --- | --- |
| Production build, lint, and type validation | Passed on the deployment-pinned Node 22.23.4. |
| Runtime regression suite | All 21 tests passed, including retries, pending/expired warm-ups, stale-frame rejection, frame-callback fallback, reverse preparation, and cleanup. |
| Navigation matrix | Chromium, Firefox, and WebKit passed desktop, phone, and small reduced-motion views; delayed controller and unavailable-video cases also passed. Contact/About/Home, scene jumps, resize, intercepted form responses, repeated navigation, and history were exercised. No real contact messages were sent. |
| Media stress | All three engines passed desktop and phone runs beginning at Contact, jumping rapidly across multiple bands, then visiting all six clips in both directions. Each run checked 36 changing pixel samples, for 216 across the matrix. Chromium used 4x CPU throttling. |
| Download recovery | Failed-first-request and 700ms-delay injection passed. WebKit native media bypassed browser routing, so its failures and delays were injected by the local HTTP server instead. |
| Progressive loading | At 1.28 Mbps, Chromium revealed a moving frame at about 0.50 seconds while only 0.85 seconds of the 8.04-second clip was buffered. |
| Stills fallbacks | Data saver, reduced motion, and `?stills` each kept six posters available and made zero video requests. |

Publication uses the combined GitHub Actions workflow on `main`. Verify the commit's successful Pages upload and the live version independently of these local results. Physical iPhone/iPad and Android decoder behavior remains a separate validation limit.

## September 14, 2026 review

## Follow-up: iPhone Chrome toolbar and video loading

The initial matrix below established navigation behavior, but did not verify decoded animation frames. A subsequent user report exposed two additional defects:

- A height-only mobile-toolbar resize left the scroll track at its old height. Reproduced with an iPhone-sized viewport changing from 390×664 to 390×844: the menu's Contact link reached the document bottom while the form opacity remained zero. The trailing viewport space now updates without moving scene boundaries, and anchor navigation reconciles that height again. Toolbar changes also preserve an intentional upward scroll.
- Videos waited for complete multi-megabyte blob downloads, with loading starting shortly before each boundary. Native video URLs now allow HTTP range loading; current, preceding, and following clips prepare for scrolling in either direction. Playback-policy rejection no longer globally disables all animation. Contact uses its final still at the endpoint rather than exposing a stale video frame while seeking.

Additional validation: Chromium, Firefox, and WebKit decoded three distinct pixel samples per clip in both directions across all six clips, starting from a fresh Contact entry and reversing through the story. A touch/wheel check confirmed that scrolling upward leaves the Contact overlay. At a throttled 1.28 Mbps, Chromium displayed a frame at 0.50 seconds of an 8.04-second clip while only 0.85 seconds was buffered, confirming playback no longer waits for a full download. The preview server used HTTP Range support, matching production's verified 206 responses. Production build and 15 runtime regression tests passed. Physical iPhone Chrome verification remains outside this environment.

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

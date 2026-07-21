# VeilStudio Scroll World: Production Prompt Pack

This is the production brief for the VeilStudio landing-page scroll world. Static
scene anchors use Codex's built-in GPT-Image 2 generation. Motion uses Seedance 2.0
through Kie.ai directly; Higgsfield is not part of this workflow. The local Kie
generator is `scripts/generate-scroll-world.mjs` and is video-only.

The art direction is an original, poetic childhood vision of space: tiny handmade
worlds, quiet wonder, warm isolated rooms, and whimsical inhabitants. It must not
copy a named book, character, costume, prop, or recognizable composition.

## Production shape

- Four scenes: `observatory-exterior`, `observatory-study`, `floating-atelier`,
  and `badger-sea`.
- Alternating desktop rhythm:
  - Scene 01 visual right, website copy left.
  - Scene 02 visual left, website copy right.
  - Scene 03 visual right, website copy left.
  - Scene 04 visual left, website copy right.
- The connectors carry the camera diagonally toward the next side, then settle
  into forward motion before the exact frame handoff.
- Scene anchors: GPT-Image 2, 3:2 landscape, high quality.
- Final motion: Seedance 2.0, 16:9, 1080p, generated audio off, web search off.
- Scene duration: 8 seconds. Connector duration: 5 seconds.
- Four scenes plus three connectors require seven Kie.ai video tasks before rerolls.
- Generate connectors only after both neighboring scene clips are approved.
- Use the actual final encoded frame of the earlier clip and actual first encoded
  frame of the next clip as connector endpoints.
- Extract web posters from the encoded Seedance clips' first frames. Do not use the
  original GPT still as a poster.

On desktop, place right-side subjects around 66% of frame width and left-side
subjects around 34%. Keep the opposite 38–42% visually quiet for copy. On narrow
screens, place copy below the scene and use per-scene `object-position` values near
`68% center` for right-side visuals and `32% center` for left-side visuals.

## Shared visual language

Use this wording in every scene-anchor prompt, followed by the scene-specific
composition instruction:

> Original poetic children's space storybook, not based on any existing book or character. Hand-painted gouache and watercolor on warm paper with delicate ink linework, subtle paper grain, simple cut-paper depth, sparse poetic composition, quiet solitude, and gentle amber moonlight. Cohesive palette of ink navy #121B3A, starlight cream #FFF1C7, lavender #A995D9, apricot #F3A56B, seafoam #9FD5C2, and coral #DE7A68. Keep the opposite 38–42% of the frame calm and mostly deep ink-navy for website copy. Preserve generous headroom and do not crop the complete world or primary character. No text, letters, numbers, labels, logos, watermark, recognizable copyrighted character, or existing book illustration.

## Scene-anchor prompts

### 01 — Observatory Exterior / visual right

```text
Use case: illustration-story.
Asset type: VeilStudio scroll-world exterior scene anchor.

Original poetic children's space storybook, not based on any existing book or character. Hand-painted gouache and watercolor on warm paper with delicate ink linework, subtle paper grain, simple cut-paper depth, sparse poetic composition, quiet solitude, and gentle amber moonlight. Cohesive palette of ink navy #121B3A, starlight cream #FFF1C7, lavender #A995D9, apricot #F3A56B, seafoam #9FD5C2, and coral #DE7A68. No text, letters, numbers, labels, logos, watermark, recognizable copyrighted character, or existing book illustration.

Create a 3:2 landscape view of a tiny rounded grass planet floating in a deep navy starfield. It has a small old observatory with warm windows and a domed roof. One large brass telescope must visibly protrude through the open roof slit at the very top of the dome and point toward the stars. On the grass, one young girl with curly dark hair, wearing a simple seafoam-and-apricot outfit, joyfully chases one luminous butterfly with a butterfly net. Add one small windswept tree and a few delicate flowers. No adult is visible outside.

Composition: place the complete planet, observatory, girl, and butterfly in the right visual third with their center of mass around 66% of frame width. Keep the left 40% calm, uncluttered deep navy space for website copy. The open observatory roof and protruding telescope must be clearly readable as the camera destination.
```

### 02 — Observatory Study / visual left

```text
Use case: illustration-story.
Asset type: VeilStudio scroll-world observatory interior scene anchor.

Use the supplied exterior image for the architecture and brass-telescope continuity, and the supplied atelier image for the painting medium and palette. Create a 3:2 cutaway, dollhouse-like interior of the same tiny observatory dome. Preserve the original poetic gouache-and-watercolor storybook treatment, delicate ink linework, warm paper grain, simple cut-paper depth, deep ink navy shadows, and amber candlelight.

Inside is one elderly astronomer with a very long white beard, looking through the same large brass telescope beneath the open dome slit. Surround him with curved bookshelves packed with old unlabeled books, a rolling ladder, several candles, a worn rug, and a small wooden desk covered with hand-drawn maps and star charts. The room should feel warm, old, intimate, and lovingly cluttered. Make the telescope eyepiece and forward lens visually clear enough to become a camera portal. The girl is not visible inside.

Composition: place the complete observatory study and astronomer in the left visual third with their center of mass around 34% of frame width. Keep the right 40% calm and dark for website copy. No readable writing, text, labels, logos, watermark, or recognizable existing character.
```

### 03 — Floating Atelier / visual right

The approved anchor is `public/media/scroll-world/stills/03-floating-atelier-right.png`.
Its pond is the portal into the next scene.

```text
Original poetic children's space storybook in hand-painted gouache and watercolor on warm paper. A detached floating island forms a tiny open-air artist atelier. One young boy conducts ribbons of golden light between blank picture frames, beside a handmade camera, paintbrushes, and a circular pond reflecting moving stars. The complete island and character sit in the right visual third around 66% of frame width, while the left 40% remains quiet deep navy space for website copy. The pond remains clearly visible. Every frame is blank. No text, labels, logos, watermark, recognizable copyrighted character, or existing book illustration.
```

### 04 — Badger's Open Sea / visual left

```text
Use case: illustration-story.
Asset type: VeilStudio scroll-world open-sea scene anchor.

Original poetic children's space storybook, not based on any existing book or character. Hand-painted gouache and watercolor on warm paper with delicate ink linework, subtle paper grain, layered cut-paper depth, deep indigo shadows, and amber moonlight. Create a 3:2 full-bleed ocean scene. This is a vast open sea extending beyond every side of the frame, not a circular water planet, floating disk, platform, or isolated puddle. A low horizon and broad rolling waves should make the water feel truly immense.

One weathered wooden sailing ship crests a deep indigo wave. At the helm stands one anthropomorphic badger sea captain in a navy pea coat and old captain's cap, calmly smoking a curved wooden pipe. Add cream sails pulling in the wind, warm lanterns, sea spray, rope, and one delicate pipe-smoke spiral. No other crew or characters.

Composition: place the ship and captain in the left visual third with their center of mass around 34% of frame width. Keep the right 40% comparatively calm with open sea and night sky for website copy. No circular water island, text, labels, logos, watermark, or recognizable existing character.
```

## Seedance scene prompts

For every scene, upload its matching anchor. Choose Seedance 2.0 regular,
16:9, 1080p, 8 seconds, generated audio off, web search off, and single-shot motion.

### Scene 01 — Observatory Exterior

```text
Single continuous cinematic camera move, no cuts. Begin high and far above the complete tiny observatory planet, with the world weighted on the right. Glide steadily forward and descend toward the girl as she runs lightly after the luminous butterfly and lifts her net. Let grass, flowers, her clothing, and the butterfly move gently. Arc upward around the warm observatory toward the brass telescope protruding through the open slit at the top of its dome. In the final second, settle from the diagonal arc into a smooth forward glide aimed directly through the open dome toward the interior, with the roof opening nearly filling the frame. Preserve the supplied hand-painted gouache-and-watercolor appearance and character design. No cuts, backward movement, text, captions, logos, or watermark.
```

### Scene 02 — Observatory Study

```text
One unbroken physical dolly shot in one continuous room from the first frame to the last frame. Absolutely no cut, edit, montage, time jump, reverse angle, teleportation, scene replacement, or sudden reframing. Begin with the complete warm observatory study weighted on the left. Move the camera forward at one slow, constant speed on a simple continuous path toward the elderly astronomer with the long white beard and the brass telescope. The shelves, desk, candles, maps, walls, and astronomer remain spatially stable and visibly continuous throughout the move; they may pass naturally out of frame only because the camera physically moves past them. The astronomer stays at the telescope and makes only one tiny focusing adjustment. Candle flames and one loose map corner move subtly. Do not orbit, whip-pan, zoom digitally, or introduce any new room or viewpoint. During the final two seconds, align gradually with the telescope's dark glass while maintaining the same forward velocity, ending with the glass almost filling the frame. Preserve the supplied hand-painted gouache-and-watercolor appearance and exact room design. No backward movement, readable writing, text, captions, logos, or watermark.
```

### Scene 03 — Floating Atelier

```text
Single continuous cinematic camera move, no cuts. Begin high and far above the complete floating atelier weighted on the right. Glide forward and descend toward the boy as he conducts ribbons of golden light between blank floating frames. Drift between the frames, passing the handmade camera and paintbrushes, then arc gently toward the circular pond of reflected stars. In the final second, settle from the arc into a smooth forward glide straight down toward the center of the pond until the rippling indigo surface nearly fills the frame. Preserve the supplied hand-painted gouache-and-watercolor appearance and exact character design. Every frame stays blank. No cuts, backward movement, text, captions, logos, or watermark.
```

### Scene 04 — Badger's Open Sea

```text
Single continuous cinematic camera move, no cuts. Begin in a wide view over a vast open indigo sea, with the sailing ship and badger captain weighted on the left. Glide forward just above the rolling waves toward the ship. The boat must visibly rise, fall, and gently pitch with the large waves while its cream sails pull and ropes move in the wind. Sea spray catches amber moonlight and the captain's pipe smoke curls softly. Pass the bow in parallax and approach the captain at the helm without centering him prematurely. End in a calm forward drift beside the helm, leaving quieter sea and sky on the right for copy. Preserve the supplied hand-painted gouache-and-watercolor appearance and character design. No circular water planet, cuts, text, captions, logos, or watermark.
```

## Seedance connector prompts

Generate each 5-second connector only after both neighboring scene clips are
approved. Use the earlier clip's actual last encoded frame as `first_frame_url`
and the next clip's actual first encoded frame as `last_frame_url`. Choose
Seedance 2.0 regular, 16:9, 1080p, generated audio off, and web search off.

### Connector 01 — Exterior right to Study left

```text
Single continuous cinematic camera move, no cuts and no backward motion. Continue through the supplied open observatory dome frame. Pass beneath the brass telescope and through the roof slit as the exterior starlight gives way to warm amber candlelight. Reveal curved bookshelves, old maps, and the tiny study while drifting naturally from the right side of the composition toward the left. In the final second, finish the lateral travel and settle into the same gentle forward glide shown by the supplied first frame of the study clip. Preserve the supplied first and last frames exactly as endpoints and keep the architecture continuous. No text, captions, logos, or watermark.
```

### Connector 02 — Study left through Telescope to Atelier right

```text
Single continuous cinematic camera move, no cuts and no backward motion. Continue forward into the supplied telescope-glass frame. The dark glass becomes a deep painted starfield with flowing indigo pigment and one thread of golden light. Follow that thread through the telescope's imagined view while drifting gradually from the left side toward the right. The darkness opens into the supplied wide view of the floating atelier. In the final second, finish the lateral travel and settle into the same gentle forward descent as the atelier clip. Preserve the supplied first and last frames exactly as endpoints. No text, captions, logos, or watermark.
```

### Connector 03 — Atelier right through Pond to Sea left

```text
Single continuous cinematic camera move, no cuts and no backward motion. Continue into the supplied close view of the atelier pond. Pass through the rippling surface as reflected stars stretch into bubbles and soft underwater shafts of amber light. The pond becomes deeper and wider until it is clearly an immense connected ocean, never a circular disk. Travel diagonally from the right side toward the left, then rise smoothly through the opposite surface into the supplied wide view of the open sea and sailing ship. In the final second, finish the lateral travel and settle into the same low forward glide as the sea clip. Preserve the supplied first and last frames exactly as endpoints. No text, captions, logos, or watermark.
```

## File handoff

```text
public/media/scroll-world/
  stills/
    01-observatory-exterior-right.png
    02-observatory-study-left.png
    03-floating-atelier-right.png
    04-badger-sea-left.png
  video/
    01-observatory-exterior.mp4
    02-observatory-study.mp4
    03-floating-atelier.mp4
    04-badger-sea.mp4
    conn-01-02.mp4
    conn-02-03.mp4
    conn-03-04.mp4
  posters/
    01-observatory-exterior.png
    02-observatory-study.png
    03-floating-atelier.png
    04-badger-sea.png
```

The landing page uses posters for first paint and the GPT stills only for
reduced-motion or data-saver fallback. Each section should expose `visualAlign`,
`copySide`, and `objectPosition` metadata rather than assuming one fixed layout.

## Local generation examples

Set `KIE_API_KEY` in the gitignored `.env.local`, then use these headings with
the video-only generator:

```powershell
npm run scroll-world:generate -- credits
npm run scroll-world:generate -- dive 01-observatory-exterior `
  --start-image public/media/scroll-world/stills/01-observatory-exterior-right.png `
  --prompt-section "Scene 01"
npm run scroll-world:generate -- connector 01-02 `
  --start-frame tmp/01-observatory-exterior-last.png `
  --end-frame tmp/02-observatory-study-first.png `
  --prompt-section "Connector 01"
```

Kie.ai's returned media URLs are temporary, so download each result immediately.

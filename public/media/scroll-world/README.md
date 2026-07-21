# Scroll-world media contract

Place the approved VeilPix assets here using the names and folders in
`docs/scroll-world/veilpix-prompt-pack.md`.

The standalone preview expects:

- `stills/`: GPT-Image 2 PNG scene artwork for reduced-motion and no-video mode.
- `video/`: encoded, silent 720p MP4 scenes/connectors plus 540p `-m` phone variants.
- `posters/`: WebP first frames extracted from each encoded MP4 variant.
  The `04-badger-sea-end*.webp` files are exact final-frame handoffs for the
  pupil-zoom finale.
- `stills/web/`: compressed WebP fallbacks for reduced motion and data saver.

The raw Kie downloads and seam frames live under gitignored `tmp/scroll-world/`.
Regenerate delivery assets with `npm run scroll-world:process`. Run the standalone
artifact with `npm run scroll-world:preview`; it is intentionally not mounted by the
VeilStudio Next.js homepage.

Regenerate only the pupil handoff frames and their SSIM check with
`npm run scroll-world:process -- finale`.

Do not commit raw VeilPix downloads or temporary frame-extraction files here. Keep raw
downloads and extracted seam frames in a local scratch folder until the final encodes
have passed the SSIM seam check.

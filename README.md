# Para Lilian — uma carta para você

A cinematic, single-page love letter paced like a film: an interactive opening
gate, a scroll-revealed opening, a vertical photo timeline with parallax, a
"what I love about you" grid of flip-cards, a scroll-driven 3D photo
dodecahedron, the letter itself on paper, and a finale where gold dust gathers
into a heart — with smooth scroll, ambient audio, a custom cursor, mouse
presence (parallax / magnetic / tilt), and two easter eggs.

Everything you'd want to personalize lives in **one file**:
[`lib/constants.ts`](lib/constants.ts).

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Lint (use the project-local ESLint — a globally-installed ESLint may shadow it):

```bash
node ./node_modules/eslint/bin/eslint.js .
```

---

## Customizing the content

Open [`lib/constants.ts`](lib/constants.ts) and edit the `CONTENT` object. No
component code needs to change.

| Field | What it controls |
|---|---|
| `name` | Her name. Used in the copy (and available to reuse anywhere). |
| `gate.buildup[]` | The cinematic build-up lines in the **interactive opening**. |
| `gate.question` | The yes/no question ("quer ser minha pra sempre?"). |
| `gate.yes` / `gate.no` | The button labels. "No" softly dodges; "Yes" celebrates → reveals the letter. |
| `gate.celebration` / `gate.celebrationSub` | The two lines shown after "Yes". |
| `opening[]` | The opening lines (Section 2), revealed kinetically on scroll. Keep them short. |
| `timeline[]` | The 5 timeline cards. Each: `{ date, title, description }`. The `date` is just a label ("O começo", "2021"…), not a real date — write anything. |
| `qualities[]` | The 6 cards in "o que eu amo em você". Each: `{ title, description }`. |
| `memoryPhrases[]` | Phrases that cross-fade over the scroll-driven 3D photo scene. |
| `letter.paragraphs[]` | The body of the letter, revealed one paragraph at a time. Add or remove freely. |
| `letter.signature` | The sign-off, shown in the handwriting font. |
| `ending.title` | The big italic line in the finale. |
| `ending.backToTop` | Label of the button that appears after 3s. |
| `konamiMessage` | Hidden message revealed by the Konami code (see Easter eggs). |

> The default copy is in Portuguese. Replace it with your own — the layout
> adapts to longer or shorter text.

---

## Replacing the audio track

The site ships with **Erik Satie — _Gymnopédie No.1_** (public domain
recording, sourced from the [Internet Archive](https://archive.org/details/GymnopedieNo.1)).
To use your own track, just replace the file:

```
public/audio/ambient.mp3
```

The path is set in `ASSETS.audio` in `lib/constants.ts` if you want a different
filename. The player starts paused; the toggle (bottom-right) fades the volume
in over 2s and out over 1s via Howler.

---

## Adding your photos & videos (the important part)

Every photo/video slot is a `MediaRef` (`{ type, src, poster? }`) in
[`lib/constants.ts`](lib/constants.ts). Just **drop a file at the `src` path**
under `public/` and it appears — until then an elegant placeholder shows (no
broken images, no code change). See [components/ui/MediaFrame.tsx](components/ui/MediaFrame.tsx).

**Drop-in photos (pre-wired paths):**

| Where | Files to add in `public/images/` |
|---|---|
| "O que eu amo em você" cards (flip to reveal) | `voce-1.jpg` … `voce-6.jpg` |
| "Nossa história" timeline (one per chapter) | `historia-1.jpg` … `historia-5.jpg` |

Square-ish or portrait (4:5) images look best. That's it — drop them in and
refresh.

**Using a video instead of a photo** — in `lib/constants.ts`, change that
item's `media` to:

```ts
media: { type: "video", src: "/videos/nosso-video.mp4", poster: "/images/poster.jpg" }
```

…and put the file in `public/videos/`. It renders muted+looping with controls.

**3D memory dodecahedron** still uses generated gradient placeholders by default
(so it always renders). To map your photos onto it too, swap the texture memo in
[`components/three/MemoryPolyhedron.tsx`](components/three/MemoryPolyhedron.tsx)
for `useTexture([...ASSETS.memoryPhotos])` (paths in `ASSETS.memoryPhotos`).

---

## Fonts

All type is loaded and self-hosted by `next/font/google` in
[`app/layout.tsx`](app/layout.tsx): **Fraunces** for display (with the
optical-size axis, so headlines grow more dramatic as they scale), **Newsreader**
for the letter body, **Inter** for UI / meta labels, and **Pinyon Script** for
the signature.

---

## Design tokens

Palette, easings, durations and stagger timing live in `lib/constants.ts`
(`PALETTE`, `EASING`, `DURATION`, `STAGGER`) and are mirrored as CSS
variables / Tailwind v4 theme tokens in [`app/globals.css`](app/globals.css).
Utilities generated from the theme: `bg-night`, `bg-night-soft`, `text-gold`,
`text-gold-bright`, `text-cream`, `text-muted`, `text-paper`, `font-display`,
`font-serif`, `font-sans`, `font-signature`, `text-hero` / `text-display` /
`text-h2`, `ease-micro`, `ease-smooth`, `ease-dramatic`. Plus `.card-surface`
(hairline content surface) and the `.tracking-display` / `.nums-lining` type
helpers.

---

## Easter eggs

- **Answer "sim, pra sempre"** on the opening gate → a gold heart-burst.
- **Konami code** (`↑ ↑ ↓ ↓ ← → ← → b a`) anywhere → reveals `konamiMessage`.

---

## Accessibility / reduced motion

Everything respects `prefers-reduced-motion`. With it on: Lenis smooth-scroll is
disabled (native scroll), the intro gate and scroll-scrubbed reveals show their
content immediately, the 3D scenes freeze (the Ending heart renders already
formed), mouse parallax / magnetic / tilt are skipped, and CSS animations are
neutralized.

---

## Deploy

```bash
# Set your real domain so the OG image resolves to an absolute URL
# (or change the fallback in app/layout.tsx -> metadata.metadataBase):
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

Metadata: title **Para Lilian**, description **Uma carta para você.**, a gold
heart favicon (`app/icon.svg`), and a generated OG image
(`app/opengraph-image.tsx`).

---

## File structure

```
app/
  layout.tsx            fonts, metadata, providers
  page.tsx              composes all sections; dynamic-imports the 3D scenes
  globals.css           design system (Tailwind v4 @theme)
  icon.svg              gold-heart favicon
  opengraph-image.tsx   generated OG image
components/
  sections/             InteractiveIntro, Opening, Timeline, WhatILove,
                        MemoryScene, Letter, Ending
  three/                ParticleField, MemoryPolyhedron, HeartParticles
  ui/                   CustomCursor, AudioToggle, MediaFrame, KonamiEasterEgg
  providers/            LenisProvider, ReducedMotionProvider
hooks/
  useLenis.ts           shared Lenis instance + scrollTo helper
  useMagnetic.ts        pointer-magnetic CTA (gsap.quickTo)
  useTilt.ts            pointer-tilt for cards/photos (gsap.quickTo)
lib/
  constants.ts          <- all editable content + design tokens
  animations.ts         reusable Motion variants + easing tuples
  seededRandom.ts       pure PRNG for particle layouts
public/
  audio/ambient.mp3            ambient track (swap freely)
  images/                      your photos (memory-1..6.jpg) — optional
```

---

## Notes on the stack (vs. the original brief)

Built on the toolchain that was actually installed, which is newer than the
brief assumed. Adjustments made for compatibility:

- **Next.js 16 + React 19 + Tailwind v4** (brief assumed Next 14 / React 18 /
  Tailwind v3). Tailwind v4 is configured CSS-first via `@theme` in
  `globals.css` — there is no `tailwind.config.js`.
- **`motion`** (current package, imported from `motion/react`) instead of
  `framer-motion` — same API, React 19 compatible.
- **`lenis`** (the maintained rename) instead of `@studio-freight/lenis`.
- Added **`@react-three/postprocessing` + `postprocessing`** for the bloom /
  chromatic-aberration effects (the brief listed the effects but not the deps).
- **`tailwindcss-animate` skipped** — it targets Tailwind v3; GSAP, Motion and a
  few CSS keyframes cover the animation needs.
- **shadcn/ui skipped** — the UI is fully bespoke; nothing shadcn would improve.
- **Type:** Fraunces (display, with the optical-size axis), Newsreader (the
  letter body), Inter (UI / meta), Pinyon Script (the signature) — all loaded via
  `next/font/google`.

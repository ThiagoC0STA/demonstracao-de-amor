# Para Lilian — uma carta para você

A cinematic, single-page love letter. Eight scenes paced like a film: a typed
preloader, a 3D hero, a typewriter opening, a pinned horizontal timeline, a
"what I love about you" grid, a rotating 3D photo dodecahedron, the letter
itself on paper, and a glowing 3D heart finale — with smooth scroll, ambient
audio, a custom cursor, and two easter eggs.

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
| `name` | The name rendered in 3D in the hero. |
| `gate.buildup[]` | The cinematic build-up lines in the **interactive opening**. |
| `gate.question` | The yes/no question ("quer ser minha pra sempre?"). |
| `gate.yes` / `gate.no` | The button labels. "No" softly dodges; "Yes" celebrates → reveals the letter. |
| `gate.celebration` / `gate.celebrationSub` | The two lines shown after "Yes". |
| `hero.subtitle` | The italic line under the 3D name. |
| `opening[]` | The two (or more) typewriter lines in Section 2. Keep them short. |
| `timeline[]` | The 5 timeline cards. Each: `{ date, title, description }`. The `date` is just a label ("O começo", "2021"…), not a real date — write anything. |
| `qualities[]` | The 6 cards in "o que eu amo em você". Each: `{ title, description }`. |
| `memoryPhrases[]` | Phrases that cross-fade over the rotating 3D photo scene. |
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

## The 3D display typeface

The extruded hero name needs a Three.js typeface JSON at
`public/fonts/display.typeface.json` (currently **Gentilis**, an elegant serif
from the Three.js examples). To change it, convert any font with
[facetype.js](https://gero3.github.io/facetype.js/) and replace that file. The
path is set in `components/three/Hero3DText.tsx` (`FONT_PATH`).

UI fonts (Playfair Display, Inter, Caveat) are loaded and self-hosted by
`next/font` in [`app/layout.tsx`](app/layout.tsx).

---

## Design tokens

Palette, easings, durations and stagger timing live in `lib/constants.ts`
(`PALETTE`, `EASING`, `DURATION`, `STAGGER`) and are mirrored as CSS
variables / Tailwind v4 theme tokens in [`app/globals.css`](app/globals.css).
Utilities generated from the theme: `bg-night`, `bg-night-soft`, `text-gold`,
`text-gold-bright`, `text-cream`, `text-muted`, `text-paper`, `font-display`,
`font-sans`, `font-signature`, `ease-smooth`, `ease-dramatic`.

---

## Easter eggs

- **Click the 3D name "Lilian" 5 times** in the hero → a gold confetti burst.
- **Konami code** (`↑ ↑ ↓ ↓ ← → ← → b a`) anywhere → reveals `konamiMessage`.

---

## Accessibility / reduced motion

Everything respects `prefers-reduced-motion`. With it on: Lenis smooth-scroll is
disabled (native scroll), the preloader/typewriters show full text immediately,
the timeline becomes a vertical stack instead of a pinned horizontal scroll, and
CSS animations are neutralized.

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
  sections/             Preloader, Hero, Opening, Timeline, WhatILove,
                        MemoryScene, Letter, Ending
  three/                ParticleField, Hero3DText, MemoryPolyhedron, HeartGeometry
  ui/                   CustomCursor, AudioToggle, ScrollIndicator, KonamiEasterEgg
  providers/            LenisProvider, ReducedMotionProvider
hooks/
  useLenis.ts           shared Lenis instance + scrollTo helper
  useGsap.ts            registers GSAP plugins; re-exports gsap/ScrollTrigger/useGSAP
lib/
  constants.ts          <- all editable content + design tokens
  animations.ts         reusable Motion variants
  seededRandom.ts       pure PRNG for particle layouts
public/
  audio/ambient.mp3            ambient track (swap freely)
  fonts/display.typeface.json  3D hero typeface
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
- The 3D hero name uses the bundled Gentilis serif typeface (no Playfair
  typeface JSON exists out of the box); see "The 3D display typeface" above.
- Hook file named `hooks/useGsap.ts` (the brief wrote `useGSAP.ts`) to avoid a
  name clash with the imported `useGSAP` identifier on case-insensitive systems.

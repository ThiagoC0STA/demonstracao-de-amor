/**
 * Single source of truth for the site.
 *
 * - PALETTE / EASING / DURATION / STAGGER mirror the design system and are
 *   also exposed as CSS variables in `app/globals.css`. Keep them in sync.
 * - CONTENT holds every piece of editable copy. To personalize the letter,
 *   edit the strings here — no component code needs to change.
 *
 * See README.md ("Customizing the content") for a field-by-field guide.
 */

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

// Single source of truth for color. These mirror the CSS custom properties in
// app/globals.css (@theme) and the literals used in the 3D scenes — keep all
// three in sync. The 3D lights/materials read `gold`/`goldBright` so the canvas
// light matches the CSS gold exactly (no two-tone gold across the page).
export const PALETTE = {
  bgPrimary: "#0a060d", // deep twilight violet-black
  bgSecondary: "#160e1d", // lifted surface
  gold: "#e5b874", // the single accent — warm champagne, luminous not yellow
  goldBright: "#ffe2aa", // highlight
  textPrimary: "#fbf8f1", // warm off-white
  textSecondary: "#b4acb0", // muted, warmer gray
  paper: "#f2ebe0", // letter section background
  goldInk: "#9c7a45", // gold that stays legible on the light paper
} as const;

/**
 * Three easing curves, chosen for real contrast (the old set was three
 * near-identical ease-outs). Mirrored as CSS variables in globals.css and as
 * GSAP ease strings in lib/animations.ts.
 *
 * - micro: crisp snap for hover/focus/tap — fast attack, controlled settle.
 * - smooth: the default reveal — expo-out, fast start then a long glide to rest.
 * - dramatic: weighty curtain/wipe — easeInOut, anticipates then settles.
 */
export const EASING = {
  /** crisp hover/focus/tap curve (120-200ms) */
  micro: [0.4, 0, 0.2, 1] as const,
  /** the default reveal — fast start, long graceful settle */
  smooth: [0.16, 1, 0.3, 1] as const,
  /** big cinematic curtain / wipe beats — heavy in-out */
  dramatic: [0.76, 0, 0.24, 1] as const,
} as const;

/** Durations in seconds (Framer/Motion + GSAP both take seconds). */
export const DURATION = {
  /** hover / focus / tap — crisp */
  micro: 0.18,
  /** quick UI transitions */
  snappy: 0.4,
  /** the standard reveal */
  standard: 0.7,
  /** big cinematic beats */
  cinematic: 1.4,
  /** the slowest, most deliberate signature beats (curtains, draws) */
  epic: 2.2,
} as const;

/** Seconds between staggered children (80ms). */
export const STAGGER = 0.08;

// ---------------------------------------------------------------------------
// Editable content
// ---------------------------------------------------------------------------

/**
 * A photo or video slot. Drop a file at `src` (under /public) and it appears;
 * while the file is missing, an elegant gradient placeholder is shown instead
 * (see components/ui/MediaFrame.tsx). For video, set type: "video" and point
 * `src` at an .mp4 (optionally a `poster` image).
 */
export interface MediaRef {
  type: "image" | "video";
  src: string;
  poster?: string;
}

export interface TimelineCard {
  date: string;
  title: string;
  description: string;
  /** Photo/video for this chapter. Drop the file at `media.src`. */
  media: MediaRef;
}

export interface LoveQuality {
  title: string;
  description: string;
  /** Photo/video revealed when the card is opened. Drop the file at media.src. */
  media: MediaRef;
}

export const CONTENT = {
  /** Name rendered in 3D in the hero. */
  name: "Lilian",

  /** Phrase revealed in the preloader intro (word-by-word). */
  intro: "uma carta pra mulher mais linda do mundo",

  /**
   * Section 0 — interactive opening gate. A short build-up, then a playful
   * "yes / still thinking" question. "Yes" celebrates and reveals the letter.
   */
  gate: {
    buildup: [
      "cada momento com você",
      "parece bom demais pra ser verdade",
      "então, antes da carta...",
    ],
    question: "quer ser minha pra sempre?",
    yes: "sim, pra sempre",
    no: "deixa eu pensar...",
    celebration: "eu já sabia.",
    celebrationSub: "deixa eu te mostrar uma coisa...",
  },

  hero: {
    subtitle: "uma carta pra você",
  },

  /** Section 2 — typewriter opening lines. Keep each line short and poetic. */
  opening: [
    "Eu não sei explicar o acaso que te colocou no meu caminho.",
    "Só sei que desde então tudo ficou um pouco mais inteiro.",
  ],

  /** Section 3 — horizontal pinned timeline. 5 cards. */
  timeline: [
    {
      date: "O começo",
      title: "Quando te vi",
      description: "Um instante que dividiu o tempo em antes e depois.",
      media: { type: "image", src: "/us/191855eb-2d8b-4675-adfb-a3bc1723aebd.jpg" },
    },
    {
      date: "Os primeiros dias",
      title: "A descoberta",
      description: "Cada conversa virava motivo pra querer a próxima.",
      media: { type: "image", src: "/us/456e0508-aaba-45a0-8f4f-51601d2d3b0b.jpg" },
    },
    {
      date: "No meio do caminho",
      title: "A certeza",
      description: "Percebi que casa não era um lugar, era você.",
      media: { type: "image", src: "/us/IMG_4239.jpg" },
    },
    {
      date: "Quando apertou",
      title: "Juntos",
      description: "A gente aprendeu que o difícil cabe quando é a dois.",
      media: { type: "image", src: "/us/286f031f-c060-4e40-85d5-80a7ae11556c.jpg" },
    },
    {
      date: "Agora",
      title: "Aqui",
      description: "E eu escolheria tudo de novo, sem pensar duas vezes.",
      media: { type: "image", src: "/us/IMG_4357.jpg" },
    },
  ] satisfies TimelineCard[],

  /** Section 4 — "what I love about you" grid. 6 cards. */
  qualities: [
    {
      title: "Seu jeito de rir",
      description: "Que desarma qualquer dia ruim em dois segundos.",
      media: { type: "image", src: "/us/c3722f14-67f2-451a-8721-73486eb889a4.jpg" },
    },
    {
      title: "Sua teimosia boa",
      description: "De não desistir das pessoas que você ama.",
      media: { type: "image", src: "/us/IMG_4555.PNG" },
    },
    {
      title: "Seu olhar",
      description: "Que entende o que eu não consigo colocar em palavras.",
      media: { type: "image", src: "/us/IMG_4554.PNG" },
    },
    {
      title: "Sua coragem",
      description: "De ser inteira mesmo quando seria mais fácil se esconder.",
      media: { type: "image", src: "/us/IMG_4024.PNG" },
    },
    {
      title: "Seu cuidado",
      description: "Nos detalhes pequenos que ninguém mais repara.",
      media: { type: "image", src: "/us/IMG_4443.jpg" },
    },
    {
      title: "Sua presença",
      description: "Que faz silêncio parecer companhia, não solidão.",
      media: { type: "image", src: "/us/AC4DD06E-773F-45B2-B5EB-66F7B5C2915E.gif" },
    },
  ] satisfies LoveQuality[],

  /** Section 5 — phrases that fade in/out over the 3D memory scene. */
  memoryPhrases: [
    "cada momento com você virou lembrança que eu guardo",
    "e as melhores ainda nem aconteceram",
  ],

  /** Section 6 — the letter. Paragraphs reveal one by one on scroll. */
  letter: {
    paragraphs: [
      "Lilian, eu comecei essa carta sem saber por onde começar, porque tudo que eu sinto por você não cabe direito em palavra nenhuma.",
      "Você chegou de um jeito silencioso e foi ocupando tudo. Hoje não existe um plano meu que não tenha você no meio dele.",
      "Obrigado por ser paciente com os meus dias difíceis, por rir das minhas bobagens e por me fazer querer ser uma pessoa melhor sem nunca me cobrar isso.",
      "Eu não preciso de um motivo grande pra te amar. Eu te amo no café da manhã, no trânsito, no cansaço, no comum. Te amo no que a vida tem de mais simples.",
    ],
    /** Shown in the signature font (Caveat), gold. */
    signature: "— seu, pra sempre",
  },

  ending: {
    title: "eu te amo, Lilian",
    backToTop: "voltar ao início",
  },

  /** Hidden message revealed by the Konami code easter egg. */
  konamiMessage:
    "você encontrou meu segredo. eu te amaria em qualquer ordem de botões.",
} as const;

// ---------------------------------------------------------------------------
// Asset paths (drop your own files here, no code change needed)
// ---------------------------------------------------------------------------

export const ASSETS = {
  /** Ambient soundtrack. Replace the file at this path to change the track. */
  audio: "/audio/ambient.mp3",
  /**
   * Photos for the memory polyhedron. 6 unique images repeated on opposite
   * faces of the dodecahedron. Until you add real files, gradient placeholders
   * are generated at runtime (see components/three/MemoryPolyhedron.tsx).
   */
  memoryPhotos: [
    "/us/72FB4F53-438F-4874-9B51-47A31B54748E.jpg",
    "/us/191855eb-2d8b-4675-adfb-a3bc1723aebd.jpg",
    "/us/456e0508-aaba-45a0-8f4f-51601d2d3b0b.jpg",
    "/us/IMG_4239.jpg",
    "/us/IMG_4357.jpg",
    "/us/IMG_4554.PNG",
  ],
} as const;

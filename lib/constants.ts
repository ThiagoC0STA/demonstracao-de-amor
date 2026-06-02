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

export const PALETTE = {
  bgPrimary: "#0A0A0B", // deep black, almost charcoal
  bgSecondary: "#14141A", // slight lift
  gold: "#D4AF7A", // champagne, not yellow
  goldBright: "#E8C896", // highlights
  textPrimary: "#F5F1EA", // warm off-white
  textSecondary: "#A8A29E", // muted
  paper: "#F2EBE0", // letter section background
  goldInk: "#9c7a45", // gold that stays legible on the light paper
} as const;

/** Cubic-bezier control points, reusable by both CSS and JS animation libs. */
export const EASING = {
  /** signature spring-out — fast start, long graceful settle. The default. */
  smooth: [0.16, 1, 0.3, 1] as const,
  /** asymmetric expressive ease-out for big cinematic curtain beats */
  dramatic: [0.22, 1, 0.36, 1] as const,
  /** crisp hover/focus/tap curve (150-200ms) */
  micro: [0.33, 1, 0.68, 1] as const,
} as const;

/** Durations in seconds (Framer/Motion + GSAP both take seconds). */
export const DURATION = {
  /** hover / focus / tap — crisp */
  micro: 0.18,
  snappy: 0.4,
  /** the standard reveal */
  standard: 0.7,
  /** big cinematic beats */
  cinematic: 1.4,
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
      media: { type: "image", src: "/images/historia-1.jpg" },
    },
    {
      date: "Os primeiros dias",
      title: "A descoberta",
      description: "Cada conversa virava motivo pra querer a próxima.",
      media: { type: "image", src: "/images/historia-2.jpg" },
    },
    {
      date: "No meio do caminho",
      title: "A certeza",
      description: "Percebi que casa não era um lugar, era você.",
      media: { type: "image", src: "/images/historia-3.jpg" },
    },
    {
      date: "Quando apertou",
      title: "Juntos",
      description: "A gente aprendeu que o difícil cabe quando é a dois.",
      media: { type: "image", src: "/images/historia-4.jpg" },
    },
    {
      date: "Agora",
      title: "Aqui",
      description: "E eu escolheria tudo de novo, sem pensar duas vezes.",
      media: { type: "image", src: "/images/historia-5.jpg" },
    },
  ] satisfies TimelineCard[],

  /** Section 4 — "what I love about you" grid. 6 cards. */
  qualities: [
    {
      title: "Seu jeito de rir",
      description: "Que desarma qualquer dia ruim em dois segundos.",
      media: { type: "image", src: "/images/voce-1.jpg" },
    },
    {
      title: "Sua teimosia boa",
      description: "De não desistir das pessoas que você ama.",
      media: { type: "image", src: "/images/voce-2.jpg" },
    },
    {
      title: "Seu olhar",
      description: "Que entende o que eu não consigo colocar em palavras.",
      media: { type: "image", src: "/images/voce-3.jpg" },
    },
    {
      title: "Sua coragem",
      description: "De ser inteira mesmo quando seria mais fácil se esconder.",
      media: { type: "image", src: "/images/voce-4.jpg" },
    },
    {
      title: "Seu cuidado",
      description: "Nos detalhes pequenos que ninguém mais repara.",
      media: { type: "image", src: "/images/voce-5.jpg" },
    },
    {
      title: "Sua presença",
      description: "Que faz silêncio parecer companhia, não solidão.",
      media: { type: "image", src: "/images/voce-6.jpg" },
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
    "/images/memory-1.jpg",
    "/images/memory-2.jpg",
    "/images/memory-3.jpg",
    "/images/memory-4.jpg",
    "/images/memory-5.jpg",
    "/images/memory-6.jpg",
  ],
} as const;

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
    question: "Quer ser minha pra sempre?",
    yes: "sim, pra sempre",
    no: "deixa eu pensar...",
    celebration: "meu coração explodiu",
    celebrationSub: "deixa eu te mostrar uma coisa...",
    contractSuccess: "contrato assinado com sucesso!",
  },

  hero: {
    subtitle: "uma carta pra você",
  },

  /** Section 2 — typewriter opening lines. Keep each line short and poetic. */
  opening: [
    "Tudo começou com um simples oi, sem aviso nenhum.",
    "E desde então tudo ficou mais inteiro, momoi.",
  ],

  /** Cosmic interlude — the signature full-bleed beat ("flutuando com você"). */
  cosmic: {
    eyebrow: "nós dois",
    line: "com você, o resto do mundo virou só paisagem",
    sub: "flutuando com você",
    media: {
      type: "image",
      src: "/us/286f031f-c060-4e40-85d5-80a7ae11556c.jpg",
    } satisfies MediaRef,
  },

  /** Section 3 — horizontal pinned timeline. 5 cards. */
  timeline: [
    {
      date: "o começo",
      title: "um oi que mudou tudo",
      description:
        "Começou com um simples oi. Quem diria que ali nascia a coisa mais importante da minha vida.",
      media: {
        type: "image",
        src: "/us/191855eb-2d8b-4675-adfb-a3bc1723aebd.jpg",
      },
    },
    {
      date: "o primeiro encontro",
      title: "o café mais horrível do mundo",
      description:
        "O café era intragável e a gente não parou de rir. Naquele mesmo dia, no god, eu te disse que te amava. E era verdade.",
      media: {
        type: "image",
        src: "/us/456e0508-aaba-45a0-8f4f-51601d2d3b0b.jpg",
      },
    },
    {
      date: "virou nós",
      title: "momoi",
      description:
        "Do nada a gente tinha um nome só nosso, um bar só nosso, um jeito de existir que ninguém de fora entende.",
      media: { type: "image", src: "/us/IMG_4239.jpg" },
    },
    {
      date: "construindo",
      title: "a casa, a Alice, a vida",
      description:
        "Te ver conquistar a sua casa e te ver com a Alice me mostrou exatamente a vida que eu quero ter pra sempre.",
      media: {
        type: "image",
        src: "/us/72FB4F53-438F-4874-9B51-47A31B54748E.jpg",
      },
    },
    {
      date: "agora",
      title: "aqui, com você",
      description:
        "E eu escolheria tudo de novo. O café ruim, o caminho inteiro, você. Sem pensar duas vezes.",
      media: { type: "image", src: "/us/IMG_4357.jpg" },
    },
  ] satisfies TimelineCard[],

  /** Section 4 — "what I love about you" grid. 6 cards. */
  qualities: [
    {
      title: "Seu olhar de louca",
      description:
        "Aquele olhar que é só meu. Me desarma e me faz rir na mesma fração de segundo.",
      media: {
        type: "image",
        src: "/us/c3722f14-67f2-451a-8721-73486eb889a4.jpg",
      },
    },
    {
      title: "Seu carinho",
      description:
        "Você é carinhosa de um jeito que transborda. Comigo, com a Alice, com tudo que você ama.",
      media: { type: "image", src: "/us/IMG_4555.PNG" },
    },
    {
      title: "Seu jeito de rir",
      description:
        "Que transformou até um café horrível no melhor primeiro dia da minha vida.",
      media: { type: "image", src: "/us/IMG_4554.PNG" },
    },
    {
      title: "Sua coragem",
      description:
        "De construir, de recomeçar, de ser mãe e mulher inteira ao mesmo tempo.",
      media: { type: "image", src: "/us/IMG_4024.PNG" },
    },
    {
      title: "Sua teimosia boa",
      description:
        "De não desistir das pessoas que você ama. Eu tenho muita sorte de ser uma delas.",
      media: { type: "image", src: "/us/IMG_4443.jpg" },
    },
    {
      title: "Sua presença",
      description:
        "Que faz qualquer lugar virar lar. Com você até o silêncio é companhia.",
      media: {
        type: "image",
        src: "/us/AC4DD06E-773F-45B2-B5EB-66F7B5C2915E.gif",
      },
    },
  ] satisfies LoveQuality[],

  /** Section 5 — phrases that fade in/out over the 3D memory scene. */
  memoryPhrases: [
    "cada momento com você virou lembrança que eu guardo com cuidado",
    "e as melhores ainda nem aconteceram, momoi",
  ],

  /** Section 6 — the letter. Paragraphs reveal one by one on scroll. */
  letter: {
    paragraphs: [
      "moi, eu já comecei essa carta umas mil vezes. Toda vez eu apago, porque nenhuma palavra parece grande o bastante pra caber tudo que eu sinto por você. Mas hoje eu decidi tentar mesmo assim, porque você merece ouvir.",
      "Tudo começou com um simples oi, sem a gente fazer ideia do que tava nascendo ali. No nosso primeiro encontro o café era horrível, e mesmo assim eu não parei de rir. Naquele mesmo dia, no god, eu te disse que te amava. Não foi pressa nem impulso: eu só já sabia. Era você. Sempre foi você.",
      "Eu amo o seu olhar de louca, aquele que é só meu, que me desarma e me faz rir na mesma fração de segundo. Amo o seu carinho, que transborda em tudo e em todo mundo que você ama. Você ama de um jeito tão inteiro que me ensinou um amor que eu nem sabia que existia.",
      "Te ver, e te ver com a Alice, é a coisa mais bonita que eu conheço. Vocês duas são o meu lugar no mundo. É olhando pra vocês que eu finalmente entendi o que a palavra lar quer dizer.",
      "Você me ensinou as duas coisas mais importantes da minha vida: que eu posso ser uma pessoa melhor, e que eu sou amado do jeito que eu sou. Eu cheguei meio quebrado e, sem fazer força nenhuma, você foi me inteirando.",
      "Então deixa eu te prometer, com todas as letras: eu quero uma vida próspera ao seu lado. Uma casa linda que seja só nossa, os nossos filhos correndo por ela, e eu, todo santo dia, escolhendo você de novo. No café ruim e no café bom, no comum e no extraordinário.",
      "Pra sempre ainda me parece pouco perto do tamanho disso que eu sinto. Mas é por aí que eu quero começar. Eu te amo, moi. Hoje, amanhã, e em todas as versões de mim que ainda vão existir.",
    ],
    /** Shown in the signature font (Caveat), gold. */
    signature: "— seu momoi, pra sempre",
  },

  ending: {
    title: "eu te amo, Lilian",
    backToTop: "voltar ao início",
  },

  /** Hidden message revealed by the Konami code easter egg. */
  konamiMessage:
    "rusbé. eu sabia que você ia achar isso, momoi. te amo até nas piadas mais sem noção que só são nossas.",
} as const;

// ---------------------------------------------------------------------------
// Asset paths (drop your own files here, no code change needed)
// ---------------------------------------------------------------------------

export const ASSETS = {
  /** Ambient soundtrack. Replace the file at this path to change the track. */
  audio: "/audio.mp3",
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

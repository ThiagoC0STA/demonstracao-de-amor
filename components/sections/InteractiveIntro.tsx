"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { mulberry32 } from "@/lib/seededRandom";
import { Starfield } from "@/components/ui/Starfield";
import { useReducedMotionPref } from "@/components/providers/ReducedMotionProvider";

/**
 * Section 0 — the gate, set in the universe. Pure CSS/JS, no animation library.
 *
 * The intro plays among the stars (same starfield as the page, drifting nebulae,
 * a shooting star). Her name assembles out of *seeded* scattered points (fixed
 * offsets → it can never "teleport"), the build-up lines fade through, then the
 * playful "quer ser minha pra sempre?" with a "No" that flees from the cursor
 * and a "Yes" that reveals the journey. Every motion is a CSS keyframe /
 * transition driven by `animation-delay`; React only flips the phase.
 */
type Phase = "intro" | "question" | "contract" | "celebrate";

const NAME_IN = 1.9; // s — name converges + settles
const NAME_HOLD = 1.0; // s — name holds before fading out
const LINE_DUR = 2.6; // s — per build-up line (in → hold → out)

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

// A flicker of sad faces rained when she tries to dodge the "no" button.
const SAD_EMOJIS = ["😢", "🥺", "😭", "😞", "🥲"];

export function InteractiveIntro({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotionPref();
  const lines = CONTENT.gate.buildup;

  const rootRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const noPos = useRef({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const signedRef = useRef(false);
  const sadId = useRef(0);
  const lastSad = useRef(0);

  const [phase, setPhase] = useState<Phase>("intro");
  const [signed, setSigned] = useState(false);
  const [sadFaces, setSadFaces] = useState<
    { id: number; x: number; y: number; r: number }[]
  >([]);
  const [simScale, setSimScale] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Seeded scatter offsets for the name letters (pure — fixed across renders).
  const letters = useMemo(() => {
    const rng = mulberry32(20260214);
    return Array.from(CONTENT.name).map((ch) => ({
      ch,
      tx: (rng() - 0.5) * 480,
      ty: (rng() - 0.5) * 360,
    }));
  }, []);

  // Seeded heart explosion — hearts shoot out from behind the words in every
  // direction and fade as they fly off (matches "Meu coração é seu").
  const burst = useMemo(() => {
    const rng = mulberry32(771);
    return Array.from({ length: 54 }, (_, i) => {
      const a = rng() * Math.PI * 2;
      const d = 280 + rng() * 720;
      return {
        id: i,
        bx: Math.cos(a) * d,
        by: Math.sin(a) * d,
        bs: 0.6 + rng() * 1.4,
        delay: rng() * 0.35,
      };
    });
  }, []);

  // intro → question: just a timer; CSS does the motion.
  useEffect(() => {
    if (phase !== "intro") return;
    const total = reduced
      ? 1400
      : Math.round((NAME_IN + NAME_HOLD + lines.length * LINE_DUR) * 1000);
    const t = setTimeout(() => setPhase("question"), total);
    return () => clearTimeout(t);
  }, [phase, reduced, lines.length]);

  const finish = () => {
    setHidden(true);
    onComplete();
  };

  // "sim, pra sempre" → play the love-contract video. Reduced motion skips
  // straight to the celebration beat (no autoplaying video). She said yes, so
  // every sad face vanishes at once.
  const handleYes = () => {
    setSadFaces([]);
    setPhase(reduced ? "celebrate" : "contract");
  };

  // Stamp the contract, hold the success message, then move on to celebrate.
  // Guarded so the video's onEnded and the "pular" button can't double-fire it.
  const sealContract = () => {
    if (signedRef.current) return;
    signedRef.current = true;
    // Stop the full-screen video decoding — it kept running behind the
    // celebration and was the thing making it stutter.
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.removeAttribute("src");
      v.load();
    }
    setSigned(true);
    window.setTimeout(() => setPhase("celebrate"), 2400);
  };

  // Entering the contract phase: play the video (the click is the gesture that
  // unlocks autoplay). If it can't play, seal it anyway so we never get stuck.
  useEffect(() => {
    if (phase !== "contract") return;
    const v = videoRef.current;
    if (!v) {
      sealContract();
      return;
    }
    v.currentTime = 0;
    // The video is muted, so this autoplays freely; the ambient track is the
    // soundtrack. If play() still fails for any reason, seal it so we never
    // get stuck on a black screen.
    v.play().catch(() => sealContract());
  }, [phase]);

  // celebrate → CSS dissolve → reveal the letter.
  useEffect(() => {
    if (phase !== "celebrate") return;
    const t = window.setTimeout(
      () => {
        if (reduced) {
          finish();
          return;
        }
        setLeaving(true); // CSS dissolve
        window.setTimeout(finish, 1100);
      },
      reduced ? 1200 : 3800,
    );
    return () => clearTimeout(t);
  }, [phase, reduced]);

  // The "No" flees away from the pointer (CSS transition smooths the jump).
  const dodge = (e?: { clientX: number; clientY: number }) => {
    const el = noRef.current;
    if (reduced || !el) return;
    const r = el.getBoundingClientRect();
    let dx = e ? r.left + r.width / 2 - e.clientX : 0;
    let dy = e ? r.top + r.height / 2 - e.clientY : 0;
    let len = Math.hypot(dx, dy);
    if (len < 8) {
      const a = Math.random() * Math.PI * 2;
      dx = Math.cos(a);
      dy = Math.sin(a);
      len = 1;
    }
    const push = 150 + Math.random() * 90;
    const limX = window.innerWidth / 2 - r.width / 2 - 24;
    const limY = window.innerHeight / 2 - r.height / 2 - 24;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const nx = clamp(noPos.current.x + (dx / len) * push, limX);
    const ny = clamp(noPos.current.y + (dy / len) * push, limY);
    noPos.current = { x: nx, y: ny };
    el.style.transform = `translate(${nx}px, ${ny}px) rotate(${(Math.random() - 0.5) * 32}deg)`;

    // Every flee drops a sad face at a random spot. They pile up and STAY
    // (never removed), always sitting *behind* the buttons via z-index — they
    // can never cover "sim, pra sempre". Each flee also nudges the "sim" button
    // a little bigger, pulling her toward the obvious answer. Throttled so one
    // tap (pointerdown + click) doesn't double-fire.
    const now = Date.now();
    if (now - lastSad.current > 200) {
      lastSad.current = now;
      const id = sadId.current++;
      setSadFaces((prev) => [
        ...prev,
        {
          id,
          x: 4 + Math.random() * 90, // vw
          y: 8 + Math.random() * 80, // vh
          r: (Math.random() - 0.5) * 30, // tilt deg
        },
      ]);
      setSimScale((s) => Math.min(s + 0.07, 2.4));
    }
  };

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[1000] overflow-hidden bg-[#050308] px-6 ${
        leaving ? "gate-leaving" : ""
      }`}
    >
      {/* continuous starfield (same seed as the page) */}
      <div className="pointer-events-none absolute inset-0">
        <Starfield />
      </div>

      {/* drifting nebulae */}
      <div className="neb-1 pointer-events-none absolute -left-1/4 top-0 h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(110,28,44,0.35),transparent_70%)] blur-2xl" />
      <div className="neb-2 pointer-events-none absolute -right-1/4 bottom-0 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(70,46,104,0.4),transparent_70%)] blur-2xl" />

      {/* shooting star + warm bloom */}
      <span className="shoot pointer-events-none absolute left-0 top-0 h-px w-40 -rotate-[28deg] bg-gradient-to-r from-transparent via-gold-bright to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(158,43,63,0.14),transparent_62%)]" />

      {/* sad faces — one rains down each time the "no" button flees */}
      {sadFaces.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          {sadFaces.map((f) => (
            <span
              key={f.id}
              className="sad-pop absolute select-none text-4xl sm:text-5xl"
              style={cssVars({ left: `${f.x}vw`, top: `${f.y}vh`, "--r": `${f.r}deg` })}
            >
              {SAD_EMOJIS[f.id % SAD_EMOJIS.length]}
            </span>
          ))}
        </div>
      )}

      {/* CONTRACT — the love-contract video, mounted early to preload, revealed
          full-screen once she says "sim, pra sempre". */}
      <video
        ref={videoRef}
        src="/contract.mp4"
        preload="auto"
        playsInline
        muted
        onEnded={sealContract}
        onError={sealContract}
        className={`absolute inset-0 z-30 h-full w-full bg-black object-cover transition-opacity duration-700 ${
          phase === "contract" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {phase === "contract" && (
        <>
          {!signed && (
            <button
              type="button"
              data-cursor
              onClick={sealContract}
              className="absolute bottom-6 right-6 z-40 rounded-md border border-cream/25 px-4 py-2 font-sans text-xs text-cream/60 transition-colors duration-200 hover:border-cream/45 hover:text-cream/90"
            >
              pular
            </button>
          )}
          {signed && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-night/55 px-6 text-center backdrop-blur-sm">
              <h1 className="rise-in max-w-[18ch] font-display text-4xl italic leading-tight tracking-display text-gold-bright sm:text-6xl">
                {CONTENT.gate.contractSuccess}
              </h1>
            </div>
          )}
        </>
      )}

      {/* INTRO */}
      {phase === "intro" && (
        <>
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center ${
              reduced ? "" : "gate-name-out"
            }`}
            style={reduced ? undefined : cssVars({ "--d": `${NAME_IN + NAME_HOLD}s` })}
          >
            <div className="text-center">
              <h1 className="font-display text-6xl italic leading-none tracking-display text-cream sm:text-8xl">
                {reduced
                  ? CONTENT.name
                  : letters.map((l, i) => (
                      <span
                        key={i}
                        className="gate-letter"
                        style={cssVars({
                          "--tx": `${l.tx}px`,
                          "--ty": `${l.ty}px`,
                          "--d": `${i * 0.05}s`,
                        })}
                      >
                        {l.ch}
                      </span>
                    ))}
              </h1>
              <span
                className="gate-rule mx-auto mt-6 block h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
                style={cssVars({ "--d": "0.6s" })}
              />
            </div>
          </div>

          {!reduced &&
            lines.map((line, i) => (
              <div
                key={i}
                className="absolute inset-0 z-20 flex items-center justify-center px-6"
              >
                <p
                  className="gate-line max-w-[20ch] text-center font-display text-3xl italic leading-tight tracking-display text-cream sm:text-5xl"
                  style={cssVars({
                    "--dur": `${LINE_DUR}s`,
                    "--d": `${NAME_IN + NAME_HOLD + i * LINE_DUR}s`,
                  })}
                >
                  {line}
                </p>
              </div>
            ))}
        </>
      )}

      {/* QUESTION */}
      {phase === "question" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-12 text-center">
          <h1 className="rise-in max-w-[16ch] font-display text-4xl italic leading-tight tracking-display text-cream sm:text-6xl">
            {CONTENT.gate.question}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <button
              type="button"
              data-cursor
              onClick={handleYes}
              className="fade-in rounded-md bg-gold px-8 py-3 font-sans text-base font-medium text-night transition-[transform,background-color] duration-300 ease-smooth hover:bg-gold-bright"
              style={cssVars({ "--d": "0.15s", transform: `scale(${simScale})` })}
            >
              {CONTENT.gate.yes}
            </button>
            <button
              ref={noRef}
              type="button"
              data-cursor
              onMouseEnter={(e) => dodge(e)}
              onPointerDown={(e) => dodge(e)}
              onFocus={() => dodge()}
              onClick={(e) => {
                e.preventDefault();
                dodge(e);
              }}
              className="fade-in rounded-md border border-cream/25 px-6 py-3 font-sans text-sm text-cream/65 transition-[transform,border-color] duration-300 ease-[var(--ease-micro)] hover:border-cream/40"
              style={cssVars({ "--d": "0.25s" })}
            >
              {CONTENT.gate.no}
            </button>
          </div>
        </div>
      )}

      {/* CELEBRATE */}
      {phase === "celebrate" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
          {!reduced && (
            <>
              {/* light shockwaves radiating out */}
              <span className="pulse-flash absolute left-1/2 top-1/2 -ml-[30vmax] -mt-[30vmax] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(255,226,170,0.4),transparent_60%)]" />
              <span
                className="pulse-flash absolute left-1/2 top-1/2 -ml-[30vmax] -mt-[30vmax] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(158,43,63,0.32),transparent_60%)]"
                style={cssVars({ "--d": "0.55s" })}
              />
              {/* hearts drifting up like confetti, behind the text */}
              <div className="pointer-events-none absolute inset-0">
                {burst.map((h) => (
                  <span
                    key={h.id}
                    className="gate-burst absolute left-1/2 top-1/2 text-gold-bright"
                    style={cssVars({
                      marginLeft: -12,
                      marginTop: -12,
                      "--bx": `${h.bx}px`,
                      "--by": `${h.by}px`,
                      "--bs": `${h.bs}`,
                      "--d": `${h.delay}s`,
                    })}
                  >
                    <HeartSvg />
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
            {/* scrim so the rising hearts never sit on the words */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vh] w-[130vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(5,3,8,0.72),transparent_66%)]"
            />
            <h1 className="rise-in font-display text-6xl italic leading-[1.05] tracking-display text-gold-bright [text-shadow:0_0_45px_rgba(229,184,116,0.45)] sm:text-8xl">
              {CONTENT.gate.celebration}
            </h1>
            <p
              className="rise-in font-display text-lg italic text-cream/75 sm:text-2xl"
              style={cssVars({ "--d": "0.3s" })}
            >
              {CONTENT.gate.celebrationSub}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function HeartSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-7-4.6-9.5-9C1 9 2.6 6 5.7 6 8 6 9.6 7.6 12 10c2.4-2.4 4-4 6.3-4C21.4 6 23 9 21.5 12 19 16.4 12 21 12 21Z" />
    </svg>
  );
}

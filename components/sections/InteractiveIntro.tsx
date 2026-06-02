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
type Phase = "intro" | "question" | "celebrate";

const NAME_IN = 1.9; // s — name converges + settles
const NAME_HOLD = 1.0; // s — name holds before fading out
const LINE_DUR = 2.6; // s — per build-up line (in → hold → out)

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

export function InteractiveIntro({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotionPref();
  const lines = CONTENT.gate.buildup;

  const rootRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const noPos = useRef({ x: 0, y: 0 });

  const [phase, setPhase] = useState<Phase>("intro");
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

  // Seeded gold heart-burst.
  const burst = useMemo(() => {
    const rng = mulberry32(771);
    return Array.from({ length: 32 }, (_, i) => {
      const a = rng() * Math.PI * 2;
      const d = 150 + rng() * 420;
      return {
        id: i,
        bx: Math.cos(a) * d,
        by: Math.sin(a) * d,
        bs: 0.5 + rng() * 1.2,
        delay: rng() * 0.25,
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

  const handleYes = () => {
    setPhase("celebrate");
    window.setTimeout(
      () => {
        if (reduced) {
          finish();
          return;
        }
        setLeaving(true); // CSS dissolve
        window.setTimeout(finish, 1100);
      },
      reduced ? 1200 : 2400,
    );
  };

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
              className="rise-in rounded-md bg-gold px-8 py-3 font-sans text-base font-medium text-night transition-colors duration-200 hover:bg-gold-bright"
              style={cssVars({ "--d": "0.15s" })}
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
              className="rise-in rounded-md border border-cream/25 px-6 py-3 font-sans text-sm text-cream/65 transition-[transform,border-color] duration-300 ease-[var(--ease-micro)] hover:border-cream/40"
              style={cssVars({ "--d": "0.25s" })}
            >
              {CONTENT.gate.no}
            </button>
          </div>
        </div>
      )}

      {/* CELEBRATE */}
      {phase === "celebrate" && (
        <>
          {!reduced && (
            <div className="pointer-events-none absolute inset-0 z-20">
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
          )}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 text-center">
            <h1 className="rise-in font-display text-5xl italic tracking-display text-gold-bright sm:text-7xl">
              {CONTENT.gate.celebration}
            </h1>
            <p
              className="rise-in font-display text-lg italic text-cream/70 sm:text-xl"
              style={cssVars({ "--d": "0.2s" })}
            >
              {CONTENT.gate.celebrationSub}
            </p>
          </div>
        </>
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

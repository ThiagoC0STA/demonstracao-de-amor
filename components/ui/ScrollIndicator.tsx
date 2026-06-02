"use client";

/**
 * Thin vertical line that draws itself downward on an infinite loop, with a
 * small caption. The drawing animation lives in globals.css (`animate-draw-down`)
 * so it is automatically neutralized under `prefers-reduced-motion`.
 */
export function ScrollIndicator({ label = "role" }: { label?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex flex-col items-center gap-3 text-muted"
    >
      <span className="text-[0.65rem] uppercase tracking-[0.3em]">{label}</span>
      <span className="relative block h-12 w-px overflow-hidden bg-gold/15">
        <span className="animate-draw-down absolute inset-0 block w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
      </span>
    </div>
  );
}

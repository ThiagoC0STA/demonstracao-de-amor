"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { InteractiveIntro } from "@/components/sections/InteractiveIntro";
import { Opening } from "@/components/sections/Opening";
import { Timeline } from "@/components/sections/Timeline";
import { WhatILove } from "@/components/sections/WhatILove";
import { Letter } from "@/components/sections/Letter";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { KonamiEasterEgg } from "@/components/ui/KonamiEasterEgg";
import { useLenis } from "@/hooks/useLenis";

// Black placeholder that reserves the section's full height while the 3D
// canvas chunk loads — prevents layout shift and keeps the dark mood.
const SceneFallback = () => <div className="h-svh w-full bg-night" />;

// 3D scenes are client-only and heavy, so they are code-split and never SSR'd.
const Hero = dynamic(
  () => import("@/components/sections/Hero").then((m) => m.Hero),
  { ssr: false, loading: SceneFallback },
);
const MemoryScene = dynamic(
  () => import("@/components/sections/MemoryScene").then((m) => m.MemoryScene),
  { ssr: false, loading: SceneFallback },
);
const Ending = dynamic(
  () => import("@/components/sections/Ending").then((m) => m.Ending),
  { ssr: false, loading: SceneFallback },
);

export default function Home() {
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  // No scroll lock. Locking via body overflow / lenis.stop() is exactly what
  // trapped users on the hero, and the preloader is a full-screen overlay so
  // nothing shows behind it anyway. We just snap back to the top once the
  // preloader finishes, in case the page drifted while it played.
  useEffect(() => {
    if (!ready) return;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [ready, lenis]);

  return (
    <>
      <InteractiveIntro onComplete={() => setReady(true)} />
      <CustomCursor />
      <AudioToggle />
      <KonamiEasterEgg />

      <main>
        <Hero />
        <Opening />
        <Timeline />
        <WhatILove />
        <MemoryScene />
        <Letter />
        <Ending />
      </main>
    </>
  );
}

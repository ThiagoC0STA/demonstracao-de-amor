"use client";

import { useEffect, useState } from "react";
import { InteractiveIntro } from "@/components/sections/InteractiveIntro";
import { Opening } from "@/components/sections/Opening";
import { Timeline } from "@/components/sections/Timeline";
import { CosmicInterlude } from "@/components/sections/CosmicInterlude";
import { WhatILove } from "@/components/sections/WhatILove";
import { MemoryScene } from "@/components/sections/MemoryScene";
import { Letter } from "@/components/sections/Letter";
import { Ending } from "@/components/sections/Ending";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { KonamiEasterEgg } from "@/components/ui/KonamiEasterEgg";
import { Starfield } from "@/components/ui/Starfield";
import { useLenis } from "@/hooks/useLenis";

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
      <Starfield />
      <InteractiveIntro onComplete={() => setReady(true)} />
      <CustomCursor />
      <AudioToggle />
      <KonamiEasterEgg />

      <main className="relative z-10">
        <Opening />
        <Timeline />
        <CosmicInterlude />
        <WhatILove />
        <MemoryScene />
        <Letter />
        <Ending />
      </main>
    </>
  );
}

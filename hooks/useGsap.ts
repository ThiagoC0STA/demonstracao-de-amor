"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins exactly once, on the client. Importing this module anywhere
// guarantees ScrollTrigger + the useGSAP integration are available.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// Re-export so components import the GSAP toolkit from one place. `useGSAP`
// scopes selectors and auto-reverts all GSAP work on unmount (no leaked tweens
// or ScrollTriggers), which matters for a single-page app with heavy timelines.
export { gsap, ScrollTrigger, useGSAP };

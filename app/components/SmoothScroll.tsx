"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchPointer = window.matchMedia("(pointer: coarse)");

    if (reducedMotion.matches || touchPointer.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: 0, duration: 1.15 },
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}

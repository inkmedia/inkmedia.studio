"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchPointer = window.matchMedia("(pointer: coarse)");

    if (reducedMotion.matches || touchPointer.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: 0, duration: 0.8 },
      lerp: 0.14,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.05,
    });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // Let Next.js handle section links, including links to another page.
    if (window.location.hash) return;

    // Clear any wheel momentum as well as the browser's scroll position.
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

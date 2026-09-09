"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

const TRANSITION_DURATION = 1.05;

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const stage = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const transitioning = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (transitioning.current) return;

      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      const currentPage = document.querySelector<HTMLElement>("body > main");
      if (!currentPage || !stage.current) {
        router.push(nextUrl);
        return;
      }

      const frozenPage = currentPage.cloneNode(true) as HTMLElement;
      frozenPage.setAttribute("aria-hidden", "true");
      frozenPage.classList.add("page-transition-frozen");
      frozenPage.style.top = `${-window.scrollY}px`;

      stage.current.replaceChildren(frozenPage);
      stage.current.style.display = "block";
      if (loader.current) {
        loader.current.hidden = false;
        gsap.set(loader.current, { opacity: 1 });
      }
      currentPage.inert = true;
      currentPage.setAttribute("aria-busy", "true");
      document.body.classList.add("page-is-transitioning");
      transitioning.current = true;
      router.push(nextUrl);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useLayoutEffect(() => {
    if (!transitioning.current || !stage.current) return;

    const incomingPage = document.querySelector<HTMLElement>("body > main");
    const outgoingPage = stage.current.firstElementChild as HTMLElement | null;
    if (!incomingPage || !outgoingPage) return;
    const parallaxContent = incomingPage.querySelector<HTMLElement>(
      ".title-page-hero h1, .hero-content h1",
    );

    gsap.killTweensOf(incomingPage);
    gsap.killTweensOf(outgoingPage);

    incomingPage.inert = true;
    incomingPage.setAttribute("aria-busy", "true");
    const finish = () => {
        if (stage.current) {
          stage.current.replaceChildren();
          stage.current.style.display = "none";
        }
        gsap.set(incomingPage, {
          clearProps:
            "transform,transformOrigin,filter,position,zIndex,willChange",
        });
        if (parallaxContent) {
          gsap.set(parallaxContent, { clearProps: "transform,willChange" });
        }
        document.body.classList.remove("page-is-transitioning");
        incomingPage.inert = false;
        incomingPage.removeAttribute("aria-busy");
        if (loader.current) loader.current.hidden = true;
        transitioning.current = false;
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = gsap.timeline({
      paused: true,
      onComplete: finish,
    });

    // Wait for the actual stroke animation, not a wall-clock estimate: route
    // compilation can delay the browser's first animation frame.
    const logoAnimations = loader.current?.querySelector("path")?.getAnimations() ?? [];
    void Promise.all(logoAnimations.map((animation) => animation.finished.catch(() => undefined)))
      .then(() => {
        timeline.play();
      });

    if (reduceMotion) {
      timeline.call(finish);
      return;
    }

    if (loader.current) {
      timeline.to(loader.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0);
    }

    timeline
      .fromTo(
        incomingPage,
        {
          y: window.innerHeight * 0.85,
          rotation: 0,
          scale: 0.82,
          // Use the visible viewport center, even on long pages like Home.
          transformOrigin: `50% ${window.innerHeight / 2}px`,
          position: "relative",
          zIndex: 2001,
          willChange: "transform",
        },
        {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: TRANSITION_DURATION,
          ease: "power3.inOut",
        },
        0.08,
      )
      .to(
        outgoingPage,
        {
          y: -24,
          rotation: 0,
          scale: 0.9,
          filter: "blur(8px)",
          opacity: 0,
          transformOrigin: `50% ${-parseFloat(outgoingPage.style.top || "0") + window.innerHeight / 2}px`,
          duration: 0.85,
          ease: "power2.inOut",
          willChange: "transform, filter, opacity",
        },
        0,
      );

    if (parallaxContent) {
      timeline.fromTo(
        parallaxContent,
        { y: 72, willChange: "transform" },
        { y: 0, duration: 1.15, ease: "power3.out" },
        0.18,
      );
    }
  }, [pathname]);

  return (
    <>
    <div ref={stage} className="page-transition-stage" aria-hidden="true" />
    <div ref={loader} className="route-loader" hidden role="status" aria-live="polite">
      <svg viewBox="170 210 660 580" aria-hidden="true" className="route-loader-logo">
        <path pathLength="1" d="M499 231 L810 769 L629 768 L501 556 L370 768 L192 768 Z" />
      </svg>
      <span className="sr-only">Loading page</span>
    </div>
    </>
  );
}

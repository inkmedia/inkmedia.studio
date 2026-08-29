"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

const TRANSITION_DURATION = 0.82;

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const stage = useRef<HTMLDivElement>(null);
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

      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
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
        (url.pathname === window.location.pathname &&
          url.search === window.location.search)
      ) {
        return;
      }

      event.preventDefault();
      if (transitioning.current) return;

      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        router.push(nextUrl);
        return;
      }

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
      document.body.classList.add("page-is-transitioning");
      transitioning.current = true;
      router.push(nextUrl);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  useLayoutEffect(() => {
    if (!transitioning.current || !stage.current) return;

    const incomingPage = document.querySelector<HTMLElement>("body > main");
    const outgoingPage = stage.current.firstElementChild as HTMLElement | null;
    if (!incomingPage || !outgoingPage) return;

    window.scrollTo(0, 0);
    gsap.killTweensOf(incomingPage);
    gsap.killTweensOf(outgoingPage);

    const timeline = gsap.timeline({
      onComplete: () => {
        if (stage.current) {
          stage.current.replaceChildren();
          stage.current.style.display = "none";
        }
        gsap.set(incomingPage, {
          clearProps:
            "transform,transformOrigin,filter,position,zIndex,willChange",
        });
        document.body.classList.remove("page-is-transitioning");
        transitioning.current = false;
      },
    });

    timeline
      .fromTo(
        incomingPage,
        {
          y: -158,
          rotation: -2.35,
          scale: -1,
          transformOrigin: "50% 50%",
          filter: "brightness(0.78)",
          position: "relative",
          zIndex: 1999,
          willChange: "transform, filter",
        },
        {
          y: 0,
          rotation: 0,
          scale: 1,
          filter: "brightness(1)",
          duration: TRANSITION_DURATION,
          ease: "power3.out",
        },
        0,
      )
      .to(
        outgoingPage,
        {
          y: window.innerHeight * 1.12,
          rotation: 2.65,
          scale: 1.015,
          transformOrigin: "50% 0%",
          duration: TRANSITION_DURATION,
          ease: "power3.inOut",
          willChange: "transform",
        },
        0,
      );
  }, [pathname]);

  return (
    <div ref={stage} className="page-transition-stage" aria-hidden="true" />
  );
}

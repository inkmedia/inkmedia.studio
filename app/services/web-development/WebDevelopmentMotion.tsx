"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function WebDevelopmentMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let context: gsap.Context | undefined;
    let started = false;

    // Establish the concealed state before the destination is painted. The
    // timeline itself waits until the global route transition has finished.
    gsap.set(".wd-hero-line-inner", { yPercent: 115 });
    gsap.set(".wd-hero-copy > *", { opacity: 0, y: 18 });
    gsap.set(".wd-image-curtain", { scaleY: 1, transformOrigin: "bottom" });
    gsap.set(".wd-hero-image img", { scale: 1.08 });
    gsap.set(".wd-scroll", { opacity: 0 });

    const start = () => {
      if (started) return;
      started = true;
      context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .to(".wd-hero-line-inner", { yPercent: 0, duration: 1.05, stagger: 0.11 }, 0.08)
        .to(".wd-hero-copy > *", { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.46)
        .to(".wd-image-curtain", { scaleY: 0, duration: 1.15 }, 0.5)
        .to(".wd-hero-image img", { scale: 1, duration: 1.5 }, 0.5)
        .to(".wd-scroll", { opacity: 1, duration: 0.5 }, 1.1);

      gsap.utils.toArray<HTMLElement>("[data-wd-reveal]").forEach((section) => {
        const targets = section.querySelectorAll<HTMLElement>(".wd-section-label, h2, article, .wd-problem-grid>div, .wd-tags, .wd-work-head>a, .wd-accordion");
        gsap.fromTo(targets.length ? targets : section,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.055, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 82%", once: true } },
        );
      });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const observer = new MutationObserver(() => {
      if (!document.body.classList.contains("page-is-transitioning")) {
        observer.disconnect();
        requestAnimationFrame(start);
      }
    });
    if (document.body.classList.contains("page-is-transitioning")) {
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    } else {
      requestAnimationFrame(start);
    }

    return () => {
      observer.disconnect();
      context?.revert();
      // Never clear all inline properties on next/image: its fill layout is
      // implemented with required inline position and sizing declarations.
      gsap.set(".wd-hero-line-inner", { clearProps: "transform" });
      gsap.set(".wd-hero-copy > *", { clearProps: "opacity,transform" });
      gsap.set(".wd-image-curtain", { clearProps: "transform,transformOrigin" });
      gsap.set(".wd-hero-image img", { clearProps: "transform" });
      gsap.set(".wd-scroll", { clearProps: "opacity" });
    };
  }, []);

  return null;
}

"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AmarCaseMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: gsap.Context | undefined;
    let started = false;
    gsap.set(".amar-hero-line-inner", { yPercent: 115 });
    gsap.set(".amar-hero-intro > *, .amar-kicker", { opacity: 0, y: 18 });
    gsap.set(".amar-image-curtain", { scaleY: 1, transformOrigin: "bottom" });
    gsap.set(".amar-hero-media img", { scale: 1.08 });

    const start = () => {
      if (started) return;
      started = true;
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power4.out" } })
          .to(".amar-hero-line-inner", { yPercent: 0, duration: 1.05, stagger: 0.11 }, 0.08)
          .to(".amar-hero-intro > *, .amar-kicker", { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.4)
          .to(".amar-image-curtain", { scaleY: 0, duration: 1.15 }, 0.5)
          .to(".amar-hero-media img", { scale: 1, duration: 1.5 }, 0.5);
        gsap.utils.toArray<HTMLElement>("[data-amar-reveal]").forEach((section) => {
          const targets = section.querySelectorAll<HTMLElement>(".amar-section-label, h2, article, .amar-overview-grid>div, .amar-challenge-grid>div, .amar-approach-head>p, .amar-showcase-image, .amar-showcase-card, .amar-outcome-grid>p, .amar-next-actions");
          gsap.fromTo(targets.length ? targets : section, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.055, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 82%", once: true } });
        });
        const outcomeSignals = document.querySelector<HTMLElement>(".amar-outcome-signals");
        if (outcomeSignals) {
          const signals = outcomeSignals.querySelectorAll<HTMLElement>("li");
          gsap.set(outcomeSignals, { "--outcome-line-progress": "0%" });
          gsap.set(signals, { opacity: 0, y: 16 });
          gsap.timeline({ scrollTrigger: { trigger: outcomeSignals, start: "top 86%", once: true } })
            .to(outcomeSignals, { "--outcome-line-progress": "100%", duration: 1.15, ease: "steps(32)" })
            .to(signals, { opacity: 1, y: 0, duration: 0.7, stagger: 0.26, ease: "power3.out" }, 0.65);
        }
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const observer = new MutationObserver(() => {
      if (!document.body.classList.contains("page-is-transitioning")) { observer.disconnect(); requestAnimationFrame(start); }
    });
    if (document.body.classList.contains("page-is-transitioning")) observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    else requestAnimationFrame(start);
    return () => {
      observer.disconnect(); context?.revert();
      gsap.set(".amar-hero-line-inner", { clearProps: "transform" });
      gsap.set(".amar-hero-intro > *, .amar-kicker", { clearProps: "opacity,transform" });
      gsap.set(".amar-image-curtain", { clearProps: "transform,transformOrigin" });
      gsap.set(".amar-hero-media img", { clearProps: "transform" });
    };
  }, []);
  return null;
}

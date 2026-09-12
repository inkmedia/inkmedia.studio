"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { RollingText } from "../components/RollingText";
import MagneticDots from "../services/web-development/MagneticDots";
import FeaturedCaseStudies from "./FeaturedCaseStudies";

import { projects, wrap, type GalleryPosition } from "./gallery-data";

const Gallery = dynamic(() => import("./CurvedGallery"), { ssr: false });
const ease = [0.16, 1, 0.3, 1] as const;

class GalleryBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function CaseStudiesHero() {
  const [position, setPosition] = useState<GalleryPosition>({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [lightHeader, setLightHeader] = useState(false);
  const reducedMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const index = wrap(position.x + position.y * 2, projects.length);
  const project = projects[index];
  const navigate = useCallback((x: number, y: number) => {
    setPosition((previous) => ({ x: previous.x + x, y: previous.y + y }));
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setReady(false), []);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    const reveal = () => {
      if (document.body.classList.contains("page-is-transitioning")) return;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      firstFrame = requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
        secondFrame = requestAnimationFrame(() => setEntered(true));
      });
    };
    const observer = new MutationObserver(reveal);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    reveal();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const heroHeight = document.querySelector<HTMLElement>(".case-hero")?.offsetHeight ?? window.innerHeight;
      setLightHeader(window.scrollY >= heroHeight - 100);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!ready || reducedMotion || focused) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      if (document.hidden) return;
      timer = setTimeout(() => {
        // Every neighbor shows a different project, including diagonal moves.
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]];
        const [x, y] = directions[Math.floor(Math.random() * directions.length)];
        navigate(x, y);
      }, 5000);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [position, ready, reducedMotion, focused, navigate]);

  return (
    <main className={`case-page${lightHeader ? " is-light-header" : ""}`} id="top">
      <div className="site-page case-page-content">
        <SiteHeader />
        <section className={`case-hero${ready ? " is-ready" : ""}${entered ? " is-entered" : ""}`} aria-label="Case studies"
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        <div
          className="case-gallery"
          role="region"
          aria-roledescription="carousel"
          aria-label="Project gallery. Click a surrounding image to explore."
        >
          <div className="case-gallery-fallback" aria-hidden="true">
            <Image src={project.image} alt="" fill sizes="(max-width: 600px) 60vw, 35vw" priority />
          </div>
          <GalleryBoundary onError={onError}>
            <Gallery position={position} entered={entered} reducedMotion={!!reducedMotion} onReady={onReady}
              onSelect={navigate} />
          </GalleryBoundary>
        </div>

        <div className="case-focus" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="sr-only" aria-live={focused ? "polite" : "off"} aria-atomic="true">
          {project.name} — {project.category}
        </div>
        <div className="case-project-links" aria-label="Select a project">
          {projects.map((item, projectIndex) => (
            <button key={item.name} onClick={() => navigate(projectIndex - index, 0)}
              aria-current={projectIndex === index ? "true" : undefined}>
              {item.name}
            </button>
          ))}
        </div>
        <div className="case-hero-bottom">
          <div className="case-heading">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: .7, delay: .35, ease }}
            >
              [ SELECTED WORK ]
            </motion.p>
            <h1 aria-label="Ideas made real. Impact that lasts.">
              <span className="case-title-mask">
                <motion.span
                  initial={reducedMotion ? false : { y: "110%" }}
                  animate={entered ? { y: 0 } : { y: "110%" }}
                  transition={{ duration: 1, delay: .12, ease }}
                >
                  Ideas made real.
                </motion.span>
              </span>
              <span className="case-title-mask">
                <motion.span
                  initial={reducedMotion ? false : { y: "110%" }}
                  animate={entered ? { y: 0 } : { y: "110%" }}
                  transition={{ duration: 1, delay: .22, ease }}
                >
                  Impact that lasts.
                </motion.span>
              </span>
            </h1>
          </div>
          <motion.p
            className="case-bottom-label"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: .7, delay: .55, ease }}
          >
            Strategy. Design. Development.
          </motion.p>
        </div>
        </section>
        <FeaturedCaseStudies />
        <section className="case-closing" aria-labelledby="case-closing-title">
        <MagneticDots />
        <p className="case-closing-label">LET’S WORK TOGETHER</p>
        <div className="case-closing-grid">
          <h2 id="case-closing-title">Have a project with similar challenges?</h2>
          <div>
            <p>See how the same thinking could apply to your website or digital platform.</p>
            <a className="section-cta swap-trigger" href="/contact">
              <RollingText>[ START A PROJECT → ]</RollingText>
            </a>
          </div>
        </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

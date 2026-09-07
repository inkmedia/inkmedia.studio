"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone } from "lucide-react";
import { RollingText as SwapText } from "./RollingText";

import { ParticleLogo } from "./ParticleLogo";

const ease = [0.16, 1, 0.3, 1] as const;

export function SiteHeader({ loading = false }: { loading?: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useMotionValue(0);
  const reveal = useMotionValue(1);
  const wasHidden = useRef(false);
  const reducedMotion = useReducedMotion();
  const clipId = useId();
  const wordOpacity = useTransform(progress, [0, 0.55, 1], [1, 0, 0]);
  const capTransform = useTransform(progress, (value) => {
    const p = reducedMotion ? (value === 1 ? 1 : 0) : value;
    const scale = 1 + p * 6.76;
    return `translate(${14.475 + p * 8.525}px, ${7.79 + p * 1.21}px) scale(${scale}) translate(-14.475px, -7.79px)`;
  });
  const capFill = useTransform(reveal, [0, 0.65, 1], [0, 0, 1]);
  const capStroke = useTransform(reveal, [0, 0.8, 1], [1, 1, 0]);
  const draw = useTransform(reveal, [0, 0.75, 1], [0, 1, 1]);

  useEffect(() => {
    const returning = wasHidden.current && !hidden;
    wasHidden.current = hidden;
    reveal.set(1);
    if (!returning || reducedMotion || progress.get() < 1) return;

    reveal.set(0);
    const drawing = animate(reveal, 1, { duration: 0.85, delay: 0.12, ease: "easeInOut" });
    const unsubscribe = progress.on("change", (value) => {
      if (value < 1) {
        drawing.stop();
        reveal.set(1);
      }
    });
    return () => {
      drawing.stop();
      unsubscribe();
    };
  }, [hidden, progress, reducedMotion, reveal]);

  useEffect(() => {
    let previous = window.scrollY;
    let distance = 0;
    let direction = 0;
    let frame = 0;
    let previousTime = performance.now();
    let completedAt: number | null = null;
    const update = () => {
      frame = 0;
      const now = performance.now();
      const elapsed = Math.min(now - previousTime, 32);
      previousTime = now;
      const y = Math.max(0, window.scrollY);
      const target = loading ? 0 : Math.min(1, Math.max(0, (y - 20) / 580));
      // Let the solid cap finish emerging even when a fast scroll skips the transition range.
      const current = progress.get();
      const next = reducedMotion ? target : Math.min(target, current + elapsed / 450);
      progress.set(next);
      if (next < 1) completedAt = null;
      else if (completedAt === null) completedAt = now;
      if (next !== target) frame = requestAnimationFrame(update);
      setScrolled(y > 20);
      const delta = y - previous;
      const nextDirection = Math.sign(delta);
      if (nextDirection && nextDirection !== direction) distance = 0;
      if (nextDirection) direction = nextDirection;
      distance += delta;
      if (loading || y <= 600 || completedAt === null || now - completedAt < 350) {
        setHidden(false);
        distance = 0;
      } else if (Math.abs(distance) >= 12) {
        setHidden(direction > 0);
        distance = 0;
      }
      previous = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [loading, progress, reducedMotion]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: -12 },
    animate: loading ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  });

  return (
    <header className={`nav shell${hidden ? " nav-hidden" : ""}${scrolled ? " nav-scrolled" : ""}`} onFocusCapture={() => setHidden(false)}>
      <motion.a
        className="wordmark"
        href="/"
        aria-label="Ink Media home"
        {...enter(0.05)}
      >
        <svg viewBox="0 0 60 46" width="60" height="46" aria-hidden="true">
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="11.5" width="60" height="34.5" />
            </clipPath>
          </defs>
          <motion.g style={{ opacity: wordOpacity }} clipPath={`url(#${clipId})`}>
            <image href="/ink-logo.png" x="7" y="0" width="46" height="46" style={{ filter: "brightness(0.1)" }} />
          </motion.g>
          <motion.g style={{ color: "var(--red)", transform: capTransform, originX: 0, originY: 0, transformBox: "view-box" }}>
            <motion.path
              d="M14.475 7.79 L16.52 11.33 L15.28 11.33 L14.475 9.98 L13.655 11.33 L12.405 11.33 Z"
              fill="currentColor"
              style={{ fillOpacity: reducedMotion ? 1 : capFill }}
            />
            <motion.path
              d="M14.475 7.79 L16.52 11.33 L15.28 11.33 L14.475 9.98 L13.655 11.33 L12.405 11.33 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.14"
              strokeLinejoin="round"
              style={{ pathLength: draw, opacity: reducedMotion ? 0 : capStroke }}
            />
          </motion.g>
        </svg>
      </motion.a>
      <nav aria-label="Primary navigation">
        <motion.a
          className="swap-trigger"
          href="/case-studies"
          {...enter(0.12)}
        >
          <SwapText>CASE STUDIES</SwapText>
        </motion.a>
        <motion.a className="swap-trigger" href="/services" {...enter(0.19)}>
          <SwapText>SERVICES</SwapText>
        </motion.a>
        <motion.a className="swap-trigger" href="/about" {...enter(0.26)}>
          <SwapText>ABOUT</SwapText>
        </motion.a>
      </nav>
      <motion.a
        className="nav-contact swap-trigger"
        href="/contact"
        {...enter(0.33)}
      >
        <SwapText>[ START A PROJECT ]</SwapText>
      </motion.a>
    </header>
  );
}

function ProjectDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const panelEl = panel.current;
    const shadeEl = shade.current;
    if (!panelEl || !shadeEl) return;

    if (open) {
      document.body.classList.add("drawer-open");
      gsap.set(shadeEl, { display: "block" });
      gsap
        .timeline()
        .to(shadeEl, { opacity: 1, duration: 0.35, ease: "power2.out" })
        .fromTo(
          panelEl,
          { yPercent: 105 },
          { yPercent: 0, duration: 0.85, ease: "power4.out" },
          0,
        );
    } else {
      document.body.classList.remove("drawer-open");
      gsap
        .timeline({ onComplete: () => gsap.set(shadeEl, { display: "none" }) })
        .to(panelEl, { yPercent: 105, duration: 0.62, ease: "power3.inOut" })
        .to(shadeEl, { opacity: 0, duration: 0.3 }, 0.18);
    }
  }, [open]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div ref={shade} className="project-shade" aria-hidden={!open}>
      <button
        className="project-shade-dismiss"
        type="button"
        onClick={onClose}
        aria-label="Close project enquiry"
      />
      <div
        ref={panel}
        className="project-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Start a project"
      >
        <div className="project-drawer-head">
          <span>[ NEW PROJECT ENQUIRY ]</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project enquiry"
          >
            CLOSE ×
          </button>
        </div>
        <div className="project-drawer-grid">
          <div className="project-drawer-title">
            <h2>
              LET’S BUILD
              <br />
              SOMETHING
              <br />
              <em>MEMORABLE.</em>
            </h2>
            <p>
              Tell us where you want to go. We’ll come back with the clearest
              route forward.
            </p>
          </div>
          <form onSubmit={submit} aria-label="Start a project enquiry">
            <div className="form-row">
              <input
                required
                name="name"
                autoComplete="name"
                placeholder="Your name"
                aria-label="Your name"
              />
              <input
                required
                name="company"
                autoComplete="organization"
                placeholder="Company"
                aria-label="Company"
              />
            </div>
            <div className="form-row">
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
                aria-label="Email address"
              />
              <input
                name="country"
                autoComplete="country-name"
                placeholder="Country"
                aria-label="Country"
              />
            </div>
            <div className="form-row">
              <select
                name="projectType"
                defaultValue=""
                aria-label="Project type"
              >
                <option value="" disabled>
                  Select project type
                </option>
                <option>New website</option>
                <option>Website redesign</option>
                <option>UX/UI design</option>
                <option>Development partner</option>
                <option>SEO & optimisation</option>
              </select>
              <select
                name="budget"
                defaultValue=""
                aria-label="Estimated budget"
              >
                <option value="" disabled>
                  Select budget
                </option>
                <option>₹2L – ₹5L</option>
                <option>₹5L – ₹10L</option>
                <option>₹10L+</option>
                <option>Let’s discuss</option>
              </select>
            </div>
            <textarea
              required
              name="summary"
              rows={2}
              placeholder="Tell us about your project"
              aria-label="Tell us about your project"
            />
            <button type="submit">
              {sent
                ? "[ THANK YOU — WE’LL BE IN TOUCH ]"
                : "[ SEND PROJECT ENQUIRY ↗ ]"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const footer = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        ".footer-reveal-inner",
        { y: -90, opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footer.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
    }, footer);
    return () => context.revert();
  }, []);

  useEffect(() => {
    const openDrawer = () => setDrawerOpen(true);
    window.addEventListener("open-project-drawer", openDrawer);
    return () => window.removeEventListener("open-project-drawer", openDrawer);
  }, []);

  return (
    <>
      <footer ref={footer} id="contact" className="site-footer">
        <div className="footer-reveal-inner shell">
          <div className="footer-kicker">
            <span>[ HAVE A PROJECT IN MIND? ]</span>
            <span>PUNE / WORLDWIDE</span>
          </div>
          <button
            className="footer-cta"
            type="button"
            onClick={() => setDrawerOpen(true)}
          >
            <span>START A</span>
            <span>PROJECT</span>
            <i>↗</i>
          </button>
          <div className="footer-columns">
            <div className="footer-brand">
              <Link
                className="footer-logo"
                href="/"
                aria-label="Ink Media home"
              >
                <ParticleLogo />
              </Link>
            </div>
            <div>
              <span>IMP LINKS</span>
              <Link className="swap-trigger" href="/">
                <SwapText>Home</SwapText>
              </Link>
              <a className="swap-trigger" href="/case-studies">
                <SwapText>Case Studies</SwapText>
              </a>
              <a className="swap-trigger" href="/services">
                <SwapText>Services</SwapText>
              </a>
              <a className="swap-trigger" href="/about">
                <SwapText>About</SwapText>
              </a>
              <a className="swap-trigger" href="/contact">
                <SwapText>Contact</SwapText>
              </a>
            </div>
            <div>
              <span>GET IN TOUCH</span>
              <a className="footer-contact-item swap-trigger" href="mailto:contact@inkmedia.in">
                <Mail aria-hidden="true" />
                <SwapText>contact@inkmedia.in</SwapText>
              </a>
              <a className="footer-contact-item swap-trigger" href="tel:+919158310192">
                <Phone aria-hidden="true" />
                <SwapText>+91 91583 10192</SwapText>
              </a>
              <address className="footer-contact-item">
                <MapPin aria-hidden="true" />
                <span>Hari Krupa, Rasta Peth,<br />Pune - 4110102</span>
              </address>
            </div>
            <div>
              <span>FOLLOW US</span>
              <a
                className="swap-trigger"
                href="https://www.linkedin.com/company/ink-media-digital/"
                target="_blank"
                rel="noreferrer"
              >
                <SwapText>LinkedIn ↗</SwapText>
              </a>
              <a
                className="swap-trigger"
                href="https://www.instagram.com/inkdigitalmedia/"
                target="_blank"
                rel="noreferrer"
              >
                <SwapText>Instagram ↗</SwapText>
              </a>
              <a
                className="swap-trigger"
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
              >
                <SwapText>Facebook ↗</SwapText>
              </a>
              <a
                className="swap-trigger"
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
              >
                <SwapText>Twitter ↗</SwapText>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} INK MEDIA</span>
            <Link className="swap-trigger" href="/">
              <SwapText>BACK TO TOP ↑</SwapText>
            </Link>
          </div>
        </div>
      </footer>
      <ProjectDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RollingText as SwapText } from "./RollingText";

const ease = [0.16, 1, 0.3, 1] as const;

export function SiteHeader({ loading = false }: { loading?: boolean }) {
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: -12 },
    animate: loading ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  });

  return (
    <header className="nav shell">
      <motion.a
        className="wordmark"
        href="/"
        aria-label="Ink Media home"
        {...enter(0.05)}
      >
        <img src="/ink-logo.png" alt="Ink Media" width="3375" height="3375" />
      </motion.a>
      <nav aria-label="Primary navigation">
        <motion.a className="swap-trigger" href="#" {...enter(0.12)}>
          <SwapText>CASE STUDIES</SwapText>
        </motion.a>
        <motion.a className="swap-trigger" href="#" {...enter(0.19)}>
          <SwapText>SERVICES</SwapText>
        </motion.a>
        <motion.a className="swap-trigger" href="#" {...enter(0.26)}>
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
                className="wordmark footer-logo"
                href="/"
                aria-label="Back to top"
              >
                <img
                  src="/ink-logo.png"
                  alt="Ink Media"
                  width="3375"
                  height="3375"
                />
              </Link>
              <p>CREATIVE WEB STUDIO.</p>
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
              <a className="swap-trigger" href="mailto:contact@inkmedia.in">
                <SwapText>contact@inkmedia.in</SwapText>
              </a>
              <a className="swap-trigger" href="tel:+919158310192">
                <SwapText>+91 91583 10192</SwapText>
              </a>
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

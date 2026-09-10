"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { SiteHeader } from "../components/SiteChrome";
import "./services.css";

const services = [
  { title: "Web Strategy", lines: ["Web", "Strategy"], image: "/work/house-of-memories.jpg", color: "#cce7ce", href: "/contact", label: "Clarity before creativity" },
  { title: "UX/UI Design", lines: ["UX/UI", "Design"], image: "/work/majestique.webp", color: "#f8e8bd", href: "/contact", label: "Designed around people" },
  { title: "Web Development", lines: ["Web", "Development"], image: "/work/tejraj.webp", color: "#f2cecc", href: "/services/web-development", label: "Built to perform" },
  { title: "Redesign, Commerce & Optimisation", lines: ["Redesign, Commerce", "& Optimisation"], image: "/work/kiara.webp", color: "#cbdcf6", href: "/contact", label: "Room to grow" },
  { title: "Digital Marketing", lines: ["Digital", "Marketing"], image: "/work/goel-ganga.jpg", color: "#e3d2ee", href: "/contact", label: "Ideas that find an audience" },
];
const copies = [-1, 0, 1];

export default function ServicesPage() {
  const gallery = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const move = useRef<(direction: number) => void>(() => {});

  useEffect(() => {
    const page = gallery.current?.closest<HTMLElement>(".services-page");
    if (!page || document.body.classList.contains("page-is-transitioning")) return;
    let finishTimer = 0;
    const startFrame = requestAnimationFrame(() => {
      page.classList.remove("services-page--pending", "services-page--done");
      void page.offsetWidth;
      page.classList.add("services-page--entering");
      finishTimer = window.setTimeout(() => {
        page.classList.remove("services-page--entering");
        page.classList.add("services-page--done");
      }, 1050);
    });
    return () => {
      window.clearTimeout(finishTimer);
      cancelAnimationFrame(startFrame);
    };
  }, []);

  useEffect(() => {
    const element = gallery.current;
    if (!element) return;
    const cards = [...element.querySelectorAll<HTMLElement>(".service-card")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = element.clientWidth <= 700 ? -0.5 : 0;
    let position = target;
    let frame = 0;
    let previousTime = 0;
    let width = element.clientWidth;
    let pointer: { id: number; x: number; y: number; dragged: boolean } | null = null;
    let suppressClick = false;
    const spacing = () => width * (width <= 700 ? 0.60 : 0.24);

    function paint() {
      if (reduced.matches) return;
      cards.forEach((card) => {
        const index = Number(card.dataset.index);
        const copy = Number(card.dataset.copy);
        // Wrap each service outside the viewport; extra copies keep both edges continuous.
        const count = services.length;
        const slot = ((index - position + count + 0.5) % count + count) % count - Math.floor(count / 2) + copy * count;
        const x = slot * spacing();
        const normalized = x / width;
        const y = normalized * normalized * width * 0.55;
        const angle = normalized * 38;
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`;
      });
    }
    function tick(time: number) {
      const dt = previousTime ? Math.min(time - previousTime, 40) : 16;
      previousTime = time;
      position += (target - position) * (1 - Math.exp(-dt / 105));
      paint();
      if (Math.abs(target - position) > 0.0001) frame = requestAnimationFrame(tick);
      else { position = target; paint(); frame = 0; previousTime = 0; }
    }
    function update(delta: number) {
      if (reduced.matches) return;
      target += delta;
      if (!frame) frame = requestAnimationFrame(tick);
    }
    move.current = update;
    function wheel(event: WheelEvent) {
      if (reduced.matches || event.ctrlKey) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element!.clientHeight : 1;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      update(Math.max(-width, Math.min(width, delta * unit)) / spacing());
    }
    function down(event: PointerEvent) {
      if (reduced.matches || event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
      suppressClick = false;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false };
    }
    let hovered: HTMLElement | null = null;
    function resetHover() {
      if (!hovered) return;
      hovered.style.setProperty("--tilt-x", "0deg");
      hovered.style.setProperty("--tilt-y", "0deg");
      hovered.removeAttribute("data-hovered");
      hovered = null;
    }
    function pointerMove(event: PointerEvent) {
      const card = (event.target as HTMLElement).closest<HTMLElement>(".service-card");
      if (hovered !== card || pointer) resetHover();
      if (card && !pointer && event.pointerType === "mouse" && !reduced.matches) {
        hovered = card;
        const bounds = card.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
        card.style.setProperty("--tilt-x", `${-y * 12}deg`);
        card.style.setProperty("--tilt-y", `${x * 16}deg`);
        card.style.setProperty("--shine-x", `${(x + 1) * 50}%`);
        card.style.setProperty("--shine-y", `${(y + 1) * 50}%`);
        card.dataset.hovered = "true";
      }
      if (cursor.current) {
        cursor.current.style.transform = `translate(${event.clientX + 18}px, ${event.clientY + 18}px)`;
        cursor.current.dataset.visible = event.pointerType === "mouse" && !(event.target as HTMLElement).closest("button") ? "true" : "false";
      }
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = pointer.x - event.clientX;
      const dy = pointer.y - event.clientY;
      if (!pointer.dragged && Math.hypot(dx, dy) < 6) return;
      pointer.dragged = true;
      suppressClick = true;
      if (!element!.hasPointerCapture(event.pointerId)) element!.setPointerCapture(event.pointerId);
      update((Math.abs(dx) >= Math.abs(dy) ? dx : dy) / spacing());
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }
    function up() { pointer = null; }
    function leave() { resetHover(); if (cursor.current) cursor.current.dataset.visible = "false"; }
    function click(event: MouseEvent) {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
    }
    function key(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (reduced.matches) return;
      event.preventDefault();
      update(event.key === "ArrowRight" ? 1 : -1);
    }
    function focus(event: FocusEvent) {
      const card = (event.target as HTMLElement).closest<HTMLElement>(".service-card");
      if (!card || reduced.matches || !card.matches(":focus-visible")) return;
      const index = Number(card.dataset.index);
      const count = services.length;
      const nearest = index - 0.5 + Math.round((target - index + 0.5) / count) * count;
      target = position = nearest;
      paint();
    }
    const resize = new ResizeObserver(() => { width = element.clientWidth; paint(); });
    resize.observe(element);
    reduced.addEventListener("change", paint);
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", pointerMove);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("click", click, true);
    element.addEventListener("keydown", key);
    element.addEventListener("focusin", focus);
    paint();
    return () => {
      resetHover();
      cancelAnimationFrame(frame);
      resize.disconnect();
      reduced.removeEventListener("change", paint);
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", pointerMove);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("click", click, true);
      element.removeEventListener("keydown", key);
      element.removeEventListener("focusin", focus);
      move.current = () => {};
    };
  }, []);

  return (
    <main className="services-page services-page--pending" id="top">
      <SiteHeader />
      <section ref={gallery} className="services-gallery" aria-labelledby="services-heading" aria-roledescription="carousel" data-lenis-prevent>
        <div className="services-glow" aria-hidden="true" />
        <div className="services-cards">
          {copies.flatMap((copy) => services.map((service, index) => (
            <a
              key={`${copy}-${index}`}
              className={`service-card${copy !== 0 ? " service-card-copy" : ""}`}
              data-index={index}
              data-copy={copy}
              href={service.href}
              aria-label={`Learn more about ${service.title}`}
              aria-hidden={copy !== 0 ? true : undefined}
              tabIndex={copy !== 0 ? -1 : 0}
              style={{
                "--service-color": service.color,
                "--initial-slot": index - 0.5 + copy * services.length,
                "--card-enter-delay": `${index * 90}ms`,
              } as CSSProperties}
              draggable={false}
            >
              <div className="service-card-surface">
              <div className="service-card-image">
                <Image src={service.image} alt="" fill sizes="(max-width: 700px) 50vw, 20vw" loading="eager" draggable={false} />
              </div>
              <div className="service-card-caption">
                <h2>{service.lines.map((line) => <span key={line}>{line}</span>)}</h2>
                <span className="service-card-number">0{index + 1}</span>
                <div className="service-card-meta">
                  <p>{service.label}</p>
                  <span className="service-card-learn">Learn more <span aria-hidden="true">↗</span></span>
                </div>
              </div>
              </div>
            </a>
          )))}
        </div>
        <div className="services-intro">
          <h1 id="services-heading" aria-label="Our expertise">
            <span aria-hidden="true">Our</span>
            <span aria-hidden="true">expertise</span>
          </h1>
          <p className="services-scroll-hint"><span className="services-desktop-hint">Scroll to see all</span><span className="services-touch-hint">Swipe to explore</span></p>
          <div className="services-controls" aria-label="Service carousel controls">
            <button type="button" onClick={() => move.current(-1)} aria-label="Previous service">←</button>
            <span>EXPLORE OUR SERVICES</span>
            <button type="button" onClick={() => move.current(1)} aria-label="Next service">→</button>
          </div>
        </div>
        <span ref={cursor} className="services-cursor" aria-hidden="true">Keep scrolling</span>
      </section>
    </main>
  );
}

"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { BrainCircuit, Gauge, PenTool } from "lucide-react";
import Preloader from "./components/Preloader";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

const DepthGallery = lazy(() => import("./components/DepthGallery"));
const HeroIcon3D = lazy(() => import("./components/HeroIcon3D"));

const projects = [
  {
    name: "TEJRAJ",
    type: "REAL ESTATE / WEB DESIGN & DEVELOPMENT",
    image: "/work/tejraj.webp",
    code: "P–01",
    website: "https://tejraj.in/",
  },
  {
    name: "GOEL GANGA",
    type: "PROPERTY / DIGITAL EXPERIENCE",
    image: "/work/goel-ganga.jpg",
    code: "P–02",
    website: "https://goelganga.com/",
  },
  {
    name: "HOUSE OF MEMORIES",
    type: "HOSPITALITY / BRAND WEBSITE",
    image: "/work/house-of-memories.jpg",
    code: "P–03",
    website: "https://houseofmemories.in/",
  },
  {
    name: "KIARA LIFESPACES",
    type: "REAL ESTATE / WEBSITE DEVELOPMENT",
    image: "/work/kiara.webp",
    code: "P–04",
    website: "https://kiaralifespaces.com/",
  },
];

const capabilities = [
  ["01", "WEB STRATEGY", "POSITIONING / CONTENT / CONVERSION"],
  ["02", "UX / UI DESIGN", "USER FLOWS / SYSTEMS / INTERACTION"],
  ["03", "WEB DEVELOPMENT", "NEXT.JS / CMS / MOTION / PERFORMANCE"],
  ["04", "WEBSITE REDESIGN", "REPOSITION / REBUILD / RELAUNCH"],
  ["05", "SEO & OPTIMISATION", "TECHNICAL SEO / SPEED / GROWTH"],
];

const chapters = [
  [
    "01",
    "STRATEGY",
    "We deep-dive into your brand, goals and audience to find the clearest route forward.",
  ],
  [
    "02",
    "UX / UI",
    "We turn that clarity into a distinct, intuitive experience where every detail earns its place.",
  ],
  [
    "03",
    "DEVELOPMENT",
    "Clean code, responsive systems and purposeful motion bring the experience to life.",
  ],
  [
    "04",
    "GROWTH",
    "We refine performance, search visibility and conversion after the website enters the world.",
  ],
];

const testimonials = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  label: index === 0 ? "KIARA LIFESPACES" : `CLIENT ${index + 1}`,
  quote:
    "INK MEDIA IS ALWAYS RESPONSIVE, AVAILABLE AND VERY EASY TO WORK WITH. DISCUSSING IDEAS AND PLANNING WITH THEM IS ENJOYABLE.",
  name: "ALPANA KIRLOSKAR",
  company: "KIARA LIFESPACES",
  image: "/alpana-kirloskar.jpg",
}));

const ease = [0.16, 1, 0.3, 1] as const;

const heroStates = [
  { label: "[ OPTIMISED ]", image: "/work/tejraj.webp" },
  { label: "[ RESPONSIVE ]", image: "/work/goel-ganga.jpg" },
  { label: "[ HIGH PERFORMANCE ]", image: "/work/house-of-memories.jpg" },
  { label: "[ PIXEL PRECISE ]", image: "/work/kiara.webp" },
  { label: "[ CONTENT ]", image: "/work/tejraj.webp" },
  { label: "[ SEO ]", image: "/work/goel-ganga.jpg" },
  { label: "[ ACCESSIBLE ]", image: "/work/house-of-memories.jpg" },
];

const insights = [
  {
    number: "01",
    date: "JAN 31, 2026",
    readTime: "4 MIN READ",
    title: "DOES YOUR COMPANY NEED DIGITAL MARKETING?",
    excerpt:
      "A practical look at when digital marketing becomes essential—and how it helps businesses stay visible, relevant and competitive.",
    image: "/blogs/company-needs-digital-marketing.jpg",
    href: "https://inkmedia.in/blogs/does-your-company-need-digital-marketing/",
  },
  {
    number: "02",
    date: "JAN 30, 2026",
    readTime: "4 MIN READ",
    title: "PERFORMANCE MARKETING FOR LEAD GENERATION",
    excerpt:
      "A clear framework for turning Google and Meta campaigns into a measurable, repeatable lead-generation system.",
    image: "/blogs/performance-marketing-leads.jpg",
    href: "https://inkmedia.in/blogs/performance-marketing-for-lead-generation/",
  },
  {
    number: "03",
    date: "JAN 30, 2026",
    readTime: "5 MIN READ",
    title: "LOCAL SEO FOR SMALL BUSINESSES",
    excerpt:
      "A practical guide to improving local visibility, reaching nearby customers and turning high-intent searches into business.",
    image: "/blogs/local-seo-small-businesses.jpg",
    href: "https://inkmedia.in/blogs/local-seo-for-small-businesses/",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function TextSwap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`text-swap ${className}`}>
      <span className="text-swap-line">{children}</span>
      <span className="text-swap-line" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 50 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % testimonials.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [reduce]);

  const testimonial = testimonials[active];

  return (
    <section
      className="quote"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="quote-label shell">
        <span>[ CLIENT PERSPECTIVE ]</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={testimonial.label}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
          >
            {testimonial.label}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="quote-inner shell" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="quote-slide"
            key={active}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18 }}
            transition={{ duration: reduce ? 0.2 : 0.55, ease }}
          >
            <blockquote>
              <span className="sr-only">“{testimonial.quote}”</span>
              <span className="quote-words" aria-hidden="true">
                {testimonial.quote.split(" ").map((word, index) => (
                  <motion.span
                    className="quote-word"
                    key={`${word}-${index}`}
                    initial={reduce ? false : { opacity: 0, y: "0.65em" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.65,
                      delay: reduce ? 0 : Math.min(index * 0.025, 0.75),
                      ease,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </blockquote>
            <motion.div
              className="quote-credit"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.5, ease }}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                width="285"
                height="230"
                loading="lazy"
              />
              <p>
                {testimonial.name}
                <br />
                <span>{testimonial.company}</span>
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="quote-controls" aria-label="Choose testimonial">
          {testimonials.map((item, index) => (
            <button
              type="button"
              className={`swap-trigger ${index === active ? "is-active" : ""}`}
              onClick={() => setActive(index)}
              aria-label={`Show testimonial ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              key={item.id}
            >
              <TextSwap>{String(index + 1).padStart(2, "0")}</TextSwap>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const studioPoints = [
  {
    number: "01",
    title: "THINKING FIRST",
    text: "We get close to your brand, audience and ambition before deciding what the website needs to become.",
  },
  {
    number: "02",
    title: "DESIGN WITH INTENT",
    text: "We shape a distinct digital experience where clarity, character and every interaction have a reason to exist.",
  },
  {
    number: "03",
    title: "BUILT TO PERFORM",
    text: "We bring it to life with clean development, purposeful motion and the performance to keep your brand moving.",
  },
];

const studioIcons = [BrainCircuit, PenTool, Gauge];

function AboutStudio() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const cardOneY = useTransform(scrollYProgress, [0.02, 0.24], ["108%", "0%"]);
  const cardTwoY = useTransform(scrollYProgress, [0.31, 0.53], ["108%", "0%"]);
  const cardThreeY = useTransform(scrollYProgress, [0.6, 0.82], ["108%", "0%"]);
  const cardY = [cardOneY, cardTwoY, cardThreeY];

  return (
    <section id="studio" className="studio" ref={ref}>
      <div className="studio-sticky shell">
        <div className="studio-copy">
          <span>[ ABOUT INK MEDIA ]</span>
          <h2>DIGITAL HOMES FOR BRANDS WITH SOMEWHERE IMPORTANT TO GO.</h2>
          <p>
            With over 20 years of combined experience, Ink Media has partnered
            with incredible clients to deliver impactful results and create
            compelling websites that resonate.
          </p>
          <a className="section-cta swap-trigger" href="#contact">
            <TextSwap>[ MEET YOUR DIGITAL TEAM ↗ ]</TextSwap>
          </a>
        </div>
        <div className="studio-cards" aria-label="How Ink Media works">
          {studioPoints.map((point, index) =>
            (() => {
              const StudioIcon = studioIcons[index];
              return (
                <motion.article
                  className={`studio-card studio-card-${index + 1}`}
                  style={{ y: cardY[index] }}
                  key={point.number}
                >
                  <div className="studio-card-top">
                    <span>[ {point.number} / 03 ]</span>
                    <span>INK MEDIA ↗</span>
                  </div>
                  <div className="studio-card-icon" aria-hidden="true">
                    <StudioIcon strokeWidth={1.25} />
                  </div>
                  <div className="studio-card-copy">
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </div>
                </motion.article>
              );
            })(),
          )}
        </div>
      </div>
    </section>
  );
}

function DepthWork() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileProject, setMobileProject] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileProject === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileProject(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileProject]);

  const selectedProject =
    mobileProject === null ? null : projects[mobileProject];

  return (
    <section
      id="work"
      className={`work depth-work ${reduce ? "is-reduced" : ""}`}
      ref={ref}
    >
      {mounted && !reduce && (
        <Suspense
          fallback={<div className="depth-stage depth-stage-loading" />}
        >
          <DepthGallery
            projects={projects}
            activeIndex={activeIndex}
            progress={scrollYProgress}
            onIndexChange={setActiveIndex}
          />
        </Suspense>
      )}
      <div className="mobile-projects shell">
        <div className="mobile-work-head">
          <span>[ SELECTED WORK / 04 ]</span>
          <h2>
            BUILT TO BE
            <br />
            REMEMBERED.
          </h2>
        </div>
        <div className="mobile-project-grid">
          {projects.map((project, index) => (
            <button
              className="mobile-project swap-trigger"
              type="button"
              key={project.name}
              onClick={() => setMobileProject(index)}
              aria-label={`View ${project.name} project details`}
            >
              <img
                src={project.image}
                alt={`${project.name} website project by Ink Media`}
                width="1920"
                height="1080"
                loading="lazy"
              />
              <div>
                <span>{project.code}</span>
                <h3>
                  <TextSwap>{project.name}</TextSwap>
                </h3>
                <p>{project.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedProject && mobileProject !== null && (
          <motion.div
            className="mobile-project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileProject(null)}
          >
            <motion.article
              className="mobile-project-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedProject.name} project details`}
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.42, ease }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="mobile-modal-close"
                type="button"
                onClick={() => setMobileProject(null)}
                aria-label="Close project details"
              >
                ×
              </button>
              <img
                src={selectedProject.image}
                alt={`${selectedProject.name} website project`}
              />
              <div className="mobile-modal-copy">
                <span>{selectedProject.code} / SELECTED WORK</span>
                <h3>{selectedProject.name}</h3>
                <p>{selectedProject.type}</p>
                <div className="mobile-modal-meta">
                  <span>
                    STRATEGY, INTERFACE,
                    <br />
                    AND DEVELOPMENT
                  </span>
                  <a
                    className="swap-trigger"
                    href={selectedProject.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TextSwap>
                      VISIT WEBSITE <Arrow />
                    </TextSwap>
                  </a>
                </div>
              </div>
              <div className="mobile-modal-nav">
                <button
                  type="button"
                  onClick={() =>
                    setMobileProject(
                      (mobileProject - 1 + projects.length) % projects.length,
                    )
                  }
                  aria-label="Previous project"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMobileProject((mobileProject + 1) % projects.length)
                  }
                  aria-label="Next project"
                >
                  →
                </button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const heroX = useMotionValue(0);
  const heroY = useMotionValue(0);
  const heroSmoothX = useSpring(heroX, { stiffness: 260, damping: 30 });
  const heroSmoothY = useSpring(heroY, { stiffness: 260, damping: 30 });
  const [clock, setClock] = useState("—");
  const [heroActive, setHeroActive] = useState(2);
  const [heroHover, setHeroHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileHero, setMobileHero] = useState(false);
  const heroTravel = useRef({
    x: 0,
    y: 0,
    distance: 0,
    lastChange: 0,
    ready: false,
  });

  useEffect(() => {
    setMounted(true);
    const mobileQuery = window.matchMedia(
      "(max-width: 900px), (pointer: coarse)",
    );
    const updateMobileHero = () => setMobileHero(mobileQuery.matches);
    updateMobileHero();
    mobileQuery.addEventListener("change", updateMobileHero);
    const updateClock = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => {
      window.clearInterval(timer);
      mobileQuery.removeEventListener("change", updateMobileHero);
    };
  }, []);

  useEffect(() => {
    if (!mobileHero || loading) return;
    const rotation = window.setInterval(
      () => setHeroActive((active) => (active + 1) % heroStates.length),
      1900,
    );
    return () => window.clearInterval(rotation);
  }, [loading, mobileHero]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ink Media",
    url: "https://inkmedia.in/",
    email: "contact@inkmedia.in",
    telephone: "+91 91583 10192",
    sameAs: [
      "https://www.linkedin.com/company/ink-media-digital/",
      "https://www.instagram.com/inkdigitalmedia/",
    ],
  };


  function moveHero(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    if (localY <= 88) {
      setHeroHover(false);
      return;
    }
    setHeroHover(true);
    heroX.set(localX);
    heroY.set(localY);

    const travel = heroTravel.current;
    if (!travel.ready) {
      travel.x = localX;
      travel.y = localY;
      travel.ready = true;
      return;
    }

    travel.distance += Math.hypot(localX - travel.x, localY - travel.y);
    travel.x = localX;
    travel.y = localY;

    const now = performance.now();
    if (travel.distance >= 180 && now - travel.lastChange >= 650) {
      travel.distance = 0;
      travel.lastChange = now;
      setHeroActive((active) => (active + 1) % heroStates.length);
    }
  }

  function leaveHero() {
    setHeroHover(false);
    heroTravel.current.ready = false;
    heroTravel.current.distance = 0;
    heroTravel.current.lastChange = 0;
  }

  function heroStagger(delay: number, y = -12) {
    if (reduce) return {};
    return {
      initial: { opacity: 0, y },
      animate: loading ? { opacity: 0, y } : { opacity: 1, y: 0 },
      transition: { duration: 0.65, delay, ease },
    };
  }

  return (
    <main>
      {loading && mounted && <Preloader onComplete={() => setLoading(false)} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="site-page">
      <SiteHeader loading={loading} />

      <section
        id="top"
        className={`hero ${heroHover ? "is-tracking" : ""}`}
        onPointerMove={moveHero}
        onPointerLeave={leaveHero}
      >
        <div className="hero-rail shell">
          <motion.span {...heroStagger(0.4)}>CREATIVE WEB STUDIO</motion.span>
          <motion.span {...heroStagger(0.47)}>PUNE / WORLDWIDE</motion.span>
          <motion.span {...heroStagger(0.54)}>IST — {clock}</motion.span>
        </div>
        {mounted && !loading && (
          <Suspense fallback={null}>
            <HeroIcon3D reducedMotion={Boolean(reduce)} />
          </Suspense>
        )}
        <motion.div
          className="hero-cross hero-cross-v"
          style={{ x: heroSmoothX }}
          aria-hidden="true"
        />
        <motion.div
          className="hero-cross hero-cross-h"
          style={{ y: heroSmoothY }}
          aria-hidden="true"
        />
        {!mobileHero && (
          <motion.div
            className="hero-follow"
            style={{ x: heroSmoothX, y: heroSmoothY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: heroHover ? 1 : 0 }}
            transition={{ duration: 0.14 }}
            aria-hidden="true"
          >
            <div className="hero-follow-inner">
              <div
                className="hero-follow-image"
                style={{ position: "relative" }}
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={heroActive}
                    src={heroStates[heroActive].image}
                    alt=""
                    width="1920"
                    height="1080"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.24, ease }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      animation: "none",
                    }}
                  />
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={heroActive}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.16 }}
                >
                  {heroStates[heroActive].label}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        {mobileHero && (
          <motion.button
            type="button"
            className="hero-mobile-capability"
            onClick={() =>
              setHeroActive((active) => (active + 1) % heroStates.length)
            }
            initial={reduce ? undefined : { opacity: 0, scale: 0.94, y: 12 }}
            animate={
              loading
                ? { opacity: 0, scale: 0.94, y: 12 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.7, delay: 0.45, ease }}
            aria-label={`Current capability: ${heroStates[heroActive].label.replaceAll("[", "").replaceAll("]", "")}. Tap for next.`}
          >
            <div
              className="hero-mobile-image"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3.1",
                overflow: "hidden",
              }}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={heroActive}
                  src={heroStates[heroActive].image}
                  alt=""
                  width="390"
                  height="252"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 0.78, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.32, ease }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={heroActive}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {heroStates[heroActive].label}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
        <p className="sr-only">
          Interactive project preview showing optimised, responsive,
          high-performance, pixel-precise, content, SEO and accessible web
          experiences.
        </p>
        <h1 aria-label="Websites built to make ambitious brands impossible to ignore">
          <span className="hero-mask">
            <motion.b
              initial={reduce ? undefined : { y: "110%" }}
              animate={reduce ? undefined : { y: loading ? "110%" : 0 }}
              transition={{ duration: 1, ease }}
            >
              WEBSITES BUILT TO MAKE
            </motion.b>
          </span>
          <span className="hero-mask hero-line-middle">
            <motion.b
              initial={reduce ? undefined : { y: "110%" }}
              animate={reduce ? undefined : { y: loading ? "110%" : 0 }}
              transition={{ duration: 1, delay: 0.08, ease }}
            >
              AMBITIOUS BRANDS
            </motion.b>
          </span>
          <span className="hero-mask hero-line-last">
            <motion.b
              initial={reduce ? undefined : { y: "110%" }}
              animate={reduce ? undefined : { y: loading ? "110%" : 0 }}
              transition={{ duration: 1, delay: 0.16, ease }}
            >
              IMPOSSIBLE TO IGNORE
            </motion.b>
          </span>
        </h1>
        <div className="hero-bottom shell">
          <motion.span {...heroStagger(0.65, 12)}>INK MEDIA</motion.span>
          <motion.span {...heroStagger(0.72, 12)}>
            CURRENT TIME: {clock} IST
          </motion.span>
          <motion.a
            className="swap-trigger"
            href="#work"
            {...heroStagger(0.79, 12)}
          >
            <TextSwap>SCROLL TO EXPLORE ↓</TextSwap>
          </motion.a>
        </div>
      </section>

      <section className="statement">
        <div className="statement-meta shell">
          <span>[ STORY / 01 ]</span>
          <span>WHAT WE BELIEVE</span>
        </div>
        <div className="statement-marquee" aria-hidden="true">
          <span>
            ENGINEERING IMMERSIVE WEB EXPERIENCES — ENGINEERING IMMERSIVE WEB
            EXPERIENCES —{" "}
          </span>
        </div>
        <Reveal className="statement-copy shell">
          <p>THE RIGHT WEBSITE IS MORE THAN A WEBSITE.</p>
          <h2>
            IT’S YOUR BRAND’S
            <br />
            <span>BEST INTRODUCTION.</span>
          </h2>
        </Reveal>
      </section>

      <section className="journey">
        <div className="journey-sticky">
          <span>[ FROM IDEA TO IMPACT ]</span>
          <h2>
            ONE CONTINUOUS
            <br />
            DIGITAL STORY.
          </h2>
          <p>
            A website isn’t just a platform—it’s where your brand takes shape
            online. It sets the tone, builds trust and creates the right first
            impression.
          </p>
        </div>
        <div className="chapters">
          {chapters.map(([no, title, text], i) => (
            <Reveal className="chapter" delay={i * 0.03} key={no}>
              <span>{no}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <i>↘</i>
            </Reveal>
          ))}
        </div>
      </section>

      <DepthWork />

      <section id="services" className="services">
        <div className="services-head shell">
          <span>[ CAPABILITIES / 05 ]</span>
          <h2>
            DESIGN FIRST.
            <br />
            DEVELOPMENT
            <br />
            WITHOUT COMPROMISE.
          </h2>
        </div>
        <div className="service-list shell">
          {capabilities.map(([no, title, detail]) => (
            <a className="service swap-trigger" href="#contact" key={no}>
              <span>[ {no} ]</span>
              <h3>
                <TextSwap>{title}</TextSwap>
              </h3>
              <p>{detail}</p>
              <i>↗</i>
            </a>
          ))}
        </div>
      </section>

      <AboutStudio />

      <TestimonialSlider />

      <section className="insights shell">
        <motion.div
          className="insights-head"
          initial={reduce ? undefined : { opacity: 0, y: -12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.65, ease }}
        >
          <span>[ IDEAS / OBSERVATIONS ]</span>
          <div className="insights-title-row">
            <h2>
              BUILDING DIGITAL.
              <br />
              THINKING BEYOND.
            </h2>
            <motion.a
              className="section-cta swap-trigger insights-cta"
              href="https://inkmedia.in/blogs/"
              target="_blank"
              rel="noreferrer"
              initial={reduce ? undefined : { opacity: 0, y: -12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.65, delay: 0.16, ease }}
            >
              <TextSwap>[ EXPLORE MORE BLOGS ↗ ]</TextSwap>
            </motion.a>
          </div>
        </motion.div>
        <div className="article-list">
          {insights.map((article, index) => (
            <motion.a
              className="swap-trigger"
              href={article.href}
              key={article.href}
              target="_blank"
              rel="noreferrer"
              initial={reduce ? undefined : { opacity: 0, y: -12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.65, delay: 0.12 + index * 0.09, ease }}
            >
              <div className="article-image">
                <img src={article.image} alt="" width="1200" height="675" />
                <span className="article-number">[ {article.number} ]</span>
              </div>
              <div className="article-copy">
                <div className="article-meta">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <h3>
                  <TextSwap>{article.title}</TextSwap>
                </h3>
                <p>{article.excerpt}</p>
                <span className="article-link">
                  <TextSwap>READ ARTICLE</TextSwap> <i>↗</i>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      </div>
      <SiteFooter />
    </main>
  );
}

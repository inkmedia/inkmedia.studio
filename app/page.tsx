"use client";

import { FormEvent, lazy, Suspense, useEffect, useRef, useState } from "react";
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

function Arrow() {
  return <span aria-hidden="true">↗</span>;
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
          <a href="#contact">[ MEET YOUR DIGITAL TEAM ↗ ]</a>
        </div>
        <div className="studio-cards" aria-label="How Ink Media works">
          {studioPoints.map((point, index) => (
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
            })()
          ))}
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

  const selectedProject = mobileProject === null ? null : projects[mobileProject];

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
            className="mobile-project"
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
              <h3>{project.name}</h3>
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
              initial={{ opacity: 0, y: 32, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: .98 }}
              transition={{ duration: .42, ease }}
              onClick={(event) => event.stopPropagation()}
            >
              <button className="mobile-modal-close" type="button" onClick={() => setMobileProject(null)} aria-label="Close project details">×</button>
              <img src={selectedProject.image} alt={`${selectedProject.name} website project`} />
              <div className="mobile-modal-copy">
                <span>{selectedProject.code} / SELECTED WORK</span>
                <h3>{selectedProject.name}</h3>
                <p>{selectedProject.type}</p>
                <div className="mobile-modal-meta">
                  <span>STRATEGY, INTERFACE,<br />AND DEVELOPMENT</span>
                  <a href={selectedProject.website} target="_blank" rel="noopener noreferrer">VISIT WEBSITE <Arrow /></a>
                </div>
              </div>
              <div className="mobile-modal-nav">
                <button type="button" onClick={() => setMobileProject((mobileProject - 1 + projects.length) % projects.length)} aria-label="Previous project">←</button>
                <button type="button" onClick={() => setMobileProject((mobileProject + 1) % projects.length)} aria-label="Next project">→</button>
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
  const [sent, setSent] = useState(false);
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

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

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
      <header className="nav shell" onPointerEnter={leaveHero}>
        <motion.a
          className="wordmark"
          href="#top"
          aria-label="Ink Media home"
          {...heroStagger(0.05)}
        >
          <img src="/ink-logo.png" alt="Ink Media" width="3375" height="3375" />
        </motion.a>
        <nav aria-label="Primary navigation">
          <motion.a href="#work" {...heroStagger(0.12)}>
            WORK
          </motion.a>
          <motion.a href="#services" {...heroStagger(0.19)}>
            SERVICES
          </motion.a>
          <motion.a href="#studio" {...heroStagger(0.26)}>
            ABOUT
          </motion.a>
        </nav>
        <motion.a
          className="nav-contact"
          href="#contact"
          {...heroStagger(0.33)}
        >
          [ START A PROJECT ]
        </motion.a>
      </header>

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
          <motion.a href="#work" {...heroStagger(0.79, 12)}>
            SCROLL TO EXPLORE ↓
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
            <a className="service" href="#contact" key={no}>
              <span>[ {no} ]</span>
              <h3>{title}</h3>
              <p>{detail}</p>
              <i>↗</i>
            </a>
          ))}
        </div>
      </section>

      <AboutStudio />

      {/* <section className="quote">
        <div className="quote-label shell">
          <span>[ CLIENT PERSPECTIVE ]</span>
          <span>KIARA LIFESPACES</span>
        </div>
        <Reveal className="quote-inner shell">
          <blockquote>
            “INK MEDIA IS ALWAYS RESPONSIVE, AVAILABLE AND VERY EASY TO WORK
            WITH. DISCUSSING IDEAS AND PLANNING WITH THEM IS ENJOYABLE.”
          </blockquote>
          <div>
            <img
              src="/alpana-kirloskar.jpg"
              alt="Alpana Kirloskar"
              width="285"
              height="230"
              loading="lazy"
            />
            <p>
              ALPANA KIRLOSKAR
              <br />
              <span>KIARA LIFESPACES</span>
            </p>
          </div>
        </Reveal>
      </section> */}

      {/* <section className="insights shell">
        <div className="insights-head">
          <span>[ IDEAS / OBSERVATIONS ]</span>
          <h2>
            BUILDING DIGITAL.
            <br />
            THINKING BEYOND.
          </h2>
        </div>
        <div className="article-list">
          <a href="https://inkmedia.in/blogs/the-future-of-digital-marketing/">
            <span>01 / PERSPECTIVE</span>
            <h3>THE FUTURE OF DIGITAL MARKETING</h3>
            <p>
              Explore the latest trends shaping the digital marketing
              landscape...
            </p>
            <i>↗</i>
          </a>
          <a href="https://inkmedia.in/blogs/ai-in-web-development/">
            <span>02 / TECHNOLOGY</span>
            <h3>AI IN WEB DEVELOPMENT</h3>
            <p>
              How AI is revolutionizing web development and user experience...
            </p>
            <i>↗</i>
          </a>
        </div>
      </section> */}

      {/* <section id="contact" className="contact">
        <div className="contact-title shell">
          <span>[ START A PROJECT ]</span>
          <h2>
            YOU’VE BUILT A BRAND
            <br />
            WORTH REMEMBERING.
            <br />
            <b>LET’S BUILD ITS HOME.</b>
          </h2>
        </div>
        <div className="contact-grid shell">
          <div className="contact-direct">
            <span>[ DIRECT CONTACT ]</span>
            <a href="mailto:contact@inkmedia.in">CONTACT@INKMEDIA.IN ↗</a>
            <a href="tel:+919158310192">+91 91583 10192</a>
            <p>
              <i /> TAKING ON SELECT PROJECTS
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
              rows={3}
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
        <footer className="footer shell">
          <a className="wordmark" href="#top" aria-label="Back to top">
            <img
              src="/ink-logo.png"
              alt="Ink Media"
              width="3375"
              height="3375"
            />
          </a>
          <div>
            <a href="https://www.linkedin.com/company/ink-media-digital/">
              LINKEDIN
            </a>
            <a href="https://www.instagram.com/inkdigitalmedia/">INSTAGRAM</a>
          </div>
          <span>© 2026 INK MEDIA</span>
          <a href="#top">BACK TO TOP ↑</a>
        </footer>
      </section> */}
    </main>
  );
}

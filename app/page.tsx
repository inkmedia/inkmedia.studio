"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, MotionValue, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const projects = [
  { name: "TEJRAJ", type: "REAL ESTATE / WEB DESIGN & DEVELOPMENT", image: "/work/tejraj.webp", code: "P–01" },
  { name: "GOEL GANGA", type: "PROPERTY / DIGITAL EXPERIENCE", image: "/work/goel-ganga.jpg", code: "P–02" },
  { name: "HOUSE OF MEMORIES", type: "HOSPITALITY / BRAND WEBSITE", image: "/work/house-of-memories.jpg", code: "P–03" },
  { name: "KIARA LIFESPACES", type: "REAL ESTATE / WEBSITE DEVELOPMENT", image: "/work/kiara.webp", code: "P–04" },
];

const capabilities = [
  ["01", "WEB STRATEGY", "POSITIONING / CONTENT / CONVERSION"],
  ["02", "UX / UI DESIGN", "USER FLOWS / SYSTEMS / INTERACTION"],
  ["03", "WEB DEVELOPMENT", "NEXT.JS / CMS / MOTION / PERFORMANCE"],
  ["04", "WEBSITE REDESIGN", "REPOSITION / REBUILD / RELAUNCH"],
  ["05", "SEO & OPTIMISATION", "TECHNICAL SEO / SPEED / GROWTH"],
];

const chapters = [
  ["01", "STRATEGY", "We deep-dive into your brand, goals and audience to find the clearest route forward."],
  ["02", "UX / UI", "We turn that clarity into a distinct, intuitive experience where every detail earns its place."],
  ["03", "DEVELOPMENT", "Clean code, responsive systems and purposeful motion bring the experience to life."],
  ["04", "GROWTH", "We refine performance, search visibility and conversion after the website enters the world."],
];

const ease = [0.16, 1, 0.3, 1] as const;

const heroStates = [
  { label: "[ OPTIMISED ]", image: "/work/tejraj.webp" },
  { label: "[ RESPONSIVE ]", image: "/work/goel-ganga.jpg" },
  { label: "[ HIGH PERFORMANCE ]", image: "/work/house-of-memories.jpg" },
  { label: "[ PIXEL PRECISE ]", image: "/work/kiara.webp" },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? undefined : { opacity: 0, y: 50 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: .8, delay, ease }}>{children}</motion.div>;
}

function DepthCard({ project, index, progress }: { project: (typeof projects)[number]; index: number; progress: MotionValue<number> }) {
  const total = projects.length;
  const center = .08 + index * (.84 / (total - 1));
  const phase = (value: number) => (value - center) / .21;
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const opacity = useTransform(progress, (value) => clamp(1 - Math.abs(phase(value)), 0, 1));
  const scale = useTransform(progress, (value) => clamp(1 + phase(value) * .42, .48, 1.42));
  const y = useTransform(progress, (value) => clamp(-phase(value) * 210, -210, 260));
  const rotateX = useTransform(progress, (value) => clamp(-phase(value) * 7, -7, 9));
  const filter = useTransform(progress, (value) => `blur(${clamp(Math.abs(phase(value)) * 9, 0, 12)}px)`);
  const pointerEvents = useTransform(progress, (value) => Math.abs(value - center) < .13 ? "auto" : "none");

  return <motion.article className="depth-project" style={{ opacity, zIndex: index + 2, pointerEvents }} aria-label={`${project.name} project`}>
    <div className="depth-backdrop"><img src={project.image} alt="" width="1920" height="1080" /></div>
    <motion.a className="depth-card" href="#contact" style={{ scale, y, rotateX, filter }}>
      <img src={project.image} alt={`${project.name} website project by Ink Media`} width="1920" height="1080" loading={index < 2 ? "eager" : "lazy"} decoding="async" />
      <div className="depth-shade" />
      <span className="depth-code">[ {project.code} ]</span>
      <span className="depth-open">[ VIEW PROJECT ↗ ]</span>
      <div className="depth-title"><h3>{project.name}</h3><p>{project.type}</p></div>
    </motion.a>
  </motion.article>;
}

function DepthWork() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return <section id="work" className={`work depth-work ${reduce ? "is-reduced" : ""}`} ref={ref}>
    <div className="depth-stage">
      <div className="depth-ui shell"><span>[ SELECTED WORK ]</span><span>DEPTH / SCROLL</span><span>04 PROJECTS</span></div>
      <div className="depth-progress"><motion.i style={{ width: progressWidth }} /></div>
      {projects.map((project, index) => <DepthCard project={project} index={index} progress={scrollYProgress} key={project.name} />)}
      <div className="depth-instruction">SCROLL TO MOVE THROUGH THE WORK <span>↓</span></div>
    </div>
    <div className="mobile-projects shell">
      <div className="mobile-work-head"><span>[ SELECTED WORK / 04 ]</span><h2>BUILT TO BE<br />REMEMBERED.</h2></div>
      {projects.map((project) => <a className="mobile-project" href="#contact" key={project.name}><img src={project.image} alt={`${project.name} website project by Ink Media`} width="1920" height="1080" loading="lazy" /><div><span>{project.code}</span><h3>{project.name}</h3><p>{project.type}</p></div></a>)}
    </div>
  </section>;
}

export default function Home() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const cx = useSpring(x, { stiffness: 500, damping: 38 });
  const cy = useSpring(y, { stiffness: 500, damping: 38 });
  const heroX = useMotionValue(0);
  const heroY = useMotionValue(0);
  const heroSmoothX = useSpring(heroX, { stiffness: 260, damping: 30 });
  const heroSmoothY = useSpring(heroY, { stiffness: 260, damping: 30 });
  const [clock, setClock] = useState("—");
  const [sent, setSent] = useState(false);
  const [heroActive, setHeroActive] = useState(2);
  const [heroHover, setHeroHover] = useState(false);

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    const move = (event: MouseEvent) => { x.set(event.clientX - 8); y.set(event.clientY - 8); };
    if (!reduce) window.addEventListener("mousemove", move, { passive: true });
    return () => { window.clearInterval(timer); window.removeEventListener("mousemove", move); };
  }, [reduce, x, y]);

  const schema = { "@context": "https://schema.org", "@type": "Organization", name: "Ink Media", url: "https://inkmedia.in/", email: "contact@inkmedia.in", telephone: "+91 91583 10192", sameAs: ["https://www.linkedin.com/company/ink-media-digital/", "https://www.instagram.com/inkdigitalmedia/"] };

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }

  function moveHero(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    heroX.set(localX);
    heroY.set(localY);
    const position = (localX / bounds.width) * .72 + (localY / bounds.height) * .28;
    setHeroActive(Math.min(heroStates.length - 1, Math.floor(position * heroStates.length)));
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {!reduce && <motion.div className={`cursor ${heroHover ? "cursor-hidden" : ""}`} style={{ x: cx, y: cy }} aria-hidden="true" />}

      <header className="nav shell">
        <a className="wordmark" href="#top" aria-label="Ink Media home"><img src="/ink-logo.png" alt="Ink Media" width="3375" height="3375" /></a>
        <nav aria-label="Primary navigation"><a href="#work">WORK</a><a href="#services">SERVICES</a><a href="#studio">ABOUT</a></nav>
        <a className="nav-contact" href="#contact">[ START A PROJECT ]</a>
      </header>

      <section id="top" className={`hero ${heroHover ? "is-tracking" : ""}`} onPointerMove={moveHero} onPointerEnter={() => setHeroHover(true)} onPointerLeave={() => setHeroHover(false)}>
        <div className="hero-rail shell"><span>CREATIVE WEB STUDIO</span><span>INDIA / WORLDWIDE</span><span>IST — {clock}</span></div>
        <span className="hero-role">WEB DESIGN &amp; DEVELOPMENT</span>
        <motion.div className="hero-cross hero-cross-v" style={{ x: heroSmoothX }} aria-hidden="true" />
        <motion.div className="hero-cross hero-cross-h" style={{ y: heroSmoothY }} aria-hidden="true" />
        <motion.div className="hero-follow" style={{ x: heroSmoothX, y: heroSmoothY }} animate={{ opacity: heroHover || reduce ? 1 : .72 }} aria-hidden="true">
          <div className="hero-follow-inner">
            <div className="hero-follow-image"><img key={heroStates[heroActive].image} src={heroStates[heroActive].image} alt="" width="1920" height="1080" /></div>
            <span>{heroStates[heroActive].label}</span>
          </div>
        </motion.div>
        <p className="sr-only">Interactive project preview showing optimised, responsive, high-performance and pixel-precise web experiences.</p>
        <h1 aria-label="Websites built to make ambitious brands impossible to ignore">
          <span className="hero-mask"><motion.b initial={reduce ? undefined : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease }}>WEBSITES BUILT TO MAKE</motion.b></span>
          <span className="hero-mask hero-line-middle"><motion.b initial={reduce ? undefined : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08, ease }}>AMBITIOUS BRANDS</motion.b></span>
          <span className="hero-mask hero-line-last"><motion.b initial={reduce ? undefined : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .16, ease }}>IMPOSSIBLE TO IGNORE</motion.b></span>
        </h1>
        <div className="hero-bottom shell"><span>INK MEDIA</span><span>CURRENT TIME: {clock} IST</span><a href="#work">SCROLL TO EXPLORE ↓</a></div>
      </section>

      <section className="statement">
        <div className="statement-meta shell"><span>[ STORY / 01 ]</span><span>WHAT WE BELIEVE</span></div>
        <div className="statement-marquee" aria-hidden="true"><span>ENGINEERING IMMERSIVE WEB EXPERIENCES — ENGINEERING IMMERSIVE WEB EXPERIENCES — </span></div>
        <Reveal className="statement-copy shell"><p>THE RIGHT WEBSITE IS MORE THAN A WEBSITE.</p><h2>IT’S YOUR BRAND’S<br /><span>BEST INTRODUCTION.</span></h2></Reveal>
      </section>

      <section className="journey">
        <div className="journey-sticky"><span>[ FROM IDEA TO IMPACT ]</span><h2>ONE CONTINUOUS<br />DIGITAL STORY.</h2><p>A website isn’t just a platform—it’s where your brand takes shape online. It sets the tone, builds trust and creates the right first impression.</p></div>
        <div className="chapters">
          {chapters.map(([no, title, text], i) => <Reveal className="chapter" delay={i * .03} key={no}><span>{no}</span><div><h3>{title}</h3><p>{text}</p></div><i>↘</i></Reveal>)}
        </div>
      </section>

      <DepthWork />

      <section id="services" className="services">
        <div className="services-head shell"><span>[ CAPABILITIES / 05 ]</span><h2>DESIGN FIRST.<br />DEVELOPMENT<br />WITHOUT COMPROMISE.</h2></div>
        <div className="service-list shell">
          {capabilities.map(([no, title, detail]) => <a className="service" href="#contact" key={no}><span>[ {no} ]</span><h3>{title}</h3><p>{detail}</p><i>↗</i></a>)}
        </div>
      </section>

      <section className="sectors">
        <div className="sector-line"><span>REAL ESTATE</span><i>/</i><span>PROPERTY</span><i>/</i><span>HOSPITALITY</span><i>/</i><span>CORPORATE & B2B</span></div>
        <div className="sector-copy shell"><span>[ INDUSTRY FOCUS ]</span><p>A DIGITAL FOUNDATION FOR<br />BUSINESSES THAT <b>MEAN BUSINESS.</b></p></div>
      </section>

      <section id="studio" className="studio shell">
        <div className="studio-mark"><img src="/ink-logo.png" alt="" width="3375" height="3375" /><span>BUILDING DIGITAL<br />THINKING BEYOND</span></div>
        <Reveal className="studio-copy"><span>[ ABOUT INK MEDIA ]</span><h2>WE CREATE DIGITAL HOMES FOR BRANDS WITH SOMEWHERE IMPORTANT TO GO.</h2><p>With over 20 years of combined experience, Ink Media has partnered with incredible clients to deliver impactful results and create compelling websites that resonate.</p><a href="#contact">[ MEET YOUR DIGITAL TEAM ↗ ]</a></Reveal>
      </section>

      <section className="quote">
        <div className="quote-label shell"><span>[ CLIENT PERSPECTIVE ]</span><span>KIARA LIFESPACES</span></div>
        <Reveal className="quote-inner shell"><blockquote>“INK MEDIA IS ALWAYS RESPONSIVE, AVAILABLE AND VERY EASY TO WORK WITH. DISCUSSING IDEAS AND PLANNING WITH THEM IS ENJOYABLE.”</blockquote><div><img src="/alpana-kirloskar.jpg" alt="Alpana Kirloskar" width="285" height="230" loading="lazy" /><p>ALPANA KIRLOSKAR<br /><span>KIARA LIFESPACES</span></p></div></Reveal>
      </section>

      <section className="insights shell">
        <div className="insights-head"><span>[ IDEAS / OBSERVATIONS ]</span><h2>BUILDING DIGITAL.<br />THINKING BEYOND.</h2></div>
        <div className="article-list"><a href="https://inkmedia.in/blogs/the-future-of-digital-marketing/"><span>01 / PERSPECTIVE</span><h3>THE FUTURE OF DIGITAL MARKETING</h3><p>Explore the latest trends shaping the digital marketing landscape...</p><i>↗</i></a><a href="https://inkmedia.in/blogs/ai-in-web-development/"><span>02 / TECHNOLOGY</span><h3>AI IN WEB DEVELOPMENT</h3><p>How AI is revolutionizing web development and user experience...</p><i>↗</i></a></div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-title shell"><span>[ START A PROJECT ]</span><h2>YOU’VE BUILT A BRAND<br />WORTH REMEMBERING.<br /><b>LET’S BUILD ITS HOME.</b></h2></div>
        <div className="contact-grid shell">
          <div className="contact-direct"><span>[ DIRECT CONTACT ]</span><a href="mailto:contact@inkmedia.in">CONTACT@INKMEDIA.IN ↗</a><a href="tel:+919158310192">+91 91583 10192</a><p><i /> TAKING ON SELECT PROJECTS</p></div>
          <form onSubmit={submit} aria-label="Start a project enquiry">
            <div className="form-row"><label>01 / YOUR NAME<input required name="name" autoComplete="name" placeholder="Jane Smith" /></label><label>02 / COMPANY<input required name="company" autoComplete="organization" placeholder="Your company" /></label></div>
            <div className="form-row"><label>03 / EMAIL<input required type="email" name="email" autoComplete="email" placeholder="jane@company.com" /></label><label>04 / COUNTRY<input name="country" autoComplete="country-name" placeholder="Where are you based?" /></label></div>
            <div className="form-row"><label>05 / PROJECT TYPE<select name="projectType" defaultValue=""><option value="" disabled>Select one</option><option>New website</option><option>Website redesign</option><option>UX/UI design</option><option>Development partner</option><option>SEO & optimisation</option></select></label><label>06 / ESTIMATED BUDGET<select name="budget" defaultValue=""><option value="" disabled>Select a range</option><option>₹2L – ₹5L</option><option>₹5L – ₹10L</option><option>₹10L+</option><option>Let’s discuss</option></select></label></div>
            <label>07 / THE BRIEF<textarea required name="summary" rows={3} placeholder="What are you building, and what should it achieve?" /></label>
            <button type="submit">{sent ? "[ THANK YOU — WE’LL BE IN TOUCH ]" : "[ SEND PROJECT ENQUIRY ↗ ]"}</button>
          </form>
        </div>
        <footer className="footer shell"><a className="wordmark" href="#top" aria-label="Back to top"><img src="/ink-logo.png" alt="Ink Media" width="3375" height="3375" /></a><div><a href="https://www.linkedin.com/company/ink-media-digital/">LINKEDIN</a><a href="https://www.instagram.com/inkdigitalmedia/">INSTAGRAM</a></div><span>© 2026 INK MEDIA</span><a href="#top">BACK TO TOP ↑</a></footer>
      </section>
    </main>
  );
}

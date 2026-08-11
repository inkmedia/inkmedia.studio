"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

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

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? undefined : { opacity: 0, y: 50 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: .8, delay, ease }}>{children}</motion.div>;
}

export default function Home() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const cx = useSpring(x, { stiffness: 500, damping: 38 });
  const cy = useSpring(y, { stiffness: 500, damping: 38 });
  const [clock, setClock] = useState("—");
  const [sent, setSent] = useState(false);

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

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {!reduce && <motion.div className="cursor" style={{ x: cx, y: cy }} aria-hidden="true" />}

      <header className="nav shell">
        <a className="wordmark" href="#top" aria-label="Ink Media home"><img src="/ink-logo.png" alt="Ink Media" width="3375" height="3375" /></a>
        <nav aria-label="Primary navigation"><a href="#work">WORK</a><a href="#services">SERVICES</a><a href="#studio">ABOUT</a></nav>
        <a className="nav-contact" href="#contact">[ START A PROJECT ]</a>
      </header>

      <section id="top" className="hero">
        <div className="hero-rail shell"><span>CREATIVE WEB STUDIO</span><span>INDIA / WORLDWIDE</span><span>IST — {clock}</span></div>
        <h1 aria-label="Websites built to make ambitious brands impossible to ignore">
          {["WEBSITES BUILT", "TO MAKE AMBITIOUS", "BRANDS IMPOSSIBLE", "TO IGNORE"].map((line, i) => <span className={`hero-mask line-${i + 1}`} key={line}><motion.b initial={reduce ? undefined : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .08 * i, ease }}>{line}</motion.b></span>)}
        </h1>
        <div className="hero-spec shell"><p>[ PIXEL-PRECISE DESIGN ]<br />[ HIGH-PERFORMANCE CODE ]<br />[ PURPOSEFUL INTERACTION ]</p><p>Strategy, UX/UI and high-performance web development for brands that care about how they are seen, experienced and remembered.</p><a href="#work">SCROLL TO EXPLORE <span>↓</span></a></div>
        <motion.div className="hero-disc" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}><span>INK</span><i /></motion.div>
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

      <section id="work" className="work">
        <div className="work-head shell"><div><span>[ SELECTED WORK / 2023—26 ]</span><h2>BUILT TO BE<br />REMEMBERED.</h2></div><p>Four digital homes shaped around clarity, character and commercial purpose.</p></div>
        <div className="projects shell">
          {projects.map((project, i) => <motion.a className="project" href="#contact" key={project.name} whileHover={reduce ? undefined : "hover"} initial="rest" animate="rest">
            <div className="project-frame"><motion.img variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: .8, ease }} src={project.image} alt={`${project.name} website project by Ink Media`} width="1920" height="1080" loading={i < 2 ? "eager" : "lazy"} decoding="async" /><div className="project-shade" /><span className="project-code">[ {project.code} ]</span><motion.span className="project-open" variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}>[ OPEN PROJECT ↗ ]</motion.span><h3>{project.name}</h3></div>
            <div className="project-meta"><span>{project.type}</span><span>ROLE: WEB DESIGN & DEVELOPMENT</span></div>
          </motion.a>)}
        </div>
      </section>

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

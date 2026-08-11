"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const projects = [
  { name: "Tejraj", tag: "Real estate · Web design & development", image: "/work/tejraj.webp", tone: "lime" },
  { name: "Goel Ganga", tag: "Property · Digital experience", image: "/work/goel-ganga.jpg", tone: "blue" },
  { name: "House of Memories", tag: "Hospitality · Brand website", image: "/work/house-of-memories.jpg", tone: "rose" },
  { name: "Kiara Lifespaces", tag: "Real estate · Website development", image: "/work/kiara.webp", tone: "sand" },
];

const services = [
  ["01", "Web Strategy", "A clear roadmap, no guesswork. We map goals, audience, content and conversion before design begins."],
  ["02", "UX/UI Design", "Thoughtful digital systems that give your brand clarity, character and an effortless user experience."],
  ["03", "Web Development", "Clean code, intuitive structure and seamless functionality—built for performance across every device."],
  ["04", "Website Redesign", "A sharper digital presence for brands ready to evolve, reposition and perform at a higher level."],
  ["05", "SEO & Optimisation", "Technical foundations and ongoing improvements that help the right people find—and enjoy—your website."],
];

const process = [
  ["01", "Strategy", "We deep-dive into your brand, goals and audience."],
  ["02", "UX / UI", "We turn clarity into a distinct, intuitive experience."],
  ["03", "Development", "We build with clean code, care and precision."],
  ["04", "Growth", "We refine performance, visibility and conversion."],
];

const reveal = {
  hidden: { opacity: 0, y: 46 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : reveal}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const cursorX = useSpring(x, { stiffness: 500, damping: 36 });
  const cursorY = useSpring(y, { stiffness: 500, damping: 36 });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const move = (event: MouseEvent) => { x.set(event.clientX - 8); y.set(event.clientY - 8); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ink Media",
    url: "https://inkmedia.in/",
    email: "contact@inkmedia.in",
    telephone: "+91 91583 10192",
    sameAs: ["https://www.linkedin.com/company/ink-media-digital/", "https://www.instagram.com/inkdigitalmedia/"],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {!reduce && <motion.div className="cursor" style={{ x: cursorX, y: cursorY }} aria-hidden="true" />}

      <header className="nav shell">
        <a className="wordmark" href="#top" aria-label="Ink Media home">INK<span>®</span>MEDIA</a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a><a href="#services">Services</a><a href="#about">Studio</a>
        </nav>
        <a className="nav-cta magnetic" href="#contact">Start a project <Arrow /></a>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-kicker"><span className="live-dot" /> Web design & development studio <span>India → Worldwide</span></div>
        <motion.h1 initial={reduce ? undefined : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <span className="hero-line"><motion.span initial={reduce ? undefined : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>Websites built to make</motion.span></span>
          <span className="hero-line hero-indent"><motion.span initial={reduce ? undefined : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>ambitious brands</motion.span></span>
          <span className="hero-line"><motion.span initial={reduce ? undefined : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}>impossible to ignore.</motion.span></span>
        </motion.h1>
        <div className="hero-bottom">
          <p>Strategy, UX/UI and high-performance web development for brands that care about how they are seen, experienced and remembered.</p>
          <div className="hero-actions"><a className="button button-light magnetic" href="#work">View selected work</a><a className="text-link" href="#contact">Start a project <Arrow /></a></div>
        </div>
        <div className="orbit" aria-hidden="true"><span>INK</span><i /></div>
        <div className="scroll-note">Scroll to explore <span>↓</span></div>
      </section>

      <section className="proof-strip" aria-label="Selected clients">
        <div className="marquee"><span>TEJRAJ</span><span>GOEL GANGA</span><span>HOUSE OF MEMORIES</span><span>KIARA LIFESPACES</span><span>MAJESTIQUE</span><span>PROFILE GROUP</span><span>TEJRAJ</span><span>GOEL GANGA</span></div>
      </section>

      <section className="story shell">
        <Reveal className="eyebrow">01 / The studio story</Reveal>
        <Reveal><h2>The right website is more than a website. <em>It’s your brand’s best introduction.</em></h2></Reveal>
        <div className="story-grid">
          <Reveal className="story-copy"><p>A website isn’t just a platform—it’s where your brand takes shape online. It sets the tone, builds trust, and creates the right first impression.</p><p>We craft websites that are thoughtful in design, seamless in function, and built to last—ensuring your digital presence works as effortlessly as it looks.</p></Reveal>
          <div className="process-list">
            {process.map(([no, title, text], i) => <Reveal className="process-item" delay={i * .04} key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section id="work" className="work">
        <div className="shell section-head"><div><span className="eyebrow">02 / Selected work</span><h2>Designed.<br />Built. <em>Delivered.</em></h2></div><p>A portfolio of distinction—digital homes shaped for credibility, perception and business momentum.</p></div>
        <div className="project-track shell">
          {projects.map((project, i) => (
            <motion.a className={`project-card ${project.tone}`} href="#contact" key={project.name} whileHover={reduce ? undefined : { y: -8 }} aria-label={`${project.name} project — enquire about a similar project`}>
              <div className="project-image"><img src={project.image} alt={`${project.name} website project by Ink Media`} width="1920" height="1080" loading={i > 1 ? "lazy" : "eager"} decoding="async" /><span className="project-index">0{i + 1}</span><span className="project-open">View project <Arrow /></span></div>
              <div className="project-meta"><h3>{project.name}</h3><p>{project.tag}</p></div>
            </motion.a>
          ))}
        </div>
      </section>

      <section id="services" className="services shell">
        <div className="section-head services-intro"><div><span className="eyebrow">03 / Capabilities</span><h2>One studio.<br /><em>Every layer.</em></h2></div><p>From the first strategic decision to launch and beyond, every detail earns its place.</p></div>
        <div className="service-list">
          {services.map(([no, title, text]) => <motion.article className="service-row" key={no} initial="rest" whileHover="hover" animate="rest"><span>{no}</span><h3>{title}</h3><p>{text}</p><motion.i variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}>↗</motion.i></motion.article>)}
        </div>
      </section>

      <section className="expertise">
        <div className="shell expertise-grid">
          <Reveal className="expertise-title"><span className="eyebrow">04 / Industry expertise</span><h2>Digital foundations for businesses that <em>mean business.</em></h2></Reveal>
          <div className="industry-cards">
            {[["Real Estate", "Built for clarity across projects, audiences and long buying journeys."], ["Property", "Premium digital experiences that turn place into desire."], ["Hospitality", "Story-rich websites that make an experience tangible."], ["Corporate / B2B", "Credibility, clarity and conversion for complex offers."]].map(([title, text], i) => <Reveal className="industry-card" delay={i * .05} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section id="about" className="about shell">
        <div className="about-stamp"><span>INK</span><small>BUILDING DIGITAL<br />THINKING BEYOND</small></div>
        <Reveal className="about-copy"><span className="eyebrow">05 / About Ink Media</span><h2>Presence and precision, <em>in equal measure.</em></h2><p>With over 20 years of combined experience, Ink Media has partnered with incredible clients to deliver impactful results and create compelling websites that resonate.</p><a className="text-link dark-link" href="#contact">Meet your digital team <Arrow /></a></Reveal>
        <div className="about-values"><div><strong>Thoughtful</strong><span>in design</span></div><div><strong>Seamless</strong><span>in function</span></div><div><strong>Built</strong><span>to last</span></div></div>
      </section>

      <section className="testimonial">
        <div className="shell testimonial-grid">
          <div><span className="eyebrow">06 / Client perspective</span><p className="quote-mark">“</p></div>
          <Reveal className="quote"><blockquote>Ink Media is always responsive, available and very easy to work with. Discussing ideas and planning with them is enjoyable. The team at Ink Media is very helpful with suggestions for any digital marketing problems I may have, even outside of Kiara.</blockquote><div className="quote-person"><img src="/alpana-kirloskar.jpg" alt="Alpana Kirloskar" width="285" height="230" loading="lazy" /><p><strong>Alpana Kirloskar</strong><span>Kiara Lifespaces</span></p></div></Reveal>
        </div>
      </section>

      <section className="insights shell">
        <div className="section-head"><div><span className="eyebrow">07 / Insights</span><h2>Building digital.<br /><em>Thinking beyond.</em></h2></div><a className="text-link dark-link" href="https://inkmedia.in/blogs/">View all insights <Arrow /></a></div>
        <div className="insights-grid">
          <a className="feature-article" href="https://inkmedia.in/blogs/the-future-of-digital-marketing/"><span>Perspective · 6 min</span><h3>The Future of Digital Marketing</h3><p>Explore the latest trends shaping the digital marketing landscape...</p><i><Arrow /></i></a>
          <a className="small-article" href="https://inkmedia.in/blogs/ai-in-web-development/"><span>Technology · 4 min</span><h3>AI in Web Development</h3><p>How AI is revolutionizing web development and user experience...</p><i><Arrow /></i></a>
          <div className="insight-note"><span>Field note / 01</span><p>The strongest content starts with a real decision, made on a real project.</p></div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="shell contact-top"><span className="eyebrow">08 / Start a project</span><h2>You’ve built a brand<br />worth remembering.<br /><em>Now, let’s craft a<br />website that reflects it.</em></h2></div>
        <div className="shell contact-grid">
          <div className="contact-direct"><p>Prefer a direct conversation?</p><a href="mailto:contact@inkmedia.in">contact@inkmedia.in <Arrow /></a><a href="tel:+919158310192">+91 91583 10192</a><div className="availability"><span className="live-dot" /> Taking on select projects</div></div>
          <form onSubmit={submit} aria-label="Start a project enquiry">
            <div className="form-row"><label>Your name<input required name="name" autoComplete="name" placeholder="Jane Smith" /></label><label>Company<input required name="company" autoComplete="organization" placeholder="Your company" /></label></div>
            <div className="form-row"><label>Email<input required type="email" name="email" autoComplete="email" placeholder="jane@company.com" /></label><label>Country<input name="country" autoComplete="country-name" placeholder="Where are you based?" /></label></div>
            <div className="form-row"><label>Project type<select name="projectType" defaultValue=""><option value="" disabled>Select one</option><option>New website</option><option>Website redesign</option><option>UX/UI design</option><option>Development partner</option><option>SEO & optimisation</option></select></label><label>Estimated budget<select name="budget" defaultValue=""><option value="" disabled>Select a range</option><option>₹2L – ₹5L</option><option>₹5L – ₹10L</option><option>₹10L+</option><option>Let’s discuss</option></select></label></div>
            <label>Tell us about the project<textarea required name="summary" rows={3} placeholder="What are you building, and what should it achieve?" /></label>
            <button className="button button-dark" type="submit">{sent ? "Thank you — we’ll be in touch" : "Send project enquiry"} <Arrow /></button>
          </form>
        </div>
        <footer className="shell footer"><a className="wordmark" href="#top">INK<span>®</span>MEDIA</a><div><a href="https://www.linkedin.com/company/ink-media-digital/">LinkedIn</a><a href="https://www.instagram.com/inkdigitalmedia/">Instagram</a></div><p>© 2026 Ink Media. All rights reserved.</p></footer>
      </section>
    </main>
  );
}

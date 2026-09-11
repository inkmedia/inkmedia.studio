import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { RollingText } from "../../components/RollingText";
import FAQAccordion from "./FAQAccordion";
import WebDevelopmentMotion from "./WebDevelopmentMotion";
import MagneticDots from "./MagneticDots";
import InteractiveHighlight from "./InteractiveHighlight";
import "./web-development.css";

export const metadata: Metadata = {
  title: "Web Development Services | Ink Media",
  description: "Fast, scalable websites built around your business goals. Ink Media develops thoughtful digital experiences that are easy to manage and ready to grow.",
  alternates: { canonical: "/services/web-development" },
};

const capabilities = [
  ["01", "Front-end development", "Responsive, accessible interfaces that translate approved designs into precise, fluid digital experiences."],
  ["02", "CMS development", "Flexible content systems your team can confidently update without calling a developer for every change."],
  ["03", "E-commerce", "Conversion-aware storefronts, product architecture, payments and operational integrations built to sell."],
  ["04", "Integrations", "Thoughtful connections between your website, CRM, analytics, marketing tools and essential business systems."],
  ["05", "Quality assurance", "Cross-device testing, accessibility reviews and performance checks before anything reaches your audience."],
  ["06", "Ongoing evolution", "Post-launch support, measured improvements and new features as your priorities and audience evolve."],
];

const stages = [
  ["01", "Align", "We define the technical brief, success measures, content needs and constraints before committing to an architecture."],
  ["02", "Architect", "We map components, data, integrations and editing workflows so the build stays coherent as it grows."],
  ["03", "Build", "Design and engineering move together in focused sprints, with regular working demos—not a last-minute reveal."],
  ["04", "Prove", "We test real devices, browsers, content and journeys, then launch with monitoring and a clear handover."],
];

const projects = [
  { name: "Tejraj", type: "Real estate platform", image: "/work/tejraj.webp", challenge: "Turn a complex property portfolio into a fast, intuitive buyer journey.", outcome: "A scalable experience that makes discovery and enquiry feel effortless." },
  { name: "House of Memories", type: "Hospitality experience", image: "/work/house-of-memories.jpg", challenge: "Translate a highly visual destination into a useful digital experience.", outcome: "An immersive, mobile-first site designed to move visitors toward booking." },
  { name: "Majestique", type: "Property showcase", image: "/work/majestique.webp", challenge: "Give multiple developments a consistent but distinctive digital home.", outcome: "A clear content system built for campaigns, launches and long-term growth." },
];

const faqs = [
  ["How long does a website take to develop?", "Most focused marketing websites take 8–14 weeks from technical discovery to launch. Larger platforms, e-commerce builds or complex integrations are scoped in phases after discovery."],
  ["Can you work with our existing design or brand team?", "Yes. We can lead the complete process or work as the development partner to your internal or external design team. We agree responsibilities and handoff standards at the start."],
  ["Which CMS or platform do you recommend?", "We choose around your content, team, integrations and growth plans—not a preferred platform. That may mean a headless CMS, WordPress, Shopify or a tailored Next.js build."],
  ["Will our team be able to update the site?", "Yes. Editing should be clear and safe. We build reusable content structures, document them and train the people who will manage the website."],
  ["What happens after launch?", "We provide a defined warranty and handover, then can continue through a support and optimisation plan covering monitoring, improvements and new functionality."],
] as const;

const technology = [
  ["Next.js", "/tech/nextdotjs.svg?v=2", "Application framework"],
  ["React", "/tech/react.svg?v=2", "Interface engineering"],
  ["Shopify", "/tech/shopify.svg?v=2", "E-commerce platform"],
  ["WordPress", "/tech/wordpress.svg?v=2", "Content management"],
  ["Contentful", "/tech/contentful.svg?v=2", "Headless CMS"],
  ["Stripe", "/tech/stripe.svg?v=2", "Payments & commerce"],
  ["Google Analytics", "/tech/googleanalytics.svg?v=2", "Measurement"],
  [".NET", "/tech/dotnet.svg?v=2", "Backend development"],
];

export default function WebDevelopmentPage() {
  return (
    <main className="wd-page" id="top">
      <WebDevelopmentMotion />
      <div className="site-page">
      <SiteHeader />

      <section className="wd-hero shell">
        <div className="wd-eyebrow"><span>03 / WEB DEVELOPMENT</span><span>ENGINEERED FOR WHAT’S NEXT</span></div>
        <div className="wd-hero-title">
          <h1><span className="wd-hero-line"><span className="wd-hero-line-inner">Websites that</span></span><span className="wd-hero-line"><span className="wd-hero-line-inner"><InteractiveHighlight /></span></span><span className="wd-hero-line"><span className="wd-hero-line-inner">as your business.</span></span></h1>
          <div className="wd-hero-copy">
            <p>We develop fast, dependable digital experiences that turn strong design into measurable business momentum.</p>
            <a href="/contact" className="section-cta swap-trigger"><RollingText>[ START A PROJECT ↗ ]</RollingText></a>
          </div>
        </div>
        <div className="wd-hero-image"><Image src="/images/Web-Development.webp" alt="Web development interfaces and technology" fill priority sizes="100vw" /><span className="wd-image-curtain" aria-hidden="true" /></div>
        <span className="wd-scroll">SCROLL TO EXPLORE ↓</span>
      </section>

      <section className="wd-problem shell" data-wd-reveal>
        <div className="wd-section-label"><span>[ THE PROBLEM ]</span></div>
        <div className="wd-problem-grid">
          <h2>A website should be an asset.<br />Too often, it becomes <em>friction.</em></h2>
          <div>
            <p>Slow pages, fragile templates, disconnected systems and difficult updates quietly cost attention, leads and team time.</p>
            <ul>
              <li>Performance drops as content and features accumulate</li>
              <li>Mobile experiences feel like a compressed afterthought</li>
              <li>Marketing depends on developers for routine changes</li>
              <li>Technology decisions limit future growth</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="wd-capabilities" data-wd-reveal>
        <div className="shell">
          <div className="wd-section-label wd-section-label--light"><span>[ WHAT WE DO ]</span></div>
          <div className="wd-cap-intro"><h2>From interface<br />to infrastructure.</h2><p>We build the layer your audience sees and the systems your team relies on—without unnecessary complexity.</p></div>
          <div className="wd-cap-list">
            {capabilities.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><i>↗</i></article>)}
          </div>
        </div>
      </section>

      <section className="wd-approach shell" data-wd-reveal>
        <div className="wd-section-label"><span>[ OUR APPROACH ]</span></div>
        <div className="wd-approach-head"><h2>Clarity at every stage.<br /><em>Proof at every turn.</em></h2><p>Development shouldn’t feel like a black box. Our process makes decisions, progress and trade-offs visible from day one.</p></div>
        <div className="wd-stages">{stages.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="wd-tech" data-wd-reveal>
        <div className="shell wd-tech-inner">
          <div className="wd-section-label wd-section-label--light"><span>[ TECHNOLOGY & METHODS ]</span></div>
          <div className="wd-tech-intro"><h2>The right stack,<br /><em>for the right reasons.</em></h2><p>Technology is a means, not the headline. We select tools against performance, editor experience, security, integration and total cost of ownership.</p></div>
          <div className="wd-tech-grid">
            {technology.map(([name, logo, role]) => <article key={name}>
              <i className="wd-tech-dot wd-tech-dot--tl" /><i className="wd-tech-dot wd-tech-dot--tr" /><i className="wd-tech-dot wd-tech-dot--bl" /><i className="wd-tech-dot wd-tech-dot--br" />
              <div className="wd-tech-brand"><Image src={logo} alt="" width={48} height={48} /><strong>{name}</strong></div>
              <span>{role}</span>
            </article>)}
          </div>
        </div>
      </section>

      <section className="wd-work shell" data-wd-reveal>
        <div className="wd-section-label"><span>[ RELEVANT WORK ]</span></div>
        <div className="wd-work-head"><h2>Selected builds,<br /><em>made to move.</em></h2><a className="section-cta swap-trigger" href="/case-studies"><RollingText>[ VIEW ALL WORK ↗ ]</RollingText></a></div>
        <div className="wd-projects">{projects.map((project, index) => <article key={project.name} className={index === 0 ? "wd-project-featured" : ""}><div className="wd-project-image"><Image src={project.image} alt="" fill sizes={index === 0 ? "100vw" : "50vw"} /></div><div className="wd-project-meta"><span>{project.type}</span><span>0{index + 1}</span></div><h3>{project.name}</h3><div className="wd-project-result"><p><b>Challenge</b>{project.challenge}</p><p><b>Outcome</b>{project.outcome}</p></div></article>)}</div>
      </section>

      <section className="wd-why shell" data-wd-reveal>
        <div className="wd-section-label"><span>[ WHY INK MEDIA ]</span></div>
        <div className="wd-why-grid"><h2>Small enough to care.<br /><em>Experienced enough<br />to deliver.</em></h2><div className="wd-reasons">
          <article><span>01</span><div><h3>Strategy stays in the room</h3><p>Business goals guide architecture and priorities throughout the build—not only during the kickoff.</p></div></article>
          <article><span>02</span><div><h3>Design and development, together</h3><p>Our disciplines work as one team, protecting intent while finding better solutions in the browser.</p></div></article>
          <article><span>03</span><div><h3>Performance is a requirement</h3><p>Speed, responsiveness, accessibility and search fundamentals are engineered in from the start.</p></div></article>
          <article><span>04</span><div><h3>Built for the people running it</h3><p>We consider editors, marketers and operators alongside end users, leaving behind a system your team owns.</p></div></article>
        </div></div>
      </section>

      <section className="wd-faq shell" data-wd-reveal>
        <div className="wd-section-label"><span>[ FREQUENTLY ASKED ]</span></div>
        <div className="wd-faq-grid"><h2>Before we<br /><em>get building.</em></h2><FAQAccordion items={faqs} /></div>
      </section>

      <section className="wd-cta shell" data-wd-reveal><MagneticDots /><span>[ HAVE A PROJECT IN MIND? ]</span><h2>Planning a web<br />development project?</h2><a className="section-cta swap-trigger" href="/contact"><RollingText>[ START A CONVERSATION ↗ ]</RollingText></a></section>
      </div>
      <SiteFooter />
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Bold, Italic, Underline, RotateCcw, ChevronDown, Target, ScanLine, Layers, Sprout, Compass, PanelsTopLeft, CodeXml, TrendingUp, ArrowUpRight, Building2, Lightbulb, PenTool, Braces, MessagesSquare, Search, ListTree, Palette, MonitorCog, SlidersHorizontal, Rocket } from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { RollingText as TextSwap } from "../components/RollingText";
import "./about.css";

const AboutGlass = dynamic(() => import("../components/AboutGlass"), {
  ssr: false,
  loading: () => <div className="about-art about-glass" aria-hidden="true" />,
});

const wording = "Creative Things.";
type TextStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
};
const initialStyle: TextStyle = {
  bold: false,
  italic: false,
  underline: false,
  color: "#980009",
};
const colors = [
  "#171717",
  "#980009",
  "#6d28d9",
  "#2159cf",
  "#087f72",
  "#d12a78",
];
export default function AboutPage() {
  const [level, setLevel] = useState<"h1" | "h2" | "h3">("h1");
  const [style, setStyle] = useState<TextStyle>(initialStyle);
  const [palette, setPalette] = useState(false);
  const [message, setMessage] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const Heading = level;
  const currentColor = style.color;

  useEffect(() => {
    function closePalette(event: PointerEvent) {
      if (!toolbarRef.current?.contains(event.target as Node))
        setPalette(false);
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setPalette(false);
    }
    document.addEventListener("keydown", onEscape);
    document.addEventListener("pointerdown", closePalette);
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("pointerdown", closePalette);
    };
  }, []);

  function format(key: "bold" | "italic" | "underline") {
    const value = !style[key];
    setStyle((previous) => ({ ...previous, [key]: value }));
    setMessage(`${key} ${value ? "applied" : "removed"}.`);
  }

  function changeColor(color: string) {
    setStyle((previous) => ({ ...previous, color }));
    setMessage("Text color changed.");
  }

  function reset() {
    setStyle(initialStyle);
    setLevel("h1");
    setPalette(false);
    window.getSelection()?.removeAllRanges();
    setMessage("Headline formatting reset.");
  }

  return (
    <main className="about-page" id="top">
      <div className="site-page">
        <SiteHeader />
        <section className="about-hero" aria-label="About Ink Media">
        <AboutGlass />
        <div className="about-composer">
          <p className="about-headline about-intro">We make</p>
          <div className="about-creative-entrance">
            <Heading
              className={`about-headline about-creative about-headline--${level}`}
              data-bold={style.bold}
              style={{
                fontStyle: style.italic ? "italic" : "normal",
                textDecoration: style.underline ? "underline" : "none",
                color: style.color,
              }}
            >
              {wording}
            </Heading>
          </div>
          <div
            ref={toolbarRef}
            className="about-toolbar"
            role="group"
            aria-label="Creative Things. formatting"
          >
            <label className="about-heading-select">
              <span className="about-sr-only">Heading level</span>
              <select
                value={level}
                onChange={(event) => {
                  setLevel(event.target.value as typeof level);
                  setMessage(`Heading ${event.target.value.slice(1)} applied.`);
                }}
              >
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
              <ChevronDown size={13} aria-hidden="true" />
            </label>
            <span className="about-toolbar-divider" />
            {(
              [
                { key: "bold", Icon: Bold },
                { key: "italic", Icon: Italic },
                { key: "underline", Icon: Underline },
              ] as const
            ).map(({ key, Icon }) => (
              <button
                key={key}
                type="button"
                aria-label={key[0].toUpperCase() + key.slice(1)}
                title={key[0].toUpperCase() + key.slice(1)}
                aria-pressed={style[key]}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => format(key)}
              >
                <Icon size={20} strokeWidth={1.7} />
              </button>
            ))}
            <span className="about-toolbar-divider" />
            <div className="about-color-control">
              <button
                type="button"
                className="about-color-toggle"
                aria-label="Font color"
                aria-expanded={palette}
                aria-controls="about-colors"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setPalette(!palette)}
              >
                <span style={{ borderColor: currentColor }}>A</span>
                <ChevronDown size={12} />
              </button>
              {palette && (
                <div
                  id="about-colors"
                  className="about-palette"
                  role="group"
                  aria-label="Choose font color"
                >
                  <div className="about-swatches">
                    {colors.map((color) => (
                      <button
                        type="button"
                        key={color}
                        aria-label={`Color ${color}`}
                        aria-pressed={currentColor === color}
                        style={{ background: color }}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => changeColor(color)}
                      />
                    ))}
                  </div>
                  <label className="about-custom-color">
                    Custom color
                    <input
                      type="color"
                      aria-label="Custom font color"
                      value={currentColor}
                      onChange={(event) => changeColor(event.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
            <span className="about-toolbar-divider" />
            <button
              type="button"
              aria-label="Reset formatting"
              title="Reset formatting"
              onClick={reset}
            >
              <RotateCcw size={17} strokeWidth={1.6} />
            </button>
          </div>
          <span className="about-sr-only" aria-live="polite">
            {message}
          </span>
        </div>
        <div className="about-hero-foot">
          <span>INK MEDIA · INDEPENDENT CREATIVE STUDIO</span>
          <span>IDEAS MADE TANGIBLE.</span>
        </div>
        </section>
      <section className="about-studio" aria-labelledby="about-studio-title">
        <div className="about-studio-label">
          <span>WHO WE ARE</span>
          <span>A CONNECTED APPROACH</span>
        </div>
        <div className="about-studio-grid">
          <h2 id="about-studio-title">
            More than a development team.
            <span>More focused than a full-service agency.</span>
          </h2>
          <div className="about-studio-copy">
            <p>
              We bring business strategy, brand, user experience and technology
              together to create clear, high-performing digital experiences.
            </p>
            <p>
              From the first planning decision to launch, we connect what your
              business needs to say with what your users need to do.
            </p>
            <div className="about-studio-disciplines" aria-label="Our connected disciplines">
              <span>Strategy</span>
              <span>Brand</span>
              <span>Experience</span>
              <span>Technology</span>
            </div>
          </div>
        </div>
      </section>
      <section className="about-thinking" aria-labelledby="about-thinking-title">
        <div className="about-thinking-inner">
          <p className="about-thinking-label">HOW WE THINK</p>
          <div className="about-thinking-layout">
            <h2 id="about-thinking-title">
              Good digital work starts with the right decisions.
            </h2>
            <div className="about-principles">
              {[
                {
                  title: "Business before decoration",
                  Icon: Target,
                  copy: "A website should solve a business problem, not simply look impressive.",
                },
                {
                  title: "Clarity before complexity",
                  Icon: ScanLine,
                  copy: "We make complex products, services and information easy to understand and use.",
                },
                {
                  title: "Design and development together",
                  Icon: Layers,
                  copy: "Every design decision considers responsiveness, performance and technical feasibility.",
                },
                {
                  title: "Built for what happens next",
                  Icon: Sprout,
                  copy: "We plan for launch and the content, optimisation and growth that follow.",
                },
              ].map((principle) => (
                <article className="about-principle" key={principle.title}>
                  <span className="about-principle-icon" aria-hidden="true">
                    <principle.Icon size={23} strokeWidth={1.5} />
                  </span>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="about-capabilities" aria-labelledby="about-capabilities-title">
        <p className="about-thinking-label">WHAT WE DO BEST</p>
        <div className="about-capabilities-header">
          <h2 id="about-capabilities-title">
            Strategy, experience and technology <span>— connected.</span>
          </h2>
          <Link className="section-cta swap-trigger" href="/services">
            <TextSwap>[ EXPLORE OUR SERVICES ↗ ]</TextSwap>
          </Link>
        </div>
        <div className="about-capabilities-grid">
          {[
            {
              title: "Web Strategy",
              Icon: Compass,
              copy: "Clear objectives, audiences and content plans that define what your website needs to achieve.",
            },
            {
              title: "UX/UI Design",
              Icon: PanelsTopLeft,
              copy: "Intuitive journeys and visual systems that make complex information feel clear and intentional.",
            },
            {
              title: "Web Development",
              Icon: CodeXml,
              copy: "Fast, responsive websites with practical content management and foundations built to scale.",
            },
            {
              title: "Redesign, Commerce & Optimisation",
              Icon: TrendingUp,
              copy: "Evolving existing platforms, creating commerce experiences and improving website performance.",
            },
          ].map((capability) => (
            <article className="about-capability" key={capability.title}>
              <span className="about-principle-icon" aria-hidden="true">
                <capability.Icon size={23} strokeWidth={1.5} />
              </span>
              <h3>{capability.title}</h3>
              <p>{capability.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-expertise" aria-labelledby="about-expertise-title">
        <div className="about-expertise-inner">
          <div className="about-expertise-copy">
            <p className="about-thinking-label">SPECIALIST EXPERTISE</p>
            <h2 id="about-expertise-title">
              Experience across industries. <span>Deeper expertise where it matters.</span>
            </h2>
            <h3><Building2 size={22} strokeWidth={1.5} aria-hidden="true" /> Real Estate &amp; Property</h3>
            <p className="about-expertise-description">
              Our work spans sectors, with a growing specialisation in property.
              We connect brand, developments, locations and enquiries through
              clear design and practical content management.
            </p>
            <a className="section-cta swap-trigger" href="#property-projects">
              <TextSwap>[ EXPLORE REAL ESTATE EXPERTISE ↗ ]</TextSwap>
            </a>
          </div>
          <div className="about-property-projects" id="property-projects">
            {[
              { name: "Tejraj", image: "/work/tejraj.webp", type: "Web design & development", href: "https://tejraj.in/" },
              { name: "Goel Ganga", image: "/work/goel-ganga.jpg", type: "Digital experience", href: "https://goelganga.com/" },
            ].map((project) => (
              <a className="about-property-project swap-trigger" href={project.href} key={project.name} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — visit website (opens in a new tab)`}>
                <div className="about-property-image">
                  <Image src={project.image} alt={`${project.name} website project`} fill sizes="(max-width: 540px) 90vw, (max-width: 1000px) 44vw, 25vw" />
                </div>
                <div className="about-property-caption">
                  <div><h3><TextSwap>{project.name}</TextSwap></h3><p>{project.type}</p></div>
                  <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="about-team" aria-labelledby="about-team-title">
        <div className="about-team-heading">
          <p className="about-thinking-label">THE TEAM</p>
          <h2 id="about-team-title">The people behind the work.</h2>
          <p>
            Senior specialists working together across strategy, design,
            development and delivery.
          </p>
        </div>
        <div className="about-team-grid">
          {[
            { role: "Strategy / Creative Direction", copy: "Positioning, ideas and creative oversight.", Icon: Lightbulb },
            { role: "UX/UI Design", copy: "User journeys, interfaces and visual systems.", Icon: PenTool },
            { role: "Development / Technical Lead", copy: "Scalable builds, performance and delivery.", Icon: Braces },
            { role: "Project / Account Lead", copy: "Clear communication, planning and coordination.", Icon: MessagesSquare },
          ].map((member) => (
            <article className="about-team-card" key={member.role}>
              <div className="about-team-portrait" aria-hidden="true">
                <member.Icon size={42} strokeWidth={1.15} />
                <span>PORTRAIT</span>
              </div>
              <div className="about-team-card-copy">
                <span>NAME TO ADD</span>
                <h3>{member.role}</h3>
                <p>{member.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="about-process" aria-labelledby="about-process-title">
        <div className="about-process-inner">
          <div className="about-process-heading">
            <p className="about-thinking-label">HOW WE WORK</p>
            <h2 id="about-process-title">A clear process from first conversation to launch.</h2>
          </div>
          <div className="about-process-grid">
            {[
              { title: "Discover", copy: "Understand the business, audience and objectives.", Icon: Search },
              { title: "Define", copy: "Set requirements, journeys and technical direction.", Icon: ListTree },
              { title: "Design", copy: "Shape the UX and visual system around the content.", Icon: Palette },
              { title: "Develop", copy: "Build a responsive, scalable digital product.", Icon: MonitorCog },
              { title: "Refine", copy: "Test and improve interactions, content and performance.", Icon: SlidersHorizontal },
              { title: "Launch & Grow", copy: "Deploy, support and optimise what comes next.", Icon: Rocket },
            ].map((step) => (
              <article className="about-process-step" key={step.title}>
                <span className="about-process-icon" aria-hidden="true">
                  <step.Icon size={22} strokeWidth={1.45} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="about-proof" aria-labelledby="about-proof-title">
        <div className="about-proof-heading">
          <p className="about-thinking-label">PROOF &amp; CREDIBILITY</p>
          <h2 id="about-proof-title">Credibility should be seen, <span>not claimed.</span></h2>
        </div>
        <div className="about-proof-logos" aria-label="Selected client logos">
          {["7.png", "5.png", "ggg.png", "fco.png", "ab-logo.png", "sc.png", "ngr.png", "hom.png"].map((logo) => (
            <div className="about-proof-logo" key={logo}>
              <Image src={`/images/clients/${logo}`} alt="" width={180} height={90} sizes="180px" />
              <span className="about-proof-bottom-dots" aria-hidden="true" />
            </div>
          ))}
        </div>
        <figure className="about-proof-quote">
          <blockquote>
            “Ink Media is always responsive, available and very easy to work
            with. Discussing ideas and planning with them is enjoyable.”
          </blockquote>
          <figcaption>
            <Image src="/alpana-kirloskar.jpg" alt="Alpana Kirloskar" width={56} height={56} />
            <span><strong>Alpana Kirloskar</strong>Kiara Lifespaces</span>
          </figcaption>
        </figure>
      </section>
      <section className="about-closing" aria-labelledby="about-closing-title">
        <p className="about-thinking-label">LET’S WORK TOGETHER</p>
        <div className="about-closing-grid">
          <h2 id="about-closing-title">Have an important digital project in mind?</h2>
          <div>
            <p>
              Tell us what you’re building, changing or trying to achieve. We’ll
              identify the most useful next conversation.
            </p>
            <a className="section-cta swap-trigger" href="#contact">
              <TextSwap>[ START A PROJECT ↗ ]</TextSwap>
            </a>
          </div>
        </div>
      </section>
      </div>
      <SiteFooter />
    </main>
  );
}

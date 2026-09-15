import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { RollingText } from "../../components/RollingText";
import MagneticDots from "../../services/web-development/MagneticDots";
import AmarCaseMotion from "./AmarCaseMotion";
import "./amar-builders.css";

export const metadata: Metadata = {
  title: "Amar Builders Case Study",
  description:
    "How Ink Media shaped a clearer, more considered digital experience for Amar Builders.",
  alternates: { canonical: "/case-studies/amar-builders" },
  openGraph: {
    title: "Amar Builders Case Study | Ink Media",
    description: "A real estate digital experience shaped by Ink Media.",
    url: "/case-studies/amar-builders",
    images: [{ url: "/images/case-studies/Amar-Builders.webp", width: 1920, height: 1080, alt: "Amar Builders digital experience" }],
  },
};

const projectDetails = [
  ["Client", "Amar Builders"],
  ["Industry", "Real Estate"],
  ["Project", "Responsive website"],
  ["Delivered", "UX/UI · Front-end development"],
];

export default function AmarBuildersCaseStudy() {
  return (
    <main className="amar-case" id="top">
      <AmarCaseMotion />
      <div className="site-page amar-case-page">
        <SiteHeader compactScroll />

        <section className="amar-hero" aria-labelledby="amar-title">
          <div className="amar-hero-copy shell">
            <p className="amar-kicker">[ CASE STUDY · REAL ESTATE ]</p>
            <h1 id="amar-title"><span className="amar-hero-line"><span className="amar-hero-line-inner">Amar</span></span><span className="amar-hero-line"><span className="amar-hero-line-inner">Builders</span></span></h1>
            <div className="amar-hero-intro">
              <p>A digital home designed to turn an established legacy into a clear, confident experience for today&apos;s property buyer.</p>
              <span>RESPONSIVE WEBSITE · UX/UI · DEVELOPMENT</span>
              <a className="amar-live-link swap-trigger" href="https://www.amarbuilders.com/" target="_blank" rel="noreferrer">
                <RollingText>[ VISIT LIVE WEBSITE ↗ ]</RollingText>
              </a>
            </div>
          </div>
          <div className="amar-hero-media">
            <Image
              src="/images/case-studies/amar-builders/amar-builders-responsive-hero.png"
              alt="Amar Builders responsive website presented on laptop and mobile devices"
              fill
              priority
              sizes="100vw"
            />
            <span className="amar-image-curtain" aria-hidden="true" />
          </div>
        </section>

        <section className="amar-overview shell" aria-labelledby="amar-overview-title" data-amar-reveal>
          <div className="amar-section-label"><span>[ PROJECT OVERVIEW ]</span></div>
          <div className="amar-overview-grid">
            <h2 id="amar-overview-title">A trusted name,<br /><em>reframed for digital.</em></h2>
            <div>
              <p className="amar-lead">Amar Builders needed a digital presence that could carry the confidence of its established name while making a broad portfolio feel simple to navigate.</p>
              <dl>
                {projectDetails.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>

        <section className="amar-challenge" aria-labelledby="amar-challenge-title" data-amar-reveal>
          <div className="shell">
            <div className="amar-section-label"><span>[ THE BRIEF ]</span></div>
            <div className="amar-challenge-grid">
              <h2 id="amar-challenge-title">A legacy brand,<br />made ready for <em>every screen.</em></h2>
              <div>
                <p>Amar Builders needed a website that could carry decades of credibility into a more contemporary digital experience. It had to make the brand story and its diverse portfolio feel clear without losing the character of the original identity.</p>
                <p>Our brief was to turn that content into one coherent journey—considered on a large desktop, comfortable on a laptop, and focused on a phone.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="amar-approach shell" aria-labelledby="amar-approach-title" data-amar-reveal>
          <div className="amar-section-label"><span>[ DESIGN DIRECTION ]</span></div>
          <div className="amar-design-grid">
            <div className="amar-design-intro">
              <p className="amar-design-eyebrow">CORE PRINCIPLE</p>
              <h2 id="amar-approach-title">One clear story,<br /><em>adapted—not reduced.</em></h2>
              <p>The experience keeps Amar Builders&apos; established visual identity intact while adjusting composition, navigation and reading flow to the screen in front of the visitor.</p>
            </div>
            <div className="amar-design-decisions">
              <article>
                <span className="amar-decision-number">01</span>
                <div><p className="amar-decision-type">CONTENT</p><h3>Lead with credibility</h3><p>Brand history, certifications and portfolio context appear before deeper project detail, helping new visitors understand who Amar Builders is.</p></div>
                <small>BRAND → PROOF → PROJECTS</small>
              </article>
              <article>
                <span className="amar-decision-number">02</span>
                <div><p className="amar-decision-type">DESKTOP</p><h3>Use width to create impact</h3><p>Large imagery, generous spacing and horizontal navigation give the established brand a confident, composed presence.</p></div>
                <small>1366 PX VIEW</small>
              </article>
              <article>
                <span className="amar-decision-number">03</span>
                <div><p className="amar-decision-type">MOBILE</p><h3>Prioritise the reading journey</h3><p>Navigation condenses, content stacks and typography remains comfortable—preserving the same story without desktop clutter.</p></div>
                <small>390 PX VIEW</small>
              </article>
            </div>
          </div>
        </section>

        <section className="amar-showcase" aria-labelledby="amar-showcase-title" data-amar-reveal>
          <div className="shell amar-showcase-heading">
            <div className="amar-section-label"><span>[ RESPONSIVE EXPERIENCE ]</span><span>DESKTOP → MOBILE</span></div>
            <h2 id="amar-showcase-title">The work,<br /><em>in context.</em></h2>
            <p>Built as one responsive system rather than a set of disconnected screens.</p>
          </div>
          <figure className="amar-browser amar-browser--desktop">
            <div className="amar-browser-bar"><i /><i /><i /><span>amarbuilders.com</span></div>
            <Image src="/images/case-studies/amar-builders/amar-builders-laptop-1366x768.png" alt="Amar Builders homepage shown at a wide desktop viewport" width={1366} height={768} sizes="94vw" />
            <figcaption><span>01</span><strong>Wide-screen website</strong><small>1366 × 768</small></figcaption>
          </figure>
          <div className="shell amar-responsive-detail">
            <div className="amar-responsive-copy">
              <span>02 / RESPONSIVE DETAIL</span>
              <h3>Same story.<br />A sharper focus.</h3>
              <p>On smaller screens, the navigation condenses and the editorial story takes priority. The brand remains recognisable while every line becomes easier to scan and explore by touch.</p>
            </div>
            <figure className="amar-phone">
              <Image src="/images/case-studies/amar-builders/amar-builders-mobile-390x844.png" alt="Amar Builders website shown at a mobile viewport" width={390} height={844} sizes="(max-width: 560px) 72vw, 340px" />
              <figcaption>Mobile website · 390 × 844</figcaption>
            </figure>
          </div>
        </section>

        <section className="amar-solution shell" aria-labelledby="amar-solution-title" data-amar-reveal>
          <div className="amar-section-label"><span>[ WHAT CHANGED ]</span></div>
          <div className="amar-change-head">
            <h2 id="amar-solution-title">A clearer digital expression<br />of an <em>established brand.</em></h2>
            <p>The redesign was less about changing who Amar Builders is and more about making that identity easier to understand, navigate and trust online.</p>
          </div>
          <div className="amar-change-cards">
            <article>
              <span>01 · BRAND SYSTEM</span>
              <div><small>FROM</small><p>Legacy content presented as separate pieces</p></div>
              <i aria-hidden="true">→</i>
              <div><small>TO</small><h3>One connected digital story</h3></div>
            </article>
            <article>
              <span>02 · RESPONSIVE EXPERIENCE</span>
              <div><small>FROM</small><p>Layouts tied to a single screen size</p></div>
              <i aria-hidden="true">→</i>
              <div><small>TO</small><h3>A fluid journey across devices</h3></div>
            </article>
            <article>
              <span>03 · USER JOURNEY</span>
              <div><small>FROM</small><p>Information visitors had to interpret</p></div>
              <i aria-hidden="true">→</i>
              <div><small>TO</small><h3>Clear paths from story to project</h3></div>
            </article>
          </div>
        </section>

        <section className="amar-outcome" aria-labelledby="amar-outcome-title" data-amar-reveal>
          <div className="shell">
            <div className="amar-outcome-meta"><span>[ OUTCOME ]</span><span>RESPONSIVE WEBSITE · 2026</span></div>
            <div className="amar-outcome-statement">
              <p>THE RESULT</p>
              <h2 id="amar-outcome-title">A digital foundation built<br />for Amar Builders&apos; <em>next chapter.</em></h2>
              <p>The finished experience gives the brand a clearer voice online—bringing its legacy, credentials and portfolio into one responsive system that feels consistent wherever it is viewed.</p>
            </div>
            <ul className="amar-outcome-signals" aria-label="Project outcomes">
              <li><span>01</span><strong>Clearer brand story</strong></li>
              <li><span>02</span><strong>Consistent across devices</strong></li>
              <li><span>03</span><strong>Ready for future projects</strong></li>
            </ul>
          </div>
        </section>

        <section className="amar-next shell" aria-labelledby="amar-next-title" data-amar-reveal>
          <MagneticDots />
          <p>[ LET&apos;S WORK TOGETHER ]</p>
          <div className="amar-next-grid">
            <h2 id="amar-next-title">Have an important digital project in mind?</h2>
            <div>
              <p>Tell us what you&apos;re building, changing or trying to achieve. We&apos;ll identify the most useful next conversation.</p>
              <div className="amar-next-actions">
                <Link className="section-cta swap-trigger" href="/contact"><RollingText>[ START A PROJECT ↗ ]</RollingText></Link>
                <Link className="section-cta swap-trigger" href="/case-studies"><RollingText>[ VIEW ALL CASE STUDIES → ]</RollingText></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

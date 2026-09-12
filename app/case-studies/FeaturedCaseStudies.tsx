"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RollingText } from "../components/RollingText";

type Category = "All" | "Real Estate" | "Hospitality";

const studies = [
  {
    client: "Goel Ganga Developments",
    slug: "goel-ganga-developments",
    website: "https://goelganga.com/",
    modalColor: "#d9d1c3",
    shortName: "Goel Ganga",
    sector: "Real Estate",
    scope: "Strategy · UX/UI · Development",
    challenge: "Reimagining the digital presence of an established multi-project property developer for today.",
    contribution: "Strategy, UX/UI and development created a scalable platform connecting corporate and individual project content.",
    outcome: "A clearer digital journey strengthens trust and makes project discovery easier for audiences.",
    image: "/work/goel-ganga.jpg",
    size: "lead",
  },
  {
    client: "Tejraj Group",
    slug: "tejraj-group",
    website: "https://tejraj.in/",
    modalColor: "#e8d5d2",
    shortName: "Tejraj",
    sector: "Real Estate",
    scope: "UX/UI · Web Development",
    challenge: "Giving a growing real estate portfolio a focused contemporary digital presence today.",
    contribution: "UX/UI and development created a structured platform combining brand storytelling with intuitive project exploration.",
    outcome: "A polished platform presents the group and its developments with greater clarity online.",
    image: "/work/tejraj.webp",
    size: "standard",
  },
  {
    client: "House of Memories",
    slug: "house-of-memories",
    website: "https://houseofmemories.in/",
    modalColor: "#d8cedd",
    shortName: "House of Memories",
    sector: "Hospitality",
    scope: "UX/UI · Digital Experience",
    challenge: "Translating a warm hospitality brand into an engaging and memorable digital journey.",
    contribution: "Visual direction, UX/UI and development shaped an atmospheric platform centred on discovery and belonging.",
    outcome: "A distinctive digital home communicates the brand’s character before every guest arrives online.",
    image: "/work/house-of-memories.jpg",
    size: "wide",
  },
  {
    client: "Kiara Lifespaces",
    slug: "kiara-lifespaces",
    website: "https://kiaralifespaces.com/",
    modalColor: "#d3e3ea",
    shortName: "Kiara Lifespaces",
    sector: "Real Estate",
    scope: "Strategy · UX/UI · Development",
    challenge: "Presenting residential developments clearly while building confidence in the wider parent brand.",
    contribution: "Strategy, UX/UI and development organised brand information and project details into one coherent journey.",
    outcome: "A cohesive experience guides buyers naturally from brand story to detailed project exploration.",
    image: "/work/kiara.webp",
    size: "standard",
  },
  {
    client: "Majestique Landmarks",
    slug: "majestique-landmarks",
    website: "https://majestiqueproperties.com/",
    modalColor: "#ead4c8",
    shortName: "Majestique",
    sector: "Real Estate",
    scope: "UX/UI · Web Development",
    challenge: "Organising an established developer’s broad project portfolio into one clear digital system.",
    contribution: "UX/UI and development established a scalable framework for portfolio browsing, clarity and brand credibility.",
    outcome: "A consistent platform makes the property portfolio easier to understand and explore online.",
    image: "/work/majestique.webp",
    size: "wide",
  },
] as const;

const categories: Category[] = ["All", "Real Estate", "Hospitality"];
type Study = (typeof studies)[number];

export default function FeaturedCaseStudies() {
  const [category, setCategory] = useState<Category>("All");
  const [activeStudy, setActiveStudy] = useState<Study | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const visibleStudies = useMemo(
    () => studies.filter((study) => category === "All" || study.sector === category),
    [category],
  );

  const navigateStudy = (direction: -1 | 1) => {
    setActiveStudy((current) => {
      if (!current) return current;
      const currentIndex = studies.findIndex((study) => study.slug === current.slug);
      return studies[(currentIndex + direction + studies.length) % studies.length];
    });
  };

  useEffect(() => {
    if (!activeStudy) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveStudy(null);
      if (event.key === "ArrowLeft") navigateStudy(-1);
      if (event.key === "ArrowRight") navigateStudy(1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeStudy]);

  const move = (direction: -1 | 1) => {
    track.current?.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.7, 920),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="featured-cases" aria-labelledby="featured-cases-title">
      <motion.div
        className="featured-cases-head"
        initial={reducedMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <p>[ SELECTED PROJECTS ]</p>
          <h2 id="featured-cases-title">FEATURED CASE STUDIES</h2>
        </div>
        <div className="featured-cases-controls">
          <div className="featured-cases-filters" aria-label="Filter case studies">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "is-active" : ""}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                [ {item.toUpperCase()} ]
              </button>
            ))}
          </div>
          <div className="featured-cases-arrows" aria-label="Browse case studies">
            <button onClick={() => move(-1)} aria-label="Previous case studies"><ArrowLeft /></button>
            <button onClick={() => move(1)} aria-label="Next case studies"><ArrowRight /></button>
          </div>
        </div>
      </motion.div>

      <div className="featured-cases-track" ref={track} key={category}>
        {visibleStudies.map((study, index) => (
          <motion.article
            className={`featured-case featured-case--${study.size}`}
            key={study.client}
            role="button"
            tabIndex={0}
            aria-label={`View ${study.client} project details`}
            onClick={() => setActiveStudy(study)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveStudy(study);
              }
            }}
            initial={reducedMotion ? false : { opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.85, delay: Math.min(index * 0.08, 0.24), ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="featured-case-image">
              <Image src={study.image} alt={`${study.client} website`} fill sizes="(max-width: 700px) 88vw, 58vw" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="featured-case-title">
              <h3>{study.shortName}</h3>
              <div>
                <p>{study.sector} · {study.scope}</p>
                <span>[ VIEW ↗ ]</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeStudy && (
            <motion.div
              className="case-modal-backdrop"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setActiveStudy(null);
              }}
            >
              <motion.div
                className="case-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="case-modal-title"
                initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.99 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="case-modal-visual" style={{ "--case-modal-color": activeStudy.modalColor } as CSSProperties}>
                  <div className="case-modal-image-frame">
                    <Image src={activeStudy.image} alt={`${activeStudy.client} website`} fill sizes="(max-width: 800px) 80vw, 48vw" />
                  </div>
                </div>
                <div className="case-modal-content">
                  <button className="case-modal-close" onClick={() => setActiveStudy(null)} aria-label="Close project details"><X /></button>
                  <p className="case-modal-eyebrow">[ {activeStudy.sector.toUpperCase()} ]</p>
                  <h3 id="case-modal-title">{activeStudy.shortName}</h3>
                  <p className="case-modal-scope">{activeStudy.scope}</p>
                  <dl className="case-modal-details">
                    <div><dt>Challenge</dt><dd>{activeStudy.challenge}</dd></div>
                    <div><dt>Ink Media contribution</dt><dd>{activeStudy.contribution}</dd></div>
                    <div><dt>Outcome</dt><dd>{activeStudy.outcome}</dd></div>
                  </dl>
                  <div className="case-modal-actions">
                    <a className="swap-trigger" href={activeStudy.website} target="_blank" rel="noreferrer"><RollingText>[ VISIT SITE ↗ ]</RollingText></a>
                    <Link className="swap-trigger" href={`/case-studies/${activeStudy.slug}`}><RollingText>[ READ FULL CASE STUDY ↗ ]</RollingText></Link>
                  </div>
                  <div className="case-modal-nav" aria-label="Navigate case studies">
                    <button onClick={() => navigateStudy(-1)} aria-label="Previous case study"><ArrowLeft /></button>
                    <button onClick={() => navigateStudy(1)} aria-label="Next case study"><ArrowRight /></button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}

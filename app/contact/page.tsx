"use client";

import { FormEvent, useLayoutEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "../components/SiteChrome";
import { RollingText } from "../components/RollingText";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "../components/SocialIcons";
import "./contact.css";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  useLayoutEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => { history.scrollRestoration = previous; };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="contact-page contact-page--entering" id="top">
      <SiteHeader compactScroll />
      <div className="contact-content">
      <div className="contact-layout shell">
        <aside className="contact-intro" aria-labelledby="contact-title">
          <p className="contact-eyebrow contact-stagger">[ START A PROJECT ]</p>
          <h1 id="contact-title">
            <span className="contact-title-line"><span className="contact-title-line-inner">Let’s talk</span></span>
            <span className="contact-title-line"><span className="contact-title-line-inner">about what</span></span>
            <span className="contact-title-line"><span className="contact-title-line-inner">you’re <em>building.</em></span></span>
          </h1>
          <p className="contact-hero-copy contact-stagger">Tell us a little about your business, your current digital challenge and what you’d like to achieve.</p>
          <div className="contact-direct-list contact-stagger">
            <a href="mailto:contact@inkmedia.in"><Mail aria-hidden="true" /><span>contact@inkmedia.in</span></a>
            <a href="tel:+919158310192"><Phone aria-hidden="true" /><span>+91 91583 10192</span></a>
            <address><MapPin aria-hidden="true" /><span>Hari Krupa, Rasta Peth,<br />Pune – 411102</span></address>
          </div>
          <div className="contact-socials contact-stagger" aria-label="Social media">
            <a className="contact-social contact-social--linkedin" href="https://www.linkedin.com/company/ink-media-digital/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a className="contact-social contact-social--instagram" href="https://www.instagram.com/inkdigitalmedia/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a className="contact-social contact-social--facebook" href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
          </div>
        </aside>

        <section className="contact-enquiry" aria-labelledby="enquiry-title">
          <div className="contact-section-heading contact-stagger">
            <span>PROJECT ENQUIRY</span>
            <h2 id="enquiry-title">Share the essentials.</h2>
          </div>
        <form className="contact-form contact-stagger" onSubmit={submit}>
          <fieldset>
            <legend>Contact</legend>
            <div className="contact-form-grid">
              <label><span>Name *</span><input required name="name" autoComplete="name" placeholder="Your name" /></label>
              <label><span>Work email *</span><input required type="email" name="email" autoComplete="email" placeholder="you@company.com" /></label>
              <label><span>Company *</span><input required name="company" autoComplete="organization" placeholder="Company name" /></label>
              <label><span>Country</span><input name="country" autoComplete="country-name" placeholder="Where are you based?" /></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Project</legend>
            <div className="contact-form-grid">
              <label><span>Current website</span><input type="url" name="website" placeholder="https://" inputMode="url" /></label>
              <label><span>Project type *</span><select required name="projectType" defaultValue=""><option value="" disabled>Select project type</option><option>New website</option><option>Website redesign</option><option>UX/UI design</option><option>Development partner</option><option>SEO &amp; optimisation</option></select></label>
              <label className="contact-form-wide"><span>Short project summary *</span><textarea required name="summary" rows={3} placeholder="What are you looking to build or improve?" /></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Commercial</legend>
            <div className="contact-form-grid">
              <label><span>Approximate budget *</span><select required name="budget" defaultValue=""><option value="" disabled>Select budget range</option><option>₹2L – ₹5L</option><option>₹5L – ₹10L</option><option>₹10L+</option><option>Let’s discuss</option></select></label>
              <label><span>Expected launch *</span><select required name="launch" defaultValue=""><option value="" disabled>Select launch period</option><option>Within 2 months</option><option>2–4 months</option><option>4–6 months</option><option>Flexible / exploring</option></select></label>
            </div>
          </fieldset>
          <div className="contact-submit-row">
            <p>Ready to discuss the project?<br /><span>Share the essentials and we’ll take it from there.</span></p>
            <button className="section-cta swap-trigger" type="submit" disabled={sent}><RollingText>{sent ? "[ ENQUIRY SENT — THANK YOU ]" : "[ SEND PROJECT ENQUIRY ↗ ]"}</RollingText></button>
          </div>
        </form>
          <section className="contact-partnership" aria-labelledby="partnership-title">
            <span>AGENCY PARTNERSHIPS</span>
            <h2 id="partnership-title">Are you an agency looking for a development partner?</h2>
            <p>We collaborate with branding agencies, creative studios and independent designers that need dependable web development and technical execution behind their client work.</p>
            <a className="section-cta swap-trigger" href="mailto:contact@inkmedia.in?subject=Agency%20partnership"><RollingText>[ DISCUSS A PARTNERSHIP ↗ ]</RollingText></a>
          </section>
        </section>
      </div>
      </div>
      <footer className="contact-copyright">
        <span className="shell">All Right Reserved © 2026 | INK MEDIA</span>
      </footer>
    </main>
  );
}

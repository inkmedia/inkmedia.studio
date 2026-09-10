"use client";

import { useState } from "react";

export default function FAQAccordion({ items }: { items: readonly (readonly [string, string])[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return <div className="wd-accordion">
    {items.map(([question, answer], index) => {
      const open = openIndex === index;
      const answerId = `wd-faq-answer-${index}`;
      return <article className={open ? "is-open" : ""} key={question}>
        <button type="button" aria-expanded={open} aria-controls={answerId} onClick={() => setOpenIndex(open ? null : index)}>
          <span>0{index + 1}</span><strong>{question}</strong><i aria-hidden="true">+</i>
        </button>
        <div className="wd-faq-answer" id={answerId} aria-hidden={!open}><div><p>{answer}</p></div></div>
      </article>;
    })}
  </div>;
}

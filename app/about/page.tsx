"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Bold, Italic, Underline, RotateCcw, ChevronDown } from "lucide-react";
import { SiteHeader } from "../components/SiteChrome";
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
    </main>
  );
}

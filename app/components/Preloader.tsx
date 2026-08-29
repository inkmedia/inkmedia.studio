"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function createWavePath(
  phase: number,
  baseline: number,
  amplitude: number,
  wavelength: number,
  secondary: number,
) {
  const start = -200;
  const end = 1400;
  const segments = 56;
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const x = start + ((end - start) * index) / segments;
    const primaryWave = Math.sin((x / wavelength) * Math.PI * 2 + phase) * amplitude;
    const secondaryWave = Math.sin((x / (wavelength * 0.48)) * Math.PI * 2 - phase * 0.62) * secondary;
    return `${x.toFixed(1)} ${(baseline + primaryWave + secondaryWave).toFixed(1)}`;
  });
  return `M${points.join(" L")} L${end} 160 L${start} 160 Z`;
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [progress, setProgress] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const exitTimer = useRef<number | null>(null);

  useEffect(() => {
    document.body.classList.add("is-loading");
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const blockedKeys = new Set([
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
      " ",
    ]);
    const stopScroll = (event: Event) => event.preventDefault();
    const stopScrollKeys = (event: KeyboardEvent) => {
      if (blockedKeys.has(event.key)) event.preventDefault();
    };

    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", stopScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", stopScroll, { passive: false, capture: true });
    window.addEventListener("keydown", stopScrollKeys, { capture: true });
    let frame = 0;
    let cancelled = false;
    let finished = false;
    let displayedProgress = 0;
    let targetProgress = 0;
    let previousTime = performance.now();
    const animationStartTime = previousTime;

    const waitForWindow = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const loadImage = (source: string) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => {
        const decoded = image.decode ? image.decode() : Promise.resolve();
        decoded.catch(() => undefined).finally(() => resolve());
      };
      image.onerror = () => resolve();
      image.src = source;
    });

    const loadFile = async (source: string) => {
      const response = await fetch(source, { cache: "force-cache" });
      if (!response.ok) throw new Error(`Unable to preload ${source}`);
      await response.arrayBuffer();
    };

    const tasks: Promise<unknown>[] = [
      waitForWindow,
      document.fonts?.ready ?? Promise.resolve(),
      loadFile("/ink_media_icon_3d.glb"),
      loadImage("/work/tejraj.webp"),
      loadImage("/work/goel-ganga.jpg"),
      loadImage("/work/house-of-memories.jpg"),
      loadImage("/work/kiara.webp"),
      import("./HeroIcon3D"),
      import("./DepthGallery"),
    ];

    let settled = 0;
    tasks.forEach((task) => {
      task.catch(() => undefined).finally(() => {
        settled += 1;
        targetProgress = settled === tasks.length
          ? 1
          : Math.min(0.58, (settled / tasks.length) * 0.58);
      });
    });

    const tick = (now: number) => {
      const delta = Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      const smoothing = 1 - Math.exp(-delta * (targetProgress === 1 ? 7 : 1.35));
      displayedProgress += (targetProgress - displayedProgress) * smoothing;

      if (!reducedMotion) {
        const fillTime = Math.min(1, (now - animationStartTime) / 2500);
        const fillEnvelope = fillTime * fillTime * (3 - 2 * fillTime);
        displayedProgress = Math.min(displayedProgress, fillEnvelope);
      }

      if (targetProgress === 1 && displayedProgress > 0.998 && !finished) {
        finished = true;
        displayedProgress = 1;
        setProgress(1);
        exitTimer.current = window.setTimeout(
          () => setLeaving(true),
          100,
        );
      } else {
        setProgress(displayedProgress);
      }
      if (!reducedMotion) setWavePhase(now * 0.001);

      if (!cancelled && !finished) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
      window.removeEventListener("wheel", stopScroll, { capture: true });
      window.removeEventListener("touchmove", stopScroll, { capture: true });
      window.removeEventListener("keydown", stopScrollKeys, { capture: true });
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, 0);
      document.body.classList.remove("is-loading");
    };
  }, [reducedMotion]);

  const fillY = 810 - progress * 620;
  const rearWave = createWavePath(wavePhase * 1.05 + 1.4, 48, 34, 720, 6);
  const highlightWave = createWavePath(-wavePhase * 0.88 + 0.5, 46, 20, 610, 4.5);
  const frontWave = createWavePath(wavePhase * 1.32, 50, 29, 680, 5.5);
  const surfaceBob = reducedMotion
    ? 0
    : Math.sin(wavePhase * 0.72) * 7 + Math.sin(wavePhase * 1.18) * 2.5;

  const overlay = (
    <motion.div
      className="preloader"
      style={{
        position: "fixed",
        zIndex: 2147483647,
        inset: 0,
        width: "100vw",
        height: "100dvh",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        background: "#ffffff",
        color: "#111111",
        isolation: "isolate",
      }}
      aria-label={`Loading Ink Media — ${Math.round(progress * 100)} percent`}
      role="status"
    >
      <motion.div
        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
        initial={{ scale: 1 }}
        animate={leaving ? { scale: 0.06 } : { scale: 1 }}
        transition={{ duration: reducedMotion ? 0.15 : 0.3, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (!leaving) return;
          document.body.classList.remove("is-loading");
          onComplete();
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            zIndex: 0,
            top: "50%",
            left: "50%",
            width: "min(55vmin, 500px)",
            height: "min(55vmin, 500px)",
            transform: "translate(-50%, -54%)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(152, 0, 9, 0.098) 0%, rgba(152, 0, 9, 0.0385) 38%, transparent 72%)",
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="preloader-icon"
          style={{ position: "relative", zIndex: 1, width: "min(40.32vmin, 364px)", height: "min(40.32vmin, 364px)" }}
          aria-hidden="true"
        >
        <svg viewBox="0 0 1000 1000" width="100%" height="100%" style={{ display: "block" }}>
          <defs>
            <path id="preloader-logo-shape" d="M499 231 L810 769 L629 768 L501 556 L370 768 L192 768 Z" />
            <clipPath id="preloader-logo-clip">
              <use href="#preloader-logo-shape" />
            </clipPath>
          </defs>

          <use href="#preloader-logo-shape" fill="#980009" opacity="0.14" />

          <g clipPath="url(#preloader-logo-clip)">
            <rect x="0" y={fillY + 72} width="1000" height={1000 - fillY} fill="#980009" />

            <g transform={`translate(0 ${fillY - 42 + surfaceBob})`}>
              <path d={rearWave} fill="#580006" opacity="0.88" />
              <path d={highlightWave} fill="#bf3941" opacity="0.3" />
              <path d={frontWave} fill="#980009" />
            </g>
          </g>

          </svg>
        </div>
        <p
          aria-label="Inking..."
          style={{
            position: "relative",
            zIndex: 1,
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 300,
            letterSpacing: "0.08em",
            color: "rgba(0, 0, 0, 0.68)",
            display: "flex",
            minHeight: 20,
          }}
        >
          {Array.from("Inking...").map((character, index) => (
            <motion.span
              key={`${character}-${index}`}
              aria-hidden="true"
              style={{ display: "inline-block", minWidth: character === " " ? "0.35em" : undefined }}
              animate={reducedMotion ? undefined : {
                y: [0, -7, 0],
                opacity: [0.38, 1, 0.6],
                filter: ["blur(1.5px)", "blur(0px)", "blur(0px)"],
              }}
              transition={{
                duration: 0.85,
                delay: index * 0.085,
                repeat: Infinity,
                repeatDelay: 1.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {character}
            </motion.span>
          ))}
        </p>
      </motion.div>

      <div className="preloader-meta">
        <span>INK MEDIA</span>
        <span>{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
      </div>
      <div className="preloader-progress">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
    </motion.div>
  );

  return createPortal(overlay, document.body);
}

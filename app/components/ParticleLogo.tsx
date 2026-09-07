"use client";

import { useEffect, useRef, useState } from "react";

type Dot = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  red: boolean;
  size: number;
};

export function ParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let dots: Dot[] = [];
    let frame = 0;
    let visible = false;
    let disposed = false;
    let width = 0;
    let height = 0;
    let previous = 0;
    let builtWidth = 0;
    let builtHeight = 0;
    let sourceRequested = false;
    const source = new Image();

    const draw = (time: number) => {
      frame = 0;
      const step = Math.min((time - previous) / 16.667 || 1, 2);
      previous = time;
      context.clearRect(0, 0, width, height);
      let moving = false;
      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (!motion.matches && distance < 43) {
          const force = (1 - distance / 43) * 1.8;
          const angle = distance > 0.1 ? Math.atan2(dy, dx) : dot.homeX;
          dot.vx += (Math.cos(angle) - Math.sin(angle) * 0.45) * force * step;
          dot.vy += (Math.sin(angle) + Math.cos(angle) * 0.45) * force * step;
        }
        dot.vx =
          (dot.vx + (dot.homeX - dot.x) * 0.035 * step) * Math.pow(0.84, step);
        dot.vy =
          (dot.vy + (dot.homeY - dot.y) * 0.035 * step) * Math.pow(0.84, step);
        dot.x += dot.vx * step;
        dot.y += dot.vy * step;
        if (
          Math.abs(dot.vx) +
            Math.abs(dot.vy) +
            Math.abs(dot.homeX - dot.x) +
            Math.abs(dot.homeY - dot.y) >
          0.05
        )
          moving = true;
        context.fillStyle = dot.red ? "#ff3434" : "rgba(255,255,255,0.98)";
        const inset = (1.7 - dot.size) / 2;
        context.fillRect(dot.x + inset, dot.y + inset, dot.size, dot.size);
      }
      if (visible && !motion.matches && moving)
        frame = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!frame && visible && !disposed) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const build = () => {
      if (!source.naturalWidth || disposed) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      if (width === builtWidth && height === builtHeight && dots.length) return;
      builtWidth = width;
      builtHeight = height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mask = document.createElement("canvas");
      mask.width = 240;
      mask.height = 240;
      const ctx = mask.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(source, 0, 0, 240, 240);
      const pixels = ctx.getImageData(0, 0, 240, 240).data;
      let left = 240,
        top = 240,
        right = 0,
        bottom = 0;
      const filled = (i: number) =>
        pixels[i + 3] > 100 &&
        Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) > 65;
      const sample = (centerX: number, centerY: number) => {
        let best = -1;
        let brightness = 0;
        let coverage = 0;
        for (
          let sampleY = Math.max(0, centerY - 1);
          sampleY <= Math.min(239, centerY + 1);
          sampleY++
        ) {
          for (
            let sampleX = Math.max(0, centerX - 1);
            sampleX <= Math.min(239, centerX + 1);
            sampleX++
          ) {
            const index = (sampleY * 240 + sampleX) * 4;
            const value = Math.max(
              pixels[index],
              pixels[index + 1],
              pixels[index + 2],
            );
            if (filled(index)) {
              coverage += 1;
              if (value > brightness) {
                best = index;
                brightness = value;
              }
            }
          }
        }
        if (coverage === 0) {
          for (
            let sampleY = Math.max(0, centerY - 2);
            sampleY <= Math.min(239, centerY + 2);
            sampleY++
          ) {
            for (
              let sampleX = Math.max(0, centerX - 2);
              sampleX <= Math.min(239, centerX + 2);
              sampleX++
            ) {
              const index = (sampleY * 240 + sampleX) * 4;
              const isRed =
                filled(index) && pixels[index] > pixels[index + 1] * 1.5;
              if (isRed) {
                best = index;
                coverage = 1;
              }
            }
          }
        }
        return { index: best, coverage };
      };
      for (let y = 0; y < 240; y++)
        for (let x = 0; x < 240; x++) {
          if (filled((y * 240 + x) * 4)) {
            left = Math.min(left, x);
            right = Math.max(right, x);
            top = Math.min(top, y);
            bottom = Math.max(bottom, y);
          }
        }
      const sourceWidth = right - left + 1;
      const sourceHeight = bottom - top + 1;
      const scale = Math.min(
        (width - 20) / sourceWidth,
        (height - 16) / sourceHeight,
      );
      const renderedWidth = sourceWidth * scale;
      const renderedHeight = sourceHeight * scale;
      const offsetX = (width - renderedWidth) / 2;
      const offsetY = (height - renderedHeight) / 2;
      const spacing = 3.6;
      const centerX = width / 2;
      const centerY = height / 2;
      const startX =
        centerX - Math.floor((centerX - offsetX) / spacing) * spacing;
      const startY =
        centerY - Math.floor((centerY - offsetY) / spacing) * spacing;
      dots = [];
      for (let y = startY; y <= offsetY + renderedHeight; y += spacing)
        for (let x = startX; x <= offsetX + renderedWidth; x += spacing) {
          const sx = Math.min(239, Math.round(left + (x - offsetX) / scale));
          const sy = Math.min(239, Math.round(top + (y - offsetY) / scale));
          const sampled = sample(sx, sy);
          if (sampled.index >= 0)
            dots.push({
              x,
              y,
              homeX: x,
              homeY: y,
              vx: 0,
              vy: 0,
              red:
                pixels[sampled.index] > pixels[sampled.index + 1] * 1.5,
              size: 1.7 * Math.max(0.48, Math.sqrt(sampled.coverage / 9)),
            });
        }
      setReady(true);
      wake();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || motion.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) * width) / rect.width;
      pointer.y = ((event.clientY - rect.top) * height) / rect.height;
      wake();
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
      wake();
    };
    const resetMotion = () => {
      leave();
      dots.forEach((dot) => {
        dot.x = dot.homeX;
        dot.y = dot.homeY;
        dot.vx = 0;
        dot.vy = 0;
      });
      wake();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (!sourceRequested) {
          sourceRequested = true;
          source.src = "/ink-logo.png";
        } else {
          wake();
        }
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        leave();
      }
    });
    intersection.observe(canvas);
    const resize = new ResizeObserver(build);
    resize.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    motion.addEventListener("change", resetMotion);
    source.onload = build;
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", resetMotion);
      source.onload = null;
    };
  }, []);

  return (
    <span className={`particle-logo${ready ? " is-ready" : ""}`}>
      <img
        src="/ink-logo.png"
        alt=""
        aria-hidden="true"
        width="3375"
        height="3375"
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </span>
  );
}

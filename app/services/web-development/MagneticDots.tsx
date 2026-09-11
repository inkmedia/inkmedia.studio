"use client";

import { useEffect, useRef } from "react";

export default function MagneticDots() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, previous = 0;
    let active = false;
    const pointer = { x: 0, y: 0 };
    let dots: { x: number; y: number; pull: number; angle: number }[] = [];

    function draw(time: number) {
      frame = 0;
      const dt = previous ? Math.min((time - previous) / 16.67, 3) : 1;
      previous = time;
      let settling = false;
      ctx!.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const dx = pointer.x - dot.x, dy = pointer.y - dot.y;
        const distance = Math.hypot(dx, dy);
        const target = active && !motion.matches ? Math.pow(Math.max(0, 1 - distance / 180), 2) : 0;
        dot.pull += (target - dot.pull) * (1 - Math.pow(.84, dt));
        if (Math.abs(target - dot.pull) > .001) settling = true;
        if (active) dot.angle = Math.atan2(dy, dx);
        // Perspective-like lift and elongated particles follow the magnetic field.
        const lift = dot.pull * 18;
        const x = dot.x + Math.cos(dot.angle) * lift;
        const y = dot.y + Math.sin(dot.angle) * lift;
        const length = 1 + dot.pull * 11;
        ctx!.strokeStyle = dot.pull > .04 ? `rgba(152,0,9,${.22 + dot.pull * .5})` : "rgba(30,25,25,.2)";
        ctx!.lineWidth = 1 + dot.pull * .35;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(x - Math.cos(dot.angle) * (length - 1) / 2, y - Math.sin(dot.angle) * (length - 1) / 2);
        ctx!.lineTo(x + Math.cos(dot.angle) * length / 2, y + Math.sin(dot.angle) * length / 2);
        ctx!.stroke();
      }
      if (settling) frame = requestAnimationFrame(draw);
      else previous = 0;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
    function resize() {
      width = section!.clientWidth;
      height = section!.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = 10; y < height; y += 20) {
        for (let x = 10; x < width; x += 20) dots.push({ x, y, pull: 0, angle: 0 });
      }
      schedule();
    }
    function move(event: PointerEvent) {
      if (event.pointerType === "touch" || motion.matches) return;
      const bounds = section!.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) * width / bounds.width;
      pointer.y = (event.clientY - bounds.top) * height / bounds.height;
      active = true;
      schedule();
    }
    function leave() { active = false; schedule(); }
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerleave", leave);
    motion.addEventListener("change", leave);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", leave);
    };
  }, []);

  return <canvas ref={ref} className="wd-magnetic-dots" aria-hidden="true" />;
}

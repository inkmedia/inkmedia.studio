"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, Line } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { RollingText } from "./RollingText";

export type DepthProject = {
  name: string;
  type: string;
  image: string;
  code: string;
  website: string;
};

const palette = [
  ["#84909a", "#285b88"],
  ["#737f89", "#174e80"],
  ["#909aa2", "#326b99"],
  ["#697681", "#123f70"],
] as const;

function DepthTrail({ offset }: { offset: { offset: number } }) {
  const mobile = useThree((state) => state.size.width < 768);
  const line = useRef<any>(null);
  const particles = useRef<THREE.Group>(null);
  const curve = useMemo(() => {
    const wide = mobile ? 2.5 : 4.5;
    const end = mobile ? 2.3 : 4.2;
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, -2.5, 0.5),
        new THREE.Vector3(-wide, -1.5, -5),
        new THREE.Vector3(wide, -0.5, -10),
        new THREE.Vector3(-wide, 0, -15),
        new THREE.Vector3(end, -1, -20),
      ],
      false,
      "centripetal",
    );
  }, [mobile]);
  const initialPoints = useMemo(
    () => Array.from({ length: 61 }, () => new THREE.Vector3(0, -0.8, 0.5)),
    [],
  );
  const trailPoints = useMemo(
    () => Array.from({ length: 61 }, () => new THREE.Vector3()),
    [],
  );
  const trailPositions = useMemo(() => new Float32Array(61 * 3), []);
  const offsets = useMemo(
    () =>
      Array.from(
        { length: 7 },
        (_, index) =>
          new THREE.Vector3(
            Math.sin(index * 2.1) * 0.18,
            Math.cos(index * 1.7) * 0.18,
            Math.sin(index * 1.3) * 0.18,
          ),
      ),
    [],
  );

  useFrame((state) => {
    const value = offset.offset;
    let length = 0.25;
    if (value < 0.15) length = (value / 0.15) * 0.25;
    if (value > 0.85) length = ((1 - value) / 0.15) * 0.25;
    let start = value + 0.03;
    const end = Math.min(1, start + length);
    if (end >= 1) start = Math.max(0, 1 - length);
    for (let index = 0; index < 61; index += 1) {
      const point = curve.getPointAt(
        start + (index / 60) * (end - start),
        trailPoints[index],
      );
      const positionIndex = index * 3;
      trailPositions[positionIndex] = point.x;
      trailPositions[positionIndex + 1] = point.y;
      trailPositions[positionIndex + 2] = point.z;
    }
    if (line.current?.geometry) {
      line.current.geometry.setPositions(trailPositions);
      line.current.computeLineDistances?.();
      line.current.material.linewidth = 8 - 7 * value;
    }
    const tip = trailPoints[60];
    particles.current?.children.forEach((particle, index) => {
      const phase = index * 0.91;
      const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 12 + phase);
      particle.position.set(
        tip.x +
          offsets[index].x +
          0.03 * Math.sin(state.clock.elapsedTime * 3 + phase),
        tip.y +
          offsets[index].y +
          0.03 * Math.cos(state.clock.elapsedTime * 4 + phase),
        tip.z +
          offsets[index].z +
          0.03 * Math.sin(state.clock.elapsedTime * 2 + phase),
      );
      particle.scale.setScalar(
        (0.025 + index * 0.004) * pulse * (length / 0.25),
      );
    });
  });

  return (
    <>
      <Line
        ref={line}
        points={initialPoints}
        color="#e8f7ff"
        lineWidth={8}
        transparent
        opacity={0.72}
        renderOrder={100}
      />
      <group ref={particles}>
        {Array.from({ length: 7 }, (_, index) => (
          <mesh key={index} renderOrder={101}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
              color="#f3fbff"
              transparent
              opacity={0.95}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

type ScrollProgress = { get: () => number };

function DepthScene({
  projects,
  progress,
  onIndexChange,
}: {
  projects: DepthProject[];
  progress: ScrollProgress;
  onIndexChange: (index: number) => void;
}) {
  const scroll = useRef({ offset: 0, delta: 0 });
  const mobile = useThree((state) => state.size.width < 768);
  const group = useRef<THREE.Group>(null);
  const lastIndex = useRef(-1);
  const foreground = useMemo(
    () => palette.map(([color]) => new THREE.Color(color)),
    [],
  );
  const background = useMemo(
    () => palette.map(([, color]) => new THREE.Color(color)),
    [],
  );
  const mixedForeground = useMemo(() => new THREE.Color(), []);
  const mixedBackground = useMemo(() => new THREE.Color(), []);
  const backgroundFrame = useRef(0);
  const lastBackground = useRef("");

  useFrame((state, frameDelta) => {
    const previous = scroll.current.offset;
    const delta = Math.min(frameDelta, 0.1);
    scroll.current.offset = THREE.MathUtils.damp(
      previous,
      progress.get(),
      5,
      delta,
    );
    scroll.current.delta = THREE.MathUtils.damp(
      scroll.current.delta,
      scroll.current.offset - previous,
      12,
      delta,
    );
    state.camera.position.z =
      0.5 - (5 * (projects.length - 1) + 0.5) * scroll.current.offset;
    if (state.camera instanceof THREE.PerspectiveCamera) {
      const fov = 75 + 80 * Math.abs(scroll.current.delta);
      if (Math.abs(state.camera.fov - fov) > 0.01) {
        state.camera.fov = fov;
        state.camera.updateProjectionMatrix();
      }
    }
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        1.5 * scroll.current.delta,
        0.1,
      );
      group.current.children.forEach((child, index) => {
        const distance = state.camera.position.z - -5 * (index + 1);
        let opacity = 0;
        if (distance > 0 && distance <= 10)
          opacity =
            distance <= 5
              ? distance / 5
              : distance <= 6
                ? 1
                : (10 - distance) / 4;
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.transparent = true;
        material.opacity = opacity;
        material.depthWrite = false;
        const baseX = mobile ? 0 : index % 2 === 0 ? -1.5 : 1.5;
        mesh.position.x = THREE.MathUtils.lerp(
          mesh.position.x,
          baseX + 0.5 * state.pointer.x,
          0.05,
        );
        const baseY = mobile ? 1.65 : 0;
        mesh.position.y = THREE.MathUtils.lerp(
          mesh.position.y,
          baseY + 0.5 * state.pointer.y,
          0.05,
        );
      });
    }
    const index = Math.min(
      Math.floor(scroll.current.offset * projects.length),
      projects.length - 1,
    );
    if (index !== lastIndex.current) {
      lastIndex.current = index;
      onIndexChange(index);
    }
    const scaled = scroll.current.offset * (projects.length - 1);
    const from = Math.min(Math.floor(scaled), projects.length - 2);
    const mix = scaled - from;
    mixedForeground.copy(foreground[from]).lerp(foreground[from + 1], mix);
    mixedBackground.copy(background[from]).lerp(background[from + 1], mix);
    backgroundFrame.current += 1;
    if (backgroundFrame.current % 6 === 0) {
      const background = `radial-gradient(circle, #${mixedForeground.getHexString()} 0%, #${mixedBackground.getHexString()} 100%)`;
      if (background !== lastBackground.current) {
        state.gl.domElement.style.background = background;
        lastBackground.current = background;
      }
    }
  });

  return (
    <>
      <DepthTrail offset={scroll.current} />
      <group ref={group}>
        {projects.map((project, index) => (
          <Image
            key={project.name}
            url={project.image}
            position={[
              mobile ? 0 : index % 2 === 0 ? -1.5 : 1.5,
              mobile ? 1.65 : 0,
              -5 * (index + 1),
            ]}
            scale={mobile ? [2.75, 1.55] : [5.2, 2.9]}
            transparent
          />
        ))}
      </group>
    </>
  );
}

export default function DepthGallery({
  projects,
  activeIndex,
  progress,
  onIndexChange,
}: {
  projects: DepthProject[];
  activeIndex: number;
  progress: ScrollProgress;
  onIndexChange: (index: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const active = projects[activeIndex] ?? projects[0];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "150px 0px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="depth-stage" ref={stageRef}>
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        dpr={[1, 1.35]}
        camera={{ fov: 75, position: [0, 0, 0.5] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <DepthScene
            projects={projects}
            progress={progress}
            onIndexChange={onIndexChange}
          />
        </Suspense>
      </Canvas>
      <div className="depth-ui" style={{ color: "#ffffff" }}>
        <span>[ DESIGNED ]</span>
        <span>[ BUILT ]</span>
        <span style={{ textAlign: "right" }}>[ DELIVERED ]</span>
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          className={`depth-info-wrap ${activeIndex % 2 === 1 ? "is-image-right" : "is-image-left"}`}
          key={active.name}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            opacity: 0,
            filter: "blur(5px)",
            transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
          }}
        >
          <div className="depth-info-spacer" />
          <div
            className="depth-info"
            style={{ color: "#ffffff", fontSize: "18px", lineHeight: 1.4 }}
          >
            <div className="depth-info-inner" style={{ gap: "32px" }}>
              <span>
                Client: {active.name}
                <br />
                Project: {active.type.toLowerCase()}
                <br />
                Code: {active.code}
              </span>
              <span>
                Category:
                <br />
                strategy, interface, and development
              </span>
              <span>Studio: Ink Media, Pune / Worldwide</span>
              <a
                className="depth-visit-site swap-trigger"
                href={active.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RollingText>[ VISIT SITE ↗ ]</RollingText>
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="depth-instruction" style={{ color: "#ffffff" }}>
        Ink Media — Selected Work
      </div>
      <a className="depth-work-all swap-trigger" href="/case-studies">
        <RollingText>[ VIEW ALL WORK ↗ ]</RollingText>
      </a>
    </div>
  );
}

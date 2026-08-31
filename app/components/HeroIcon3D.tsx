"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function IconModel({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/ink_media_icon_3d.glb");
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = new THREE.MeshStandardMaterial({
        color: "#a40008",
        metalness: 0.2,
        roughness: 0.42,
        transparent: false,
        opacity: 1,
        depthWrite: true,
      });
    });
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    const elapsed = state.clock.elapsedTime;
    const entranceProgress = Math.min(elapsed / 1.05, 1);
    const entranceScale = 1 - Math.pow(1 - entranceProgress, 4);
    const targetScale =
      entranceScale * (1 + Math.sin(elapsed * 0.52) * 0.055);

    group.current.rotation.y = -0.3 + elapsed * 0.16;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -0.08 + Math.sin(elapsed * 0.32) * 0.035,
      3,
      delta,
    );
    group.current.scale.setScalar(targetScale);
  });

  return (
    <group ref={group} rotation={[-0.08, -0.3, 0]}>
      <primitive object={model} />
    </group>
  );
}

export default function HeroIcon3D({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-model"
      style={{ opacity: 0.35 }}
      aria-hidden="true"
    >
      <Canvas
        frameloop={isVisible && !reducedMotion ? "always" : "demand"}
        dpr={[1, 1.35]}
        camera={{ fov: 32, position: [0, 0, 6] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight
          position={[4, 5, 6]}
          intensity={2.2}
          color="#fff5ee"
        />
        <directionalLight
          position={[-4, -2, 2]}
          intensity={0.7}
          color="#d71920"
        />
        <Bounds fit clip margin={1.28}>
          <Center>
            <IconModel reducedMotion={reducedMotion} />
          </Center>
        </Bounds>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/ink_media_icon_3d.glb");

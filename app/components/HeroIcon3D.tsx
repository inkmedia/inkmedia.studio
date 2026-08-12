"use client";

import { useMemo, useRef } from "react";
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
        metalness: .18,
        roughness: .42,
        transparent: true,
        opacity: .34,
        depthWrite: false,
      });
    });
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    const elapsed = state.clock.elapsedTime;
    const targetScale = 1 + Math.sin(elapsed * .52) * .055;

    group.current.rotation.y = -.3 + elapsed * .16;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -.08 + Math.sin(elapsed * .32) * .035,
      3,
      delta,
    );
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, targetScale, 3.5, delta),
    );
  });

  return <group ref={group} rotation={[-.08, -.3, 0]}>
    <primitive object={model} />
  </group>;
}

export default function HeroIcon3D({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return <div className="hero-model" aria-hidden="true">
    <Canvas dpr={[1, 1.35]} camera={{ fov: 32, position: [0, 0, 6] }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color="#fff5ee" />
      <directionalLight position={[-4, -2, 2]} intensity={.7} color="#d71920" />
      <Bounds fit clip margin={1.28}>
        <Center><IconModel reducedMotion={reducedMotion} /></Center>
      </Bounds>
    </Canvas>
  </div>;
}

useGLTF.preload("/ink_media_icon_3d.glb");

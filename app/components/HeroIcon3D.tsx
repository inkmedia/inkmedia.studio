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
    group.current.rotation.y += delta * .16;
    group.current.rotation.x = -.08 + Math.sin(state.clock.elapsedTime * .32) * .035;
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
      <Bounds fit clip observe margin={1.28}>
        <Center><IconModel reducedMotion={reducedMotion} /></Center>
      </Bounds>
    </Canvas>
  </div>;
}

useGLTF.preload("/ink_media_icon_3d.glb");

"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createInkFluidMaterial } from "./inkFluidMaterial";

type InkPointer = { position: THREE.Vector2; active: boolean };

function IconModel({ reducedMotion, pointer }: {
  reducedMotion: boolean;
  pointer: RefObject<InkPointer>;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/ink_media_icon_3d.glb");
  const elapsed = useRef(0);
  const interactionRef = useRef({
    position: new THREE.Vector2(),
    trail: new THREE.Vector2(),
    previous: new THREE.Vector2(),
    velocity: new THREE.Vector2(),
    targetVelocity: new THREE.Vector2(),
    strength: 0,
    viewToModel: new THREE.Matrix4(),
  });
  const { model, materials } = useMemo(() => {
    const clone = scene.clone(true);
    const materials: THREE.ShaderMaterial[] = [];
    clone.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry.computeBoundingBox();
      const material = createInkFluidMaterial(mesh.geometry.boundingBox!);
      mesh.material = material;
      materials.push(material);
    });
    return { model: clone, materials };
  }, [scene]);

  useEffect(() => () => {
    materials.forEach((material) => material.dispose());
  }, [materials]);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    // Clamp the first frame after returning to the tab so the ink never jumps.
    elapsed.current += Math.min(delta, 1 / 30);
    const time = elapsed.current;
    const interaction = interactionRef.current;
    const dt = Math.min(delta, 1 / 30);
    interaction.previous.copy(interaction.position);
    interaction.position.lerp(pointer.current.position, 1 - Math.exp(-7 * dt));
    interaction.trail.lerp(interaction.position, 1 - Math.exp(-2.2 * dt));
    interaction.targetVelocity.copy(interaction.position)
      .sub(interaction.previous).divideScalar(Math.max(dt, 0.001)).clampLength(0, 2.5);
    interaction.velocity.lerp(interaction.targetVelocity, 1 - Math.exp(-4 * dt));
    interaction.strength = THREE.MathUtils.damp(
      interaction.strength, pointer.current.active ? 1 : 0, 2.0, dt,
    );
    // Preserve the original continuous turn while the ink flows independently.
    group.current.rotation.y = -0.3 + time * 0.16;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -0.08 + Math.sin(time * 0.32) * 0.035,
      3,
      delta,
    );
    group.current.scale.setScalar(1 + Math.sin(time * 0.3) * 0.012);
    group.current.updateWorldMatrix(true, true);
    interaction.viewToModel.multiplyMatrices(state.camera.matrixWorldInverse, model.matrixWorld).invert();
    materials.forEach((material) => {
      material.uniforms.uTime.value = time;
      material.uniforms.uPointer.value.copy(interaction.position);
      material.uniforms.uTrail.value.copy(interaction.trail);
      material.uniforms.uVelocity.value.copy(interaction.velocity);
      material.uniforms.uStrength.value = interaction.strength;
      material.uniforms.uAspect.value = state.size.width / state.size.height;
      material.uniforms.uViewToModel.value.copy(interaction.viewToModel);
    });
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
  const pointer = useRef<InkPointer>({ position: new THREE.Vector2(), active: false });

  useEffect(() => {
    const container = containerRef.current;
    const hero = container?.closest(".hero");
    if (!container || !hero || reducedMotion) return;
    // Listen on the hero: its text sits above the decorative, non-clickable canvas.
    const move = (event: Event) => {
      const e = event as PointerEvent;
      if (e.pointerType === "touch") return;
      const rect = container.getBoundingClientRect();
      pointer.current.position.set(
        THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width * 2 - 1, -1.5, 1.5),
        THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / rect.height * 2, -1.5, 1.5),
      );
      pointer.current.active = true;
    };
    const leave = () => { pointer.current.active = false; };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      leave();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [reducedMotion]);
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px 0px" },
    );
    observer.observe(container);
    const syncVisibility = () => setIsPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-model"
      aria-hidden="true"
    >
      <Canvas
        frameloop={isVisible && isPageVisible && !reducedMotion ? "always" : "demand"}
        dpr={[1, 1.35]}
        camera={{ fov: 32, position: [0, 0, 6] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Bounds fit clip margin={1.28}>
          <Center>
            <IconModel reducedMotion={reducedMotion} pointer={pointer} />
          </Center>
        </Bounds>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/ink_media_icon_3d.glb");

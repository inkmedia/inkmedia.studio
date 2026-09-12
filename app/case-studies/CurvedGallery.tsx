"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects, wrap, type GalleryPosition } from "./gallery-data";

const GRID = 5;
const cells = Array.from({ length: GRID * GRID }, (_, index) => ({
  x: index % GRID - 2, y: Math.floor(index / GRID) - 2,
}));
const loop = (value: number) => wrap(value + GRID / 2, GRID) - GRID / 2;

type Props = {
  position: GalleryPosition;
  entered: boolean;
  reducedMotion: boolean;
  onReady: () => void;
  onSelect: (x: number, y: number) => void;
};

function Card({ x, y, current, target, texture, onSelect }: {
  x: number; y: number; current: GalleryPosition; target: GalleryPosition; texture: THREE.Texture;
  onSelect: Props["onSelect"];
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mobile = useThree((state) => state.size.width < 600);
  const cardSize = mobile ? 2.15 : 3.3;
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(cardSize, cardSize, 20, 20);
    // Crop the landscape placeholders to a square without stretching them.
    const source = texture.image as { width: number; height: number };
    const aspect = source.width / source.height;
    const uv = plane.getAttribute("uv");
    for (let index = 0; index < uv.count; index++) {
      uv.setXY(index, (uv.getX(index) - 0.5) * Math.min(1, 1 / aspect) + 0.5,
        (uv.getY(index) - 0.5) * Math.min(1, aspect) + 0.5);
    }
    return plane;
  }, [cardSize, texture]);
  const original = useMemo(() => Float32Array.from(geometry.getAttribute("position").array), [geometry]);
  const previous = useRef<{ x: number; y: number; geometry: THREE.PlaneGeometry | null }>({ x: NaN, y: NaN, geometry: null });
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    if (!mesh.current) return;
    const dx = loop(x - current.x);
    const dy = loop(y - current.y);
    mesh.current.visible = Math.abs(dx) < 1.8 && Math.abs(dy) < 1.65;
    if (!mesh.current.visible) return;
    if (previous.current.geometry === geometry && Math.abs(previous.current.x - dx) < 0.00001 && Math.abs(previous.current.y - dy) < 0.00001) return;
    previous.current = { x: dx, y: dy, geometry };
    const positions = geometry.getAttribute("position");
    const radius = 11.5;
    for (let index = 0; index < positions.count; index++) {
      const px = original[index * 3] + dx * (mobile ? 2.55 : 5.15);
      const py = original[index * 3 + 1] - dy * (mobile ? 4.3 : 5.05);
      positions.setXYZ(index,
        Math.sin(px / radius) * radius,
        Math.sin(py / radius) * radius,
        radius * (1 - Math.cos(px / radius)) + radius * (1 - Math.cos(py / radius)) * 0.65,
      );
    }
    positions.needsUpdate = true;
    geometry.computeBoundingSphere();
  });

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 12) return;
    const dx = Math.round(loop(x - target.x));
    const dy = Math.round(loop(y - target.y));
    if (dx || dy) onSelect(dx, dy);
  };

  return <mesh ref={mesh} geometry={geometry} frustumCulled={false} onClick={select}>
    <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
  </mesh>;
}

function Scene({ position, entered, reducedMotion, onReady, onSelect }: Props) {
  const textures = useTexture(projects.map((project) => project.image));
  const current = useRef<GalleryPosition>({ x: 0, y: 0 });
  const invalidate = useThree((state) => state.invalidate);
  const canvas = useThree((state) => state.gl.domElement);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const surface = canvas.closest("main") ?? canvas;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion) return;
      const bounds = canvas.getBoundingClientRect();
      pointer.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.current.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      invalidate();
    };
    const reset = () => { pointer.current = { x: 0, y: 0 }; invalidate(); };
    reset();
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", reset);
    return () => {
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", reset);
    };
  }, [canvas, invalidate, reducedMotion]);
  useEffect(() => {
    textures.forEach((texture) => { texture.colorSpace = THREE.SRGBColorSpace; });
    onReady();
  }, [textures, onReady]);
  useEffect(() => { invalidate(); }, [position, entered, reducedMotion, invalidate]);
  useFrame((state, delta) => {
    if (group.current) {
      // Move the gallery against the pointer to bring the approached edge into view.
      const targetX = reducedMotion ? 0 : -pointer.current.x * 0.6;
      const targetY = reducedMotion ? 0 : -pointer.current.y * 1.05;
      const amount = Math.min(delta, 0.05);
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 4, amount);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 4, amount);
      group.current.rotation.y = group.current.position.x * 0.09;
      group.current.rotation.x = -group.current.position.y * 0.09;
      const targetScale = reducedMotion || entered ? 1 : .82;
      const nextScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 4.5, amount);
      group.current.scale.setScalar(nextScale);
      if (
        Math.abs(group.current.position.x - targetX) +
        Math.abs(group.current.position.y - targetY) +
        Math.abs(nextScale - targetScale) > .0001
      ) invalidate();
    }
    const next = current.current;
    next.x = reducedMotion ? position.x : THREE.MathUtils.damp(next.x, position.x, 5.5, Math.min(delta, 0.05));
    next.y = reducedMotion ? position.y : THREE.MathUtils.damp(next.y, position.y, 5.5, Math.min(delta, 0.05));
    if (Math.abs(next.x - position.x) + Math.abs(next.y - position.y) > 0.0001) invalidate();
    else { next.x = position.x; next.y = position.y; }
  });
  return <group ref={group} scale={reducedMotion ? 1 : .82}>{cells.map(({ x, y }) => <Card key={`${x}:${y}`} x={x} y={y} current={current.current} target={position}
    texture={textures[wrap(x + y * 2, projects.length)]} onSelect={onSelect} />)}</group>;
}

export default function CurvedGallery(props: Props) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 40 }}
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} aria-hidden="true">
    <Suspense fallback={null}><Scene {...props} /></Suspense>
  </Canvas>;
}

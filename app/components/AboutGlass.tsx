"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const logos = ["ab-logo", "fco", "sc", "ngr", "hom", "ggg", "profile", "5", "7", "8"];
type Disc = { group: THREE.Group; caustic: THREE.Mesh; velocity: THREE.Vector2; spin: number; radius: number; home: THREE.Vector2 };

export default function AboutGlass() {
  const host = useRef<HTMLDivElement>(null);
  const reset = useRef<() => void>(() => {});

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch { return; }
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-label", "Interactive glass client logos. Drag a disc and release to throw it.");
    element.appendChild(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f7f6f3");
    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 100);
    camera.position.z = 20;
    const resources: { dispose: () => void }[] = [];
    let disposed = false;

    // Single-pass Fresnel glass: transparent centers, bright edge reflections.
    // Avoid transmission render targets and physical-material refraction passes.
    const glassMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vLocal;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vLocal = position;
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vLocal;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 view = vec3(0.0, 0.0, 1.0);
          float facing = max(dot(normal, view), 0.0);
          float fresnel = pow(1.0 - facing, 2.0);
          vec3 light = normalize(vec3(-0.6, 0.9, 1.0));
          vec3 secondLight = normalize(vec3(0.9, -0.3, 0.7));
          float shine = pow(max(dot(normal, normalize(light + view)), 0.0), 100.0);
          float secondShine = pow(max(dot(normal, normalize(secondLight + view)), 0.0), 140.0);
          float highlight = shine * 0.85 + secondShine * 0.5;
          float rim = smoothstep(0.95, 1.025, length(vLocal.xy));
          vec3 reflected = reflect(-view, normal);
          float bands = 0.5 + 0.5 * sin(reflected.x * 8.0 + reflected.y * 5.0 + reflected.z * 4.0);
          float silver = smoothstep(0.18, 0.75, bands);
          vec3 edge = mix(vec3(0.045, 0.065, 0.085), vec3(0.97, 0.99, 1.0), silver);
          edge = mix(edge, vec3(1.0), shine);
          fresnel = max(fresnel, rim * 0.88);
          vec3 color = mix(vec3(0.78, 0.83, 0.87), edge, fresnel);
          color = mix(color, vec3(1.0, 0.98, 0.91), min(highlight, 1.0));
          gl_FragColor = vec4(color, min(0.065 + fresnel * 0.82 + highlight, 0.94));
          #include <colorspace_fragment>
        }
      `,
    });
    resources.push(glassMaterial);

    // Analytic caustics on the wall: one inexpensive quad per disc, no
    // refraction buffers or shadow maps. Their projection follows each lens.
    const causticGeometry = new THREE.PlaneGeometry(1, 1);
    const causticMaterial = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          vec2 p = (vUv - 0.5) * 2.0;
          // Soft cast shadow beneath narrow, focused sunlight folds.
          float shadow = exp(-dot(p * vec2(1.55, 2.5), p * vec2(1.55, 2.5)) * 1.9);
          float envelope = exp(-p.x * p.x * 2.8) * (1.0 - smoothstep(0.72, 1.0, length(p)));
          float curveA = p.y - (0.28 * p.x * p.x - 0.18);
          float curveB = p.y - (-0.38 * p.x * p.x + 0.21);
          float curveC = p.y - (0.53 * p.x + 0.05);
          float folds = exp(-curveA * curveA * 2300.0)
                      + exp(-curveB * curveB * 1600.0) * 0.8
                      + exp(-curveC * curveC * 1900.0) * 0.5;
          float glow = exp(-curveA * curveA * 170.0) * 0.18
                     + exp(-curveB * curveB * 130.0) * 0.12;
          float light = min((folds * 0.88 + glow) * envelope, 1.0);
          float fringeBlue = exp(-pow((curveA - 0.025) * 55.0, 2.0)) * envelope;
          float fringeGold = exp(-pow((curveA + 0.025) * 55.0, 2.0)) * envelope;
          float fringe = max(fringeBlue, fringeGold) * 0.18;
          float shade = shadow * 0.38;
          vec3 color = vec3(0.47, 0.45, 0.42);
          color = mix(color, mix(vec3(0.77, 0.88, 1.0), vec3(1.0, 0.85, 0.57), fringeGold / max(fringeBlue + fringeGold, 0.001)), fringe / max(shade + fringe, 0.001));
          color = mix(color, vec3(1.0, 0.995, 0.97), light / max(shade + fringe + light, 0.001));
          gl_FragColor = vec4(color, min(shade + fringe + light, 0.96));
          #include <colorspace_fragment>
        }
      `,
    });
    resources.push(causticGeometry, causticMaterial);

    // A gently convex lens face bends studio reflections across the disc.
    const profile = [[0,-0.18],[0.35,-0.175],[0.7,-0.155],[0.94,-0.12],[1.025,-0.07],[1.045,0],[1.025,0.07],[0.94,0.12],[0.7,0.155],[0.35,0.175],[0,0.18]];
    const geometry = new THREE.LatheGeometry(profile.map(([r, z]) => new THREE.Vector2(r, z)), 64);
    geometry.rotateX(Math.PI / 2);
    geometry.scale(1, 1, 1.3);
    const logoGeometry = new THREE.PlaneGeometry(1, 1);
    resources.push(geometry, logoGeometry);
    const discs: Disc[] = [];
    const hits: THREE.Mesh[] = [];
    const loader = new THREE.TextureLoader();
    logos.forEach((logo, i) => {
      const radius = 0.75 + (i % 3) * 0.13;
      const group = new THREE.Group();
      group.scale.setScalar(radius);
      group.rotation.set(0.2 + (i % 3) * 0.22, (i % 2 ? -1 : 1) * (0.25 + (i % 4) * 0.16), (i % 3 - 1) * 0.3);
      const glass = new THREE.Mesh(geometry, glassMaterial);
      glass.userData.index = i;
      hits.push(glass);
      group.add(glass);
      loader.load(`/images/clients/${logo}.png`, texture => {
        if (disposed) { texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        // Preserve soft alpha edges and keep the logo crisp above the glass highlight.
        const ink = new THREE.MeshBasicMaterial({
          map: texture, side: THREE.DoubleSide, transparent: true,
          depthWrite: false, toneMapped: false,
        });
        resources.push(texture, ink);
        const label = new THREE.Mesh(logoGeometry, ink);
        label.renderOrder = 1;
        const aspect = texture.image.width / texture.image.height;
        label.scale.set(aspect > 1 ? 1.5 : 1.5 * aspect, aspect > 1 ? 1.5 / aspect : 1.5, 1);
        group.add(label);
      });
      scene.add(group);
      const caustic = new THREE.Mesh(causticGeometry, causticMaterial);
      caustic.renderOrder = -1;
      scene.add(caustic);
      discs.push({ group, caustic, radius, velocity: new THREE.Vector2(), spin: 0, home: new THREE.Vector2() });
    });

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let halfWidth = 8;
    let mobile = false;
    let entranceStartedAt = document.body.classList.contains("page-is-transitioning")
      ? Number.POSITIVE_INFINITY
      : performance.now();
    let entranceComplete = motion.matches;
    const transitionObserver = new MutationObserver(() => {
      if (
        !entranceComplete &&
        Number.isFinite(entranceStartedAt) === false &&
        !document.body.classList.contains("page-is-transitioning")
      ) {
        entranceStartedAt = performance.now();
      }
    });
    transitionObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const arrange = () => {
      discs.forEach((disc, i) => {
        // Keep the initial composition clear around the headline and toolbar.
        const positions = mobile
          ? [[-0.7,-1], [0.7,-2.4], [-0.7,-3.5], [0.8,-4], [-0.9,-2.2], [0.85,-0.6], [-0.6,-4], [0,-3], [0.8,-3.3], [-0.9,-0.4]]
          : [[-0.85,1.8], [-0.85,-0.6], [-0.67,-2.8], [-0.34,-3.4], [0.02,-3.55], [0.48,-3.4], [0.79,-2.3], [0.88,0], [0.8,2.5], [0.52,-1.8]];
        disc.radius = (mobile ? 0.53 : 0.92) + (i % 3) * (mobile ? 0.04 : 0.14);
        disc.group.scale.setScalar(entranceComplete ? disc.radius : 0.001);
        disc.home.set(positions[i][0] * (halfWidth - disc.radius), positions[i][1]);
        disc.group.position.set(disc.home.x, disc.home.y, 0);
        disc.velocity.set(0, 0);
        disc.spin = 0;
        disc.group.rotation.set(0.2 + (i % 3) * 0.22, (i % 2 ? -1 : 1) * (0.25 + (i % 4) * 0.16), (i % 3 - 1) * 0.3);
      });
    };
    const resize = () => {
      // Route transitions temporarily scale the entire incoming page. Layout
      // dimensions stay correct during that transform; bounding-client
      // dimensions do not and previously left the canvas permanently narrow.
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      halfWidth = 5 * width / Math.max(height, 1);
      mobile = width < 640;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      arrange();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    reset.current = arrange;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const point = new THREE.Vector3();
    const offset = new THREE.Vector2();
    let held: Disc | null = null;
    let activePointer: number | null = null;
    let lastMove = 0;
    const sampledVelocity = new THREE.Vector2();
    const previousPointer = new THREE.Vector2();
    function locate(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, point);
    }
    function down(event: PointerEvent) {
      if (activePointer !== null || event.button !== 0) return;
      locate(event);
      const hit = raycaster.intersectObjects(hits, false)[0];
      if (!hit) return;
      held = discs[hit.object.userData.index];
      activePointer = event.pointerId;
      offset.set(held.group.position.x - point.x, held.group.position.y - point.y);
      held.velocity.set(0, 0);
      previousPointer.set(held.group.position.x, held.group.position.y);
      lastMove = performance.now();
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    }
    function move(event: PointerEvent) {
      locate(event);
      if (!held || activePointer !== event.pointerId) {
        if (!held) canvas.style.cursor = raycaster.intersectObjects(hits, false).length ? "grab" : "default";
        return;
      }
      const now = performance.now();
      const dt = Math.max((now - lastMove) / 1000, 0.008);
      const x = THREE.MathUtils.clamp(point.x + offset.x, -halfWidth + held.radius, halfWidth - held.radius);
      const y = THREE.MathUtils.clamp(point.y + offset.y, -4.7 + held.radius, 4.5 - held.radius);
      sampledVelocity.set((x - previousPointer.x) / dt, (y - previousPointer.y) / dt).clampLength(0, 14);
      held.velocity.lerp(sampledVelocity, 1 - Math.exp(-25 * dt));
      previousPointer.set(x, y);
      held.spin = -held.velocity.x * 0.15;
      held.group.position.set(x, y, 0);
      lastMove = now;
    }
    function release(event?: PointerEvent) {
      if (event && activePointer !== event.pointerId) return;
      if (held && (!event || event.type !== "pointerup" || performance.now() - lastMove > 100)) held.velocity.set(0, 0);
      const id = activePointer;
      held = null;
      activePointer = null;
      if (id !== null && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
      canvas.style.cursor = "default";
    }
    const blur = () => release();
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("lostpointercapture", release);
    window.addEventListener("blur", blur);
    const contextLost = (event: Event) => { event.preventDefault(); element.classList.remove("is-ready"); ready = false; };
    canvas.addEventListener("webglcontextlost", contextLost);
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibility.observe(element);
    let previous = 0;
    let time = 0;
    let ready = false;
    renderer.setAnimationLoop((now) => {
      const dt = Math.min((now - previous) / 1000 || 0, 1 / 30);
      previous = now;
      if (!visible || document.hidden || renderer.getContext().isContextLost()) return;
      time += dt;
      if (!entranceComplete) {
        let allVisible = true;
        discs.forEach((disc, index) => {
          const delay = index * 55;
          const progress = THREE.MathUtils.clamp(
            (now - entranceStartedAt - delay) / 720,
            0,
            1,
          );
          const eased = 1 - Math.pow(1 - progress, 4);
          const overshoot = Math.sin(progress * Math.PI) * 0.045;
          disc.group.scale.setScalar(disc.radius * (eased + overshoot));
          if (progress < 1) allVisible = false;
        });
        entranceComplete = allVisible;
      }
      // Lightweight circle collision proxies constrain the 3D discs to the hero plane.
      for (const disc of discs) {
        if (disc === held) continue;
        const p = disc.group.position;
        p.x += disc.velocity.x * dt;
        p.y += disc.velocity.y * dt;
        disc.velocity.multiplyScalar(Math.exp(-0.48 * dt));
        if (!motion.matches) {
          disc.velocity.x += (disc.home.x - p.x) * 0.085 * dt;
          disc.velocity.y += (disc.home.y - p.y) * 0.085 * dt;
          disc.group.rotation.x += Math.sin(time * 0.65 + disc.home.x) * 0.035 * dt;
          disc.group.rotation.y += Math.cos(time * 0.5 + disc.home.y) * 0.065 * dt;
        }
        disc.group.rotation.z += disc.spin * dt;
        disc.spin *= Math.exp(-1.1 * dt);
        const boundX = Math.max(0, halfWidth - disc.radius);
        if (Math.abs(p.x) > boundX) { p.x = Math.sign(p.x) * boundX; disc.velocity.x *= -0.72; }
        if (p.y < -4.7 + disc.radius || p.y > 4.5 - disc.radius) {
          p.y = THREE.MathUtils.clamp(p.y, -4.7 + disc.radius, 4.5 - disc.radius);
          disc.velocity.y *= -0.72;
        }
      }
      for (let i = 0; i < discs.length; i++) for (let j = i + 1; j < discs.length; j++) {
        const a = discs[i], b = discs[j];
        const dx = b.group.position.x - a.group.position.x, dy = b.group.position.y - a.group.position.y;
        const distance = Math.hypot(dx, dy);
        const separation = (a.radius + b.radius) * 0.85;
        if (distance >= separation || distance < 0.0001) continue;
        const nx = dx / distance, ny = dy / distance;
        const wa = a === held ? 0 : 1, wb = b === held ? 0 : 1;
        const correction = (separation - distance) / (wa + wb);
        a.group.position.x -= nx * correction * wa; a.group.position.y -= ny * correction * wa;
        b.group.position.x += nx * correction * wb; b.group.position.y += ny * correction * wb;
        const speed = (b.velocity.x - a.velocity.x) * nx + (b.velocity.y - a.velocity.y) * ny;
        if (speed < 0) {
          const impulse = -1.7 * speed / (wa + wb);
          a.velocity.x -= impulse * nx * wa; a.velocity.y -= impulse * ny * wa;
          b.velocity.x += impulse * nx * wb; b.velocity.y += impulse * ny * wb;
          a.spin -= impulse * 0.06; b.spin += impulse * 0.06;
        }
      }
      for (const disc of discs) {
        const tilt = Math.sin(disc.group.rotation.y);
        const visibleRadius = disc.group.scale.x;
        // Sunlight comes from the upper left, projecting down and to the right.
        disc.caustic.position.set(
          disc.group.position.x + 0.62 + tilt * 0.2,
          disc.group.position.y - 0.65, -1.2,
        );
        disc.caustic.scale.set(
          visibleRadius * (3.5 + tilt * 0.45),
          visibleRadius * 2.5,
          1,
        );
        disc.caustic.rotation.z = -0.45 + disc.group.rotation.z * 0.12;
      }
      renderer.render(scene, camera);
      if (!ready) { element.classList.add("is-ready"); ready = true; }
    });
    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect(); visibility.disconnect(); transitionObserver.disconnect();
      window.removeEventListener("blur", blur);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", release);
      canvas.removeEventListener("lostpointercapture", release);
      canvas.removeEventListener("webglcontextlost", contextLost);
      resources.forEach(resource => resource.dispose());
      renderer.dispose();
      canvas.remove();
      element.classList.remove("is-ready");
      reset.current = () => {};
    };
  }, []);

  return <>
    <div ref={host} className="about-art about-glass" />
    <div className="about-glass-controls">
      <span>Grab a logo. Give it a spin.</span>
      <button type="button" onClick={() => reset.current()} aria-label="Reset glass logo positions">Reset ↺</button>
    </div>
  </>;
}

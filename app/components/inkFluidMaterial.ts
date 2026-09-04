import * as THREE from "three";

// Object-space coordinates keep the ink attached to the logo as it turns.
// Three depth samples suggest suspended pigment without a costly fluid solver.
const vertexShader = /* glsl */ `
  varying vec4 vClipPosition;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
    vClipPosition = gl_Position;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uTrail;
  uniform vec2 uVelocity;
  uniform float uStrength;
  uniform float uAspect;
  uniform mat4 uViewToModel;
  uniform vec3 uCenter;
  uniform float uSize;
  varying vec4 vClipPosition;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  // Smooth, nested flow fields: no textures, seams, or loop reset.
  vec3 flow(vec3 p, float t) {
    vec3 q = p;
    q += 0.48 * sin(p.yzx * 2.1 + vec3(t * 0.7, -t * 0.6, t * 0.4));
    q += 0.24 * sin(q.zxy * 3.2 + vec3(-t * 0.4, t * 0.5, t * 0.6));
    return q;
  }
  float pigment(vec3 p, float t) {
    vec3 q = flow(p, t);
    // Unequal scales and nested warping break up the old parallel wave bands.
    float broad = sin(q.x * 2.3 + q.y * 1.7 + sin(q.z * 2.1 + t * 0.19));
    float eddy = sin(q.y * 3.7 - q.z * 2.4 + sin(q.x * 2.6 - t * 0.21));
    return broad * 0.68 + eddy * 0.32;
  }
  void main() {
    vec3 p = (vPosition - uCenter) / uSize * 3.4;
    float t = uTime * 0.20;
    vec2 screen = vClipPosition.xy / vClipPosition.w;
    vec2 aspect = vec2(uAspect, 1.0);
    vec2 offset = (screen - uPointer) * aspect;
    vec2 wake = (screen - uTrail) * aspect;
    float influence = exp(-dot(offset, offset) * 4.5) * uStrength;
    float wakeInfluence = exp(-dot(wake, wake) * 3.0) * uStrength;
    float speed = min(length(uVelocity), 2.0);
    // A broad pull, local eddy, and delayed wake follow the mouse with inertia.
    vec2 swirl = vec2(-offset.y, offset.x) * (0.7 + speed * 0.45);
    vec2 drag = (swirl - uVelocity * aspect * 0.38) * influence;
    drag += vec2(-wake.y, wake.x) * wakeInfluence * 0.48;
    vec3 localDrag = (uViewToModel * vec4(drag, 0.0, 0.0)).xyz;
    p += localDrag * 1.7;
    p.z += (influence + wakeInfluence * 0.35) * (0.28 + speed * 0.12);
    float front = pigment(p, t);
    float middle = pigment(p + vec3(0.17, -0.12, 0.38), t - 0.35);
    float back = pigment(p + vec3(-0.12, 0.2, 0.78), t - 0.7);
    float density = front * 0.56 + middle * 0.29 + back * 0.15;

    vec3 burgundy = vec3(0.075, 0.001, 0.005);
    vec3 crimson = vec3(0.43, 0.002, 0.012);
    vec3 scarlet = vec3(0.72, 0.014, 0.026);
    vec3 color = mix(burgundy, crimson, smoothstep(-0.8, 0.15, density));
    color = mix(color, scarlet, smoothstep(0.05, 0.82, density));

    // Soft light travels along the folds underneath the glossy shell.
    float fold = exp(-9.0 * abs(front + 0.12));
    float innerLight = smoothstep(-0.4, 0.8, middle) * fold;
    color += vec3(0.38, 0.065, 0.065) * innerLight;

    vec3 normal = normalize(vNormal);
    vec3 view = normalize(vViewPosition);
    vec3 warped = flow(p, t);
    vec3 liquidNormal = normalize(normal + vec3(
      sin(warped.y * 2.8 + t * 0.3),
      cos(warped.x * 2.5 - t * 0.2),
      sin(warped.z * 2.2 + warped.x)
    ) * 0.24);
    vec3 key = normalize(vec3(-0.55, 0.8, 1.4));
    vec3 halfVector = normalize(key + view);
    float diffuse = max(dot(normal, key), 0.0);
    float gloss = pow(max(dot(liquidNormal, halfVector), 0.0), 46.0);
    float softGloss = pow(max(dot(liquidNormal, halfVector), 0.0), 9.0);
    float rim = pow(1.0 - abs(dot(normal, view)), 3.0);
    color *= 0.72 + diffuse * 0.38;
    color += vec3(1.0, 0.7, 0.65) * gloss * 0.32;
    color += vec3(0.32, 0.06, 0.055) * softGloss * 0.32;
    color += vec3(0.55, 0.025, 0.035) * rim * 0.34;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createInkFluidMaterial(bounds: THREE.Box3) {
  const size = bounds.getSize(new THREE.Vector3());
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uTrail: { value: new THREE.Vector2() },
      uVelocity: { value: new THREE.Vector2() },
      uStrength: { value: 0 },
      uAspect: { value: 1 },
      uViewToModel: { value: new THREE.Matrix4() },
      uCenter: { value: bounds.getCenter(new THREE.Vector3()) },
      uSize: { value: Math.max(size.x, size.y, size.z, 0.001) },
    },
    vertexShader,
    fragmentShader,
  });
}

import { Component, lazy, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Prevents a WebGL unavailability (e.g. sandboxed environments) from crashing the whole app.
class WebGLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

const CosmosStation = lazy(() => import("./stations/CosmosStation.jsx"));
const RelativityStation = lazy(
  () => import("./stations/RelativityStation.jsx"),
);
const QuantumStation = lazy(() => import("./stations/QuantumStation.jsx"));
const StandardStation = lazy(
  () => import("./stations/StandardModelStation.jsx"),
);

// Gaussian helper for particle layouts
function gauss() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generatePositions(shape, count, radius) {
  const a = new Float32Array(count * 3);
  const put = (i, x, y, z) => {
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = z;
  };
  for (let i = 0; i < count; i++) {
    if (shape === "sphere") {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      put(
        i,
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    } else if (shape === "spiral") {
      const t = Math.random();
      const r = radius * Math.sqrt(t);
      const arm = Math.floor(Math.random() * 3) * ((Math.PI * 2) / 3);
      const angle = r * 0.8 + arm + (Math.random() - 0.5) * 0.6;
      put(
        i,
        Math.cos(angle) * r + gauss() * 0.3,
        Math.sin(angle) * r + gauss() * 0.3,
        gauss() * radius * 0.06,
      );
    } else if (shape === "cluster") {
      put(i, gauss() * radius, gauss() * radius, gauss() * radius);
    } else if (shape === "shells") {
      const shell = (Math.floor(Math.random() * 3) + 1) / 3;
      const r = radius * shell;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      put(
        i,
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    } else {
      const angle = (i / count) * Math.PI * 2;
      put(i, Math.cos(angle) * radius, Math.sin(angle) * radius, gauss() * 0.2);
    }
  }
  return a;
}

function makeDotTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.85)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function PointLayer({
  shape,
  count,
  radius,
  color,
  size,
  center,
  texture,
  zoomRef,
  span = 26,
  baseZ = -7,
  sigma = 0.15,
  spin = 0.0005,
}) {
  const ref = useRef();
  const matRef = useRef();
  const positions = useMemo(
    () => generatePositions(shape, count, radius),
    [shape, count, radius],
  );
  useFrame(() => {
    const p = zoomRef.current;
    const d = p - center;
    if (ref.current) {
      ref.current.position.z = baseZ + d * span;
      ref.current.rotation.z += spin;
    }
    if (matRef.current) {
      const opacity = Math.exp(-(d * d) / (2 * sigma * sigma));
      matRef.current.opacity = opacity;
      if (ref.current) ref.current.visible = opacity > 0.012;
    }
  });
  return (
    <points ref={ref} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={color}
        size={size}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, -2);
  });
  return null;
}

const LAYERS = [
  {
    shape: "sphere",
    count: 1600,
    radius: 11,
    color: "#7c83ff",
    size: 0.05,
    center: 0.0,
  },
  {
    shape: "spiral",
    count: 2200,
    radius: 8,
    color: "#aab6ff",
    size: 0.055,
    center: 0.19,
    spin: 0.0011,
  },
  {
    shape: "cluster",
    count: 900,
    radius: 2.4,
    color: "#ffb24d",
    size: 0.14,
    center: 0.4,
  },
  {
    shape: "shells",
    count: 1300,
    radius: 6,
    color: "#36e08a",
    size: 0.06,
    center: 0.6,
    spin: 0.0016,
  },
  {
    shape: "cluster",
    count: 120,
    radius: 1.1,
    color: "#ff6b9d",
    size: 0.22,
    center: 0.8,
  },
  {
    shape: "few",
    count: 3,
    radius: 0.7,
    color: "#ff4d8d",
    size: 0.5,
    center: 1.0,
  },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Ambient thematic decoration beside the content: scales up across [zStart, zEnd]
// and fades in/out at the edges of that range, independently of the star layers above.
function RangeDecor({
  zoomRef,
  zStart,
  zEnd,
  x,
  y = 0,
  baseZ = -4.5,
  scaleFrom = 1,
  scaleTo = 1.5,
  fadeWidth = 0.05,
  children,
}) {
  const groupRef = useRef();
  const initRef = useRef(false);
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    if (!initRef.current) {
      g.traverse((o) => {
        if (o.material) o.userData.baseOpacity = o.material.opacity;
      });
      initRef.current = true;
    }
    const z = zoomRef.current;
    const t = clamp01((z - zStart) / Math.max(0.0001, zEnd - zStart));
    g.scale.setScalar(scaleFrom + (scaleTo - scaleFrom) * t);
    // Fade strictly inside [zStart, zEnd] — never bleeds into a neighboring
    // band's range, so two themes are never visible at the same time.
    const fadeIn = clamp01((z - zStart) / fadeWidth);
    const fadeOut = clamp01((zEnd - z) / fadeWidth);
    const fade = Math.min(fadeIn, fadeOut);
    g.visible = fade > 0.003;
    if (g.visible) {
      g.traverse((o) => {
        if (o.material && o.userData.baseOpacity != null) {
          o.material.opacity = o.userData.baseOpacity * fade;
        }
      });
    }
  });
  return (
    <group ref={groupRef} position={[x, y, baseZ]}>
      {children}
    </group>
  );
}

// ─── Decor: galaxy cluster (cosmos anchor + transit) ──────────────────────────
function GalaxyCluster({ mirror = 1 }) {
  const ref = useRef();
  const positions = useMemo(() => generatePositions("spiral", 260, 1.3), []);
  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.0014 * mirror;
  });
  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#aab6ff"
          size={0.045}
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshBasicMaterial color="#dde0ff" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// ─── Decor: solar system + stars (relativity anchor) ─────────────────────────
function SolarSystemCluster({ mirror = 1 }) {
  const orbitRef = useRef();
  const starPositions = useMemo(() => generatePositions("sphere", 60, 2.4), []);
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.children.forEach((child, i) => {
        const speed = 0.4 + i * 0.25;
        const r = 0.45 + i * 0.32;
        child.position.x =
          Math.cos(state.clock.elapsedTime * speed * mirror) * r;
        child.position.y =
          Math.sin(state.clock.elapsedTime * speed * mirror) * r;
      });
    }
  });
  const PLANETS = ["#ffcc66", "#6090ff", "#ff8844"];
  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.03}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
      <mesh>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshBasicMaterial
          color="#ffe9a8"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {PLANETS.map((c, i) => (
        <mesh key={i} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.45 + i * 0.32, 0.01, 6, 48]} />
          <meshBasicMaterial color={c} transparent opacity={0.25} />
        </mesh>
      ))}
      <group ref={orbitRef}>
        {PLANETS.map((c, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.07 + i * 0.015, 10, 10]} />
            <meshBasicMaterial color={c} transparent opacity={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Decor: lone planets (relativity → quantum transit) ──────────────────────
function PlanetsCluster({ mirror = 1 }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.003 * mirror;
  });
  const BODIES = [
    { r: 0.32, color: "#ff9d6c", pos: [0, 0.3, 0], ring: true },
    { r: 0.18, color: "#7fa8ff", pos: [-0.55, -0.35, 0.2], ring: false },
    { r: 0.12, color: "#c9b08a", pos: [0.5, -0.45, -0.1], ring: false },
  ];
  return (
    <group ref={ref}>
      {BODIES.map((b, i) => (
        <group key={i} position={b.pos}>
          <mesh>
            <sphereGeometry args={[b.r, 16, 16]} />
            <meshBasicMaterial color={b.color} transparent opacity={0.9} />
          </mesh>
          {b.ring && (
            <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
              <torusGeometry args={[b.r * 1.7, 0.025, 6, 40]} />
              <meshBasicMaterial color="#ffcc99" transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ─── Decor: atoms, waves & photons (quantum anchor + transit) ────────────────
function QuantumCluster({ mirror = 1 }) {
  const e1 = useRef();
  const e2 = useRef();
  const photonRef = useRef();
  const wavePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push(
        new THREE.Vector3((t - 0.5) * 1.6, Math.sin(t * Math.PI * 4) * 0.18, 0),
      );
    }
    return pts;
  }, []);
  const waveGeom = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(wavePoints),
    [wavePoints],
  );
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (e1.current) e1.current.rotation.z = t * 1.2 * mirror;
    if (e2.current) e2.current.rotation.x = t * 0.9 * mirror;
    if (photonRef.current) {
      const p = (t * 0.5 * mirror) % 1;
      photonRef.current.position.set(
        (p - 0.5) * 1.6,
        Math.sin(p * Math.PI * 4) * 0.18,
        0.05,
      );
    }
  });
  return (
    <group>
      {/* Mini atom */}
      <group position={[0, 0.75, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#80ffcc" transparent opacity={0.95} />
        </mesh>
        <group ref={e1}>
          <mesh>
            <torusGeometry args={[0.36, 0.01, 6, 32]} />
            <meshBasicMaterial color="#36e08a" transparent opacity={0.55} />
          </mesh>
          <mesh position={[0.36, 0, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#80ffcc" transparent opacity={0.9} />
          </mesh>
        </group>
        <group ref={e2} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.36, 0.01, 6, 32]} />
            <meshBasicMaterial color="#20c070" transparent opacity={0.45} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#60f0aa" transparent opacity={0.85} />
          </mesh>
        </group>
      </group>
      {/* Sine wave */}
      <line geometry={waveGeom} position={[0, -0.55, 0]}>
        <lineBasicMaterial color="#36e08a" transparent opacity={0.6} />
      </line>
      {/* Photon traveling along the wave */}
      <mesh ref={photonRef} position={[0, -0.55, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── Decor: quark triad + strong-force lines (standard model anchor → end) ───
function QuarkTriad({ mirror = 1 }) {
  const ref = useRef();
  const QUARK_COLORS = ["#ff4d4d", "#4dff88", "#4d88ff"];
  const POSITIONS = [
    [0, 0.42, 0],
    [-0.36, -0.22, 0],
    [0.36, -0.22, 0],
  ];
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01 * mirror;
  });
  const lineGeoms = useMemo(() => {
    return [
      [0, 1],
      [1, 2],
      [2, 0],
    ].map(([a, b]) => {
      const A = new THREE.Vector3(...POSITIONS[a]);
      const B = new THREE.Vector3(...POSITIONS[b]);
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const p = A.clone().lerp(B, t);
        const perp = new THREE.Vector3(-(B.y - A.y), B.x - A.x, 0).normalize();
        p.add(perp.multiplyScalar(Math.sin(t * Math.PI * 5) * 0.045));
        pts.push(p);
      }
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, []);
  return (
    <group ref={ref}>
      {lineGeoms.map((geom, i) => (
        <line key={i} geometry={geom}>
          <lineBasicMaterial color="#ff4d8d" transparent opacity={0.55} />
        </line>
      ))}
      {POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshBasicMaterial
            color={QUARK_COLORS[i]}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
}

// Each band spans an anchor and the travel up to the next one (the standard
// model band runs through to the end of the journey), per the requested story:
// galaxies → solar systems (anchor only) → planets (transit) → quantum → quarks.
// Bands are contiguous (each one ends exactly where the next starts) so only
// RangeDecor's small fadeWidth crossfades them — they never both show at once.
function buildDecorBands(anchors, maxZ) {
  if (!anchors || anchors.length < 4) return [];
  const [, a1, a2, a3] = anchors;
  const ANCHOR_HALF = 0.12; // half-width of the "at the anchor" zone around a1
  return [
    {
      Theme: GalaxyCluster,
      zStart: 0,
      zEnd: a1 - ANCHOR_HALF,
      scaleFrom: 1.0,
      scaleTo: 1.45,
    },
    {
      Theme: SolarSystemCluster,
      zStart: a1 - ANCHOR_HALF,
      zEnd: a1 + ANCHOR_HALF,
      scaleFrom: 1.0,
      scaleTo: 1.15,
    },
    {
      Theme: PlanetsCluster,
      zStart: a1 + ANCHOR_HALF,
      zEnd: a2,
      scaleFrom: 0.9,
      scaleTo: 1.8,
    },
    {
      Theme: QuantumCluster,
      zStart: a2,
      zEnd: a3,
      scaleFrom: 1.0,
      scaleTo: 1.6,
    },
    { Theme: QuarkTriad, zStart: a3, zEnd: maxZ, scaleFrom: 1.0, scaleTo: 1.7 },
  ];
}

const STATION_SCENES = [
  CosmosStation,
  RelativityStation,
  QuantumStation,
  StandardStation,
];

function ZoomWorld({ zoomRef, docked, onObjectClick, maxZ, anchors }) {
  const texture = useMemo(() => makeDotTexture(), []);
  const farStars = useMemo(() => generatePositions("sphere", 1200, 30), []);
  const farRef = useRef();
  useFrame(() => {
    if (farRef.current) farRef.current.rotation.y += 0.0002;
  });

  const decorBands = useMemo(
    () => buildDecorBands(anchors, maxZ),
    [anchors, maxZ],
  );

  const StationScene = docked !== null ? STATION_SCENES[docked] : null;

  return (
    <>
      <CameraRig />
      <points ref={farRef} position={[0, 0, -18]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farStars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#9aa7ff"
          size={0.04}
          map={texture}
          transparent
          opacity={0.5}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {LAYERS.map((layer, i) => (
        <PointLayer
          key={i}
          texture={texture}
          zoomRef={zoomRef}
          {...layer}
          center={layer.center * maxZ}
          sigma={(layer.sigma ?? 0.15) * maxZ}
        />
      ))}

      {/* Thematic decoration to the sides of the content, keyed to the same anchors */}
      {decorBands.map(({ Theme, zStart, zEnd, scaleFrom, scaleTo }, i) => (
        <group key={i}>
          <RangeDecor
            zoomRef={zoomRef}
            zStart={zStart}
            zEnd={zEnd}
            x={-8}
            scaleFrom={scaleFrom}
            scaleTo={scaleTo}>
            <Theme mirror={1} />
          </RangeDecor>
          <RangeDecor
            zoomRef={zoomRef}
            zStart={zStart}
            zEnd={zEnd}
            x={8}
            scaleFrom={scaleFrom}
            scaleTo={scaleTo}>
            <Theme mirror={-1} />
          </RangeDecor>
        </group>
      ))}

      {/* Interactive 3D objects for the current station */}
      {StationScene && (
        <Suspense fallback={null}>
          <StationScene onObjectClick={onObjectClick} />
        </Suspense>
      )}
    </>
  );
}

export default function ZoomBackground({
  zoomRef,
  docked,
  onObjectClick,
  maxZ = 1,
  anchors,
}) {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: docked !== null ? "auto" : "none" }}>
      <WebGLBoundary>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}>
          <color attach="background" args={["#000007"]} />
          <fog attach="fog" args={["#000007", 14, 30]} />
          <ZoomWorld
            zoomRef={zoomRef}
            docked={docked}
            onObjectClick={onObjectClick}
            maxZ={maxZ}
            anchors={anchors}
          />
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}

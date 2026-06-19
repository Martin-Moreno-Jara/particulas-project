import { Component, lazy, Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Prevents a WebGL unavailability (e.g. sandboxed environments) from crashing the whole app.
class WebGLBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

const CosmosStation      = lazy(() => import('./stations/CosmosStation.jsx'))
const RelativityStation  = lazy(() => import('./stations/RelativityStation.jsx'))
const QuantumStation     = lazy(() => import('./stations/QuantumStation.jsx'))
const StandardStation    = lazy(() => import('./stations/StandardModelStation.jsx'))

// Gaussian helper for particle layouts
function gauss() {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function generatePositions(shape, count, radius) {
  const a = new Float32Array(count * 3)
  const put = (i, x, y, z) => { a[i*3]=x; a[i*3+1]=y; a[i*3+2]=z }
  for (let i = 0; i < count; i++) {
    if (shape === 'sphere') {
      const r = radius * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      put(i, r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi))
    } else if (shape === 'spiral') {
      const t = Math.random()
      const r = radius * Math.sqrt(t)
      const arm = Math.floor(Math.random() * 3) * ((Math.PI * 2) / 3)
      const angle = r * 0.8 + arm + (Math.random() - 0.5) * 0.6
      put(i, Math.cos(angle)*r + gauss()*0.3, Math.sin(angle)*r + gauss()*0.3, gauss()*radius*0.06)
    } else if (shape === 'cluster') {
      put(i, gauss()*radius, gauss()*radius, gauss()*radius)
    } else if (shape === 'shells') {
      const shell = (Math.floor(Math.random() * 3) + 1) / 3
      const r = radius * shell
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      put(i, r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi))
    } else {
      const angle = (i / count) * Math.PI * 2
      put(i, Math.cos(angle)*radius, Math.sin(angle)*radius, gauss()*0.2)
    }
  }
  return a
}

function makeDotTexture() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = size; c.height = size
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.3, 'rgba(255,255,255,0.85)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(c)
}

function PointLayer({ shape, count, radius, color, size, center, texture, zoomRef, span=26, baseZ=-7, sigma=0.15, spin=0.0005 }) {
  const ref = useRef()
  const matRef = useRef()
  const positions = useMemo(() => generatePositions(shape, count, radius), [shape, count, radius])
  useFrame(() => {
    const p = zoomRef.current
    const d = p - center
    if (ref.current) {
      ref.current.position.z = baseZ + d * span
      ref.current.rotation.z += spin
    }
    if (matRef.current) {
      const opacity = Math.exp(-(d * d) / (2 * sigma * sigma))
      matRef.current.opacity = opacity
      if (ref.current) ref.current.visible = opacity > 0.012
    }
  })
  return (
    <points ref={ref} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef} color={color} size={size} map={texture}
        transparent opacity={0} depthWrite={false}
        sizeAttenuation blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CameraRig() {
  const { camera, pointer } = useThree()
  useFrame(() => {
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.04
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.04
    camera.lookAt(0, 0, -2)
  })
  return null
}

const LAYERS = [
  { shape:'sphere', count:1600, radius:11, color:'#7c83ff', size:0.05, center:0.0  },
  { shape:'spiral', count:2200, radius:8,  color:'#aab6ff', size:0.055,center:0.19, spin:0.0011 },
  { shape:'cluster',count:900,  radius:2.4,color:'#ffb24d', size:0.14, center:0.4  },
  { shape:'shells', count:1300, radius:6,  color:'#36e08a', size:0.06, center:0.6, spin:0.0016 },
  { shape:'cluster',count:120,  radius:1.1,color:'#ff6b9d', size:0.22, center:0.8  },
  { shape:'few',    count:3,    radius:0.7,color:'#ff4d8d', size:0.5,  center:1.0  },
]

const STATION_SCENES = [CosmosStation, RelativityStation, QuantumStation, StandardStation]

function ZoomWorld({ zoomRef, docked, onObjectClick, maxZ }) {
  const texture = useMemo(() => makeDotTexture(), [])
  const farStars = useMemo(() => generatePositions('sphere', 1200, 30), [])
  const farRef = useRef()
  useFrame(() => { if (farRef.current) farRef.current.rotation.y += 0.0002 })

  const StationScene = docked !== null ? STATION_SCENES[docked] : null

  return (
    <>
      <CameraRig />
      <points ref={farRef} position={[0, 0, -18]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farStars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#9aa7ff" size={0.04} map={texture} transparent opacity={0.5}
          depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending}
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

      {/* Interactive 3D objects for the current station */}
      {StationScene && (
        <Suspense fallback={null}>
          <StationScene onObjectClick={onObjectClick} />
        </Suspense>
      )}
    </>
  )
}

export default function ZoomBackground({ zoomRef, docked, onObjectClick, maxZ = 1 }) {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: docked !== null ? 'auto' : 'none' }}
    >
      <WebGLBoundary>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#000007']} />
        <fog attach="fog" args={['#000007', 14, 30]} />
        <ZoomWorld zoomRef={zoomRef} docked={docked} onObjectClick={onObjectClick} maxZ={maxZ} />
      </Canvas>
      </WebGLBoundary>
    </div>
  )
}

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useInView } from '../../hooks/useInView.js'

// Sim R1 — Malla de espacio-tiempo deformable: la masa hunde la cuadrícula y un
// fotón sigue la curvatura. A masa máxima (agujero negro) el fotón queda atrapado.
const SIZE = 20
const SEG = 46
const DEPTH = 5

function depthAt(r, mass) {
  return mass * DEPTH * Math.exp(-(r * r) / (2 * 3.0 * 3.0))
}

function Sheet({ massRef, photonRef, onEnd }) {
  const geomRef = useRef()
  const matRef = useRef()
  const photonMesh = useRef()
  const horizon = useRef()
  const green = new THREE.Color('#36e08a')
  const red = new THREE.Color('#ff4d6a')

  useFrame(() => {
    const mass = massRef.current
    const geom = geomRef.current
    if (geom) {
      const pos = geom.attributes.position
      const arr = pos.array
      for (let i = 0; i < arr.length; i += 3) {
        const px = arr[i]
        const py = arr[i + 1]
        const r = Math.sqrt(px * px + py * py)
        arr[i + 2] = -depthAt(r, mass)
      }
      pos.needsUpdate = true
    }
    if (matRef.current) matRef.current.color.copy(green).lerp(red, mass)

    // Horizonte de eventos visible solo cerca de la masa máxima
    if (horizon.current) {
      const show = mass > 0.8
      horizon.current.visible = show
      const hr = Math.max(0.001, (mass - 0.8) * 6)
      horizon.current.scale.set(hr, hr, hr)
      horizon.current.position.z = -depthAt(0, mass) + 0.05
    }

    // Integración del fotón sobre el plano (coordenadas locales x,y)
    const ph = photonRef.current
    if (ph && ph.active) {
      const r2 = ph.x * ph.x + ph.y * ph.y + 0.25
      const r = Math.sqrt(r2)
      const a = (-0.9 * mass) / (r2 * r) // aceleración tipo gravedad
      ph.vx += a * ph.x
      ph.vy += a * ph.y
      ph.x += ph.vx
      ph.y += ph.vy
      const horizonR = mass > 0.8 ? (mass - 0.8) * 6 : 0
      if (r < horizonR + 0.4 && mass > 0.8) {
        ph.active = false
        onEnd('captured')
      } else if (Math.abs(ph.x) > SIZE / 2 || Math.abs(ph.y) > SIZE / 2) {
        ph.active = false
        onEnd('escaped')
      }
      if (photonMesh.current) {
        photonMesh.current.visible = ph.active
        photonMesh.current.position.set(ph.x, ph.y, -depthAt(r, mass) + 0.25)
      }
    } else if (photonMesh.current) {
      photonMesh.current.visible = false
    }
  })

  return (
    <group rotation={[-1.0, 0, 0]}>
      <mesh>
        <planeGeometry args={[SIZE, SIZE, SEG, SEG]} ref={geomRef} />
        <meshBasicMaterial ref={matRef} color="#36e08a" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh ref={horizon} visible={false}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={photonMesh} visible={false}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color="#fff7c0" />
      </mesh>
    </group>
  )
}

export default function SpacetimeMesh() {
  const [mass, setMass] = useState(0.35)
  const massRef = useRef(0.35)
  const photonRef = useRef({ active: false })
  const [status, setStatus] = useState('')
  const [viewRef, inView] = useInView({ threshold: 0.1 })

  const onMass = (e) => {
    const v = parseFloat(e.target.value)
    massRef.current = v
    setMass(v)
  }

  const launch = () => {
    photonRef.current = { x: -9.5, y: 2.6, vx: 0.17, vy: 0, active: true }
    setStatus('El fotón viaja por el espacio curvado…')
  }

  const onEnd = (result) => {
    setStatus(result === 'captured' ? '🕳️ El fotón no pudo escapar del agujero negro.' : 'El fotón salió desviado por la curvatura.')
  }

  return (
    <div>
      <div ref={viewRef} className="overflow-hidden rounded-lg bg-black" style={{ height: 340 }}>
        <Canvas
          camera={{ position: [0, 1.5, 15], fov: 45 }}
          dpr={[1, 1.75]}
          frameloop={inView ? 'always' : 'never'}
        >
          <color attach="background" args={['#04060a']} />
          <Sheet massRef={massRef} photonRef={photonRef} onEnd={onEnd} />
        </Canvas>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex justify-between sim-label">
            <span>Masa del objeto</span>
            <span>{mass > 0.8 ? 'Agujero negro' : mass > 0.45 ? 'Estrella masiva' : 'Planeta'}</span>
          </div>
          <input type="range" min="0" max="1" step="0.01" value={mass} onChange={onMass} className="w-full" />
        </div>
        <div className="flex items-center gap-3">
          <button className="sim-btn" onClick={launch}>
            ☄ Lanzar fotón
          </button>
          <span className="text-sm text-text-secondary">{status}</span>
        </div>
      </div>
    </div>
  )
}

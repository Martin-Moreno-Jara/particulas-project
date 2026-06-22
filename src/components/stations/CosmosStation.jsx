import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from './Hotspot.jsx'

const ACC = '#5b7cff'

// ─── Galaxy: spiral point cloud ───────────────────────────────────────────────
function SpiralGalaxy() {
  const ref = useRef()
  const positions = useMemo(() => {
    const N = 700
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const t = i / N
      const r = 0.15 + t * 1.8
      const arm = Math.floor(Math.random() * 3) * ((Math.PI * 2) / 3)
      const angle = r * 2.8 + arm + (Math.random() - 0.5) * 0.55
      const spread = Math.random() * 0.08
      arr[i * 3]     = Math.cos(angle) * r + (Math.random() - 0.5) * spread * r
      arr[i * 3 + 1] = Math.sin(angle) * r + (Math.random() - 0.5) * spread * r
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.12
    }
    return arr
  }, [])

  useFrame(() => { if (ref.current) ref.current.rotation.z += 0.0018 })

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#aab6ff" size={0.05} transparent opacity={0.85}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </points>
      {/* Bright nucleus */}
      <mesh>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#dde0ff" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// ─── CMB: wireframe sphere ─────────────────────────────────────────────────────
function CMBSphere() {
  const ref = useRef()
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.004 })
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.9, 16, 10]} />
        <meshBasicMaterial color="#6090ff" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshBasicMaterial color="#4060cc" transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

// ─── Dark matter: two perpendicular tori ──────────────────────────────────────
function DarkMatterRings() {
  const ref = useRef()
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.006 })
  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[0.85, 0.06, 8, 48]} />
        <meshBasicMaterial color="#8899ff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.04, 8, 48]} />
        <meshBasicMaterial color="#6677cc" transparent opacity={0.45} />
      </mesh>
      {/* Galaxy dot at center */}
      <mesh>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshBasicMaterial color="#aab6ff" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// ─── Cosmic timeline: row of milestone spheres ─────────────────────────────────
function Timeline() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        child.scale.setScalar(0.9 + 0.1 * Math.sin(state.clock.elapsedTime * 1.2 + i))
      })
    }
  })
  const MILESTONES = ['#2244aa', '#3355bb', '#4466cc', '#5577dd', '#7799ff', '#99aaff', '#ffffff']
  return (
    <group ref={ref}>
      {MILESTONES.map((c, i) => (
        <mesh key={i} position={[(i - 3) * 0.32, 0, 0]}>
          <sphereGeometry args={[i === 6 ? 0.14 : 0.08, 8, 8]} />
          <meshBasicMaterial color={c} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* Line connecting them */}
      {[...Array(6)].map((_, i) => {
        const pts = [
          new THREE.Vector3((i - 3) * 0.32 + 0.08, 0, 0),
          new THREE.Vector3((i - 3 + 1) * 0.32 - 0.08, 0, 0),
        ]
        const geom = new THREE.BufferGeometry().setFromPoints(pts)
        return (
          <line key={i} geometry={geom}>
            <lineBasicMaterial color="#4466aa" transparent opacity={0.45} />
          </line>
        )
      })}
    </group>
  )
}

const EXP  = (expId) => ({ type: 'experiment', expId })
const INFO = (title, accent, facts, expId = null, video = null) => ({ type: 'info', title, accent, facts, expId, video })

export default function CosmosStation({ onObjectClick }) {
  return (
    <group>
      {/* grid top-left */}
      <Hotspot
        position={[-2.2, 0.9, 0]}
        color={ACC}
        label="Galaxia espiral"
        hint="El universo se expande desde el Big Bang"
        size={1.0}
        onSelect={() => onObjectClick(EXP('cosmos-expansion'))}
      >
        <SpiralGalaxy />
      </Hotspot>

      {/* grid top-right */}
      <Hotspot
        position={[2.2, 0.9, 0]}
        color="#6090ff"
        label="Fondo cósmico"
        hint="La 'foto' más antigua del universo"
        size={1.0}
        onSelect={() => onObjectClick(INFO(
          'Radiación de fondo de microondas',
          '#6090ff',
          [
            'Emitido 380.000 años después del Big Bang, cuando el universo se enfrió lo suficiente para que los átomos se formasen.',
            'Su temperatura media es 2,725 K (−270 °C), con variaciones de apenas una parte en cien mil.',
            'Esas diminutas fluctuaciones de temperatura son las semillas gravitacionales de todas las galaxias actuales.',
          ],
          'cosmos-cmb',
          { id: '-kE9dGVPPNQ', title: 'Fondo cósmico de microondas' },
        ))}
      >
        <CMBSphere />
      </Hotspot>

      {/* grid bottom-left */}
      <Hotspot
        position={[-2.2, -1.5, 0]}
        color="#8899ff"
        label="Materia oscura"
        hint="El 27 % del universo es invisible"
        size={1.0}
        labelAbove={false}
        onSelect={() => onObjectClick(INFO(
          'Materia oscura',
          '#8899ff',
          [
            'Representa el 27 % del contenido energético del universo; la materia ordinaria es solo el 5 %.',
            'No emite, absorbe ni refleja luz: se detecta únicamente a través de sus efectos gravitacionales.',
            'Sin materia oscura, las estrellas externas de una galaxia escaparían al rotar — las curvas de rotación observadas no cuadran sin ella.',
          ],
          'cosmos-dark-matter',
          // Kurzgesagt – "What Is Dark Matter and Dark Energy?" (sustituir ID si es necesario)
          { id: 'QAa2O_8wBUQ', title: 'Kurzgesagt — ¿Qué es la materia oscura?' },
        ))}
      >
        <DarkMatterRings />
      </Hotspot>

      {/* grid bottom-right */}
      <Hotspot
        position={[2.2, -1.5, 0]}
        color="#99aaff"
        label="Historia del cosmos"
        hint="13 800 millones de años en una línea"
        size={1.0}
        labelAbove={false}
        onSelect={() => onObjectClick(EXP('cosmos-timeline'))}
      >
        <Timeline />
      </Hotspot>
    </group>
  )
}

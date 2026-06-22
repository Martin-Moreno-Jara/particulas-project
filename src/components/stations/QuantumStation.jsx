import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from './Hotspot.jsx'

const ACC = '#36e08a'

// ─── Atom: nucleus + electron orbitals ────────────────────────────────────────
function Atom() {
  const eRef1 = useRef()
  const eRef2 = useRef()
  const eRef3 = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (eRef1.current) eRef1.current.rotation.z = t * 1.4
    if (eRef2.current) eRef2.current.rotation.x = t * 1.1
    if (eRef3.current) eRef3.current.rotation.y = t * 0.9
  })
  return (
    <group>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshBasicMaterial color="#80ffcc" transparent opacity={0.95} />
      </mesh>
      {/* Orbital ring 1 */}
      <group ref={eRef1}>
        <mesh>
          <torusGeometry args={[0.75, 0.018, 6, 48]} />
          <meshBasicMaterial color="#36e08a" transparent opacity={0.5} />
        </mesh>
        {/* Electron on ring 1 */}
        <mesh position={[0.75, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#80ffcc" transparent opacity={0.9} />
        </mesh>
      </group>
      {/* Orbital ring 2 */}
      <group ref={eRef2} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.75, 0.018, 6, 48]} />
          <meshBasicMaterial color="#20c070" transparent opacity={0.45} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#60f0aa" transparent opacity={0.8} />
        </mesh>
      </group>
      {/* Orbital ring 3 */}
      <group ref={eRef3} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[0.75, 0.018, 6, 48]} />
          <meshBasicMaterial color="#1aa060" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.75]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#40e090" transparent opacity={0.75} />
        </mesh>
      </group>
    </group>
  )
}

// ─── Double slit: barrier + interference pattern ──────────────────────────────
function DoubleSlit3D() {
  const patternRef = useRef()
  useFrame((state) => {
    if (!patternRef.current) return
    const t = state.clock.elapsedTime
    patternRef.current.children.forEach((child, i) => {
      child.scale.y = 0.7 + 0.3 * Math.sin(t * 2 + i * 0.6)
    })
  })

  const FRINGES = 9
  return (
    <group>
      {/* Barrier */}
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.12, 1.8, 0.12]} />
        <meshBasicMaterial color="#1a4a30" transparent opacity={0.85} />
      </mesh>
      {/* Slits (gaps in barrier shown as lighter regions) */}
      <mesh position={[-0.5, 0.35, 0]}>
        <boxGeometry args={[0.13, 0.22, 0.14]} />
        <meshBasicMaterial color="#36e08a" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-0.5, -0.35, 0]}>
        <boxGeometry args={[0.13, 0.22, 0.14]} />
        <meshBasicMaterial color="#36e08a" transparent opacity={0.6} />
      </mesh>
      {/* Screen */}
      <mesh position={[0.55, 0, 0]}>
        <boxGeometry args={[0.06, 1.8, 0.1]} />
        <meshBasicMaterial color="#0d2a1a" transparent opacity={0.8} />
      </mesh>
      {/* Interference fringes */}
      <group ref={patternRef} position={[0.55, 0, 0.06]}>
        {Array.from({ length: FRINGES }, (_, i) => {
          const y = (i - Math.floor(FRINGES / 2)) * 0.2
          const bright = Math.cos(y * 3.8) ** 2
          return (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[0.05, 0.14, 0.06]} />
              <meshBasicMaterial
                color="#36e08a"
                transparent
                opacity={bright * 0.85}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// ─── Schrödinger box: superposed cat state ────────────────────────────────────
function SchrodingerBox() {
  const innerRef = useRef()
  useFrame((state) => {
    if (!innerRef.current) return
    const flicker = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 4.5)
    innerRef.current.material.opacity = flicker * 0.8
  })
  return (
    <group>
      {/* Box frame */}
      <mesh>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial color="#36e08a" wireframe transparent opacity={0.45} />
      </mesh>
      {/* Semi-transparent shell */}
      <mesh>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial color="#1a4a30" transparent opacity={0.12} />
      </mesh>
      {/* Flickering inner state (alive / dead) */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.32, 12, 12]} />
        <meshBasicMaterial color="#80ffcc" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* "?" mark using a small torus + cylinder */}
      <mesh position={[0, 0, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.03, 6, 16, Math.PI * 1.4]} />
        <meshBasicMaterial color="#36e08a" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.24, 0.58]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#36e08a" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// ─── Quantum tunnel: particle + barrier ──────────────────────────────────────
function QuantumTunnel3D() {
  const particleRef = useRef()
  const glowRef = useRef()
  const dirRef = useRef(1)
  const posRef = useRef(-0.9)

  useFrame((_, dt) => {
    posRef.current += dirRef.current * 0.022
    // Tunneling: occasionally teleports to the other side
    if (posRef.current > 0.5 && Math.random() < 0.015) {
      posRef.current = 0.5
      dirRef.current = 1
    }
    if (posRef.current > 1.4) {
      posRef.current = -1.2
    }
    if (posRef.current < -1.2) {
      posRef.current = -1.2
      dirRef.current = 1
    }
    if (particleRef.current) {
      particleRef.current.position.x = posRef.current
      // Fade through wall
      const inWall = Math.abs(posRef.current) < 0.35
      particleRef.current.material.opacity = inWall ? 0.3 : 0.9
    }
  })
  return (
    <group>
      {/* Barrier */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.55]} />
        <meshBasicMaterial color="#1a3a2a" transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.55]} />
        <meshBasicMaterial color="#36e08a" wireframe transparent opacity={0.3} />
      </mesh>
      {/* Particle */}
      <mesh ref={particleRef} position={[-0.9, 0, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#80ffcc" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

const EXP  = (expId) => ({ type: 'experiment', expId })
const INFO = (title, accent, facts, expId = null, video = null) => ({ type: 'info', title, accent, facts, expId, video })

export default function QuantumStation({ onObjectClick }) {
  return (
    <group>
      {/* grid top-left */}
      <Hotspot
        position={[-2.2, 0.9, 0]}
        color={ACC}
        label="Átomo de hidrógeno"
        hint="La incertidumbre como ley fundamental"
        size={1.0}
        onSelect={() => onObjectClick(INFO(
          'Principio de incertidumbre',
          '#36e08a',
          [
            'Δx · Δp ≥ ℏ/2 — conocer mejor la posición implica mayor incertidumbre en el momento, y viceversa.',
            'No es un límite tecnológico: es una propiedad intrínseca de la naturaleza, independiente del instrumento de medida.',
            'Los electrones no siguen órbitas definidas, sino nubes de probabilidad — los orbitales describen dónde es probable encontrarlos.',
          ],
          'qm-uncertainty',
          { id: 'JnEAMYltzi0', title: 'Teorema de incertidumbre' },
        ))}
      >
        <Atom />
      </Hotspot>

      {/* grid top-right */}
      <Hotspot
        position={[2.2, 0.9, 0]}
        color="#20c070"
        label="Doble rendija"
        hint="Onda y partícula a la vez"
        size={1.0}
        onSelect={() => onObjectClick(EXP('qm-doubleslit'))}
      >
        <DoubleSlit3D />
      </Hotspot>

      {/* grid bottom-left */}
      <Hotspot
        position={[-2.2, -1.5, 0]}
        color="#44cc88"
        label="Gato de Schrödinger"
        hint="Superposición cuántica"
        size={1.0}
        labelAbove={false}
        onSelect={() => onObjectClick(INFO(
          'Superposición y colapso cuántico',
          '#44cc88',
          [
            'Antes de ser medido, un sistema cuántico existe en superposición: todos los estados posibles coexisten simultáneamente.',
            "La medición 'colapsa' la función de onda a un único resultado de forma aparentemente aleatoria.",
            'Schrödinger inventó el gato para criticar la interpretación de Copenhague, llevando la superposición al absurdo macroscópico.',
          ],
          'qm-schrodinger',
        ))}
      >
        <SchrodingerBox />
      </Hotspot>

      {/* grid bottom-right */}
      <Hotspot
        position={[2.2, -1.5, 0]}
        color="#40f0a0"
        label="Efecto túnel"
        hint="Atravesar lo imposible"
        size={1.0}
        labelAbove={false}
        onSelect={() => onObjectClick(EXP('qm-tunnel'))}
      >
        <QuantumTunnel3D />
      </Hotspot>
    </group>
  )
}

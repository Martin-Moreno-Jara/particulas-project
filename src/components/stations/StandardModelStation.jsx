import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from './Hotspot.jsx'

const ACC = '#ff4d8d'

// ─── Proton: 3 quarks connected by gluon strings ─────────────────────────────
function Proton() {
  const groupRef = useRef()
  const QUARK_COLORS = ['#ff4d4d', '#4dff88', '#4d88ff']
  const POSITIONS = [
    [0, 0.6, 0],
    [-0.52, -0.3, 0],
    [0.52, -0.3, 0],
  ]

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.012
  })

  const lineGeoms = useMemo(() => {
    return [[0, 1], [1, 2], [2, 0]].map(([a, b]) => {
      const pts = [
        new THREE.Vector3(...POSITIONS[a]),
        new THREE.Vector3(...POSITIONS[b]),
      ]
      return new THREE.BufferGeometry().setFromPoints(pts)
    })
  }, [])

  return (
    <group ref={groupRef}>
      {/* Gluon lines */}
      {lineGeoms.map((geom, i) => (
        <line key={i} geometry={geom}>
          <lineBasicMaterial color="#ff4d8d" transparent opacity={0.4} linewidth={1} />
        </line>
      ))}
      {/* Quarks */}
      {POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.22, 14, 14]} />
          <meshBasicMaterial color={QUARK_COLORS[i]} transparent opacity={0.9} />
        </mesh>
      ))}
      {/* Outer proton boundary */}
      <mesh>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshBasicMaterial color="#ff4d8d" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

// ─── Particle grid: instanced colored dots ────────────────────────────────────
function ParticleGrid() {
  const ref = useRef()
  const GRID = [
    // quarks row
    ['#ff5d5d', '#ff8a5d', '#ffb15d', '#ffd75d', '#ff5d8a', '#ff5db1'],
    // leptons row
    ['#5db1ff', '#5dd7ff', '#5d8aff', '#5db1ff', '#5d5dff', '#8a5dff'],
    // bosons row
    ['#36e08a', '#ffe85d', '#b15dff', '#c75dff', '#f5f5f5', '#444455'],
  ]
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.006
  })
  return (
    <group ref={ref}>
      {GRID.map((row, ri) =>
        row.map((color, ci) => (
          <mesh
            key={`${ri}-${ci}`}
            position={[(ci - 2.5) * 0.28, (1 - ri) * 0.32, 0]}
          >
            <sphereGeometry args={[0.085, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.85} />
          </mesh>
        ))
      )}
    </group>
  )
}

// ─── Four forces: concentric rings at different scales ────────────────────────
function FourForces() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.children.forEach((child, i) => {
      child.rotation.z = state.clock.elapsedTime * (0.5 + i * 0.35)
      child.rotation.x = state.clock.elapsedTime * (0.2 + i * 0.15)
    })
  })
  const FORCES = [
    { r: 0.9, color: '#ffcc66', label: 'gravedad' },
    { r: 0.65, color: '#5b7cff', label: 'electromag.' },
    { r: 0.45, color: '#36e08a', label: 'fuerte' },
    { r: 0.28, color: '#ff4d8d', label: 'débil' },
  ]
  return (
    <group ref={ref}>
      {FORCES.map((f, i) => (
        <mesh key={i} rotation={[i * 0.4, i * 0.5, 0]}>
          <torusGeometry args={[f.r, 0.03, 8, 48]} />
          <meshBasicMaterial color={f.color} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  )
}

const EXP  = (expId) => ({ type: 'experiment', expId })
const INFO = (title, accent, facts, expId = null, video = null) => ({ type: 'info', title, accent, facts, expId, video })

export default function StandardModelStation({ onObjectClick }) {
  return (
    <group>
      {/* triangle top-left */}
      <Hotspot
        position={[-2.2, 0.5, 0]}
        color={ACC}
        label="Protón"
        hint="Tres quarks, infinitas posibilidades"
        size={1.0}
        onSelect={() => onObjectClick(EXP('sm-quarks'))}
      >
        <Proton />
      </Hotspot>

      {/* triangle top-right */}
      <Hotspot
        position={[2.2, 0.5, 0]}
        color="#ff88bb"
        label="Partículas elementales"
        hint="El catálogo completo de la materia"
        size={1.0}
        onSelect={() => onObjectClick(INFO(
          'El Modelo Estándar',
          '#ff88bb',
          [
            'Cataloga 17 partículas elementales: 6 quarks, 6 leptones y 5 bosones de calibre.',
            'Los quarks y leptones forman la materia; los bosones transmiten las fuerzas (fotón → EM, gluones → nuclear fuerte…).',
            'El bosón de Higgs, descubierto en el LHC en 2012, da masa a las demás partículas mediante el mecanismo de Higgs.',
          ],
          'sm-particles',
          // Kurzgesagt – "The Most Complex Language In The Universe" / TED-Ed "The Standard Model"
          { id: 'ehHoOYqAT_U', title: 'TED-Ed — El Modelo Estándar de física de partículas' },
        ))}
      >
        <ParticleGrid />
      </Hotspot>

      {/* triangle bottom-center */}
      <Hotspot
        position={[0, -1.5, 0]}
        color="#ff6699"
        label="Las 4 fuerzas"
        hint="Lo que mantiene todo unido"
        size={1.0}
        labelAbove={false}
        onSelect={() => onObjectClick(INFO(
          'Las cuatro fuerzas fundamentales',
          '#ff6699',
          [
            'La fuerza fuerte es 10³⁸ veces más intensa que la gravedad, pero solo actúa a escala de 10⁻¹⁵ m.',
            'Gravedad y electromagnetismo tienen alcance infinito; la fuerza fuerte y la débil solo operan a muy corto alcance.',
            "La 'gran unificación' (GUT) aspira a describir las cuatro fuerzas como una sola — la gravedad aún no ha podido integrarse.",
          ],
          'sm-forces',
          // Kurzgesagt – "The Four Fundamental Forces of Nature"
          { id: 'r--RI6c1l-Q', title: 'Kurzgesagt — Las cuatro fuerzas fundamentales' },
        ))}
      >
        <FourForces />
      </Hotspot>
    </group>
  )
}

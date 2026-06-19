import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Hotspot } from './Hotspot.jsx'

const ACC = '#ff9d3d'

// ─── Spacetime funnel: deformed plane wireframe ───────────────────────────────
function SpacetimeFunnel() {
  const groupRef = useRef()
  // Capture geometry in memo so useFrame can mutate it without a ref on the material
  const geom = useMemo(() => new THREE.PlaneGeometry(3, 3, 18, 18), [])

  useFrame((state) => {
    const pos = geom.attributes.position
    const arr = pos.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i], y = arr[i + 1]
      const r = Math.sqrt(x * x + y * y) + 0.001
      arr[i + 2] = -0.7 * Math.exp(-(r * r) / 4) * (1 + 0.05 * Math.sin(t * 1.5))
    }
    pos.needsUpdate = true
  })

  return (
    <group ref={groupRef} rotation={[-0.6, 0, 0.3]}>
      <mesh geometry={geom}>
        <meshBasicMaterial color="#ff9d3d" wireframe transparent opacity={0.65} />
      </mesh>
      {/* Central mass */}
      <mesh position={[0, 0, -0.68]}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// ─── Twin clocks (two cylinders, different heights = different time rates) ─────
function TwinClocks() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Hand of the fast clock
    ref.current.children[2].rotation.z = -t * 2.2
    // Hand of the slow clock (twin in fast ship)
    ref.current.children[5].rotation.z = -t * 0.7
  })
  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* Earth clock */}
      <mesh position={[-0.55, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
        <meshBasicMaterial color="#444" transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.55, 0.06, 0]}>
        <torusGeometry args={[0.35, 0.025, 8, 32]} />
        <meshBasicMaterial color="#ff9d3d" transparent opacity={0.7} />
      </mesh>
      {/* Earth clock hand */}
      <mesh position={[-0.55, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.02, 0.28, 0.02]} />
        <meshBasicMaterial color="#ff9d3d" />
      </mesh>

      {/* Traveling twin clock */}
      <mesh position={[0.55, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
        <meshBasicMaterial color="#222" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.55, 0.06, 0]}>
        <torusGeometry args={[0.35, 0.025, 8, 32]} />
        <meshBasicMaterial color="#cc7700" transparent opacity={0.55} />
      </mesh>
      {/* Slow hand */}
      <mesh position={[0.55, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.02, 0.28, 0.02]} />
        <meshBasicMaterial color="#cc7700" />
      </mesh>
    </group>
  )
}

// ─── Lorentz: compressed box ───────────────────────────────────────────────────
function LorentzBox() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const squeeze = 0.35 + 0.3 * (1 + Math.sin(state.clock.elapsedTime * 0.8)) / 2
    ref.current.scale.x = squeeze
  })
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.4, 0.55, 0.55]} />
        <meshBasicMaterial color="#ff9d3d" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.4, 0.55, 0.55]} />
        <meshBasicMaterial color="#ff9d3d" transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

// ─── Speed limit: sphere chasing an unreachable barrier ───────────────────────
function SpeedWall() {
  const ballRef = useRef()
  useFrame((state) => {
    if (!ballRef.current) return
    const t = state.clock.elapsedTime
    // Ball oscillates, approaching the wall
    const pos = (Math.sin(t * 0.7) * 0.5 + 0.5) * 0.65 - 0.7
    ballRef.current.position.x = pos
  })
  return (
    <group>
      {/* The "c" wall */}
      <mesh position={[0.8, 0, 0]}>
        <planeGeometry args={[0.06, 1.4]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Speed label plane */}
      <mesh position={[0.8, 0, 0]}>
        <planeGeometry args={[0.12, 1.5]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Moving ball */}
      <mesh ref={ballRef} position={[-0.7, 0, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.9} />
      </mesh>
      {/* Trail ring */}
      <mesh ref={ballRef} position={[-0.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.22, 0.03, 6, 24]} />
        <meshBasicMaterial color="#ff9d3d" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

const EXP  = (expId) => ({ type: 'experiment', expId })
const INFO = (title, accent, facts, expId = null, video = null) => ({ type: 'info', title, accent, facts, expId, video })

export default function RelativityStation({ onObjectClick }) {
  return (
    <group>
      {/* grid top-left */}
      <Hotspot
        position={[-2.2, 0.9, 0]}
        color={ACC}
        label="Espacio-tiempo"
        hint="Arrastra la masa, lanza un fotón"
        size={1.0}
        onSelect={() => onObjectClick(EXP('rel-spacetime'))}
      >
        <SpacetimeFunnel />
      </Hotspot>

      {/* grid top-right */}
      <Hotspot
        position={[2.2, 0.9, 0]}
        color="#ffcc66"
        label="Paradoja de los gemelos"
        hint="El tiempo no pasa igual para todos"
        size={1.0}
        onSelect={() => onObjectClick(INFO(
          'Paradoja de los gemelos',
          '#ffcc66',
          [
            'El gemelo que viaja a velocidades relativistas envejece más lento: al regresar, es físicamente más joven que su hermano en reposo.',
            'No es paradoja real, sino predicción verificada: el tiempo transcurre diferente según el estado de movimiento del observador.',
            'Los satélites GPS aplican corrección relativista; sin ella, los errores de posición acumularían varios kilómetros por día.',
          ],
          'rel-twin',
          // MinutePhysics – "Einstein's Proof of E=mc²" / "Special Relativity" series
          { id: 'hW7DW9NIO9M', title: 'MinutePhysics — Por qué E = mc²' },
        ))}
      >
        <TwinClocks />
      </Hotspot>

      {/* grid bottom-left */}
      <Hotspot
        position={[-2.2, -1.5, 0]}
        color="#ff9d3d"
        label="Contracción de Lorentz"
        hint="Los objetos rápidos se comprimen"
        size={1.0}
        labelAbove={false}
        onSelect={() => onObjectClick(INFO(
          'Contracción de Lorentz',
          '#ff9d3d',
          [
            'Un objeto que viaja al 86,6 % de c mide solo la mitad de su longitud en reposo, medida por el observador estático.',
            'A 99,5 % de c la longitud se reduce a una décima parte; a 99,99 % de c, a menos del 1 % de la original.',
            'No es ilusión óptica: es una propiedad real y consistente del espacio-tiempo relativista.',
          ],
          'rel-contraction',
        ))}
      >
        <LorentzBox />
      </Hotspot>

      {/* grid bottom-right */}
      <Hotspot
        position={[2.2, -1.5, 0]}
        color="#ffbb44"
        label="Límite de velocidad"
        hint="Nada con masa puede alcanzar c"
        size={1.0}
        labelAbove={false}
        onSelect={() => onObjectClick(EXP('rel-lightspeed'))}
      >
        <SpeedWall />
      </Hotspot>
    </group>
  )
}

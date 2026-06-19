import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

// Clickable 3D object wrapper: invisible hit sphere + hover ring + label.
// Used by every station scene. Children = the visible geometry.
export function Hotspot({ position, color, label, hint, onSelect, size = 1.2, labelAbove = true, children }) {
  const [hovered, setHovered] = useState(false)
  const ringRef = useRef()

  useFrame(() => {
    if (ringRef.current) {
      const target = hovered ? 0.9 : 0
      ringRef.current.material.opacity += (target - ringRef.current.material.opacity) * 0.14
    }
  })

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      {/* Invisible pick target */}
      <mesh>
        <sphereGeometry args={[size, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Hover selection ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 1.22, 0.028, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>

      {children}

      <Html
        position={[0, labelAbove ? size + 0.42 : -(size + 0.42), 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none' }}
        zIndexRange={[20, 30]}
      >
        <div style={{
          color: hovered ? color : 'rgba(255,255,255,0.5)',
          fontSize: '10px',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 0 10px #000, 0 0 20px #000',
          whiteSpace: 'nowrap',
          transition: 'color 0.18s',
          userSelect: 'none',
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
        }}>
          {label}
          {hovered && hint && (
            <div style={{
              fontSize: '8px', letterSpacing: 0, textTransform: 'none',
              opacity: 0.75, marginTop: 3, fontWeight: 400, maxWidth: 110,
              whiteSpace: 'normal', textAlign: 'center', color: 'rgba(255,255,255,0.7)',
            }}>
              {hint}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

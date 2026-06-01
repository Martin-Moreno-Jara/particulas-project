import { useEffect, useRef } from 'react'
import { sections } from '../../data/content.js'

// Navegación fija superior: logo (volver al inicio), enlaces que llevan por zoom a cada
// sección y una barra de progreso que refleja el nivel de zoom actual.
export default function Navbar({ onNavigate, onHome, zoomRef }) {
  const barRef = useRef(null)

  // La barra se actualiza desde zoomRef sin provocar re-renders de React.
  useEffect(() => {
    let raf
    const loop = () => {
      if (barRef.current) barRef.current.style.width = `${(zoomRef.current * 100).toFixed(2)}%`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [zoomRef])

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <button
          onClick={onHome}
          className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-text-primary transition-colors hover:text-accent"
        >
          Del Universo al Quark
        </button>
        <ul className="flex items-center gap-1 md:gap-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => onNavigate(i)}
                className="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Barra de progreso del zoom global */}
      <div className="h-0.5 w-full bg-white/5">
        <div ref={barRef} className="h-full bg-gradient-to-r from-accent to-glossary" style={{ width: '0%' }} />
      </div>
    </nav>
  )
}

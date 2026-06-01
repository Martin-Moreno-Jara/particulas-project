import { useEffect, useRef } from 'react'

// Indicador lateral fijo de escala: muestra la magnitud actual (de 10²⁶ m a 10⁻¹⁸ m)
// y un marcador que se desliza por una línea vertical según el zoom. Los puntos de
// cada sección son clicables para viajar directamente a ellas.

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }
const toSuperscript = (n) =>
  String(n)
    .split('')
    .map((c) => SUP[c] ?? c)
    .join('')

export default function ZoomIndicator({ zoomRef, anchors, sections, onJump }) {
  const expRef = useRef(null)
  const markRef = useRef(null)
  const last = useRef(-1)

  // Actualiza el texto de escala y la posición del marcador desde zoomRef (sin re-render).
  useEffect(() => {
    let raf
    const loop = () => {
      const z = zoomRef.current
      if (Math.abs(z - last.current) > 0.001) {
        last.current = z
        const exponent = Math.round(26 - z * 44)
        if (expRef.current) expRef.current.textContent = `10${toSuperscript(exponent)} m`
        if (markRef.current) markRef.current.style.top = `${(z * 100).toFixed(2)}%`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [zoomRef])

  return (
    <aside className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <div className="mb-3 text-right">
        <div className="text-[0.65rem] uppercase tracking-widest text-text-secondary">Escala actual</div>
        <div ref={expRef} className="font-mono text-2xl font-semibold text-text-primary">
          10²⁶ m
        </div>
      </div>

      <div className="relative ml-auto h-[46vh] w-px bg-white/15">
        <div className="absolute right-3 top-0 -translate-y-1 whitespace-nowrap text-right text-[0.6rem] text-text-secondary">
          Universo
        </div>
        <div className="absolute bottom-0 right-3 translate-y-1 whitespace-nowrap text-right text-[0.6rem] text-text-secondary">
          Quark
        </div>

        {/* Puntos de cada sección (clicables) */}
        {anchors.map((a, i) => (
          <button
            key={i}
            onClick={() => onJump(i)}
            className="group absolute right-0 -translate-y-1/2"
            style={{ top: `${a * 100}%` }}
            title={sections[i].title}
          >
            <span className="absolute right-[-13px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/40 bg-white/30 transition-all group-hover:scale-150" />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-right text-[0.6rem] text-text-secondary opacity-0 transition-opacity group-hover:opacity-100">
              {sections[i].title}
            </span>
          </button>
        ))}

        {/* Marcador deslizante */}
        <div
          ref={markRef}
          className="pointer-events-none absolute right-[-5px] h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(96,165,250,0.6)]"
          style={{ top: '0%' }}
        />
      </div>
    </aside>
  )
}

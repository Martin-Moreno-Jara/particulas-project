import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cosmicTimeline } from '../../data/content.js'

// Sim C4 — Línea de tiempo cósmica: escala logarítmica, arrastrable, con hitos
// seleccionables que despliegan un panel con la descripción del evento.
const TRACK_W = 2200
const L0 = -6 // log10 de 1e-6 años (extremo izquierdo)
const L1 = 14 // log10 de 1e14 años (extremo derecho)

function fraction(years) {
  const l = Math.log10(Math.max(years, 1e-6))
  return Math.min(1, Math.max(0, (l - L0) / (L1 - L0)))
}

function formatTime(years) {
  if (years <= 1e-6) return 'Instante inicial'
  if (years < 1) return `${Math.round(years * 525960)} minutos tras el Big Bang`
  if (years < 1e3) return `${Math.round(years)} años`
  if (years < 1e6) return `${Math.round(years / 1e3)} mil años`
  if (years < 1e9) return `${Math.round(years / 1e6)} millones de años`
  const g = years / 1e9
  return `${g < 10 ? g.toFixed(1) : Math.round(g)} mil millones de años`
}

export default function CosmicTimeline() {
  const scrollRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })
  const [selected, setSelected] = useState(6) // "Hoy" por defecto

  const onDown = (e) => {
    drag.current = { active: true, startX: e.pageX, startScroll: scrollRef.current.scrollLeft }
  }
  const onMove = (e) => {
    if (!drag.current.active) return
    scrollRef.current.scrollLeft = drag.current.startScroll - (e.pageX - drag.current.startX)
  }
  const stop = () => {
    drag.current.active = false
  }

  const event = cosmicTimeline[selected]

  return (
    <div>
      <p className="mb-3 text-xs text-text-secondary">
        Arrastra horizontalmente para recorrer la historia del cosmos. La escala es logarítmica:
        cada paso hacia la derecha multiplica el tiempo transcurrido.
      </p>

      <div
        ref={scrollRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={stop}
        onMouseLeave={stop}
        className="relative cursor-grab overflow-x-auto rounded-lg border border-white/10 bg-black/40 active:cursor-grabbing"
        style={{ height: 200 }}
      >
        <div className="relative" style={{ width: TRACK_W, height: '100%' }}>
          {/* Línea base */}
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-accent/30 via-glossary/50 to-[#ff4d8d]/40" />

          {cosmicTimeline.map((m, i) => {
            const left = fraction(m.years) * TRACK_W
            const above = i % 2 === 0
            const active = i === selected
            return (
              <button
                key={m.label}
                onClick={() => setSelected(i)}
                className="absolute -translate-x-1/2"
                style={{ left, top: '50%' }}
              >
                {/* Punto del hito */}
                <span
                  className={`block h-3 w-3 -translate-y-1/2 rounded-full border transition-all ${
                    active
                      ? 'scale-150 border-white bg-glossary shadow-[0_0_12px_3px_rgba(251,191,36,0.6)]'
                      : 'border-white/40 bg-accent hover:scale-125'
                  }`}
                />
                {/* Etiqueta alternada arriba/abajo */}
                <span
                  className={`absolute left-1/2 w-32 -translate-x-1/2 text-center text-xs leading-tight ${
                    above ? 'bottom-4' : 'top-4'
                  } ${active ? 'text-text-primary' : 'text-text-secondary'}`}
                >
                  <span className="block font-medium">{m.label}</span>
                  <span className="block font-mono text-[0.6rem] opacity-70">{formatTime(m.years)}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Panel del evento seleccionado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-accent">
            {formatTime(event.years)}
          </div>
          <h4 className="mt-1 font-display text-xl font-semibold text-text-primary">{event.label}</h4>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{event.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

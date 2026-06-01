import { useState } from 'react'
import { motion } from 'framer-motion'
import { particles, baryons } from '../../data/content.js'

// Sim SM2 — Compositor de hadrones: arrastra tres quarks a la zona central y el
// sistema valida si forman un hadrón estable, mostrando nombre, carga y masa.

// Carga de cada sabor en tercios de la carga elemental.
const CHARGE_THIRDS = { u: 2, c: 2, t: 2, d: -1, s: -1, b: -1 }
// Carga de color (rojo / verde / azul) asignada por orden de llegada → "blanco".
const COLOR_CHARGE = [
  { hex: '#ff5d5d', name: 'rojo' },
  { hex: '#36e08a', name: 'verde' },
  { hex: '#5d8aff', name: 'azul' },
]
// Posiciones triangulares en la zona de ensamblaje.
const SLOTS = [
  { x: 50, y: 18 },
  { x: 22, y: 70 },
  { x: 78, y: 70 },
]

// Mapa de bariones normalizado por composición (orden de letras indiferente).
const NORMALIZED = Object.fromEntries(
  Object.entries(baryons).map(([k, v]) => [k.split('').sort().join(''), v])
)

function formatThirds(t) {
  const sign = t > 0 ? '+' : t < 0 ? '−' : ''
  const a = Math.abs(t)
  if (a % 3 === 0) return `${sign}${a / 3}`
  return `${sign}${a}/3`
}

export default function QuarkComposer() {
  const [slots, setSlots] = useState([])

  const add = (symbol) => {
    if (slots.length >= 3) return
    setSlots((s) => [...s, symbol])
  }
  const reset = () => setSlots([])

  const totalThirds = slots.reduce((sum, s) => sum + CHARGE_THIRDS[s], 0)
  const complete = slots.length === 3
  const match = complete ? NORMALIZED[[...slots].sort().join('')] : null

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Banco de quarks */}
        <div>
          <div className="mb-2 sim-label">Banco de quarks (arrastra o pulsa)</div>
          <div className="grid grid-cols-3 gap-2">
            {particles.quarks.map((q) => (
              <div
                key={q.symbol}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', q.symbol)}
                onClick={() => add(q.symbol)}
                className="cursor-grab select-none rounded-lg border p-3 text-center transition-transform hover:scale-105 active:cursor-grabbing"
                style={{ borderColor: q.color, background: `${q.color}1a` }}
              >
                <div className="font-display text-xl font-bold" style={{ color: q.color }}>
                  {q.symbol}
                </div>
                <div className="font-mono text-[0.6rem] text-text-secondary">{q.charge}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Zona de ensamblaje */}
        <div className="flex flex-col items-center">
          <div className="mb-2 sim-label">Zona de ensamblaje</div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              add(e.dataTransfer.getData('text/plain'))
            }}
            className="relative h-40 w-40 rounded-full border-2 border-dashed border-white/20 bg-black/40"
          >
            {slots.length === 0 && (
              <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-text-secondary">
                Suelta 3 quarks aquí
              </span>
            )}
            {slots.map((s, i) => {
              const q = particles.quarks.find((x) => x.symbol === s)
              const cc = COLOR_CHARGE[i]
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-lg font-bold"
                  style={{
                    left: `${SLOTS[i].x}%`,
                    top: `${SLOTS[i].y}%`,
                    background: `${q.color}33`,
                    color: q.color,
                    border: `3px solid ${cc.hex}`,
                  }}
                  title={`color ${cc.name}`}
                >
                  {s}
                </motion.div>
              )
            })}
          </div>
          <div className="mt-2 font-mono text-sm text-text-secondary">
            Carga total: <span className="text-text-primary">{formatThirds(totalThirds)}</span>
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div className="mt-4 min-h-[4.5rem] rounded-lg border border-white/10 bg-black/40 p-4">
        {!complete ? (
          <p className="text-sm text-text-secondary">
            Añade {3 - slots.length} quark{3 - slots.length !== 1 ? 's' : ''} más. Un hadrón necesita
            tres quarks, uno de cada carga de color (rojo, verde y azul), para ser "blanco".
          </p>
        ) : match ? (
          <div>
            <div className="flex items-center gap-3">
              <h4 className="font-display text-xl font-semibold text-text-primary">{match.name}</h4>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  match.stable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {match.stable ? 'estable' : 'inestable'}
              </span>
            </div>
            <div className="mt-1 font-mono text-xs text-text-secondary">
              Composición: {slots.join(' ')} · Carga: {match.charge} · Masa: {match.mass}
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#ff8a8a' }}>
            Esta combinación ({slots.join(' ')}) no corresponde a un hadrón conocido que pueda existir
            libremente.
          </p>
        )}
      </div>

      <button className="sim-btn mt-3" onClick={reset}>
        ↺ Vaciar
      </button>
    </div>
  )
}

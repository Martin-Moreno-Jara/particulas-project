import { useRef, useState } from 'react'

// Sim R4 — Energía vs. velocidad: la energía para acelerar una nave se dispara al
// infinito al acercarse a c. Punto arrastrable con equivalencias energéticas.
const M_C2 = 1000 * 9e16 // masa (1000 kg) × c²  → julios
const EMIN = 1e12
const EMAX = 1e22
const VB_W = 520
const VB_H = 300
const LEFT = 52
const RIGHT = 508
const TOP = 16
const BOTTOM = 258

const gammaOf = (v) => 1 / Math.sqrt(1 - v * v)
const energyOf = (v) => (gammaOf(v) - 1) * M_C2
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))

const xScale = (v) => LEFT + (v / 0.999) * (RIGHT - LEFT)
const yScale = (E) => {
  const t = (Math.log10(clamp(E, EMIN, EMAX)) - Math.log10(EMIN)) / (Math.log10(EMAX) - Math.log10(EMIN))
  return BOTTOM - t * (BOTTOM - TOP)
}

const REFERENCES = [
  { label: 'Bomba de Hiroshima', E: 6.3e13 },
  { label: 'Bomba Tsar (la mayor)', E: 2.4e17 },
  { label: 'Consumo eléctrico mundial (1 año)', E: 9e19 },
]

export default function LightSpeedLimit() {
  const [vFrac, setVFrac] = useState(0.5)
  const svgRef = useRef(null)
  const dragging = useRef(false)

  const setFromClientX = (clientX) => {
    const rect = svgRef.current.getBoundingClientRect()
    const vbX = ((clientX - rect.left) / rect.width) * VB_W
    const v = clamp(((vbX - LEFT) / (RIGHT - LEFT)) * 0.999, 0, 0.999)
    setVFrac(v)
  }

  const onDown = (e) => {
    dragging.current = true
    setFromClientX(e.clientX)
  }
  const onMove = (e) => {
    if (dragging.current) setFromClientX(e.clientX)
  }
  const stop = () => {
    dragging.current = false
  }

  const E = energyOf(vFrac)
  const bombs = E / 6.3e13

  const curve = Array.from({ length: 120 }, (_, i) => {
    const v = (i / 119) * 0.999
    return `${i === 0 ? 'M' : 'L'}${xScale(v).toFixed(1)},${yScale(energyOf(v)).toFixed(1)}`
  }).join(' ')

  return (
    <div>
      <div className="rounded-lg border border-white/10 bg-black/40 p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full cursor-pointer touch-none"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={stop}
          onPointerLeave={stop}
        >
          {/* Ejes */}
          <line x1={LEFT} y1={TOP} x2={LEFT} y2={BOTTOM} stroke="#ffffff33" />
          <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} stroke="#ffffff33" />
          {/* Asíntota en c */}
          <line x1={xScale(0.999)} y1={TOP} x2={xScale(0.999)} y2={BOTTOM} stroke="#ff4d6a55" strokeDasharray="4 4" />
          <text x={xScale(0.999) - 4} y={TOP + 10} textAnchor="end" fill="#ff4d6a" fontSize="10" fontFamily="monospace">
            c
          </text>

          {/* Líneas de referencia energéticas */}
          {REFERENCES.map((r) => (
            <g key={r.label}>
              <line x1={LEFT} y1={yScale(r.E)} x2={RIGHT} y2={yScale(r.E)} stroke="#ffffff1f" strokeDasharray="3 4" />
              <text x={LEFT + 6} y={yScale(r.E) - 3} fill="#8a8a96" fontSize="9" fontFamily="monospace">
                {r.label}
              </text>
            </g>
          ))}

          <path d={curve} fill="none" stroke="#ff9d3d" strokeWidth={2.4} />

          {/* Punto arrastrable */}
          <line x1={xScale(vFrac)} y1={BOTTOM} x2={xScale(vFrac)} y2={yScale(E)} stroke="#ffffff33" />
          <circle cx={xScale(vFrac)} cy={yScale(E)} r={7} fill="#ffd9a8" stroke="#ff9d3d" strokeWidth={2} />

          <text x={LEFT} y={BOTTOM + 14} fill="#a0a0a0" fontSize="10" fontFamily="monospace">
            energía requerida (escala log) · velocidad → c
          </text>
        </svg>
      </div>

      <p className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3 text-sm leading-relaxed text-text-secondary">
        Para acelerar una nave de <strong className="text-text-primary">1000 kg</strong> al{' '}
        <strong className="text-text-primary">{(vFrac * 100).toFixed(1)}% de c</strong> necesitas{' '}
        <strong className="text-text-primary">{E.toExponential(2)} julios</strong>, equivalente a{' '}
        <strong style={{ color: '#ff9d3d' }}>
          {bombs >= 1e4 ? bombs.toExponential(1) : Math.round(bombs).toLocaleString('es')} bombas de Hiroshima
        </strong>
        . Arrastra el punto: al acercarte a <em>c</em>, la energía crece sin límite.
      </p>

      <div className="mt-3">
        <div className="mb-1 sim-label">Velocidad de la nave</div>
        <input
          type="range"
          min="0"
          max="0.999"
          step="0.001"
          value={vFrac}
          onChange={(e) => setVFrac(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}

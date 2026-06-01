import { useState } from 'react'

// Sim R3 — Contracción de longitud: una nave se comprime en la dirección del
// movimiento al acercarse a la velocidad de la luz. Incluye gráfico longitud vs. velocidad.
const REST_LENGTH = 100 // metros (longitud en reposo)
const GW = 520
const GH = 150

const factorOf = (v) => Math.sqrt(1 - v * v)

export default function LengthContraction() {
  const [vFrac, setVFrac] = useState(0.6)
  const factor = factorOf(vFrac)
  const observed = REST_LENGTH * factor

  // Curva del gráfico longitud(%) vs velocidad
  const path = Array.from({ length: 81 }, (_, i) => {
    const v = (i / 80) * 0.999
    const x = 30 + (v / 0.999) * (GW - 45)
    const y = 12 + (1 - factorOf(v)) * (GH - 30)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const markX = 30 + (vFrac / 0.999) * (GW - 45)
  const markY = 12 + (1 - factor) * (GH - 30)

  return (
    <div>
      {/* Vista de la nave */}
      <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/40">
        <svg viewBox="0 0 520 150" className="h-full w-full">
          {/* Contorno de longitud en reposo (referencia) */}
          <rect x={130} y={58} width={260} height={34} rx={17} fill="none" stroke="#ffffff22" strokeDasharray="5 5" />
          {/* Nave contraída */}
          <g transform={`translate(260 75) scale(${factor} 1) translate(-260 -75)`} style={{ transition: 'transform 0.15s linear' }}>
            <rect x={130} y={58} width={260} height={34} rx={17} fill="#ff9d3d22" stroke="#ff9d3d" strokeWidth={2} />
            <polygon points="390,58 420,75 390,92" fill="#ff9d3d" />
            <circle cx={200} cy={75} r={8} fill="#ffd9a8" />
            <circle cx={250} cy={75} r={8} fill="#ffd9a8" />
            <rect x={120} y={66} width={14} height={18} rx={3} fill="#ff9d3d" />
          </g>
          {/* Flecha de movimiento */}
          <text x={260} y={130} textAnchor="middle" fill="#a0a0a0" fontSize="11" fontFamily="monospace">
            movimiento →
          </text>
        </svg>
      </div>

      {/* Lectura numérica */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-white/5 p-2">
          <div className="sim-label">Velocidad</div>
          <div className="font-mono text-lg text-text-primary">{(vFrac * 100).toFixed(1)}% c</div>
        </div>
        <div className="rounded-md bg-white/5 p-2">
          <div className="sim-label">Longitud observada</div>
          <div className="font-mono text-lg text-text-primary">{(factor * 100).toFixed(1)}%</div>
        </div>
        <div className="rounded-md bg-white/5 p-2">
          <div className="sim-label">Tamaño real → visto</div>
          <div className="font-mono text-lg text-text-primary">{observed.toFixed(0)} m</div>
        </div>
      </div>

      <div className="mt-4">
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

      {/* Gráfico longitud vs velocidad */}
      <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-2">
        <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full">
          <line x1={30} y1={12} x2={30} y2={GH - 14} stroke="#ffffff33" />
          <line x1={30} y1={GH - 14} x2={GW - 12} y2={GH - 14} stroke="#ffffff33" />
          <path d={path} fill="none" stroke="#ff9d3d" strokeWidth={2} />
          <circle cx={markX} cy={markY} r={5} fill="#ffd9a8" stroke="#ff9d3d" strokeWidth={2} />
          <text x={34} y={20} fill="#a0a0a0" fontSize="10" fontFamily="monospace">
            longitud
          </text>
          <text x={GW - 12} y={GH - 2} textAnchor="end" fill="#a0a0a0" fontSize="10" fontFamily="monospace">
            velocidad → c
          </text>
        </svg>
      </div>
      <p className="mt-2 text-xs text-text-secondary">
        A velocidades cotidianas el efecto es imperceptible; solo cerca de la velocidad de la luz la
        nave se aplana hasta parecer un disco.
      </p>
    </div>
  )
}

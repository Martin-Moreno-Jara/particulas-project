import { useState } from 'react'

// Sim Q2 — Principio de incertidumbre: precisar la posición ensancha el momento y
// viceversa. El producto Δx·Δp se mantiene en el mínimo (≈ ℏ/2).
const PRODUCT = 1320 // Δx · Δp constante (en unidades de la simulación)
const BOX_W = 250
const BOX_H = 150

const lerp = (a, b, t) => a + (b - a) * t

// Genera el trazo SVG de una gaussiana de anchura sigma centrada en la caja.
function gaussianPath(sigma) {
  const cx = BOX_W / 2
  const peakY = 18
  const baseY = BOX_H - 22
  const pts = []
  for (let i = 0; i <= 60; i++) {
    const x = -118 + (i / 60) * 236
    const y = Math.exp(-(x * x) / (2 * sigma * sigma))
    const sx = cx + x
    const sy = baseY - y * (baseY - peakY)
    pts.push(`${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`)
  }
  return pts.join(' ')
}

function Plot({ title, sigma, value, color, hint }) {
  const cx = BOX_W / 2
  return (
    <div className="flex-1 rounded-lg border border-white/10 bg-black/40 p-2">
      <div className="mb-1 flex items-baseline justify-between px-1">
        <span className="text-sm font-medium" style={{ color }}>
          {title}
        </span>
        <span className="font-mono text-xs text-text-secondary">Δ = {value.toFixed(0)}</span>
      </div>
      <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} className="w-full">
        <line x1={20} y1={BOX_H - 22} x2={BOX_W - 12} y2={BOX_H - 22} stroke="#ffffff22" />
        <line x1={cx} y1={16} x2={cx} y2={BOX_H - 22} stroke="#ffffff12" strokeDasharray="3 3" />
        {/* Anchura sombreada */}
        <rect x={cx - sigma} y={16} width={sigma * 2} height={BOX_H - 38} fill={`${color}14`} />
        <path d={gaussianPath(sigma)} fill="none" stroke={color} strokeWidth={2.2} />
        <text x={cx} y={BOX_H - 6} textAnchor="middle" fill="#8a8a96" fontSize="9" fontFamily="monospace">
          {hint}
        </text>
      </svg>
    </div>
  )
}

export default function UncertaintyPrinciple() {
  const [k, setK] = useState(0.5) // precisión en posición (0..1)

  const dx = lerp(110, 12, k) // incertidumbre de posición (anchura)
  const dp = PRODUCT / dx // incertidumbre de momento (ligada inversamente)

  return (
    <div>
      <div className="flex gap-3">
        <Plot title="Posición" sigma={dx} value={dx} color="#36e08a" hint="¿dónde está?" />
        <Plot title="Momento" sigma={dp} value={dp} color="#5dd7ff" hint="¿con qué velocidad?" />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex justify-between sim-label">
            <span>Precisión en posición</span>
            <span>{(k * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.01"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="mb-1 flex justify-between sim-label">
            <span>Precisión en momento</span>
            <span>{((1 - k) * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.01"
            value={1 - k}
            onChange={(e) => setK(1 - parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <p className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3 text-center text-sm text-text-secondary">
        Δx · Δp = <strong className="text-text-primary">{(dx * dp).toFixed(0)}</strong> (constante). El
        producto <span className="font-mono">Δx · Δp</span> nunca puede ser menor que{' '}
        <span className="font-mono">ℏ/2</span>: precisar una variable difumina inevitablemente la otra.
      </p>
    </div>
  )
}

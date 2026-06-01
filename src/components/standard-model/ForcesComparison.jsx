import { useCallback, useRef, useState } from 'react'
import P5Sketch from '../ui/P5Sketch.jsx'

// Sim SM3 — Las cuatro fuerzas comparadas: gravedad, electromagnetismo, fuerza fuerte
// (arrastrable, confinamiento) y fuerza débil (decaimiento beta), más tabla comparativa.
const W = 720
const H = 420
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

const TABLE = [
  { force: 'Gravedad', range: 'Infinito', strength: '10⁻³⁹', mediator: 'Gravitón (teórico)', color: '#9fb8ff' },
  { force: 'Electromagnetismo', range: 'Infinito', strength: '10⁻²', mediator: 'Fotón (γ)', color: '#ffe85d' },
  { force: 'Fuerza fuerte', range: '~10⁻¹⁵ m', strength: '1 (la mayor)', mediator: 'Gluón (g)', color: '#36e08a' },
  { force: 'Fuerza débil', range: '~10⁻¹⁸ m', strength: '10⁻⁶', mediator: 'Bosones W y Z', color: '#c75dff' },
]

export default function ForcesComparison() {
  const [gravMass, setGravMass] = useState(1)
  const [emMode, setEmMode] = useState('attract')
  const [decaying, setDecaying] = useState(false)
  const gravRef = useRef(1)
  const emRef = useRef('attract')
  const decayRef = useRef({ t0: -1 })

  const sketch = useCallback((p) => {
    let gravAngle = 0
    let emDist = 90
    let quarks = []
    let dragged = null

    p.setup = () => {
      p.createCanvas(W, H)
      const cx = 180
      const cy = 315
      const angs = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]
      quarks = angs.map((a) => ({
        hx: cx + Math.cos(a) * 34,
        hy: cy + Math.sin(a) * 34,
        x: cx + Math.cos(a) * 34,
        y: cy + Math.sin(a) * 34,
        col: ['#ff5d5d', '#36e08a', '#5d8aff'][angs.indexOf(a)] || '#36e08a',
      }))
    }

    const panel = (x, y, title) => {
      p.noFill()
      p.stroke(255, 255, 255, 22)
      p.rect(x, y, 360, 210)
      p.noStroke()
      p.fill(232)
      p.textFont('monospace')
      p.textSize(12)
      p.textAlign(p.LEFT, p.TOP)
      p.text(title, x + 12, y + 10)
    }

    p.draw = () => {
      p.background(10, 6, 14)

      // ---------- Gravedad (arriba-izq) ----------
      panel(0, 0, 'Gravedad')
      const mass = gravRef.current
      const gcx = 180
      const gcy = 105
      p.noFill()
      p.stroke(255, 255, 255, 25)
      p.circle(gcx, gcy, 150)
      p.noStroke()
      p.fill(255, 220, 120)
      p.circle(gcx, gcy, 18 + mass * 8)
      gravAngle += 0.02 * Math.sqrt(mass)
      const px = gcx + Math.cos(gravAngle) * 75
      const py = gcy + Math.sin(gravAngle) * 75
      p.fill(150, 190, 255)
      p.circle(px, py, 10)
      p.fill(160)
      p.textSize(10)
      p.text(`masa estrella: ${mass}×`, 12, 188)

      // ---------- Electromagnetismo (arriba-der) ----------
      panel(360, 0, 'Electromagnetismo')
      const attract = emRef.current === 'attract'
      const target = attract ? 46 : 150
      emDist += (target + Math.sin(p.frameCount * 0.05) * 12 - emDist) * 0.06
      const ecy = 105
      const e1 = 540 - emDist / 2
      const e2 = 540 + emDist / 2
      p.stroke(255, 255, 255, 50)
      p.strokeWeight(1)
      // flechas de interacción
      const dir = attract ? 1 : -1
      p.line(e1 + 16 * dir, ecy, e1 + 30 * dir, ecy)
      p.line(e2 - 16 * dir, ecy, e2 - 30 * dir, ecy)
      p.noStroke()
      p.fill(255, 90, 90)
      p.circle(e2, ecy, 22)
      p.fill(90, 150, 255)
      p.circle(e1, ecy, 22)
      p.fill(255)
      p.textSize(14)
      p.textAlign(p.CENTER, p.CENTER)
      p.text('+', e2, ecy)
      p.text('–', e1, ecy)
      p.fill(160)
      p.textAlign(p.LEFT, p.TOP)
      p.textSize(10)
      p.text(attract ? 'cargas opuestas: se atraen' : 'cargas iguales: se repelen', 372, 188)

      // ---------- Fuerza fuerte (abajo-izq) ----------
      panel(0, 210, 'Fuerza fuerte')
      const mx = p.mouseX
      const my = p.mouseY
      const inBL = mx >= 0 && mx <= 360 && my >= 210 && my <= 420
      if (p.mouseIsPressed && inBL) {
        if (dragged === null) {
          for (let i = 0; i < quarks.length; i++) {
            if (p.dist(mx, my, quarks[i].x, quarks[i].y) < 20) dragged = i
          }
        }
        if (dragged !== null) {
          quarks[dragged].x = clamp(mx, 12, 348)
          quarks[dragged].y = clamp(my, 222, 408)
        }
      } else {
        dragged = null
      }
      // gluones entre pares (confinamiento: más estiramiento → línea más intensa)
      for (let i = 0; i < quarks.length; i++) {
        const a = quarks[i]
        const b = quarks[(i + 1) % quarks.length]
        const d = p.dist(a.x, a.y, b.x, b.y)
        const tension = clamp(p.map(d, 34, 150, 0, 1), 0, 1)
        p.stroke(120 + tension * 135, 230, 160 + tension * 80, 160 + tension * 95)
        p.strokeWeight(1 + tension * 5)
        p.line(a.x, a.y, b.x, b.y)
        if (dragged === null) a.x += (a.hx - a.x) * 0.12
        if (dragged === null) a.y += (a.hy - a.y) * 0.12
      }
      p.noStroke()
      for (const q of quarks) {
        p.fill(q.col)
        p.circle(q.x, q.y, 16)
      }
      p.fill(160)
      p.textSize(10)
      p.textAlign(p.LEFT, p.TOP)
      p.text('arrastra un quark: la fuerza crece al separarlo', 12, 398)

      // ---------- Fuerza débil (abajo-der) ----------
      panel(360, 210, 'Fuerza débil — decaimiento β')
      const wcx = 540
      const wcy = 315
      const decay = decayRef.current
      let t = -1
      if (decay.t0 >= 0) t = (p.millis() - decay.t0) / 1000
      // nucleones de fondo
      p.noStroke()
      p.fill(255, 90, 90, 180)
      p.circle(wcx - 12, wcy + 6, 20)
      p.fill(120, 120, 130, 180)
      p.circle(wcx + 10, wcy - 8, 20)
      // neutrón que decae → protón
      const becameProton = t > 0.6
      p.fill(becameProton ? p.color(255, 90, 90) : p.color(130, 130, 140))
      p.circle(wcx, wcy, 22)
      p.fill(255)
      p.textSize(11)
      p.textAlign(p.CENTER, p.CENTER)
      p.text(becameProton ? 'p' : 'n', wcx, wcy)
      if (t >= 0 && t < 1.6) {
        // bosón W y productos saliendo
        const k = clamp(t / 1.5, 0, 1)
        p.fill(199, 93, 255)
        p.circle(wcx + k * 70, wcy - k * 50, 12)
        p.fill(90, 150, 255)
        if (t > 0.6) p.circle(wcx + (k - 0.4) * 110, wcy + 40 * k, 8) // electrón
        p.fill(200, 200, 200, 120)
        if (t > 0.6) p.circle(wcx + (k - 0.4) * 130, wcy - 10 * k, 5) // antineutrino
      }
      p.fill(160)
      p.textAlign(p.LEFT, p.TOP)
      p.textSize(10)
      p.text('n → p + e⁻ + ν̄ (emite un bosón W)', 372, 398)
    }
  }, [])

  const doubleMass = () => {
    const next = gravRef.current === 1 ? 2 : 1
    gravRef.current = next
    setGravMass(next)
  }
  const toggleCharge = () => {
    const next = emRef.current === 'attract' ? 'repel' : 'attract'
    emRef.current = next
    setEmMode(next)
  }
  const simulateDecay = () => {
    decayRef.current = { t0: performance.now() }
    setDecaying(true)
    setTimeout(() => setDecaying(false), 1800)
  }

  return (
    <div>
      <P5Sketch sketch={sketch} className="flex justify-center overflow-x-auto rounded-lg" />

      <div className="mt-4 flex flex-wrap gap-3">
        <button className="sim-btn" onClick={doubleMass}>
          Gravedad: masa {gravMass === 1 ? '×1' : '×2'}
        </button>
        <button className="sim-btn" onClick={toggleCharge}>
          EM: {emMode === 'attract' ? 'cargas opuestas' : 'cargas iguales'}
        </button>
        <button className={`sim-btn ${decaying ? 'sim-btn--active' : ''}`} onClick={simulateDecay}>
          Débil: simular decaimiento β
        </button>
      </div>

      {/* Tabla comparativa */}
      <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-text-secondary">
            <tr>
              <th className="px-3 py-2 font-medium">Fuerza</th>
              <th className="px-3 py-2 font-medium">Alcance</th>
              <th className="px-3 py-2 font-medium">Intensidad relativa</th>
              <th className="px-3 py-2 font-medium">Mediador</th>
            </tr>
          </thead>
          <tbody>
            {TABLE.map((r) => (
              <tr key={r.force} className="border-t border-white/5">
                <td className="px-3 py-2 font-medium" style={{ color: r.color }}>
                  {r.force}
                </td>
                <td className="px-3 py-2 font-mono text-text-secondary">{r.range}</td>
                <td className="px-3 py-2 font-mono text-text-secondary">{r.strength}</td>
                <td className="px-3 py-2 text-text-secondary">{r.mediator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

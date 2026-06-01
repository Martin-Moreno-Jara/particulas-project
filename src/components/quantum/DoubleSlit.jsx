import { useCallback, useRef, useState } from 'react'
import P5Sketch from '../ui/P5Sketch.jsx'

// Sim Q1 — Doble rendija: sin detector, las partículas forman un patrón de
// interferencia; con detector, el patrón colapsa en dos bandas (comportamiento de partícula).
const W = 560
const H = 380
const SOURCE_X = 26
const BARRIER_X = 195
const SCREEN_X = W - 34
const YC = H / 2

export default function DoubleSlit() {
  const [detector, setDetector] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [count, setCount] = useState(0)
  const detectorRef = useRef(false)
  const speedRef = useRef(2)
  const resetRef = useRef(false)
  const countRef = useRef(0)

  const sketch = useCallback((p) => {
    let particles = []
    let screen // capa persistente con los impactos acumulados

    // Densidad de probabilidad en la pantalla según el modo.
    const prob = (y) => {
      const d = y - YC
      if (detectorRef.current) {
        return Math.exp(-((d - 40) ** 2) / (2 * 20 * 20)) + Math.exp(-((d + 40) ** 2) / (2 * 20 * 20))
      }
      return Math.cos(d * 0.13) ** 2 * Math.exp(-(d * d) / (2 * 92 * 92))
    }

    const sampleY = () => {
      for (let i = 0; i < 40; i++) {
        const y = 40 + Math.random() * (H - 80)
        if (Math.random() < prob(y)) return y
      }
      return YC
    }

    p.setup = () => {
      p.createCanvas(W, H)
      screen = p.createGraphics(W, H)
    }

    p.draw = () => {
      if (resetRef.current) {
        screen.clear()
        particles = []
        countRef.current = 0
        setCount(0)
        resetRef.current = false
      }

      p.background(8, 14, 11)

      // Fuente
      p.noStroke()
      p.fill(120, 230, 170)
      p.circle(SOURCE_X, YC, 12)
      p.fill(120, 230, 170, 60)
      p.circle(SOURCE_X, YC, 22)

      // Barrera con dos rendijas
      const slitHalf = 13
      p.fill(40, 60, 50)
      p.rect(BARRIER_X - 5, 0, 10, YC - 40 - slitHalf)
      p.rect(BARRIER_X - 5, YC - 40 + slitHalf, 10, 80 - 2 * slitHalf)
      p.rect(BARRIER_X - 5, YC + 40 + slitHalf, 10, H - (YC + 40 + slitHalf))

      // Pantalla detectora
      p.fill(30, 45, 38)
      p.rect(SCREEN_X, 0, 6, H)

      // Detectores (solo en modo "con detector")
      if (detectorRef.current) {
        p.fill(255, 90, 90)
        p.circle(BARRIER_X, YC - 40, 9)
        p.circle(BARRIER_X, YC + 40, 9)
      }

      // Emisión de partículas
      const emit = Math.round(speedRef.current)
      for (let k = 0; k < emit; k++) {
        if (particles.length < 60) particles.push({ x: SOURCE_X, target: sampleY() })
      }

      // Impactos acumulados
      p.image(screen, 0, 0)

      // Partículas en vuelo
      p.fill(180, 255, 210)
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i]
        pt.x += 3 + speedRef.current
        const frac = (pt.x - SOURCE_X) / (SCREEN_X - SOURCE_X)
        const y = p.lerp(YC, pt.target, p.constrain(frac, 0, 1))
        p.circle(pt.x, y, 3)
        if (pt.x >= SCREEN_X) {
          screen.noStroke()
          screen.fill(150, 255, 200, 70)
          screen.circle(SCREEN_X + 3 + Math.random() * 3, pt.target, 3)
          particles.splice(i, 1)
          countRef.current++
          if (countRef.current % 8 === 0) setCount(countRef.current)
        }
      }

      // Texto de estado
      p.noStroke()
      p.fill(232)
      p.textFont('monospace')
      p.textSize(12)
      p.textAlign(p.LEFT, p.TOP)
      p.text(detectorRef.current ? 'Con detector: dos bandas' : 'Sin detector: interferencia', 12, 12)
    }
  }, [])

  const toggleDetector = () => {
    const next = !detectorRef.current
    detectorRef.current = next
    setDetector(next)
    resetRef.current = true
  }

  return (
    <div>
      <P5Sketch sketch={sketch} className="flex justify-center overflow-x-auto rounded-lg" />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button className={`sim-btn ${detector ? 'sim-btn--active' : ''}`} onClick={toggleDetector}>
          {detector ? '👁 Detector activado' : '👁 Activar detector'}
        </button>
        <button className="sim-btn" onClick={() => (resetRef.current = true)}>
          ↺ Reiniciar
        </button>
        <div className="flex items-center gap-2">
          <span className="sim-label">Velocidad</span>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={speed}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              speedRef.current = v
              setSpeed(v)
            }}
          />
        </div>
        <span className="text-sm text-text-secondary">Impactos: {count}</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-text-secondary">
        {detector
          ? 'Al "mirar" por qué rendija pasa cada partícula, se comporta como partícula y solo aparecen dos bandas: la interferencia desaparece.'
          : 'Sin observar el camino, cada partícula interfiere consigo misma como una onda y, una a una, construye el patrón de franjas.'}
      </p>
    </div>
  )
}

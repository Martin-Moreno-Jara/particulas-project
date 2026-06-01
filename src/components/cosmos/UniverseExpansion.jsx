import { useCallback, useRef, useState } from 'react'
import P5Sketch from '../ui/P5Sketch.jsx'

// Sim C1 — Expansión del universo: galaxias que se alejan del centro al avanzar el
// tiempo, con líneas de corrimiento al rojo que se estiran al acelerarse la expansión.
const W = 560
const H = 380

// Factor de escala del universo en función del tiempo (Ga desde hoy; Big Bang en -13.8).
function scaleFactor(t) {
  const x = (t + 13.8) / 13.8 // 0 en el Big Bang, 1 hoy
  if (t <= 0) return Math.max(0.015, x)
  return 1 + Math.pow(t / 13.8, 1.4) // expansión acelerada hacia el futuro
}

function epochLabel(t) {
  if (t < -0.05) return `Hace ${(-t).toFixed(1)} mil millones de años`
  if (t > 0.05) return `Dentro de ${t.toFixed(1)} mil millones de años`
  return 'Hoy (13.800 millones de años)'
}

export default function UniverseExpansion() {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timeRef = useRef(0)
  const playingRef = useRef(false)

  const sketch = useCallback((p) => {
    let galaxies = []
    const R = 165

    const seed = () => {
      galaxies = []
      for (let i = 0; i < 130; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.pow(Math.random(), 0.7) // más densidad hacia el centro
        const tint = Math.random()
        galaxies.push({
          angle,
          radius,
          size: 1.5 + Math.random() * 2.5,
          col: tint < 0.6 ? [220, 225, 255] : tint < 0.85 ? [160, 190, 255] : [255, 230, 170],
        })
      }
    }

    p.setup = () => {
      p.createCanvas(W, H)
      seed()
    }

    p.draw = () => {
      if (playingRef.current) {
        timeRef.current += 0.18
        if (timeRef.current > 50) timeRef.current = -13.8
        if (p.frameCount % 5 === 0) setTime(timeRef.current)
      }
      const t = timeRef.current
      const a = scaleFactor(t)

      p.background(8, 8, 16)
      p.translate(W / 2, H / 2)

      // Líneas de corrimiento al rojo (más largas y visibles al acelerarse la expansión)
      const redAlpha = p.constrain(p.map(a, 0.8, 4, 0, 200), 0, 200)
      if (redAlpha > 2) {
        p.strokeWeight(1.4)
        for (const g of galaxies) {
          const dist = g.radius * a * R
          const x = Math.cos(g.angle) * dist
          const y = Math.sin(g.angle) * dist
          const len = g.radius * a * 22
          p.stroke(255, 70, 70, redAlpha)
          p.line(x, y, x + Math.cos(g.angle) * len, y + Math.sin(g.angle) * len)
        }
      }

      // Galaxias
      p.noStroke()
      for (const g of galaxies) {
        const dist = g.radius * a * R
        const x = Math.cos(g.angle) * dist
        const y = Math.sin(g.angle) * dist
        p.fill(g.col[0], g.col[1], g.col[2], 230)
        p.circle(x, y, g.size)
        p.fill(g.col[0], g.col[1], g.col[2], 40)
        p.circle(x, y, g.size * 3)
      }

      // Punto de origen (Big Bang) cuando el universo es muy joven
      if (a < 0.12) {
        p.fill(255, 240, 200, 220)
        p.circle(0, 0, 10 + (0.12 - a) * 200)
      }

      // Etiqueta de época
      p.resetMatrix()
      p.noStroke()
      p.fill(232, 232, 232)
      p.textFont('monospace')
      p.textSize(12)
      p.textAlign(p.LEFT, p.TOP)
      p.text(epochLabel(t), 14, 14)
      p.fill(160)
      p.text(`Factor de escala: ${a.toFixed(2)}×`, 14, 32)
    }
  }, [])

  const togglePlay = () => {
    const next = !playingRef.current
    playingRef.current = next
    setPlaying(next)
  }

  const onSlider = (e) => {
    const v = parseFloat(e.target.value)
    timeRef.current = v
    setTime(v)
    playingRef.current = false
    setPlaying(false)
  }

  return (
    <div>
      <P5Sketch sketch={sketch} className="flex justify-center overflow-x-auto rounded-lg" />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button className={`sim-btn ${playing ? 'sim-btn--active' : ''}`} onClick={togglePlay}>
          {playing ? '❚❚ Pausar' : '▶ Reproducir'}
        </button>
        <div className="flex-1">
          <div className="mb-1 flex justify-between sim-label">
            <span>Big Bang</span>
            <span>Tiempo</span>
            <span>Futuro</span>
          </div>
          <input
            type="range"
            min="-13.8"
            max="50"
            step="0.1"
            value={time}
            onChange={onSlider}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

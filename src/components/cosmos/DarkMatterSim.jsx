import { useCallback, useRef, useState } from 'react'
import P5Sketch from '../ui/P5Sketch.jsx'

// Sim C3 — Rotación galáctica: compara la curva kepleriana (sin materia oscura, las
// estrellas externas se rezagan y escapan) con la curva plana (con materia oscura).
const W = 760
const H = 400
const CX = 200
const CY = 200
const RGAL = 165
const RC = 0.18 // radio del núcleo (normalizado)

const kepler = (r) => (r < RC ? r / RC : Math.sqrt(RC / r))
const flat = (r) => (r < RC ? r / RC : 1)

export default function DarkMatterSim() {
  const [mode, setMode] = useState('A')
  const modeRef = useRef('A')

  const sketch = useCallback((p) => {
    let stars = []

    p.setup = () => {
      p.createCanvas(W, H)
      stars = []
      for (let i = 0; i < 700; i++) {
        const rBase = Math.pow(Math.random(), 0.6)
        const arm = Math.floor(Math.random() * 2) * Math.PI
        const angle = arm + rBase * 4.2 + (Math.random() - 0.5) * 0.5
        stars.push({
          rBase,
          rDyn: rBase,
          angle,
          size: 1 + Math.random() * 1.6,
          warm: rBase < 0.45,
        })
      }
    }

    const drawGraph = () => {
      const gx = 450
      const gy = 70
      const gw = 270
      const gh = 250
      const mode = modeRef.current
      p.noFill()
      p.stroke(255, 255, 255, 40)
      p.strokeWeight(1)
      p.line(gx, gy, gx, gy + gh)
      p.line(gx, gy + gh, gx + gw, gy + gh)
      p.noStroke()
      p.fill(160)
      p.textFont('monospace')
      p.textSize(10)
      p.textAlign(p.LEFT, p.TOP)
      p.text('velocidad orbital', gx + 4, gy - 14)
      p.textAlign(p.RIGHT, p.TOP)
      p.text('distancia al centro →', gx + gw, gy + gh + 6)

      const plot = (fn, col, weight, alpha) => {
        p.noFill()
        p.stroke(col[0], col[1], col[2], alpha)
        p.strokeWeight(weight)
        p.beginShape()
        for (let i = 0; i <= 60; i++) {
          const r = i / 60
          const x = gx + r * gw
          const y = gy + gh - fn(r) * gh * 0.88
          p.vertex(x, y)
        }
        p.endShape()
      }
      // Curva inactiva atenuada, activa resaltada
      plot(kepler, [255, 100, 100], mode === 'A' ? 2.6 : 1.2, mode === 'A' ? 255 : 70)
      plot(flat, [120, 220, 160], mode === 'B' ? 2.6 : 1.2, mode === 'B' ? 255 : 70)

      // Leyenda
      p.textAlign(p.LEFT, p.CENTER)
      p.fill(255, 100, 100, mode === 'A' ? 255 : 110)
      p.text('— Sin materia oscura (cae)', gx + 6, gy + 14)
      p.fill(120, 220, 160, mode === 'B' ? 255 : 110)
      p.text('— Con materia oscura (plana)', gx + 6, gy + 30)
    }

    p.draw = () => {
      p.background(8, 8, 16)
      const mode = modeRef.current

      // Halo / disco de la galaxia
      p.noStroke()
      p.fill(60, 70, 140, 24)
      p.circle(CX, CY, RGAL * 2.05)
      p.fill(255, 220, 150, 30)
      p.circle(CX, CY, RC * RGAL * 3.2)

      let escaping = 0
      for (const s of stars) {
        const speed = mode === 'A' ? kepler(s.rDyn) : flat(s.rDyn)
        const omega = (0.95 * speed) / Math.max(s.rDyn, 0.05)
        s.angle += omega * 0.02

        // Estrellas externas: en modo A se rezagan y escapan; en B vuelven a su órbita
        if (mode === 'A' && s.rBase > 0.82) {
          s.rDyn += 0.0016
          if (s.rDyn > 1.3) s.rDyn = s.rBase
          if (s.rDyn > 1.0) escaping++
        } else {
          s.rDyn += (s.rBase - s.rDyn) * 0.04
        }

        const x = CX + Math.cos(s.angle) * s.rDyn * RGAL
        const y = CY + Math.sin(s.angle) * s.rDyn * RGAL
        if (mode === 'A' && s.rDyn > 1.02) {
          p.fill(255, 120, 110, 170) // estrella escapando
        } else if (s.warm) {
          p.fill(255, 225, 170, 220)
        } else {
          p.fill(180, 200, 255, 210)
        }
        p.circle(x, y, s.size)
      }

      // Núcleo brillante
      p.fill(255, 240, 210)
      p.circle(CX, CY, 6)

      drawGraph()

      // Texto de estado
      p.noStroke()
      p.fill(232)
      p.textFont('monospace')
      p.textSize(12)
      p.textAlign(p.LEFT, p.TOP)
      p.text(mode === 'A' ? 'Modo A — Sin materia oscura' : 'Modo B — Con materia oscura', 14, 14)
      p.fill(160)
      p.textSize(11)
      if (mode === 'A') p.text(`Estrellas escapando: ${escaping}`, 14, 34)
      else p.text('Curva de rotación plana: galaxia estable', 14, 34)
    }
  }, [])

  const choose = (m) => {
    modeRef.current = m
    setMode(m)
  }

  return (
    <div>
      <P5Sketch sketch={sketch} className="flex justify-center overflow-x-auto rounded-lg" />
      <div className="mt-4 flex gap-3">
        <button className={`sim-btn ${mode === 'A' ? 'sim-btn--active' : ''}`} onClick={() => choose('A')}>
          Sin materia oscura
        </button>
        <button className={`sim-btn ${mode === 'B' ? 'sim-btn--active' : ''}`} onClick={() => choose('B')}>
          Con materia oscura
        </button>
      </div>
    </div>
  )
}

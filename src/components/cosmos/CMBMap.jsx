import { useCallback, useState } from 'react'
import { createNoise3D } from 'simplex-noise'
import P5Sketch from '../ui/P5Sketch.jsx'

// Sim C2 — Mapa del Fondo Cósmico de Microondas: proyección de Mollweide con
// anisotropías generadas por ruido simplex y lectura de temperatura al pasar el ratón.
const W = 560
const H = 320

// Paleta de "color falso": azul (frío) → cian → verde → amarillo → rojo (caliente).
const STOPS = [
  [0.0, [10, 10, 90]],
  [0.25, [20, 70, 220]],
  [0.5, [20, 200, 170]],
  [0.72, [235, 215, 60]],
  [1.0, [220, 40, 40]],
]
function tempColor(u) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ca] = STOPS[i]
    const [b, cb] = STOPS[i + 1]
    if (u <= b) {
      const f = (u - a) / (b - a)
      return [ca[0] + (cb[0] - ca[0]) * f, ca[1] + (cb[1] - ca[1]) * f, ca[2] + (cb[2] - ca[2]) * f]
    }
  }
  return STOPS[STOPS.length - 1][1]
}

// PRNG sembrado (mulberry32): genera un mapa de ruido reproducible y de calidad.
function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function CMBMap() {
  const [showInfo, setShowInfo] = useState(false)

  const sketch = useCallback((p) => {
    let pg
    let noise3

    const project = (nx, ny) => {
      const theta = Math.asin(Math.max(-1, Math.min(1, ny)))
      const lat = Math.asin((2 * theta + Math.sin(2 * theta)) / Math.PI)
      const c = Math.max(1e-6, Math.cos(theta))
      const lon = (Math.PI * nx) / c
      if (Math.abs(lon) > Math.PI) return null
      return [lon, lat]
    }

    const sample = (lon, lat) => {
      const x = Math.cos(lat) * Math.cos(lon)
      const y = Math.cos(lat) * Math.sin(lon)
      const z = Math.sin(lat)
      let v = 0
      let amp = 1
      let freq = 1.7
      let norm = 0
      for (let o = 0; o < 4; o++) {
        v += amp * noise3(x * freq, y * freq, z * freq)
        norm += amp
        amp *= 0.5
        freq *= 2.15
      }
      return v / norm
    }

    p.setup = () => {
      p.createCanvas(W, H)
      noise3 = createNoise3D(mulberry32(20260601)) // semilla fija → mapa reproducible
      pg = p.createGraphics(W, H)
      pg.pixelDensity(1)
      pg.loadPixels()
      const a = W / 2
      const b = H / 2
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const idx = 4 * (py * W + px)
          const nx = (px - a) / a
          const ny = (py - b) / b
          let r = 10
          let g = 10
          let bl = 18
          if (nx * nx + ny * ny <= 1) {
            const proj = project(nx, ny)
            if (proj) {
              const v = sample(proj[0], proj[1])
              const col = tempColor((v + 1) / 2)
              r = col[0]
              g = col[1]
              bl = col[2]
            }
          }
          pg.pixels[idx] = r
          pg.pixels[idx + 1] = g
          pg.pixels[idx + 2] = bl
          pg.pixels[idx + 3] = 255
        }
      }
      pg.updatePixels()
    }

    p.draw = () => {
      p.background(8, 8, 16)
      p.image(pg, 0, 0)

      // Lectura de temperatura al pasar el ratón sobre el mapa
      const mx = p.mouseX
      const my = p.mouseY
      const a = W / 2
      const b = H / 2
      const nx = (mx - a) / a
      const ny = (my - b) / b
      if (mx >= 0 && mx < W && my >= 0 && my < H && nx * nx + ny * ny <= 1) {
        const proj = project(nx, ny)
        if (proj) {
          const v = sample(proj[0], proj[1])
          const dT = Math.round(v * 180)
          const label = `${dT > 0 ? '+' : ''}${dT} µK · ${v > 0 ? 'más caliente' : 'más fría'}`
          p.noStroke()
          p.fill(0, 0, 0, 210)
          const tw = p.textWidth(label) + 16
          const bx = Math.min(mx + 12, W - tw - 4)
          const by = Math.min(my + 12, H - 26)
          p.rect(bx, by, tw, 20, 4)
          p.fill(232)
          p.textFont('monospace')
          p.textSize(11)
          p.textAlign(p.LEFT, p.CENTER)
          p.text(label, bx + 8, by + 10)
          // cruceta
          p.stroke(255, 255, 255, 180)
          p.line(mx - 5, my, mx + 5, my)
          p.line(mx, my - 5, mx, my + 5)
        }
      }
    }
  }, [])

  return (
    <div>
      <P5Sketch sketch={sketch} className="flex justify-center overflow-x-auto rounded-lg" />
      <p className="mt-3 text-xs text-text-secondary">
        Cada color representa una diminuta variación de temperatura (de unas pocas millonésimas de
        grado). Pasa el ratón por el mapa para leer la temperatura relativa de cada región.
      </p>
      <div className="mt-3">
        <button className="sim-btn" onClick={() => setShowInfo((s) => !s)}>
          {showInfo ? 'Ocultar explicación' : '¿Qué son estas manchas?'}
        </button>
        {showInfo && (
          <p className="mt-3 rounded-lg border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-text-secondary">
            Estas manchas son fluctuaciones de densidad del universo cuando tenía solo 380.000 años.
            Las regiones un poco más densas (calientes) tenían algo más de gravedad: con el tiempo
            atrajeron más materia y se convirtieron en las semillas de las galaxias y cúmulos que
            vemos hoy. Las zonas más frías evolucionaron hacia los grandes vacíos cósmicos.
          </p>
        )}
      </div>
    </div>
  )
}

import { useCallback, useRef, useState } from 'react'
import P5Sketch from '../ui/P5Sketch.jsx'

// Sim Q4 — Efecto túnel: un paquete de onda llega a una barrera; parte se refleja,
// dentro decae exponencialmente y una fracción emerge al otro lado.
const W = 560
const H = 300
const YMID = H / 2 + 20

const kappaOf = (height) => 0.03 * Math.sqrt(height)
const transmission = (height, thickness) => Math.exp(-2 * kappaOf(height) * thickness)

export default function QuantumTunnel() {
  const [height, setHeight] = useState(0.55)
  const [thickness, setThickness] = useState(55)
  const heightRef = useRef(0.55)
  const thicknessRef = useRef(55)

  const sketch = useCallback((p) => {
    let cx = -40
    let phase = 0

    p.setup = () => {
      p.createCanvas(W, H)
    }

    p.draw = () => {
      const bh = heightRef.current
      const d = thicknessRef.current
      const bx0 = W * 0.52 - d / 2
      const bx1 = bx0 + d
      const kappa = kappaOf(bh)
      const tAmp = Math.exp(-kappa * d)

      p.background(8, 14, 11)

      // Línea base
      p.stroke(255, 255, 255, 30)
      p.line(0, YMID, W, YMID)

      // Barrera de potencial
      const barH = bh * (H * 0.7)
      p.noStroke()
      p.fill(255, 90, 90, 40 + bh * 90)
      p.rect(bx0, YMID - barH, d, barH)
      p.fill(255, 120, 120, 200)
      p.rect(bx0, YMID - barH, d, 3)
      p.fill(200)
      p.textFont('monospace')
      p.textSize(10)
      p.textAlign(p.CENTER, p.BOTTOM)
      p.text('barrera', (bx0 + bx1) / 2, YMID - barH - 4)

      // Factor de amplitud según la región
      const amp = (x) => {
        if (x < bx0) return 1
        if (x <= bx1) return Math.exp(-kappa * (x - bx0))
        return tAmp
      }

      // Función de onda (paquete gaussiano que viaja a la derecha)
      const w = 26
      const k = 0.34
      const scale = 62
      p.noFill()
      p.stroke(90, 230, 255, 230)
      p.strokeWeight(2)
      p.beginShape()
      for (let x = 0; x <= W; x += 2) {
        const env = Math.exp(-((x - cx) ** 2) / (2 * w * w))
        const psi = env * amp(x) * Math.cos((x - cx) * k - phase)
        p.vertex(x, YMID - psi * scale)
      }
      p.endShape()

      // Envolvente de probabilidad (tenue)
      p.stroke(90, 230, 255, 60)
      p.strokeWeight(1)
      p.beginShape()
      for (let x = 0; x <= W; x += 2) {
        const env = Math.exp(-((x - cx) ** 2) / (2 * w * w))
        p.vertex(x, YMID - env * amp(x) * scale)
      }
      p.endShape()

      // Avance del paquete
      cx += 1.7
      phase += 0.22
      if (cx > W + 50) cx = -40

      // Etiquetas
      p.noStroke()
      p.fill(150, 230, 255)
      p.textAlign(p.LEFT, p.TOP)
      p.textSize(11)
      p.text('partícula entrante →', 10, 12)
    }
  }, [])

  const T = transmission(height, thickness)

  return (
    <div>
      <P5Sketch sketch={sketch} className="flex justify-center overflow-x-auto rounded-lg" />

      <div className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3 text-center">
        <span className="sim-label">Probabilidad de tunelaje</span>
        <div className="font-mono text-2xl font-semibold" style={{ color: '#5dd7ff' }}>
          {(T * 100).toFixed(T * 100 < 1 ? 2 : 1)}%
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex justify-between sim-label">
            <span>Altura de la barrera</span>
            <span>{(height * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.15"
            max="1"
            step="0.01"
            value={height}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              heightRef.current = v
              setHeight(v)
            }}
            className="w-full"
          />
        </div>
        <div>
          <div className="mb-1 flex justify-between sim-label">
            <span>Grosor de la barrera</span>
            <span>{thickness.toFixed(0)} px</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="1"
            value={thickness}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              thicknessRef.current = v
              setThickness(v)
            }}
            className="w-full"
          />
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-text-secondary">
        En física clásica, una partícula sin suficiente energía para superar una barrera de
        potencial simplemente rebota: nunca aparece al otro lado. En mecánica cuántica, la
        partícula se describe como una función de onda extendida en el espacio, y dentro de la
        barrera esa onda no se anula, sino que decae exponencialmente con el grosor y la altura
        del obstáculo. Como la onda nunca llega exactamente a cero, existe una probabilidad —
        pequeña pero real — de que la partícula "aparezca" del otro lado sin haber adquirido la
        energía necesaria para cruzarla clásicamente: eso es el efecto túnel. Cuanto más alta o
        más ancha es la barrera, más rápido decae la onda en su interior y menor es la
        probabilidad de tunelaje, como puedes comprobar moviendo los controles de arriba.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-text-secondary">
        En el Sol, la fusión nuclear ocurre porque los protones se "teletransportan" a través de la
        barrera electrostática gracias a este efecto: sin túnel cuántico, las estrellas no brillarían.
        El mismo principio se usa en la vida cotidiana, por ejemplo en el microscopio de efecto
        túnel (STM), capaz de "ver" átomos individuales midiendo la corriente que tunela entre una
        punta metálica y una superficie.
      </p>
    </div>
  )
}

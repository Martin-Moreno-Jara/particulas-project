import { useEffect, useRef, useState } from 'react'

// Sim R2 — Paradoja de los gemelos: el reloj de la nave avanza más lento cuanto mayor
// es su velocidad. Se puede simular un viaje de 10 años (tiempo terrestre).
const DURATION = 6 // segundos que dura la animación del viaje de 10 años

const gammaOf = (v) => 1 / Math.sqrt(1 - v * v)

export default function TwinParadox() {
  const [vFrac, setVFrac] = useState(0.8)
  const [running, setRunning] = useState(false)
  const [showFormula, setShowFormula] = useState(false)
  const [trip, setTrip] = useState({ earth: 0, ship: 0 })
  const [done, setDone] = useState(false)

  const vRef = useRef(0.8)
  const runningRef = useRef(false)
  const tripRef = useRef(0)
  const phaseRef = useRef(0)
  const handA = useRef(null)
  const handB = useRef(null)

  // Bucle de animación: gira las manecillas (B más lenta) y avanza el viaje.
  useEffect(() => {
    let raf
    let last = performance.now()
    let frame = 0
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const g = gammaOf(vRef.current)
      phaseRef.current += dt
      const aAng = (phaseRef.current * 110) % 360
      const bAng = ((phaseRef.current * 110) / g) % 360
      if (handA.current) handA.current.style.transform = `translateX(-50%) rotate(${aAng}deg)`
      if (handB.current) handB.current.style.transform = `translateX(-50%) rotate(${bAng}deg)`

      if (runningRef.current) {
        tripRef.current += dt
        const earth = Math.min(10, (tripRef.current / DURATION) * 10)
        frame++
        if (frame % 3 === 0) setTrip({ earth, ship: earth / g })
        if (earth >= 10) {
          runningRef.current = false
          setRunning(false)
          setTrip({ earth: 10, ship: 10 / g })
          setDone(true)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onV = (e) => {
    const v = parseFloat(e.target.value)
    vRef.current = v
    setVFrac(v)
  }

  const simulate = () => {
    tripRef.current = 0
    setDone(false)
    setTrip({ earth: 0, ship: 0 })
    runningRef.current = true
    setRunning(true)
  }

  const g = gammaOf(vFrac)

  const Clock = ({ label, color, handRef, years, subtitle }) => (
    <div className="flex flex-1 flex-col items-center rounded-lg border border-white/10 bg-black/30 p-4">
      <span className="mb-3 text-sm font-medium" style={{ color }}>
        {label}
      </span>
      <div className="relative h-28 w-28 rounded-full border-2" style={{ borderColor: `${color}66` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-1 w-0.5 bg-white/20"
            style={{ transform: `translate(-50%,-50%) rotate(${i * 30}deg) translateY(-52px)` }}
          />
        ))}
        <div
          ref={handRef}
          className="absolute bottom-1/2 left-1/2 h-10 w-1 rounded-full"
          style={{ background: color, transformOrigin: 'bottom center' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="mt-3 font-mono text-2xl font-semibold text-text-primary">{years.toFixed(2)}</span>
      <span className="text-xs text-text-secondary">años · {subtitle}</span>
    </div>
  )

  return (
    <div>
      <div className="flex gap-4">
        <Clock label="Gemelo A — Tierra" color="#ff9d3d" handRef={handA} years={trip.earth} subtitle="en reposo" />
        <Clock
          label="Gemelo B — Nave"
          color="#5b7cff"
          handRef={handB}
          years={trip.ship}
          subtitle={`a ${(vFrac * 100).toFixed(1)}% de c`}
        />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between sim-label">
          <span>Velocidad de la nave</span>
          <span>{(vFrac * 100).toFixed(1)}% de c · γ = {g.toFixed(2)}</span>
        </div>
        <input type="range" min="0" max="0.999" step="0.001" value={vFrac} onChange={onV} className="w-full" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className={`sim-btn ${running ? 'sim-btn--active' : ''}`} onClick={simulate} disabled={running}>
          {running ? 'Viajando…' : '▶ Simular viaje de 10 años (Tierra)'}
        </button>
        <button className="sim-btn" onClick={() => setShowFormula((s) => !s)}>
          {showFormula ? 'Ocultar fórmula' : 'Mostrar fórmula'}
        </button>
      </div>

      {showFormula && (
        <p className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3 text-center font-mono text-sm text-text-secondary">
          γ = 1 / √(1 − v²/c²) = {g.toFixed(3)} → el reloj de la nave avanza al {(100 / g).toFixed(1)}% del ritmo terrestre
        </p>
      )}

      {done && (
        <p className="mt-3 rounded-lg border p-3 text-sm" style={{ borderColor: '#5b7cff66', color: '#cdd6ff' }}>
          El Gemelo A envejeció <strong>10 años</strong>, pero el Gemelo B solo envejeció{' '}
          <strong>{(10 / g).toFixed(2)} años</strong>. Al reencontrarse, B es {(10 - 10 / g).toFixed(2)} años más joven.
        </p>
      )}
    </div>
  )
}

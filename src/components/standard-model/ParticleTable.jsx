import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { particles } from '../../data/content.js'

// Sim SM1 — Tabla del Modelo Estándar: tarjetas interactivas de cada partícula con
// panel informativo, animación de su rol y modo antimateria.

// Descripciones divulgativas breves por partícula.
const INFO = {
  u: 'Junto al quark abajo forma protones y neutrones: es uno de los ladrillos de toda la materia ordinaria.',
  d: 'Compañero del quark arriba dentro de protones y neutrones. Un neutrón es, en esencia, dos abajo y un arriba.',
  c: 'Versión más pesada del quark arriba. Aparece en partículas exóticas y decae rápidamente.',
  s: 'Quark de masa intermedia presente en partículas "extrañas" creadas en aceleradores y rayos cósmicos.',
  t: 'El quark más pesado, casi tan masivo como un átomo de oro entero. Vive una billonésima de billonésima de segundo.',
  b: 'Quark pesado clave en los experimentos del LHC para estudiar la diferencia entre materia y antimateria.',
  e: 'Responsable de la electricidad, los enlaces químicos y la luz que emiten los átomos. Orbita el núcleo en nubes de probabilidad.',
  'νe': 'Neutrino ligadísimo al electrón. Billones atraviesan tu cuerpo cada segundo sin tocarte.',
  'μ': 'Un electrón pesado e inestable. Se crea cuando los rayos cósmicos chocan con la atmósfera.',
  'νμ': 'Neutrino asociado al muón. Como todos los neutrinos, apenas interactúa con la materia.',
  'τ': 'El leptón cargado más pesado: unas 3.500 veces el electrón. Extremadamente fugaz.',
  'ντ': 'El más esquivo de los neutrinos, asociado al tau. Su detección directa llegó en el año 2000.',
  g: 'Pega los quarks entre sí mediante la fuerza fuerte. Curiosamente, los gluones también se atraen entre ellos.',
  'γ': 'La partícula de luz. Transmite la fuerza electromagnetica y no tiene masa: por eso viaja siempre a c.',
  Z: 'Mediador neutro de la fuerza débil. Su descubrimiento confirmó la unificación electrodébil.',
  W: 'Mediador cargado de la fuerza débil; protagonista de la radiactividad beta, donde un neutrón se vuelve protón.',
  H: 'El bosón de Higgs: la huella del campo que da masa a las demás partículas. Confirmado en el LHC en 2012.',
}

const flipCharge = (c) => (c.startsWith('+') ? '−' + c.slice(1) : c.startsWith('−') ? '+' + c.slice(1) : c)

// Animación del rol de la partícula según su categoría.
function RoleAnimation({ category, color }) {
  if (category === 'quark') {
    return (
      <svg viewBox="0 0 140 90" className="h-20">
        {[
          [70, 28],
          [48, 62],
          [92, 62],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={9}
            fill={['#ff5d5d', '#36e08a', '#5d8aff'][i]}
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
        <circle cx={70} cy={50} r={30} fill="none" stroke="#ffffff22" />
      </svg>
    )
  }
  if (category === 'lepton') {
    return (
      <svg viewBox="0 0 140 90" className="h-20">
        <circle cx={70} cy={45} r={7} fill="#ffd9a8" />
        <ellipse cx={70} cy={45} rx={42} ry={20} fill="none" stroke="#ffffff22" />
        <motion.circle
          r={5}
          fill={color}
          animate={{ offsetDistance: ['0%', '100%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          style={{ offsetPath: 'path("M 28 45 a 42 20 0 1 0 84 0 a 42 20 0 1 0 -84 0")' }}
        />
      </svg>
    )
  }
  if (category === 'higgs') {
    return (
      <svg viewBox="0 0 140 90" className="h-20">
        <circle cx={70} cy={45} r={10} fill="#f5f5f5" />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={70}
            cy={45}
            r={14}
            fill="none"
            stroke="#f5f5f5"
            animate={{ r: [14, 38], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </svg>
    )
  }
  // boson: mediador intercambiado entre dos partículas
  return (
    <svg viewBox="0 0 140 90" className="h-20">
      <circle cx={26} cy={45} r={9} fill="#5d8aff" />
      <circle cx={114} cy={45} r={9} fill="#5d8aff" />
      <motion.circle
        cy={45}
        r={6}
        fill={color}
        animate={{ cx: [30, 110, 30] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

function Card({ p, category, anti, onClick, active }) {
  const charge = anti ? flipCharge(p.charge) : p.charge
  const showAnti = anti && (category === 'quark' || category === 'lepton')
  return (
    <button
      onClick={onClick}
      className="rounded-md border p-2 text-left transition-transform hover:scale-[1.04]"
      style={{
        borderColor: p.color,
        background: anti ? p.color : 'rgba(0,0,0,0.4)',
        color: anti ? '#15050f' : '#e8e8e8',
        outline: active ? `2px solid ${p.color}` : 'none',
      }}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-lg font-bold">
          {showAnti ? <span style={{ textDecoration: 'overline' }}>{p.symbol}</span> : p.symbol}
        </span>
        <span className="font-mono text-[0.65rem] opacity-80">{charge}</span>
      </div>
      <div className="truncate text-[0.6rem] leading-tight opacity-80">
        {showAnti ? 'anti-' : ''}
        {p.name}
      </div>
    </button>
  )
}

function Group({ title, items, category, anti, selected, onSelect }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <h4 className="mb-2 text-center text-xs uppercase tracking-widest text-text-secondary">{title}</h4>
      <div className={`grid gap-2 ${items.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {items.map((p) => (
          <Card
            key={p.symbol}
            p={p}
            category={category}
            anti={anti}
            active={selected?.symbol === p.symbol}
            onClick={() => onSelect({ ...p, category })}
          />
        ))}
      </div>
    </div>
  )
}

export default function ParticleTable() {
  const [anti, setAnti] = useState(false)
  const [selected, setSelected] = useState({ ...particles.quarks[0], category: 'quark' })

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className={`sim-btn ${anti ? 'sim-btn--active' : ''}`} onClick={() => setAnti((a) => !a)}>
          {anti ? '◐ Mostrando antimateria' : '◑ Mostrar antimateria'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Group title="Quarks" items={particles.quarks} category="quark" anti={anti} selected={selected} onSelect={setSelected} />
        <Group title="Leptones" items={particles.leptons} category="lepton" anti={anti} selected={selected} onSelect={setSelected} />
        <Group title="Bosones gauge" items={particles.bosons} category="boson" anti={anti} selected={selected} onSelect={setSelected} />
        <Group title="Higgs" items={particles.higgs} category="higgs" anti={anti} selected={selected} onSelect={setSelected} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected.symbol}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-4 flex flex-col gap-4 rounded-lg border border-white/10 bg-black/40 p-5 md:flex-row md:items-center"
        >
          <div className="flex shrink-0 items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-lg font-display text-3xl font-bold"
              style={{ background: `${selected.color}22`, color: selected.color, border: `1px solid ${selected.color}` }}
            >
              {selected.symbol}
            </div>
            <RoleAnimation category={selected.category} color={selected.color} />
          </div>
          <div>
            <h4 className="font-display text-xl font-semibold text-text-primary">{selected.name}</h4>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-secondary">
              <span>Masa: {selected.mass}</span>
              <span>Carga: {anti ? flipCharge(selected.charge) : selected.charge}</span>
              <span>Spin: {selected.spin}</span>
              {selected.role && <span>Rol: {selected.role}</span>}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{INFO[selected.symbol]}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

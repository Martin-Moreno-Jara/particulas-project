import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Sim Q3 — Gato de Schrödinger: superposición de "vivo" y "muerto" hasta que se
// mide (abrir la caja), momento en que la función de onda colapsa a un único estado.

// Ilustración estilizada del gato según su estado.
function Cat({ mode }) {
  const fill = mode === 'alive' ? '#36e08a' : '#8a8a96'
  const stroke = mode === 'alive' ? '#9bffcf' : '#c2c2cc'
  return (
    <svg viewBox="0 0 160 150" className="h-full w-full">
      {/* Orejas */}
      <polygon points="44,52 36,18 66,40" fill={fill} />
      <polygon points="116,52 124,18 94,40" fill={fill} />
      {/* Cabeza */}
      <circle cx="80" cy="78" r="42" fill={fill} opacity="0.9" />
      {/* Ojos */}
      {mode === 'alive' ? (
        <>
          <circle cx="64" cy="72" r="6" fill="#06281b" />
          <circle cx="96" cy="72" r="6" fill="#06281b" />
          <path d="M68 96 Q80 106 92 96" fill="none" stroke="#06281b" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M58 66 L70 78 M70 66 L58 78" stroke="#2a2a30" strokeWidth="3" strokeLinecap="round" />
          <path d="M90 66 L102 78 M102 66 L90 78" stroke="#2a2a30" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="98" x2="92" y2="98" stroke="#2a2a30" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* Bigotes */}
      <g stroke={stroke} strokeWidth="1.5" opacity="0.7">
        <line x1="40" y1="84" x2="14" y2="80" />
        <line x1="40" y1="90" x2="16" y2="92" />
        <line x1="120" y1="84" x2="146" y2="80" />
        <line x1="120" y1="90" x2="144" y2="92" />
      </g>
    </svg>
  )
}

export default function SchrodingerCat() {
  const [measured, setMeasured] = useState(false)
  const [result, setResult] = useState(null)

  const open = () => {
    setResult(Math.random() < 0.5 ? 'alive' : 'dead')
    setMeasured(true)
  }
  const close = () => {
    setMeasured(false)
    setResult(null)
  }

  return (
    <div>
      <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-black/60 to-black/30">
        <div className="relative h-44 w-44">
          {!measured ? (
            // Superposición: ambos estados parpadean superpuestos
            <>
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.9, 0.2, 0.9] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Cat mode="alive" />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Cat mode="dead" />
              </motion.div>
            </>
          ) : (
            <AnimatePresence>
              <motion.div
                key={result}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                className="absolute inset-0"
              >
                <Cat mode={result} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-text-secondary">
          {measured ? 'Caja abierta — colapso' : 'Caja cerrada — superposición'}
        </span>
      </div>

      <p className="mt-3 min-h-[3.5rem] rounded-lg border border-white/10 bg-black/40 p-3 text-sm leading-relaxed text-text-secondary">
        {!measured ? (
          <>
            El gato está <span className="text-quantum" style={{ color: '#36e08a' }}>vivo</span> Y{' '}
            <span style={{ color: '#a0a0a0' }}>muerto</span> simultáneamente. La partícula radiactiva
            no ha decaído NI ha decaído: ambas posibilidades coexisten.
          </>
        ) : (
          <>
            Al medir, la función de onda <strong className="text-text-primary">colapsa</strong> a un
            único estado: el gato está{' '}
            <strong style={{ color: result === 'alive' ? '#36e08a' : '#a0a0a0' }}>
              {result === 'alive' ? 'vivo' : 'muerto'}
            </strong>
            . El resultado es aleatorio: 50% y 50%.
          </>
        )}
      </p>

      <div className="mt-3 flex gap-3">
        <button className="sim-btn" onClick={open} disabled={measured}>
          🔍 Abrir la caja (medir)
        </button>
        <button className="sim-btn" onClick={close} disabled={!measured}>
          ↺ Cerrar la caja (reiniciar)
        </button>
      </div>
    </div>
  )
}

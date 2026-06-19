import { Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Spinner() {
  return (
    <div className="flex h-48 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
    </div>
  )
}

// Floating experiment overlay. `experiment` = { title, hint, accent, Sim }.
// Closes on Escape or backdrop click.
export default function ExperimentModal({ experiment, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const { title, hint, accent, Sim } = experiment

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        style={{ background: 'rgba(0,0,5,0.82)', backdropFilter: 'blur(10px)' }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          key="panel"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-3xl overflow-hidden rounded-2xl border bg-[#07070d]"
          style={{
            borderColor: accent + '40',
            boxShadow: `0 0 60px ${accent}18, 0 20px 60px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-6 py-4"
            style={{ borderColor: accent + '25' }}
          >
            <div>
              <h2
                className="font-display text-xl font-bold leading-tight"
                style={{ color: accent }}
              >
                {title}
              </h2>
              {hint && (
                <p className="mt-0.5 text-xs text-white/45">{hint}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Sim body */}
          <div className="p-5">
            <Suspense fallback={<Spinner />}>
              <Sim />
            </Suspense>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

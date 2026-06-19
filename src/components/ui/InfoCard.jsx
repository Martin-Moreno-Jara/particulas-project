import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InfoCard({ card, onClose, onOpenExperiment }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const { title, facts, accent, expId, video } = card
  const hasVideo = video?.id

  return (
    <AnimatePresence>
      <motion.div
        key="ic-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(0,0,5,0.80)', backdropFilter: 'blur(12px)' }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          key="ic-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`w-full ${hasVideo ? 'max-w-lg' : 'max-w-sm'} rounded-2xl border bg-[#06060e]`}
          style={{
            borderColor: accent + '45',
            boxShadow: `0 0 60px ${accent}18, 0 24px 60px rgba(0,0,0,0.6)`,
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Scrollable body */}
          <div className="overflow-y-auto p-6">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2
                className="font-display text-xl font-bold leading-tight"
                style={{ color: accent }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Facts */}
            <ul className="space-y-4">
              {facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                  <span className="mt-1 flex-shrink-0 text-[10px]" style={{ color: accent }}>◆</span>
                  {fact}
                </li>
              ))}
            </ul>

            {/* Video embed */}
            {hasVideo && (
              <div className="mt-5">
                <p className="mb-2 text-[0.65rem] uppercase tracking-widest" style={{ color: accent + 'aa' }}>
                  {video.title}
                </p>
                <div
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: accent + '25' }}
                >
                  <iframe
                    className="aspect-video w-full"
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* "Go deeper" button */}
            {expId && (
              <button
                onClick={() => { onClose(); onOpenExperiment(expId) }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all hover:brightness-110"
                style={{ borderColor: accent + '55', color: accent, background: accent + '14' }}
              >
                Explorar el experimento
                <span className="opacity-70">→</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

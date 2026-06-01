import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { glossary } from '../../data/content.js'

// Envuelve un término técnico: subrayado punteado + tooltip con su definición al hover.
export default function GlossaryTooltip({ term, children }) {
  const [open, setOpen] = useState(false)
  const definition = glossary[term]

  // Si el término no está en el glosario, se muestra el texto sin decorar.
  if (!definition) return <>{children || term}</>

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="glossary-term">{children || term}</span>
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-white/15 bg-[#0c0c14] p-3 text-left text-xs font-normal not-italic leading-relaxed text-text-primary shadow-2xl shadow-black/60"
          >
            <span className="mb-1 block font-display text-[0.7rem] font-semibold uppercase tracking-wider text-glossary">
              {term}
            </span>
            {definition}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-white/15 bg-[#0c0c14]" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

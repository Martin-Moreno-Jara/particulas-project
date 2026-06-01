import { motion } from 'framer-motion'

// Encabezado animado de cada sección: número, título, lema y rango de escala.
export default function SectionTitle({ index, title, tagline, scaleRange, accent }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="mb-12 border-l-2 pl-6"
      style={{ borderColor: accent }}
    >
      <div className="mb-2 font-mono text-sm tracking-[0.3em] text-text-secondary">
        0{index} — ESCALA {scaleRange}
      </div>
      <h2 className="font-display text-5xl font-bold leading-tight md:text-6xl" style={{ color: accent }}>
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-lg text-text-secondary">{tagline}</p>
    </motion.header>
  )
}

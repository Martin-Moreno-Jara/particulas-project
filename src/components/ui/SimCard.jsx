import { motion } from 'framer-motion'

// Contenedor reutilizable de una simulación interactiva: etiqueta, título,
// descripción y un marco con el color de acento de la sección.
export default function SimCard({ label, title, description, accent, children, wide = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sim-frame ${wide ? 'col-span-full' : ''}`}
      style={{ '--section-accent': `${accent}66` }}
    >
      <header className="mb-4">
        {label && (
          <span className="sim-label" style={{ color: accent }}>
            {label}
          </span>
        )}
        <h3 className="mt-1 font-display text-2xl font-semibold text-text-primary">{title}</h3>
        {description && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>}
      </header>
      <div className="sim-body">{children}</div>
    </motion.div>
  )
}

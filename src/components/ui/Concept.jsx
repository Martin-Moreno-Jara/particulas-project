import { motion } from 'framer-motion'
import GlossaryText from './GlossaryText.jsx'
import GlossaryTooltip from './GlossaryTooltip.jsx'

// Renderiza una subsección divulgativa: concepto, puntos clave, analogía y los
// términos del glosario resaltados con tooltip.
export default function Concept({ sub, accent }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm"
    >
      <h3 className="font-display text-xl font-semibold text-text-primary">{sub.title}</h3>

      <p className="mt-3 leading-relaxed text-text-secondary">
        <GlossaryText text={sub.concept} terms={sub.glossaryTerms} />
      </p>

      <ul className="mt-4 space-y-2">
        {sub.keyPoints.map((point, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
            <span className="mt-1 shrink-0" style={{ color: accent }}>
              ▸
            </span>
            <span>
              <GlossaryText text={point} terms={sub.glossaryTerms} />
            </span>
          </li>
        ))}
      </ul>

      <blockquote
        className="mt-4 border-l-2 pl-4 text-sm italic leading-relaxed text-text-primary/80"
        style={{ borderColor: accent }}
      >
        <span className="mr-1 not-italic" style={{ color: accent }}>
          Analogía:
        </span>
        {sub.analogy}
      </blockquote>

      <div className="mt-4 flex flex-wrap gap-2">
        {sub.glossaryTerms.map((term) => (
          <span
            key={term}
            className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-text-secondary"
          >
            <GlossaryTooltip term={term} />
          </span>
        ))}
      </div>
    </motion.article>
  )
}

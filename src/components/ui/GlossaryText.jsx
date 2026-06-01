import GlossaryTooltip from './GlossaryTooltip.jsx'
import { glossary } from '../../data/content.js'

// Escapa caracteres especiales de regex (paréntesis, barras, etc.).
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Renderiza un texto resaltando automáticamente los términos del glosario indicados,
// envolviéndolos en un GlossaryTooltip. Si no se pasan términos, usa todo el glosario.
export default function GlossaryText({ text, terms }) {
  const pool = (terms && terms.length ? terms : Object.keys(glossary)).filter((t) => glossary[t])
  if (!pool.length) return <>{text}</>

  // Coincidencias más largas primero, para no partir términos compuestos.
  const sorted = [...pool].sort((a, b) => b.length - a.length)
  const regex = new RegExp(`(${sorted.map(escapeRegExp).join('|')})`, 'gi')
  const canonical = new Map(sorted.map((t) => [t.toLowerCase(), t]))
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) => {
        const canon = part ? canonical.get(part.toLowerCase()) : undefined
        return canon ? (
          <GlossaryTooltip key={i} term={canon}>
            {part}
          </GlossaryTooltip>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </>
  )
}

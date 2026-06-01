import SectionTitle from './SectionTitle.jsx'
import Concept from './Concept.jsx'

// Contenido de una sección dentro de su panel-estación: título, bloques divulgativos
// y rejilla de simulaciones. El tamaño, el scroll y el fondo los aporta StationPanel.
export default function SectionShell({ section, index, children }) {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <SectionTitle
        index={index}
        title={section.title}
        tagline={section.tagline}
        scaleRange={section.scaleRange}
        accent={section.accent}
      />

      {/* Bloques divulgativos de las subsecciones */}
      <div className="grid gap-6 md:grid-cols-2">
        {section.subsections.map((sub) => (
          <Concept key={sub.id} sub={sub} accent={section.accent} />
        ))}
      </div>

      {/* Simulaciones interactivas de la sección */}
      <div className="mt-14">
        <h3 className="mb-8 font-display text-2xl font-semibold text-text-primary">
          Simulaciones interactivas
        </h3>
        <div className="grid gap-8 lg:grid-cols-2">{children}</div>
      </div>
    </div>
  )
}

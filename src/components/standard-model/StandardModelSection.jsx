import SectionShell from '../ui/SectionShell.jsx'
import SimCard from '../ui/SimCard.jsx'
import { sections } from '../../data/content.js'
import ParticleTable from './ParticleTable.jsx'
import QuarkComposer from './QuarkComposer.jsx'
import ForcesComparison from './ForcesComparison.jsx'

// Sección 4: Modelo Estándar — el catálogo de las partículas elementales (10⁻¹⁴ → 10⁻¹⁸ m).
const section = sections.find((s) => s.id === 'modelo-estandar')

export default function StandardModelSection() {
  return (
    <SectionShell section={section} index={4}>
      <SimCard
        label="Sim SM1"
        title="Tabla de partículas elementales"
        description="Explora quarks, leptones y bosones. Haz clic en cada partícula para ver su ficha y su papel, o activa el modo antimateria."
        accent={section.accent}
        wide
      >
        <ParticleTable />
      </SimCard>

      <SimCard
        label="Sim SM2"
        title="Compositor de hadrones"
        description="Arrastra tres quarks a la zona central y descubre si forman un protón, un neutrón u otra partícula… o una combinación imposible."
        accent={section.accent}
        wide
      >
        <QuarkComposer />
      </SimCard>

      <SimCard
        label="Sim SM3"
        title="Las cuatro fuerzas comparadas"
        description="Cuatro paneles simultáneos: órbitas gravitatorias, cargas eléctricas, quarks confinados por gluones y un decaimiento beta. Interactúa con cada uno."
        accent={section.accent}
        wide
      >
        <ForcesComparison />
      </SimCard>
    </SectionShell>
  )
}

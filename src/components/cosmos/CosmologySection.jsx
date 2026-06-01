import SectionShell from '../ui/SectionShell.jsx'
import SimCard from '../ui/SimCard.jsx'
import { sections } from '../../data/content.js'
import UniverseExpansion from './UniverseExpansion.jsx'
import CMBMap from './CMBMap.jsx'
import DarkMatterSim from './DarkMatterSim.jsx'
import CosmicTimeline from './CosmicTimeline.jsx'

// Sección 1: Cosmología — las mayores estructuras del cosmos (10²⁶ → 10²² m).
const section = sections.find((s) => s.id === 'cosmologia')

export default function CosmologySection() {
  return (
    <SectionShell section={section} index={1}>
      <SimCard
        label="Sim C1"
        title="Expansión del universo"
        description="Reproduce la expansión y mueve el tiempo desde el Big Bang hasta el futuro lejano. Observa cómo las galaxias se alejan y aparece el corrimiento al rojo."
        accent={section.accent}
      >
        <UniverseExpansion />
      </SimCard>

      <SimCard
        label="Sim C2"
        title="Mapa del Fondo Cósmico de Microondas"
        description="Una proyección de todo el cielo con las diminutas variaciones de temperatura del universo bebé. Pasa el ratón para leer cada región."
        accent={section.accent}
      >
        <CMBMap />
      </SimCard>

      <SimCard
        label="Sim C3"
        title="Rotación galáctica y materia oscura"
        description="Compara cómo gira una galaxia con y sin materia oscura. Sin ella, las estrellas externas se rezagan y escapan; con ella, la curva de rotación es plana."
        accent={section.accent}
        wide
      >
        <DarkMatterSim />
      </SimCard>

      <SimCard
        label="Sim C4"
        title="Línea de tiempo cósmica"
        description="Recorre 13.800 millones de años de historia (y el futuro) en escala logarítmica. Haz clic en cada hito para conocerlo."
        accent={section.accent}
        wide
      >
        <CosmicTimeline />
      </SimCard>
    </SectionShell>
  )
}

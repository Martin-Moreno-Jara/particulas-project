import SectionShell from '../ui/SectionShell.jsx'
import SimCard from '../ui/SimCard.jsx'
import { sections } from '../../data/content.js'
import SpacetimeMesh from './SpacetimeMesh.jsx'
import TwinParadox from './TwinParadox.jsx'
import LengthContraction from './LengthContraction.jsx'
import LightSpeedLimit from './LightSpeedLimit.jsx'

// Sección 2: Relatividad — cómo la masa moldea el espacio y el tiempo (10¹⁶ → 10⁹ m).
const section = sections.find((s) => s.id === 'relatividad')

export default function RelativitySection() {
  return (
    <SectionShell section={section} index={2}>
      <SimCard
        label="Sim R1"
        title="Malla de espacio-tiempo"
        description="Aumenta la masa y observa cómo se hunde la cuadrícula. Lanza un fotón: seguirá la curvatura. A masa máxima, ni la luz escapa del agujero negro."
        accent={section.accent}
      >
        <SpacetimeMesh />
      </SimCard>

      <SimCard
        label="Sim R2"
        title="Paradoja de los gemelos"
        description="Cuanto más rápido viaja la nave, más lento avanza su reloj. Simula un viaje de 10 años terrestres y compara cuánto envejece cada gemelo."
        accent={section.accent}
      >
        <TwinParadox />
      </SimCard>

      <SimCard
        label="Sim R3"
        title="Contracción de longitud"
        description="Los objetos en movimiento se comprimen en la dirección del viaje. Mueve la velocidad y observa cómo la nave se aplana cerca de c."
        accent={section.accent}
      >
        <LengthContraction />
      </SimCard>

      <SimCard
        label="Sim R4"
        title="El límite de velocidad"
        description="La energía necesaria para acelerar una nave se dispara al infinito al acercarse a la velocidad de la luz. Arrastra el punto sobre la curva."
        accent={section.accent}
      >
        <LightSpeedLimit />
      </SimCard>
    </SectionShell>
  )
}

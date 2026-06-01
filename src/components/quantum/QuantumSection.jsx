import SectionShell from '../ui/SectionShell.jsx'
import SimCard from '../ui/SimCard.jsx'
import { sections } from '../../data/content.js'
import DoubleSlit from './DoubleSlit.jsx'
import UncertaintyPrinciple from './UncertaintyPrinciple.jsx'
import SchrodingerCat from './SchrodingerCat.jsx'
import QuantumTunnel from './QuantumTunnel.jsx'

// Sección 3: Mecánica cuántica — las reglas de lo muy pequeño (10⁻⁸ → 10⁻¹⁰ m).
const section = sections.find((s) => s.id === 'cuantica')

export default function QuantumSection() {
  return (
    <SectionShell section={section} index={3}>
      <SimCard
        label="Sim Q1"
        title="Experimento de la doble rendija"
        description="Dispara partículas una a una. Sin detector forman franjas de interferencia; al activar el detector, el patrón colapsa en dos bandas."
        accent={section.accent}
      >
        <DoubleSlit />
      </SimCard>

      <SimCard
        label="Sim Q2"
        title="Principio de incertidumbre"
        description="Precisa la posición y observa cómo se difumina el momento (y viceversa). El producto de ambas incertidumbres tiene un mínimo inviolable."
        accent={section.accent}
      >
        <UncertaintyPrinciple />
      </SimCard>

      <SimCard
        label="Sim Q3"
        title="El gato de Schrödinger"
        description="Mientras la caja está cerrada, el gato está vivo y muerto a la vez. Ábrela para forzar el colapso a un único estado, al azar."
        accent={section.accent}
      >
        <SchrodingerCat />
      </SimCard>

      <SimCard
        label="Sim Q4"
        title="Efecto túnel cuántico"
        description="Un paquete de onda llega a una barrera. Ajusta su altura y grosor y observa qué fracción logra atravesarla."
        accent={section.accent}
      >
        <QuantumTunnel />
      </SimCard>
    </SectionShell>
  )
}

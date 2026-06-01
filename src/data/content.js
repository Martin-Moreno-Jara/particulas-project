// Todo el texto divulgativo del portal: secciones, subsecciones, analogías y glosario.
// Sin fórmulas matemáticas; lenguaje accesible para público general.

// ---------- GLOSARIO GLOBAL ----------
// Cada término aparece subrayado en el texto y muestra su definición al hacer hover.
export const glossary = {
  // Cosmología
  'Big Bang':
    'Modelo del origen del universo: hace ~13.800 millones de años todo el cosmos estaba concentrado en un estado extremadamente caliente y denso que comenzó a expandirse.',
  'Corrimiento al rojo':
    'Estiramiento de la luz de un objeto que se aleja: sus ondas se vuelven más largas (más rojas). Cuanto más lejos está una galaxia, mayor es su corrimiento al rojo.',
  'Expansión cósmica':
    'El espacio mismo se estira con el tiempo, alejando a las galaxias unas de otras. No es que las galaxias viajen por el espacio: es el espacio el que crece.',
  CMB:
    'Fondo Cósmico de Microondas: la radiación más antigua que podemos detectar, emitida 380.000 años tras el Big Bang. Es una "fotografía" del universo bebé.',
  'Anisotropías':
    'Pequeñísimas variaciones de temperatura (de una parte en cien mil) en el Fondo Cósmico de Microondas. Fueron las semillas de las galaxias actuales.',
  'Materia oscura':
    'Materia invisible que no emite ni refleja luz, pero cuya gravedad mantiene unidas a las galaxias. Constituye cerca del 27% del universo.',
  'Energía oscura':
    'Forma de energía desconocida que actúa como una "antigravedad", acelerando la expansión del universo. Representa cerca del 68% del cosmos.',
  'Lente gravitacional':
    'Curvatura de la luz al pasar cerca de una gran masa, que actúa como una lente y distorsiona la imagen de objetos lejanos.',
  'Gran Colapso':
    'Hipótesis (hoy descartada por la energía oscura) de que la expansión podría revertirse y el universo volvería a contraerse en un "Big Crunch".',
  'Muerte térmica':
    'Destino más probable del universo: tras una expansión eterna, todo quedará frío, oscuro y disperso, sin energía utilizable.',

  // Relatividad
  'Espacio-tiempo':
    'Tejido de cuatro dimensiones (tres de espacio y una de tiempo) en el que ocurren todos los eventos del universo.',
  Curvatura:
    'Deformación del espacio-tiempo causada por la masa y la energía. Lo que llamamos gravedad es, en realidad, esta curvatura.',
  'Horizonte de eventos':
    'Frontera de un agujero negro: una vez cruzada, nada —ni siquiera la luz— puede escapar.',
  'Geodésica':
    'El camino más recto posible a través de un espacio-tiempo curvado. Los planetas y la luz siguen geodésicas.',
  'Dilatación temporal':
    'Fenómeno real por el que el tiempo transcurre más lento para objetos en movimiento rápido o cerca de grandes masas.',
  'Relatividad especial':
    'Teoría de Einstein (1905) sobre el espacio, el tiempo y la velocidad de la luz para observadores que se mueven a velocidad constante.',
  'Relatividad general':
    'Teoría de Einstein (1915) que describe la gravedad como la curvatura del espacio-tiempo producida por la masa y la energía.',
  'Contracción de Lorentz':
    'Acortamiento de un objeto en la dirección de su movimiento cuando viaja a velocidades cercanas a la de la luz.',
  'Factor gamma':
    'Número que cuantifica cuánto se dilata el tiempo y se contrae la longitud. Vale 1 en reposo y crece sin límite al acercarse a la velocidad de la luz.',
  'Velocidad de la luz (c)':
    'El límite de velocidad del universo: unos 300.000 km/s. Nada con masa puede alcanzarla.',
  Causalidad:
    'Principio de que la causa precede al efecto. El límite de la velocidad de la luz garantiza que ninguna señal viaje al pasado.',

  // Cuántica
  'Fotón': 'Partícula de luz: el "paquete" mínimo de energía electromagnética. No tiene masa y viaja siempre a la velocidad de la luz.',
  Interferencia:
    'Suma de ondas que se refuerzan (crestas con crestas) o se cancelan (cresta con valle), creando patrones de franjas.',
  'Difracción': 'Tendencia de las ondas a curvarse y abrirse al pasar por una rendija o bordear un obstáculo.',
  'Patrón de interferencia':
    'Serie de franjas claras y oscuras que aparece cuando dos ondas se solapan. Es la huella inconfundible del comportamiento ondulatorio.',
  Incertidumbre:
    'Principio de Heisenberg: es imposible conocer a la vez, con precisión total, la posición y el momento de una partícula.',
  'Función de onda':
    'Descripción matemática del estado cuántico de una partícula. Su cuadrado indica la probabilidad de encontrarla en cada lugar.',
  Colapso:
    'Reducción instantánea de la función de onda a un único resultado en el momento de la medición.',
  Momentum:
    'Cantidad de movimiento de una partícula, combinación de su masa y su velocidad.',
  'Superposición':
    'Capacidad de un sistema cuántico de estar en varios estados a la vez hasta que se le mide.',
  'Estado cuántico':
    'Conjunto completo de información que describe a un sistema cuántico (posición, momento, espín, etc.).',
  'Túnel cuántico':
    'Fenómeno por el que una partícula atraviesa una barrera de energía que, según la física clásica, no debería poder superar.',
  'Barrera de potencial':
    'Región del espacio que requiere cierta energía para ser atravesada, como una colina para una pelota.',
  'Probabilidad de transmisión':
    'Posibilidad (entre 0% y 100%) de que una partícula logre atravesar una barrera por efecto túnel.',

  // Modelo Estándar
  Quark:
    'Partícula elemental que forma los protones y neutrones. Existen seis tipos o "sabores" y nunca se encuentran aislados.',
  'Sabor de quark':
    'Cada uno de los seis tipos de quark: arriba, abajo, encanto, extraño, cima (top) y fondo (bottom).',
  'Gluón':
    'Partícula mensajera de la fuerza fuerte. "Pega" los quarks entre sí dentro de protones y neutrones.',
  'Hadrón':
    'Partícula compuesta por quarks unidos mediante gluones, como el protón o el neutrón.',
  'Confinamiento de color':
    'Propiedad de la fuerza fuerte por la que los quarks jamás pueden existir libres: siempre están confinados dentro de hadrones.',
  'Leptón':
    'Familia de partículas elementales que no sienten la fuerza fuerte. Incluye al electrón y a los neutrinos.',
  Electrón:
    'Leptón de carga negativa que orbita el núcleo atómico y es responsable de la química y la electricidad.',
  Neutrino:
    'Leptón casi sin masa y sin carga que apenas interactúa con la materia. Miles de billones atraviesan tu cuerpo cada segundo.',
  'Muón/Tau':
    'Primos pesados del electrón. Tienen la misma carga pero mucha más masa y son inestables.',
  'Generación':
    'Cada uno de los tres "pisos" en que se agrupan quarks y leptones, de menor a mayor masa. Toda la materia ordinaria usa la primera generación.',
  'Bosón W/Z':
    'Partículas mensajeras de la fuerza débil, responsables de ciertas formas de radiactividad. Son inusualmente pesadas.',
  'Bosón de Higgs':
    'Partícula asociada al campo de Higgs, que da masa a las demás partículas elementales. Descubierta en el LHC en 2012.',
  'Bosón gauge':
    'Partícula mensajera que transmite una fuerza fundamental: fotón, gluón y bosones W y Z.',
  'Fuerza fuerte':
    'La más intensa de las cuatro fuerzas. Mantiene unidos a los quarks y a los núcleos atómicos, pero solo actúa a distancias diminutas.',
  'Fuerza débil':
    'Fuerza responsable de la radiactividad y de procesos como la fusión en el Sol. Actúa a distancias todavía menores que la fuerte.',
  Electromagnetismo:
    'Fuerza responsable de la luz, la electricidad, el magnetismo y toda la química. Puede atraer o repeler.',
  Gravedad:
    'La más débil de las cuatro fuerzas, pero de alcance infinito y siempre atractiva. Domina a escala cósmica.',
  'Unificación de fuerzas':
    'Aspiración de la física de describir todas las fuerzas fundamentales como manifestaciones de una sola interacción.',
}

// ---------- HERO ----------
export const hero = {
  title: 'Del Universo al Quark',
  subtitle: 'Un viaje de zoom desde el cosmos hasta las partículas elementales',
  hint: 'Desliza hacia abajo para comenzar el viaje',
}

// ---------- SECCIONES ----------
export const sections = [
  {
    id: 'cosmologia',
    title: 'Cosmología',
    tagline: 'Las mayores estructuras del cosmos',
    scaleLabel: '10²⁶ m',
    scaleRange: '10²⁶ – 10²² m',
    color: '#0d1b4b',
    accent: '#5b7cff',
    subsections: [
      {
        id: 'big-bang',
        title: 'Big Bang y expansión del universo',
        concept:
          'El universo comenzó hace unos 13.800 millones de años en un estado extremadamente caliente y denso, y desde entonces se expande continuamente.',
        keyPoints: [
          'Las galaxias se alejan unas de otras a medida que pasa el tiempo.',
          'La expansión se detecta por el corrimiento al rojo de la luz de las galaxias.',
          'No son las galaxias las que se mueven por el espacio: es el propio espacio el que se estira.',
        ],
        analogy:
          'Imagina un globo inflándose con galaxias pintadas sobre su superficie. Al inflarse, todas se alejan entre sí, pero ninguna está en el centro.',
        glossaryTerms: ['Big Bang', 'Corrimiento al rojo', 'Expansión cósmica'],
      },
      {
        id: 'cmb',
        title: 'Fondo Cósmico de Microondas',
        concept:
          'Es la radiación fósil que llena todo el universo, emitida cuando el cosmos tenía apenas 380.000 años. Una auténtica "foto" del universo temprano.',
        keyPoints: [
          'Es la evidencia directa más sólida del Big Bang.',
          'Llena todo el universo de forma casi perfectamente uniforme.',
          'Sus diminutas fluctuaciones de temperatura dieron origen a las galaxias.',
        ],
        analogy:
          'Es como el rescoldo todavía tibio de una hoguera gigantesca: aunque el fuego se apagó hace eones, aún podemos sentir su calor en todas direcciones.',
        glossaryTerms: ['CMB', 'Anisotropías', 'Big Bang'],
      },
      {
        id: 'materia-oscura',
        title: 'Materia oscura y energía oscura',
        concept:
          'El 95% del universo es invisible. La materia oscura (~27%) tiene gravedad pero no emite luz; la energía oscura (~68%) acelera la expansión.',
        keyPoints: [
          'Las galaxias rotan demasiado rápido para la masa que vemos en ellas.',
          'La expansión del universo se está acelerando de forma inexplicable.',
          'Solo el 5% del cosmos es materia ordinaria: estrellas, planetas y nosotros.',
        ],
        analogy:
          'Es como un sistema solar donde los planetas se mueven demasiado rápido: tiene que haber algo más, invisible, que no estamos viendo.',
        glossaryTerms: ['Materia oscura', 'Energía oscura', 'Lente gravitacional'],
      },
      {
        id: 'destino',
        title: 'El destino del universo',
        concept:
          'La energía oscura garantiza una expansión eterna. El universo final será oscuro, frío y vacío: lo que se conoce como muerte térmica.',
        keyPoints: [
          'Las galaxias lejanas terminarán por desaparecer de nuestra vista.',
          'Las últimas estrellas se apagarán dentro de unos 100 billones de años.',
          'El "Gran Colapso" quedó descartado al descubrirse la aceleración cósmica.',
        ],
        analogy:
          'Como una fiesta que se dispersa lentamente: las luces se apagan una a una hasta que solo queda oscuridad y silencio.',
        glossaryTerms: ['Energía oscura', 'Muerte térmica', 'Gran Colapso'],
      },
    ],
  },
  {
    id: 'relatividad',
    title: 'Relatividad',
    tagline: 'Cómo la masa moldea el espacio y el tiempo',
    scaleLabel: '10¹⁶ m',
    scaleRange: '10¹⁶ – 10⁹ m',
    color: '#2d1200',
    accent: '#ff9d3d',
    subsections: [
      {
        id: 'curvatura',
        title: 'Curvatura del espacio-tiempo',
        concept:
          'La gravedad no es una fuerza que "tira": es la curvatura del espacio-tiempo causada por la masa. Los objetos siguen el camino más recto posible en ese espacio curvado.',
        keyPoints: [
          'La luz también se curva al pasar cerca de grandes masas.',
          'Los agujeros negros son curvatura llevada al extremo.',
          'Es la gran diferencia entre Newton (gravedad como fuerza) y Einstein (gravedad como geometría).',
        ],
        analogy:
          'Una lona elástica estirada. Coloca una bola de bowling en el centro: la lona se hunde. Una canica que lances seguirá la curva, no una línea recta.',
        glossaryTerms: ['Espacio-tiempo', 'Curvatura', 'Geodésica', 'Horizonte de eventos'],
      },
      {
        id: 'dilatacion',
        title: 'Dilatación temporal',
        concept:
          'El tiempo transcurre a ritmos diferentes según el movimiento o la gravedad. No es una ilusión: es física real y medible.',
        keyPoints: [
          'Los relojes en movimiento rápido van más lentos (relatividad especial).',
          'Los relojes cerca de grandes masas también van más lentos (relatividad general).',
          'El GPS necesita corregir estos efectos a diario o acumularía errores de kilómetros.',
        ],
        analogy:
          'El tiempo es como un río que fluye a distinta velocidad según dónde te encuentres: más lento si te mueves muy rápido o estás cerca de algo muy masivo.',
        glossaryTerms: ['Dilatación temporal', 'Relatividad especial', 'Relatividad general', 'Factor gamma'],
      },
      {
        id: 'contraccion',
        title: 'Contracción de longitud',
        concept:
          'Los objetos en movimiento se comprimen en la dirección en la que se mueven. Cuanto más rápido van, más cortos se ven.',
        keyPoints: [
          'El efecto es totalmente imperceptible a velocidades cotidianas.',
          'A un 99,9% de la velocidad de la luz, una nave parecería casi un disco plano.',
          'No es una ilusión óptica: es una propiedad real del espacio-tiempo.',
        ],
        analogy:
          'Como si el espacio mismo se encogiera por delante de un viajero ultrarrápido, acercándole su destino.',
        glossaryTerms: ['Contracción de Lorentz', 'Factor gamma', 'Velocidad de la luz (c)'],
      },
      {
        id: 'limite-c',
        title: 'El límite de velocidad (c)',
        concept:
          'Nada con masa puede viajar a la velocidad de la luz. Acercarse a ella requiere una energía que crece hasta el infinito.',
        keyPoints: [
          'Solo las partículas sin masa, como los fotones, viajan a la velocidad de la luz.',
          'Cuanto más rápido va un objeto, más energía hace falta para acelerarlo un poco más.',
          'La causalidad —que las causas precedan a los efectos— depende de este límite.',
        ],
        analogy:
          'Es como una pared infinitamente alta justo en el 100%: por más impulso que tomes, nunca llegas a tocarla si tienes masa.',
        glossaryTerms: ['Velocidad de la luz (c)', 'Causalidad', 'Factor gamma'],
      },
    ],
  },
  {
    id: 'cuantica',
    title: 'Mecánica cuántica',
    tagline: 'Las reglas extrañas de lo muy pequeño',
    scaleLabel: '10⁻⁸ m',
    scaleRange: '10⁻⁸ – 10⁻¹⁰ m',
    color: '#001a0d',
    accent: '#36e08a',
    subsections: [
      {
        id: 'dualidad',
        title: 'Dualidad onda-partícula',
        concept:
          'Las partículas no son simples "bolitas": se comportan como ondas y como partículas según se las observe o no.',
        keyPoints: [
          'La luz tiene doble naturaleza: es onda y es fotón.',
          'Los electrones también muestran esta dualidad.',
          'El experimento de la doble rendija es su demostración definitiva.',
        ],
        analogy:
          'Imagina a alguien que, sin mirarlo, se extiende como una onda que lo invade todo; pero en cuanto lo observas, aparece de golpe en un único lugar concreto.',
        glossaryTerms: ['Fotón', 'Interferencia', 'Difracción', 'Patrón de interferencia'],
      },
      {
        id: 'incertidumbre',
        title: 'Principio de incertidumbre',
        concept:
          'Es imposible conocer a la vez la posición exacta y el momento exacto de una partícula. No es un límite de los instrumentos: es una propiedad fundamental de la naturaleza.',
        keyPoints: [
          'Cuanto mejor mides la posición, menos sabes sobre el momento, y viceversa.',
          'El propio acto de medir altera el sistema observado.',
          'Los electrones no siguen órbitas definidas, sino "nubes de probabilidad".',
        ],
        analogy:
          'Para ver una bola en una caja oscura usas un flash: la ves, pero el destello la empuja. Si en cambio mides su velocidad con cámara lenta, ya no sabes exactamente dónde está.',
        glossaryTerms: ['Incertidumbre', 'Momentum', 'Función de onda'],
      },
      {
        id: 'superposicion',
        title: 'Superposición',
        concept:
          'Un sistema cuántico existe en varios estados a la vez hasta que se mide. La medición lo "colapsa" a un único resultado.',
        keyPoints: [
          'Antes de medir, todas las posibilidades coexisten.',
          'La medición elige —al azar— uno de los estados posibles.',
          'El gato de Schrödinger lleva este absurdo a escala macroscópica para ilustrarlo.',
        ],
        analogy:
          'Una moneda cuántica girando en el aire no es ni cara ni cruz: es ambas a la vez. Solo al atraparla se decide el resultado.',
        glossaryTerms: ['Superposición', 'Estado cuántico', 'Colapso', 'Función de onda'],
      },
      {
        id: 'tunel',
        title: 'Efecto túnel cuántico',
        concept:
          'Las partículas cuánticas pueden atravesar barreras que, según la física clásica, serían infranqueables.',
        keyPoints: [
          'No es teletransporte, sino un efecto puramente probabilístico.',
          'La fusión nuclear en las estrellas ocurre, en parte, gracias al efecto túnel.',
          'Cuanto más delgada o baja es la barrera, mayor es la probabilidad de atravesarla.',
        ],
        analogy:
          'Una pelota lanzada contra una colina rebota siempre. Una partícula cuántica, en cambio, tiene cierta probabilidad de aparecer al otro lado, como un fantasma que cruza la pared.',
        glossaryTerms: ['Túnel cuántico', 'Barrera de potencial', 'Probabilidad de transmisión'],
      },
    ],
  },
  {
    id: 'modelo-estandar',
    title: 'Modelo Estándar',
    tagline: 'El catálogo de las partículas elementales',
    scaleLabel: '10⁻¹⁴ m',
    scaleRange: '10⁻¹⁴ – 10⁻¹⁸ m',
    color: '#1a0010',
    accent: '#ff4d8d',
    subsections: [
      {
        id: 'quarks',
        title: 'Quarks',
        concept:
          'Los quarks son los constituyentes más fundamentales conocidos de la materia. Combinados, forman los protones y los neutrones.',
        keyPoints: [
          'Hay seis "sabores": arriba, abajo, encanto, extraño, cima y fondo.',
          'Tienen carga eléctrica fraccionaria (±1/3 o ±2/3 de la del electrón).',
          'Nunca se encuentran libres: el confinamiento de color los mantiene siempre unidos.',
        ],
        analogy:
          'Son como letras que nunca aparecen solas: siempre forman "palabras" (protones, neutrones) y jamás verás una letra suelta paseando por su cuenta.',
        glossaryTerms: ['Quark', 'Sabor de quark', 'Gluón', 'Confinamiento de color', 'Hadrón'],
      },
      {
        id: 'leptones',
        title: 'Leptones',
        concept:
          'Partículas fundamentales que no sienten la fuerza fuerte. El electrón es el ejemplo más conocido.',
        keyPoints: [
          'Hay seis leptones organizados en tres generaciones.',
          'Los neutrinos casi no tienen masa y atraviesan la materia con facilidad.',
          'Miles de billones de neutrinos del Sol cruzan tu cuerpo cada segundo.',
        ],
        analogy:
          'Los neutrinos son como fantasmas cósmicos: atraviesan planetas enteros sin apenas notarlos.',
        glossaryTerms: ['Leptón', 'Electrón', 'Neutrino', 'Muón/Tau', 'Generación'],
      },
      {
        id: 'bosones',
        title: 'Bosones: las partículas mensajeras',
        concept:
          'Los bosones transmiten las fuerzas: son los "mensajeros" que las partículas se intercambian para interactuar.',
        keyPoints: [
          'El fotón transmite el electromagnetismo.',
          'El gluón transmite la fuerza fuerte; los bosones W y Z, la fuerza débil.',
          'El bosón de Higgs da masa a las demás partículas elementales.',
        ],
        analogy:
          'Como jugadores que se pasan un balón: el intercambio del balón (el bosón) es lo que crea la interacción entre ellos.',
        glossaryTerms: ['Fotón', 'Gluón', 'Bosón W/Z', 'Bosón de Higgs', 'Bosón gauge'],
      },
      {
        id: 'fuerzas',
        title: 'Las cuatro interacciones fundamentales',
        concept:
          'Todo lo que ocurre en el universo se debe a cuatro fuerzas: gravedad, electromagnetismo, fuerza fuerte y fuerza débil.',
        keyPoints: [
          'Gravedad: alcance infinito, siempre atractiva, domina a escala cosmológica.',
          'Electromagnetismo: alcance infinito, atractivo o repulsivo, gobierna la química y la luz.',
          'Fuerza fuerte: alcance diminuto, mantiene unidos a los quarks; es la más intensa.',
          'Fuerza débil: alcance aún menor, responsable de la radiactividad beta.',
        ],
        analogy:
          'Cuatro directores de orquesta con territorios distintos: dos dirigen a distancias enormes (gravedad y electromagnetismo) y dos solo dentro del minúsculo núcleo atómico.',
        glossaryTerms: ['Gravedad', 'Electromagnetismo', 'Fuerza fuerte', 'Fuerza débil', 'Unificación de fuerzas'],
      },
    ],
  },
]

// ---------- DATOS DE PARTÍCULAS (Modelo Estándar) ----------
// Usado por ParticleTable y QuarkComposer. Masas en unidades aproximadas y divulgativas.
export const particles = {
  quarks: [
    { symbol: 'u', name: 'Arriba (up)', mass: '2,2 MeV', charge: '+2/3', spin: '1/2', gen: 1, color: '#ff5d5d' },
    { symbol: 'd', name: 'Abajo (down)', mass: '4,7 MeV', charge: '−1/3', spin: '1/2', gen: 1, color: '#ff8a5d' },
    { symbol: 'c', name: 'Encanto (charm)', mass: '1,28 GeV', charge: '+2/3', spin: '1/2', gen: 2, color: '#ffb15d' },
    { symbol: 's', name: 'Extraño (strange)', mass: '96 MeV', charge: '−1/3', spin: '1/2', gen: 2, color: '#ffd75d' },
    { symbol: 't', name: 'Cima (top)', mass: '173 GeV', charge: '+2/3', spin: '1/2', gen: 3, color: '#ff5d8a' },
    { symbol: 'b', name: 'Fondo (bottom)', mass: '4,18 GeV', charge: '−1/3', spin: '1/2', gen: 3, color: '#ff5db1' },
  ],
  leptons: [
    { symbol: 'e', name: 'Electrón', mass: '0,511 MeV', charge: '−1', spin: '1/2', gen: 1, color: '#5db1ff' },
    { symbol: 'νe', name: 'Neutrino electrónico', mass: '< 1 eV', charge: '0', spin: '1/2', gen: 1, color: '#5dd7ff' },
    { symbol: 'μ', name: 'Muón', mass: '105,7 MeV', charge: '−1', spin: '1/2', gen: 2, color: '#5d8aff' },
    { symbol: 'νμ', name: 'Neutrino muónico', mass: '< 1 eV', charge: '0', spin: '1/2', gen: 2, color: '#5db1ff' },
    { symbol: 'τ', name: 'Tau', mass: '1,777 GeV', charge: '−1', spin: '1/2', gen: 3, color: '#5d5dff' },
    { symbol: 'ντ', name: 'Neutrino tauónico', mass: '< 1 eV', charge: '0', spin: '1/2', gen: 3, color: '#8a5dff' },
  ],
  bosons: [
    { symbol: 'g', name: 'Gluón', mass: '0', charge: '0', spin: '1', gen: 0, color: '#36e08a', role: 'Fuerza fuerte' },
    { symbol: 'γ', name: 'Fotón', mass: '0', charge: '0', spin: '1', gen: 0, color: '#ffe85d', role: 'Electromagnetismo' },
    { symbol: 'Z', name: 'Bosón Z', mass: '91,2 GeV', charge: '0', spin: '1', gen: 0, color: '#b15dff', role: 'Fuerza débil' },
    { symbol: 'W', name: 'Bosón W', mass: '80,4 GeV', charge: '±1', spin: '1', gen: 0, color: '#c75dff', role: 'Fuerza débil' },
  ],
  higgs: [
    { symbol: 'H', name: 'Bosón de Higgs', mass: '125 GeV', charge: '0', spin: '0', gen: 0, color: '#f5f5f5', role: 'Da masa' },
  ],
}

// Combinaciones válidas de tres quarks (bariones) para el QuarkComposer.
export const baryons = {
  uud: { name: 'Protón', charge: '+1', mass: '938 MeV', stable: true },
  udd: { name: 'Neutrón', charge: '0', mass: '940 MeV', stable: true },
  uuu: { name: 'Delta ++ (Δ⁺⁺)', charge: '+2', mass: '1232 MeV', stable: false },
  ddd: { name: 'Delta − (Δ⁻)', charge: '−1', mass: '1232 MeV', stable: false },
  uus: { name: 'Sigma + (Σ⁺)', charge: '+1', mass: '1189 MeV', stable: false },
  uds: { name: 'Lambda (Λ⁰)', charge: '0', mass: '1116 MeV', stable: false },
  dds: { name: 'Sigma − (Σ⁻)', charge: '−1', mass: '1197 MeV', stable: false },
  uss: { name: 'Xi 0 (Ξ⁰)', charge: '0', mass: '1315 MeV', stable: false },
  dss: { name: 'Xi − (Ξ⁻)', charge: '−1', mass: '1322 MeV', stable: false },
  sss: { name: 'Omega − (Ω⁻)', charge: '−1', mass: '1672 MeV', stable: false },
  uuc: { name: 'Sigma c ++ (Σc⁺⁺)', charge: '+2', mass: '2454 MeV', stable: false },
}

// ---------- LÍNEA DE TIEMPO CÓSMICA ----------
// Hitos para CosmicTimeline. 'years' es el tiempo transcurrido desde el Big Bang.
export const cosmicTimeline = [
  { years: 1e-43, label: 'Big Bang', desc: 'El instante cero: todo el universo concentrado en un punto de densidad y temperatura inimaginables.' },
  { years: 5.7e-6, label: 'Núcleos primordiales', desc: 'Tres minutos después, se forman los primeros núcleos de hidrógeno y helio (nucleosíntesis).' },
  { years: 380000, label: 'Primeros átomos', desc: 'El universo se enfría lo suficiente para que electrones y núcleos formen átomos. Se libera el Fondo Cósmico de Microondas.' },
  { years: 2e8, label: 'Primeras estrellas', desc: 'La gravedad agrupa el gas y se encienden las primeras estrellas, iluminando la "edad oscura" cósmica.' },
  { years: 5e9, label: 'Nace la Vía Láctea', desc: 'Se forma nuestra galaxia a partir de la fusión de estructuras menores.' },
  { years: 9.2e9, label: 'Sistema Solar', desc: 'A partir de una nube de gas y polvo nacen el Sol y los planetas, hace ~4.600 millones de años.' },
  { years: 1.38e10, label: 'Hoy', desc: 'El universo tiene 13.800 millones de años. Galaxias, estrellas, planetas y vida coexisten.' },
  { years: 1e14, label: 'Muerte de las estrellas', desc: 'Dentro de ~100 billones de años se apagarán las últimas estrellas. Comienza la larga era oscura.' },
]

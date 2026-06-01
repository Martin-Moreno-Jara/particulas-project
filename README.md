# Del Universo al Quark

Portal web educativo de **física moderna** que recorre, mediante una metáfora visual de **zoom continuo**, desde las mayores estructuras del cosmos (10²⁶ m) hasta las partículas más fundamentales (10⁻¹⁸ m). Pensado para divulgación —sin fórmulas complejas— a través de simulaciones interactivas.

Proyecto académico de la asignatura de **Partículas y Cosmología**. Desktop-first.

## Navegación por zoom (rueda del ratón)

En lugar del scroll vertical clásico, la navegación funciona como en *The Scale of the Universe*: la **rueda del ratón controla un zoom continuo** a través de las escalas.

- **Rueda hacia abajo / arriba** → viajas hacia adentro (cosmos → quark) o hacia afuera.
- Al alcanzar una sección, el viaje **se ancla**: se abre su panel y la rueda **desplaza su contenido**.
- Al llegar al **borde del panel**, la rueda **reanuda el zoom** hacia la siguiente escala (también con el botón "Seguir hacia el quark ⌄").
- **Barra de navegación** y **puntos de la regla de escala** (lateral derecha): saltan directamente a cualquier sección.
- **Teclado**: `↑`/`↓` o `AvPág`/`RePág` para cambiar de estación, `Inicio`/`Fin` para los extremos.

## Las cuatro secciones

| # | Sección | Escala | Simulaciones |
|---|---------|--------|--------------|
| 01 | **Cosmología** | 10²⁶ – 10²² m | Expansión del universo · Mapa del CMB · Rotación galáctica (materia oscura) · Línea de tiempo cósmica |
| 02 | **Relatividad** | 10¹⁶ – 10⁹ m | Malla de espacio-tiempo · Paradoja de los gemelos · Contracción de longitud · Límite de velocidad |
| 03 | **Mecánica cuántica** | 10⁻⁸ – 10⁻¹⁰ m | Doble rendija · Principio de incertidumbre · Gato de Schrödinger · Efecto túnel |
| 04 | **Modelo Estándar** | 10⁻¹⁴ – 10⁻¹⁸ m | Tabla de partículas · Compositor de hadrones · Las cuatro fuerzas |

## Stack tecnológico

- **React 18** + **Vite 5**
- **Three.js** vía **@react-three/fiber** + **drei** — fondo de zoom 3D persistente
- **p5.js** (modo instancia) — simulaciones 2D
- **GSAP** — animación (tweening) del zoom entre estaciones
- **Framer Motion** — micro-animaciones de UI
- **Tailwind CSS v3** — estilos
- **simplex-noise** — anisotropías del Fondo Cósmico de Microondas

## Instalación y uso

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo en http://localhost:5173
npm run build        # build de producción (carpeta dist/)
npm run preview      # previsualizar el build en http://localhost:4173
```

> Si `npm install` reporta conflictos de *peer dependencies* (por `react-p5`), usa:
> `npm install --legacy-peer-deps`.

## Despliegue en Vercel

El proyecto se despliega sin configuración adicional:

- `package.json` define `"build": "vite build"`.
- `vite.config.js` usa `base: '/'`.
- No requiere variables de entorno.

En Vercel: *New Project → importar el repositorio*. El framework **Vite** se detecta automáticamente (Build Command `npm run build`, Output Directory `dist`).

## Estructura

```
src/
├── main.jsx
├── App.jsx                       # raíz + aviso de pantalla pequeña
├── components/
│   ├── ZoomExperience.jsx        # orquestador del viaje por zoom (rueda, anclaje, gsap)
│   ├── ZoomBackground.jsx        # canvas Three.js persistente (capas de partículas)
│   ├── cosmos/ relativity/ quantum/ standard-model/   # las 4 secciones + sus simulaciones
│   └── ui/                       # Navbar, ZoomIndicator, Hero, StationPanel,
│                                 # GlossaryTooltip, SectionTitle, SimCard, P5Sketch…
├── hooks/
│   └── useInView.js              # IntersectionObserver (pausa sims fuera de pantalla)
├── data/
│   └── content.js                # todo el texto divulgativo, glosario y datos
└── styles/
    └── index.css
```

## Rendimiento

- Cada sección se carga bajo demanda (`React.lazy` + `Suspense`) y se precarga en tiempo libre.
- Las simulaciones p5.js se **pausan** automáticamente fuera de pantalla (IntersectionObserver); el canvas Three.js de la malla de espacio-tiempo usa `frameloop` bajo demanda.
- Bundle de producción muy por debajo de 5 MB *gzipped*.

## Notas

- **Desktop-first**: en viewports menores de 900 px se muestra un aviso (la experiencia de zoom requiere pantalla amplia).
- Las simulaciones son **educativas**: simplifican para ganar claridad visual, sin ser conceptualmente incorrectas.
- Todo el contenido visual es **generativo** (Three.js, p5.js, Canvas, SVG): no se usan imágenes rasterizadas externas.

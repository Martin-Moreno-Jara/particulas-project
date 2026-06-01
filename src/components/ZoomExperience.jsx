import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { sections } from '../data/content.js'
import ZoomBackground from './ZoomBackground.jsx'
import Navbar from './ui/Navbar.jsx'
import ZoomIndicator from './ui/ZoomIndicator.jsx'
import Hero from './ui/Hero.jsx'
import StationPanel from './ui/StationPanel.jsx'

// Orquestador del viaje por zoom. La rueda del ratón controla un valor `z` (0→1) que
// recorre las escalas (cosmos→quark). Al alcanzar una sección, el viaje se "ancla":
// se abre su panel con scroll interno; al llegar a su borde, el zoom continúa.

// Carga diferida de cada sección (code-splitting) + funciones para precargarlas.
const IMPORTS = [
  () => import('./cosmos/CosmologySection.jsx'),
  () => import('./relativity/RelativitySection.jsx'),
  () => import('./quantum/QuantumSection.jsx'),
  () => import('./standard-model/StandardModelSection.jsx'),
]
const LAZY = IMPORTS.map((f) => lazy(f))

// Posición de cada estación en el eje de zoom (0=universo, 1=quark).
const ANCHORS = sections.map((_, i) => 0.14 + i * 0.24)
const DOCK_R = 0.05 // radio para anclar a una estación
const PREVIEW_R = 0.13 // radio en que el panel se previsualiza (crece/aparece)
const FADE_R = 0.11 // radio de desvanecimiento
const SCALE_K = 7 // intensidad del efecto de escala al acercarse/pasar
const TRAVEL_SPEED = 0.00085 // sensibilidad de la rueda en modo viaje
const HERO_VISIBLE = 0.12
const HERO_FADE = 0.09

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

function PanelLoader() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-text-secondary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
        <span className="text-sm">Cargando sección…</span>
      </div>
    </div>
  )
}

function Hint() {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-5 py-2.5 text-sm text-text-secondary backdrop-blur">
      🖱️ Usa la <span className="text-text-primary">rueda del ratón</span> para viajar por las escalas
    </div>
  )
}

export default function ZoomExperience() {
  const zoomRef = useRef(0)
  const dockedRef = useRef(null)
  const animatingRef = useRef(false)
  const cardRefs = useRef([])
  const heroRef = useRef(null)

  const [docked, setDocked] = useState(null)
  const [mounted, setMounted] = useState([])
  const [hintVisible, setHintVisible] = useState(true)

  const registerRef = useCallback((i, el) => {
    cardRefs.current[i] = el
  }, [])

  const ensureMounted = useCallback((i) => {
    setMounted((prev) => (prev.includes(i) ? prev : [...prev, i]))
  }, [])

  // Actualiza escala/opacidad/visibilidad del héroe y de cada panel según el zoom.
  const applyVisuals = useCallback(() => {
    const z = zoomRef.current
    const dk = dockedRef.current

    if (heroRef.current) {
      const show = dk === null && z < HERO_VISIBLE
      heroRef.current.style.display = show ? 'block' : 'none'
      heroRef.current.style.opacity = clamp(1 - z / HERO_FADE, 0, 1)
      heroRef.current.style.transform = `scale(${Math.pow(2, z * SCALE_K)})`
    }

    ANCHORS.forEach((a, i) => {
      const el = cardRefs.current[i]
      if (!el) return
      const isDocked = dk === i
      const delta = z - a
      const near = Math.abs(delta) < PREVIEW_R
      if (!isDocked && !near) {
        el.style.display = 'none'
        return
      }
      el.style.display = 'block'
      el.style.transform = `scale(${isDocked ? 1 : Math.pow(2, delta * SCALE_K)})`
      el.style.opacity = isDocked ? 1 : clamp(1 - Math.abs(delta) / FADE_R, 0, 1)
      el.style.pointerEvents = isDocked ? 'auto' : 'none'
      el.style.overflowY = isDocked ? 'auto' : 'hidden'
    })
  }, [])

  const dockTo = useCallback(
    (idx) => {
      ensureMounted(idx)
      animatingRef.current = true
      gsap.killTweensOf(zoomRef)
      gsap.to(zoomRef, {
        current: ANCHORS[idx],
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: applyVisuals,
        onComplete: () => {
          animatingRef.current = false
          dockedRef.current = idx
          setDocked(idx)
          if (cardRefs.current[idx]) cardRefs.current[idx].scrollTop = 0
          applyVisuals()
        },
      })
    },
    [applyVisuals, ensureMounted]
  )

  const undock = useCallback(
    (dir) => {
      const i = dockedRef.current
      if (i === null) return
      dockedRef.current = null
      setDocked(null)
      zoomRef.current = clamp(ANCHORS[i] + dir * (DOCK_R + 0.02), 0, 1)
      applyVisuals()
    },
    [applyVisuals]
  )

  const goHome = useCallback(() => {
    dockedRef.current = null
    setDocked(null)
    animatingRef.current = true
    gsap.killTweensOf(zoomRef)
    gsap.to(zoomRef, {
      current: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: applyVisuals,
      onComplete: () => {
        animatingRef.current = false
        applyVisuals()
      },
    })
  }, [applyVisuals])

  const goToStation = useCallback(
    (idx) => {
      if (idx < 0) return goHome()
      if (idx > ANCHORS.length - 1) return
      ensureMounted(idx)
      setHintVisible(false)
      dockedRef.current = null
      setDocked(null)
      animatingRef.current = true
      gsap.killTweensOf(zoomRef)
      gsap.to(zoomRef, {
        current: ANCHORS[idx],
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: applyVisuals,
        onComplete: () => {
          animatingRef.current = false
          dockedRef.current = idx
          setDocked(idx)
          if (cardRefs.current[idx]) cardRefs.current[idx].scrollTop = 0
          applyVisuals()
        },
      })
    },
    [applyVisuals, ensureMounted, goHome]
  )

  const nearestIndex = useCallback(() => {
    const z = zoomRef.current
    if (z < 0.07) return -1
    let best = 0
    let bestD = Infinity
    ANCHORS.forEach((a, i) => {
      const d = Math.abs(z - a)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    return best
  }, [])

  const onWheel = useCallback(
    (e) => {
      if (animatingRef.current) {
        e.preventDefault()
        return
      }
      setHintVisible(false)
      const dk = dockedRef.current

      if (dk !== null) {
        // Anclado: la rueda desplaza el panel; al llegar a su borde, reanuda el zoom.
        e.preventDefault()
        const el = cardRefs.current[dk]
        if (el) {
          const atTop = el.scrollTop <= 0
          const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1
          const down = e.deltaY > 0
          if ((down && !atBottom) || (!down && !atTop)) {
            el.scrollTop += e.deltaY
            return
          }
        }
        undock(e.deltaY > 0 ? 1 : -1)
        return
      }

      // Modo viaje: la rueda mueve el zoom de forma continua
      e.preventDefault()
      const prev = zoomRef.current
      const nz = clamp(prev + e.deltaY * TRAVEL_SPEED, 0, 1)
      zoomRef.current = nz
      ANCHORS.forEach((a, i) => {
        if (Math.abs(nz - a) < PREVIEW_R) ensureMounted(i)
      })
      applyVisuals()
      // Ancla a la primera estación encontrada en el trayecto (robusto a saltos grandes).
      const reached = ANCHORS.map((a, i) => ({ a, i }))
        .filter(({ a }) => a >= Math.min(prev, nz) - DOCK_R && a <= Math.max(prev, nz) + DOCK_R)
        .sort((x, y) => (nz >= prev ? x.a - y.a : y.a - x.a))
      if (reached.length) dockTo(reached[0].i)
    },
    [applyVisuals, dockTo, ensureMounted, undock]
  )

  const onKey = useCallback(
    (e) => {
      const dk = dockedRef.current
      const current = dk !== null ? dk : nearestIndex()
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        setHintVisible(false)
        goToStation(current + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goToStation(current - 1)
      } else if (e.key === 'Home') {
        goHome()
      } else if (e.key === 'End') {
        goToStation(ANCHORS.length - 1)
      }
    },
    [goHome, goToStation, nearestIndex]
  )

  // Listeners globales + precarga de las secciones en tiempo libre.
  useEffect(() => {
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    applyVisuals()
    const preload = () => IMPORTS.forEach((f) => f())
    const idle = typeof window.requestIdleCallback === 'function'
    const id = idle ? window.requestIdleCallback(preload) : window.setTimeout(preload, 1500)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      if (idle && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(id)
      else clearTimeout(id)
    }
  }, [onWheel, onKey, applyVisuals])

  // Re-aplica los estilos cuando cambian el anclaje o los paneles montados.
  useEffect(() => {
    applyVisuals()
  }, [docked, mounted, applyVisuals])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ZoomBackground zoomRef={zoomRef} />
      <Navbar onNavigate={goToStation} onHome={goHome} zoomRef={zoomRef} />
      <ZoomIndicator zoomRef={zoomRef} anchors={ANCHORS} sections={sections} onJump={goToStation} />
      <Hero heroRef={heroRef} onStart={() => goToStation(0)} />

      {mounted.map((i) => {
        const Comp = LAZY[i]
        return (
          <StationPanel
            key={i}
            section={sections[i]}
            index={i}
            total={ANCHORS.length}
            registerRef={registerRef}
            onGo={goToStation}
          >
            <Suspense fallback={<PanelLoader />}>
              <Comp />
            </Suspense>
          </StationPanel>
        )
      })}

      {hintVisible && <Hint />}
    </div>
  )
}

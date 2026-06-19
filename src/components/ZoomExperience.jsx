import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { sections } from "../data/content.js";
import ZoomBackground from "./ZoomBackground.jsx";
import ScaleRuler from "./ui/ScaleRuler.jsx";
import Hero from "./ui/Hero.jsx";
import StationPanel from "./ui/StationPanel.jsx";
import ExperimentModal from "./ui/ExperimentModal.jsx";
import InfoCard from "./ui/InfoCard.jsx";

// ─── Experiment registry ────────────────────────────────────────────────────
// Each entry maps a click-target ID to a sim component (lazy) + metadata.
const EXPERIMENTS = {
  // Cosmología
  "cosmos-expansion": {
    title: "Expansión del universo",
    hint: "Mueve el tiempo desde el Big Bang hasta el futuro lejano.",
    accent: "#5b7cff",
    Sim: lazy(() => import("./cosmos/UniverseExpansion.jsx")),
  },
  "cosmos-cmb": {
    title: "Fondo Cósmico de Microondas",
    hint: "La foto más antigua del cosmos. Pasa el ratón por las regiones.",
    accent: "#5b7cff",
    Sim: lazy(() => import("./cosmos/CMBMap.jsx")),
  },
  "cosmos-dark-matter": {
    title: "Materia oscura",
    hint: "Compara la rotación galáctica con y sin masa invisible.",
    accent: "#5b7cff",
    Sim: lazy(() => import("./cosmos/DarkMatterSim.jsx")),
  },
  "cosmos-timeline": {
    title: "Línea de tiempo cósmica",
    hint: "Recorre 13 800 Ma de historia (y el futuro) a escala log.",
    accent: "#5b7cff",
    Sim: lazy(() => import("./cosmos/CosmicTimeline.jsx")),
  },
  // Relatividad
  "rel-spacetime": {
    title: "Curvatura del espacio-tiempo",
    hint: "Arrastra la masa, lanza un fotón hacia el agujero negro.",
    accent: "#ff9d3d",
    Sim: lazy(() => import("./relativity/SpacetimeMesh.jsx")),
  },
  "rel-twin": {
    title: "Paradoja de los gemelos",
    hint: "Cuanto más rápido viaja la nave, más lento avanza su reloj.",
    accent: "#ff9d3d",
    Sim: lazy(() => import("./relativity/TwinParadox.jsx")),
  },
  "rel-contraction": {
    title: "Contracción de longitud",
    hint: "Los objetos rápidos se comprimen en la dirección del viaje.",
    accent: "#ff9d3d",
    Sim: lazy(() => import("./relativity/LengthContraction.jsx")),
  },
  "rel-lightspeed": {
    title: "El límite de velocidad (c)",
    hint: "Arrastra el punto y observa la energía necesaria para acercarse a c.",
    accent: "#ff9d3d",
    Sim: lazy(() => import("./relativity/LightSpeedLimit.jsx")),
  },
  // Cuántica
  "qm-doubleslit": {
    title: "Experimento de la doble rendija",
    hint: "Activa el detector y observa cómo colapsa la interferencia.",
    accent: "#36e08a",
    Sim: lazy(() => import("./quantum/DoubleSlit.jsx")),
  },
  "qm-uncertainty": {
    title: "Principio de incertidumbre",
    hint: "Comprime el paquete de onda y observa el impacto en el momento.",
    accent: "#36e08a",
    Sim: lazy(() => import("./quantum/UncertaintyPrinciple.jsx")),
  },
  "qm-schrodinger": {
    title: "Gato de Schrödinger",
    hint: "Superposición cuántica: hasta que se observa, todo es posible.",
    accent: "#36e08a",
    Sim: lazy(() => import("./quantum/SchrodingerCat.jsx")),
  },
  "qm-tunnel": {
    title: "Efecto túnel cuántico",
    hint: "Las partículas atraviesan barreras clásicamente infranqueables.",
    accent: "#36e08a",
    Sim: lazy(() => import("./quantum/QuantumTunnel.jsx")),
  },
  // Modelo Estándar
  "sm-quarks": {
    title: "Compositor de quarks",
    hint: "Combina quarks para construir protones, neutrones y más.",
    accent: "#ff4d8d",
    Sim: lazy(() => import("./standard-model/QuarkComposer.jsx")),
  },
  "sm-particles": {
    title: "Tabla de partículas",
    hint: "El catálogo completo de partículas elementales conocidas.",
    accent: "#ff4d8d",
    Sim: lazy(() => import("./standard-model/ParticleTable.jsx")),
  },
  "sm-forces": {
    title: "Las cuatro fuerzas fundamentales",
    hint: "Alcance e intensidad de gravedad, EM, fuerte y débil.",
    accent: "#ff4d8d",
    Sim: lazy(() => import("./standard-model/ForcesComparison.jsx")),
  },
};

// ─── Navigation constants ───────────────────────────────────────────────────
// Anchor spacing doubled (0.24 → 0.48) so the trip between stations is
// twice as long; MAX_Z extends past 1 to fit the wider gaps, and every
// other component that reasoned in 0..1 terms (ScaleRuler, ZoomBackground
// layers) receives MAX_Z so it can rescale proportionally.
const ANCHOR_START = 0.14;
const ANCHOR_GAP = 0.48;
const ANCHORS = sections.map((_, i) => ANCHOR_START + i * ANCHOR_GAP);
const MAX_Z = ANCHORS[ANCHORS.length - 1] + ANCHOR_START;
const DOCK_R = 0.05;
const PREVIEW_R = 0.13;
const FADE_R = 0.11;
const SCALE_K = 7;
const TRAVEL_SPEED = 0.00025;
const HERO_VISIBLE = 0.12;
const HERO_FADE = 0.09;
const WHEEL_CLAMP = 80;
const SMOOTHING = 0.12;
const UNDOCK_SCROLL = 320; // accumulated |deltaY| needed to leave a docked anchor

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// ─── Station HUD (minimal nav + hint) ──────────────────────────────────────
function StationHUD({ section, index, total, onPrev, onNext }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 pb-6">
      {/* Scale range chip */}
      <div
        className="rounded-full border px-3 py-1 text-xs font-mono"
        style={{
          borderColor: section.accent + "50",
          color: section.accent,
          background: section.color + "cc",
        }}>
        {section.scaleRange}
      </div>

      {/* Navigation bar */}
      <div
        className="pointer-events-auto flex items-center gap-1 rounded-full border bg-black/70 px-2 py-1.5 backdrop-blur-md"
        style={{ borderColor: section.accent + "35" }}>
        <button
          onClick={onPrev}
          className="rounded-full px-3 py-1 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white">
          ⌃ {index === 0 ? "Inicio" : "Anterior"}
        </button>
        <span
          className="px-3 text-xs font-semibold"
          style={{ color: section.accent }}>
          {section.title}
        </span>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="rounded-full px-3 py-1 text-xs font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
          style={index < total - 1 ? { color: section.accent } : {}}>
          {index === total - 1 ? "Final del viaje" : "Siguiente ⌄"}
        </button>
      </div>

      {/* Interaction hint */}
      <p className="text-[0.6rem] uppercase tracking-widest text-white/25">
        Haz clic en los objetos para explorar · rueda del ratón para continuar
      </p>
    </div>
  );
}

export default function ZoomExperience() {
  const zoomRef = useRef(0);
  const targetZoomRef = useRef(0);
  const dockedRef = useRef(null);
  const animatingRef = useRef(false);
  const cardRefs = useRef([]);
  const heroRef = useRef(null);
  const undockAccumRef = useRef(0);
  const undockDirRef = useRef(0);

  const [docked, setDocked] = useState(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(null); // { kind:'experiment'|'info', ...data }

  const registerRef = useCallback((i, el) => {
    cardRefs.current[i] = el;
  }, []);

  const applyVisuals = useCallback(() => {
    const z = zoomRef.current;
    const dk = dockedRef.current;

    if (heroRef.current) {
      const show = dk === null && z < HERO_VISIBLE;
      heroRef.current.style.display = show ? "block" : "none";
      heroRef.current.style.opacity = clamp(1 - z / HERO_FADE, 0, 1);
      heroRef.current.style.transform = `scale(${Math.pow(2, z * SCALE_K)})`;
    }

    // Station panels are now invisible placeholders – just toggle display
    ANCHORS.forEach((a, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const isDocked = dk === i;
      const near = Math.abs(z - a) < PREVIEW_R;
      el.style.display = isDocked || near ? "block" : "none";
    });
  }, []);

  const dockTo = useCallback(
    (idx) => {
      animatingRef.current = true;
      gsap.killTweensOf(zoomRef);
      gsap.to(zoomRef, {
        current: ANCHORS[idx],
        duration: 0.5,
        ease: "power2.out",
        onUpdate: applyVisuals,
        onComplete: () => {
          animatingRef.current = false;
          dockedRef.current = idx;
          targetZoomRef.current = ANCHORS[idx];
          undockAccumRef.current = 0;
          undockDirRef.current = 0;
          setDocked(idx);
          applyVisuals();
        },
      });
    },
    [applyVisuals],
  );

  const undock = useCallback(
    (dir) => {
      const i = dockedRef.current;
      if (i === null) return;
      dockedRef.current = null;
      setDocked(null);
      undockAccumRef.current = 0;
      undockDirRef.current = 0;
      zoomRef.current = clamp(ANCHORS[i] + dir * (DOCK_R + 0.02), 0, MAX_Z);
      targetZoomRef.current = zoomRef.current;
      applyVisuals();
    },
    [applyVisuals],
  );

  const goHome = useCallback(() => {
    dockedRef.current = null;
    setDocked(null);
    animatingRef.current = true;
    gsap.killTweensOf(zoomRef);
    gsap.to(zoomRef, {
      current: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: applyVisuals,
      onComplete: () => {
        animatingRef.current = false;
        targetZoomRef.current = 0;
        applyVisuals();
      },
    });
  }, [applyVisuals]);

  const goToStation = useCallback(
    (idx) => {
      if (idx < 0) return goHome();
      if (idx > ANCHORS.length - 1) return;
      setHintVisible(false);
      dockedRef.current = null;
      setDocked(null);
      animatingRef.current = true;
      gsap.killTweensOf(zoomRef);
      gsap.to(zoomRef, {
        current: ANCHORS[idx],
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: applyVisuals,
        onComplete: () => {
          animatingRef.current = false;
          dockedRef.current = idx;
          targetZoomRef.current = ANCHORS[idx];
          undockAccumRef.current = 0;
          undockDirRef.current = 0;
          setDocked(idx);
          applyVisuals();
        },
      });
    },
    [applyVisuals, goHome],
  );

  const nearestIndex = useCallback(() => {
    const z = zoomRef.current;
    if (z < 0.07) return -1;
    let best = 0,
      bestD = Infinity;
    ANCHORS.forEach((a, i) => {
      const d = Math.abs(z - a);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }, []);

  const onWheel = useCallback(
    (e) => {
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }
      // Don't capture scroll if any card/modal is open
      if (activeCard) return;
      setHintVisible(false);
      const dk = dockedRef.current;

      if (dk !== null) {
        e.preventDefault();
        // Leaving a docked anchor needs sustained scroll in one direction,
        // so a single accidental tick doesn't kick you back out.
        const dir = e.deltaY > 0 ? 1 : -1;
        if (dir !== undockDirRef.current) {
          undockDirRef.current = dir;
          undockAccumRef.current = 0;
        }
        undockAccumRef.current += Math.abs(e.deltaY);
        if (undockAccumRef.current >= UNDOCK_SCROLL) {
          undock(dir);
        }
        return;
      }

      e.preventDefault();
      const delta = clamp(e.deltaY, -WHEEL_CLAMP, WHEEL_CLAMP);
      targetZoomRef.current = clamp(
        targetZoomRef.current + delta * TRAVEL_SPEED,
        0,
        MAX_Z,
      );
    },
    [undock, activeCard],
  );

  // Smoothly eases zoomRef toward targetZoomRef every frame, giving the
  // travel a soft "drift" instead of jumping by the raw wheel delta.
  useEffect(() => {
    let raf;
    const tick = () => {
      if (!animatingRef.current && dockedRef.current === null) {
        const prev = zoomRef.current;
        const target = targetZoomRef.current;
        const next = prev + (target - prev) * SMOOTHING;
        if (Math.abs(next - prev) > 0.00001) {
          zoomRef.current = next;
          applyVisuals();
          const reached = ANCHORS.map((a, i) => ({ a, i }))
            .filter(
              ({ a }) =>
                a >= Math.min(prev, next) - DOCK_R &&
                a <= Math.max(prev, next) + DOCK_R,
            )
            .sort((x, y) => (next >= prev ? x.a - y.a : y.a - x.a));
          if (reached.length) dockTo(reached[0].i);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyVisuals, dockTo]);

  const onKey = useCallback(
    (e) => {
      if (activeCard) return;
      const dk = dockedRef.current;
      const current = dk !== null ? dk : nearestIndex();
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setHintVisible(false);
        goToStation(current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToStation(current - 1);
      } else if (e.key === "Home") {
        goHome();
      } else if (e.key === "End") {
        goToStation(ANCHORS.length - 1);
      }
    },
    [goHome, goToStation, nearestIndex, activeCard],
  );

  // ── Object click → open info card or experiment modal ─────────────────────
  const handleObjectClick = useCallback((config) => {
    if (config.type === "experiment") {
      const exp = EXPERIMENTS[config.expId];
      if (exp) setActiveCard({ kind: "experiment", ...exp });
    } else if (config.type === "info") {
      setActiveCard({ kind: "info", ...config });
    }
  }, []);

  const closeCard = useCallback(() => setActiveCard(null), []);

  const openExperimentFromInfo = useCallback((expId) => {
    setActiveCard(null);
    // tiny delay lets the close animation finish before the modal opens
    setTimeout(() => {
      const exp = EXPERIMENTS[expId];
      if (exp) setActiveCard({ kind: "experiment", ...exp });
    }, 80);
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    applyVisuals();
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [onWheel, onKey, applyVisuals]);

  useEffect(() => {
    applyVisuals();
  }, [docked, applyVisuals]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ZoomBackground
        zoomRef={zoomRef}
        docked={docked}
        onObjectClick={handleObjectClick}
        maxZ={MAX_Z}
        anchors={ANCHORS}
      />

      {/* Navbar with scale ruler */}
      <ScaleRuler
        zoomRef={zoomRef}
        anchors={ANCHORS}
        sections={sections}
        onJump={goToStation}
        maxZ={MAX_Z}
      />

      {/* Hero screen */}
      <Hero heroRef={heroRef} onStart={() => goToStation(0)} />

      {/* Invisible station ref placeholders (for undocking detection) */}
      {sections.map((_, i) => (
        <StationPanel key={i} index={i} registerRef={registerRef} />
      ))}

      {/* Station HUD: minimal nav + hint when docked */}
      {docked !== null && (
        <StationHUD
          section={sections[docked]}
          index={docked}
          total={sections.length}
          onPrev={() => goToStation(docked - 1)}
          onNext={() => goToStation(docked + 1)}
        />
      )}

      {/* Scroll hint for first-time visitors */}
      {hintVisible && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-5 py-2.5 text-sm text-white/50 backdrop-blur">
          Usa la <span className="text-white">rueda del ratón</span> para viajar
          por las escalas
        </div>
      )}

      {/* Info card (lightweight facts + optional "go deeper" button) */}
      {activeCard?.kind === "info" && (
        <InfoCard
          card={activeCard}
          onClose={closeCard}
          onOpenExperiment={openExperimentFromInfo}
        />
      )}

      {/* Experiment modal (full sim) */}
      {activeCard?.kind === "experiment" && (
        <ExperimentModal experiment={activeCard} onClose={closeCard} />
      )}
    </div>
  );
}

import { useEffect, useRef } from 'react'

// "Potencias de diez" — panel lateral que muestra el objeto representativo
// de la escala actual mientras el usuario viaja con la rueda del ratón.

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }
const sup = (n) => String(n).split('').map((c) => SUP[c] ?? c).join('')

// ─── SVG icons ────────────────────────────────────────────────────────────────
// Each renders a 48×48 illustration representing its scale.

function IconUniverse({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gu)" opacity="0.25" />}
      <defs>
        <radialGradient id="gu" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c83ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7c83ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" stroke="#7c83ff" strokeWidth="1.2" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="#7c83ff" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
      {[
        [8,10],[38,8],[14,36],[40,33],[24,4],[24,43],[5,24],[43,24],
        [32,14],[16,18],[30,34],[10,29],[36,24],[20,8],[12,16],[40,18],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.7} fill="#aab6ff" opacity={0.5 + (i % 4) * 0.12} />
      ))}
    </svg>
  )
}

function IconSupercluster({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gsc)" opacity="0.2" />}
      <defs>
        <radialGradient id="gsc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9b9fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#9b9fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[
        [12,12,4],[36,10,5],[10,32,3],[38,36,4],[24,22,7],[20,14,2],[30,30,2],[16,28,3],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#9b9fff" opacity={0.3 + i * 0.08} />
      ))}
      {[[12,12],[36,10],[24,22],[10,32],[38,36]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={0.8} fill="white" opacity={0.9} />
      ))}
    </svg>
  )
}

function IconGalaxy({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <ellipse cx="24" cy="24" rx="22" ry="22" fill="url(#gg)" opacity="0.25" />}
      <defs>
        <radialGradient id="gg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#aab6ff" />
          <stop offset="100%" stopColor="#aab6ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* spiral arms */}
      <path d="M24 24 Q30 18 38 16 Q42 20 38 26 Q32 30 24 24" fill="#aab6ff" opacity="0.5" />
      <path d="M24 24 Q18 30 10 32 Q6 28 10 22 Q16 18 24 24" fill="#aab6ff" opacity="0.5" />
      <path d="M24 24 Q30 30 34 38 Q30 42 24 40 Q20 34 24 24" fill="#9b9fff" opacity="0.35" />
      <path d="M24 24 Q18 18 14 10 Q18 6 24 8 Q28 14 24 24" fill="#9b9fff" opacity="0.35" />
      <ellipse cx="24" cy="24" rx="4" ry="4" fill="#d0d4ff" opacity="0.9" />
      <ellipse cx="24" cy="24" rx="2" ry="2" fill="white" opacity="1" />
      {/* star dust */}
      {[[34,12],[38,28],[14,38],[10,16],[28,8],[20,40],[40,22],[8,30]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={0.7} fill="white" opacity={0.6} />
      ))}
    </svg>
  )
}

function IconSolarSystem({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gss)" opacity="0.25" />}
      <defs>
        <radialGradient id="gss" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb24d" />
          <stop offset="100%" stopColor="#ffb24d" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* orbits */}
      <ellipse cx="24" cy="24" rx="10" ry="10" stroke="#ffb24d" strokeWidth="0.5" opacity="0.3" fill="none" />
      <ellipse cx="24" cy="24" rx="16" ry="16" stroke="#ffb24d" strokeWidth="0.4" opacity="0.2" fill="none" />
      <ellipse cx="24" cy="24" rx="21" ry="8" stroke="#c8a060" strokeWidth="0.4" opacity="0.25" fill="none" />
      {/* sun */}
      <circle cx="24" cy="24" r="5" fill="#ffb24d" opacity="0.95" />
      <circle cx="24" cy="24" r="5" fill="url(#sun)" />
      <defs>
        <radialGradient id="sun" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#ff8c00" />
        </radialGradient>
      </defs>
      {/* planets */}
      <circle cx="34" cy="24" r="2" fill="#4da6ff" />
      <circle cx="7"  cy="24" r="1.4" fill="#ff8060" />
      <circle cx="43" cy="19" r="1" fill="#c8a060" />
    </svg>
  )
}

function IconStar({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gst)" opacity="0.3" />}
      <defs>
        <radialGradient id="gst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcc66" />
          <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#sthalo)" opacity="0.15" />
      <defs>
        <radialGradient id="sthalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcc66" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* corona rays */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        const x1 = 24 + Math.cos(a) * 9
        const y1 = 24 + Math.sin(a) * 9
        const x2 = 24 + Math.cos(a) * 18
        const y2 = 24 + Math.sin(a) * 18
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffcc66" strokeWidth="1.2" opacity="0.35" />
      })}
      <circle cx="24" cy="24" r="9" fill="url(#stcore)" />
      <defs>
        <radialGradient id="stcore" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff0aa" />
          <stop offset="100%" stopColor="#ff8800" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function IconPlanet({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gpl)" opacity="0.25" />}
      <defs>
        <radialGradient id="gpl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4da6ff" />
          <stop offset="100%" stopColor="#4da6ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Saturn-like ring */}
      <ellipse cx="24" cy="24" rx="20" ry="6" stroke="#c8a060" strokeWidth="1.5" opacity="0.45" fill="none" />
      <circle cx="24" cy="24" r="11" fill="url(#plcore)" />
      <defs>
        <radialGradient id="plcore" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#88ccff" />
          <stop offset="60%" stopColor="#3388dd" />
          <stop offset="100%" stopColor="#1a4488" />
        </radialGradient>
      </defs>
      {/* continent hint */}
      <path d="M19 20 Q22 18 26 21 Q28 25 24 27 Q20 26 19 20Z" fill="#4a9f50" opacity="0.6" />
      <path d="M26 18 Q29 17 31 20 Q30 23 27 22Z" fill="#4a9f50" opacity="0.5" />
    </svg>
  )
}

function IconMountain({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="28" r="20" fill="url(#gmt)" opacity="0.2" />}
      <defs>
        <radialGradient id="gmt" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8ab4ff" />
          <stop offset="100%" stopColor="#8ab4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* sky stars */}
      {[[10,8],[38,6],[30,12],[6,14],[42,10]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={0.8} fill="white" opacity={0.5} />
      ))}
      {/* background mountain */}
      <polygon points="30,38 44,38 37,14" fill="#445566" opacity="0.6" />
      {/* main mountain */}
      <polygon points="4,38 44,38 24,8" fill="#556677" />
      {/* snow cap */}
      <polygon points="24,8 18,22 30,22" fill="white" opacity="0.85" />
      {/* ground */}
      <rect x="0" y="38" width="48" height="4" fill="#223344" opacity="0.7" rx="1" />
    </svg>
  )
}

function IconHuman({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="28" r="20" fill="url(#ghm)" opacity="0.2" />}
      <defs>
        <radialGradient id="ghm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* ground */}
      <line x1="8" y1="44" x2="40" y2="44" stroke="white" strokeWidth="1" opacity="0.3" />
      {/* body */}
      <line x1="24" y1="20" x2="24" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* arms */}
      <line x1="14" y1="26" x2="34" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* legs */}
      <line x1="24" y1="36" x2="17" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="36" x2="31" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* head */}
      <circle cx="24" cy="15" r="5" fill="white" opacity="0.9" />
    </svg>
  )
}

function IconCell({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gcl)" opacity="0.25" />}
      <defs>
        <radialGradient id="gcl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#36e08a" />
          <stop offset="100%" stopColor="#36e08a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* membrane (wavy) */}
      <path d="M24 4 C30 4 36 8 38 14 C42 20 42 28 38 34 C34 40 28 44 24 44 C18 44 12 40 10 34 C6 28 6 20 10 14 C12 8 18 4 24 4Z"
        stroke="#36e08a" strokeWidth="1.2" fill="#36e08a" fillOpacity="0.08" />
      {/* nucleus */}
      <circle cx="24" cy="22" r="7" fill="#36e08a" fillOpacity="0.25" stroke="#36e08a" strokeWidth="1" />
      <circle cx="24" cy="22" r="4" fill="#36e08a" fillOpacity="0.5" />
      {/* organelles */}
      {[[16,32,2.5],[32,30,2],[14,16,1.5],[34,16,1.8],[28,36,1.5]].map(([x,y,r],i)=>(
        <ellipse key={i} cx={x} cy={y} rx={r*1.6} ry={r} fill="#36e08a" opacity={0.35} />
      ))}
    </svg>
  )
}

function IconDNA({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gdna)" opacity="0.2" />}
      <defs>
        <radialGradient id="gdna" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#20c070" />
          <stop offset="100%" stopColor="#20c070" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* double helix strands */}
      {[0,1,2,3,4,5,6].map(i => {
        const t = i / 6
        const y = 5 + t * 38
        const dx = Math.sin(t * Math.PI * 2) * 10
        return (
          <g key={i}>
            <circle cx={24 + dx} cy={y} r={2} fill="#36e08a" opacity={0.8} />
            <circle cx={24 - dx} cy={y} r={2} fill="#20c070" opacity={0.8} />
          </g>
        )
      })}
      {/* rungs */}
      {[0.15,0.35,0.55,0.75].map((t, i) => {
        const y = 5 + t * 38
        const dx = Math.sin(t * Math.PI * 2) * 10
        return <line key={i} x1={24 + dx} y1={y} x2={24 - dx} y2={y} stroke="#80ffcc" strokeWidth="1" opacity="0.5" />
      })}
    </svg>
  )
}

function IconAtom({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gat)" opacity="0.25" />}
      <defs>
        <radialGradient id="gat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#36e08a" />
          <stop offset="100%" stopColor="#36e08a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* electron orbits */}
      <ellipse cx="24" cy="24" rx="20" ry="7" stroke="#36e08a" strokeWidth="1" opacity="0.5" fill="none" />
      <ellipse cx="24" cy="24" rx="20" ry="7" stroke="#36e08a" strokeWidth="1" opacity="0.5" fill="none"
        transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="7" stroke="#36e08a" strokeWidth="1" opacity="0.5" fill="none"
        transform="rotate(120 24 24)" />
      {/* nucleus */}
      <circle cx="24" cy="24" r="4" fill="#36e08a" opacity="0.9" />
      <circle cx="24" cy="24" r="2.5" fill="white" opacity="0.8" />
      {/* electrons */}
      <circle cx="44" cy="24" r="2" fill="#80ffcc" />
      <circle cx="14" cy="14" r="2" fill="#80ffcc" transform="rotate(60 24 24)" />
      <circle cx="14" cy="14" r="2" fill="#80ffcc" transform="rotate(120 24 24)" />
    </svg>
  )
}

function IconNucleus({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gnc)" opacity="0.3" />}
      <defs>
        <radialGradient id="gnc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b9d" />
          <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* nucleons cluster */}
      {[
        [24,20,3.5,'#ff6b9d'],
        [19,25,3.5,'#c060ff'],
        [29,25,3.5,'#ff6b9d'],
        [24,29,3,'#c060ff'],
        [20,19,2.5,'#c060ff'],
        [28,19,2.5,'#ff6b9d'],
        [24,24,2,'#ff99cc'],
      ].map(([cx,cy,r,fill],i)=>(
        <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={0.85} />
      ))}
      <circle cx="24" cy="24" r="10" stroke="#ff6b9d" strokeWidth="0.8" fill="none" opacity="0.35" strokeDasharray="2 2" />
    </svg>
  )
}

function IconQuark({ glow }) {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      {glow && <circle cx="24" cy="24" r="22" fill="url(#gq)" opacity="0.35" />}
      <defs>
        <radialGradient id="gq" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d8d" />
          <stop offset="100%" stopColor="#ff4d8d" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* gluon strings */}
      <line x1="24" y1="24" x2="18" y2="14" stroke="#ff4d8d" strokeWidth="1.5" opacity="0.6" strokeDasharray="2 2" />
      <line x1="24" y1="24" x2="32" y2="14" stroke="#c060ff" strokeWidth="1.5" opacity="0.6" strokeDasharray="2 2" />
      <line x1="24" y1="24" x2="24" y2="36" stroke="#ff8c00" strokeWidth="1.5" opacity="0.6" strokeDasharray="2 2" />
      {/* three quarks (RGB) */}
      <circle cx="18" cy="13" r="4.5" fill="#ff4d8d" opacity="0.9" />
      <circle cx="32" cy="13" r="4.5" fill="#a040ff" opacity="0.9" />
      <circle cx="24" cy="36" r="4.5" fill="#ff8c00" opacity="0.9" />
      {/* labels */}
      <text x="18" y="15" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" opacity="0.9">u</text>
      <text x="32" y="15" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" opacity="0.9">d</text>
      <text x="24" y="38" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" opacity="0.9">d</text>
    </svg>
  )
}

// ─── Scale stops ──────────────────────────────────────────────────────────────
// z = (26 − exp) / 44   →  exponent at z=0 is 26, at z=1 is −18.

const STOPS = [
  { exp: 26, z: 0,          label: 'Universo observable',     sub: '~10²⁶ m',    color: '#7c83ff', Icon: IconUniverse },
  { exp: 23, z: 3 / 44,     label: 'Supercúmulo de galaxias', sub: '~10²³ m',    color: '#9b9fff', Icon: IconSupercluster },
  { exp: 21, z: 5 / 44,     label: 'Galaxia (Vía Láctea)',    sub: '~10²¹ m',    color: '#aab6ff', Icon: IconGalaxy },
  { exp: 13, z: 13 / 44,    label: 'Sistema Solar',           sub: '~10¹³ m',    color: '#ffb24d', Icon: IconSolarSystem },
  { exp: 10, z: 16 / 44,    label: 'Estrella (Sol)',           sub: '~10¹⁰ m',    color: '#ffcc66', Icon: IconStar },
  { exp: 7,  z: 19 / 44,    label: 'Planeta (Tierra)',         sub: '~10⁷ m',     color: '#4da6ff', Icon: IconPlanet },
  { exp: 4,  z: 22 / 44,    label: 'Montaña',                  sub: '~10⁴ m',     color: '#8ab4ff', Icon: IconMountain },
  { exp: 0,  z: 26 / 44,    label: 'Ser humano',               sub: '~1 m',       color: '#e0e8ff', Icon: IconHuman },
  { exp: -6, z: 32 / 44,    label: 'Célula',                   sub: '~10⁻⁶ m',    color: '#36e08a', Icon: IconCell },
  { exp: -8, z: 34 / 44,    label: 'Molécula de ADN',          sub: '~10⁻⁸ m',    color: '#20c070', Icon: IconDNA },
  { exp: -10,z: 36 / 44,    label: 'Átomo',                    sub: '~10⁻¹⁰ m',   color: '#36e08a', Icon: IconAtom },
  { exp: -14,z: 40 / 44,    label: 'Núcleo atómico',           sub: '~10⁻¹⁴ m',   color: '#ff6b9d', Icon: IconNucleus },
  { exp: -18,z: 1,           label: 'Quark',                    sub: '~10⁻¹⁸ m',   color: '#ff4d8d', Icon: IconQuark },
]

const STRIP_ITEM_H = 52  // px per stop in the strip

export default function ScaleRuler({ zoomRef, anchors, sections, onJump, maxZ = 1 }) {
  const expTextRef   = useRef(null)
  const stripRef     = useRef(null)
  const featIconRef  = useRef(null)
  const featLabelRef = useRef(null)
  const featSubRef   = useRef(null)
  const featBgRef    = useRef(null)
  const lastZ        = useRef(-1)
  const lastStopIdx  = useRef(-1)

  useEffect(() => {
    let raf
    const loop = () => {
      // f is the 0..1 fraction of the (possibly stretched) journey; STOPS
      // and their distance thresholds are all defined in this fraction space.
      const f = zoomRef.current / maxZ
      if (Math.abs(f - lastZ.current) > 0.0008) {
        lastZ.current = f

        // Update scale text
        const exp = Math.round(26 - f * 44)
        if (expTextRef.current) expTextRef.current.textContent = `10${sup(exp)} m`

        // Find nearest stop
        let nearest = 0
        let nearestDist = Infinity
        STOPS.forEach((s, i) => {
          const d = Math.abs(f - s.z)
          if (d < nearestDist) { nearestDist = d; nearest = i }
        })
        const stop = STOPS[nearest]

        // Update featured object if stop changed
        if (nearest !== lastStopIdx.current) {
          lastStopIdx.current = nearest
          if (featLabelRef.current) {
            featLabelRef.current.textContent = stop.label
            featLabelRef.current.style.color = stop.color
          }
          if (featSubRef.current) featSubRef.current.textContent = stop.sub
          if (featBgRef.current) {
            featBgRef.current.style.borderColor = stop.color + '55'
            featBgRef.current.style.boxShadow   = `0 0 24px 4px ${stop.color}22`
          }
          // show only the matching stacked icon
          featIconRef.current?.querySelectorAll('[data-feat-icon]').forEach((el, idx) => {
            el.style.opacity = idx === nearest ? '1' : '0'
          })
        }

        // Scroll the strip so current stop is in view (centered)
        if (stripRef.current) {
          const targetOffset = nearest * STRIP_ITEM_H - (stripRef.current.clientHeight / 2 - STRIP_ITEM_H / 2)
          stripRef.current.scrollTop += (targetOffset - stripRef.current.scrollTop) * 0.12
        }

        // Update strip item highlights imperatively
        const items = stripRef.current?.querySelectorAll('[data-stop]')
        items?.forEach((el, i) => {
          const dist = Math.abs(f - STOPS[i].z)
          const alpha = Math.max(0, 1 - dist / 0.15)
          el.style.opacity = 0.35 + alpha * 0.65
          el.style.transform = `scale(${1 + alpha * 0.08})`
          el.style.color = alpha > 0.5 ? STOPS[i].color : 'rgba(255,255,255,0.5)'
          const dot = el.querySelector('[data-dot]')
          if (dot) dot.style.background = alpha > 0.5 ? STOPS[i].color : 'rgba(255,255,255,0.25)'
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [zoomRef])

  // Featured icon is rendered via React; we track current index in state-less way
  // by using a ref div + rendering STOPS[0].Icon as default, updating via dataset.
  // Simpler: render ALL icons hidden + show the right one.

  return (
    <aside className="pointer-events-none fixed right-0 top-0 z-30 hidden h-full w-52 lg:flex flex-col">
      {/* ── Featured object ─────────────────────────── */}
      <div className="pointer-events-auto mx-3 mt-20 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-md transition-all duration-700"
        ref={featBgRef}
        style={{ borderColor: STOPS[0].color + '55', boxShadow: `0 0 24px 4px ${STOPS[0].color}22` }}
      >
        {/* Icon layer: all icons stacked, only current one visible */}
        <div className="relative h-12 w-12" ref={featIconRef}>
          {STOPS.map((s, i) => (
            <div key={i}
              data-feat-icon={i}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <s.Icon glow />
            </div>
          ))}
        </div>
        <div ref={featLabelRef} className="text-center text-[0.65rem] font-semibold leading-tight text-white">
          {STOPS[0].label}
        </div>
        <div ref={featSubRef} className="font-mono text-[0.7rem] text-white/50">
          {STOPS[0].sub}
        </div>
      </div>

      {/* ── Scale exponent ──────────────────────────── */}
      <div className="mx-3 mt-2 text-center">
        <div className="text-[0.55rem] uppercase tracking-widest text-white/30">Escala</div>
        <div ref={expTextRef} className="font-mono text-xl font-bold text-white/80">10²⁶ m</div>
      </div>

      {/* ── Scrolling strip ─────────────────────────── */}
      <div className="mx-3 mt-3 flex-1 overflow-hidden rounded-xl border border-white/8 bg-black/40 backdrop-blur-sm">
        <div
          ref={stripRef}
          className="h-full overflow-y-scroll"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* top padding */}
          <div style={{ height: 20 }} />
          {STOPS.map((stop, i) => (
            <button
              key={i}
              data-stop={i}
              onClick={() => {
                /* jump to nearest section anchor */
                const stopZ = stop.z * maxZ
                let best = -1, bestDist = Infinity
                anchors.forEach((a, j) => {
                  const d = Math.abs(stopZ - a)
                  if (d < bestDist) { bestDist = d; best = j }
                })
                if (bestDist < 0.18 * maxZ && best >= 0) onJump(best)
              }}
              className="pointer-events-auto flex w-full items-center gap-2 px-2 py-1.5 transition-all duration-150"
              style={{ height: STRIP_ITEM_H, opacity: i === 0 ? 1 : 0.35 }}
              title={stop.label}
            >
              <div data-dot className="h-2 w-2 flex-shrink-0 rounded-full transition-colors duration-200"
                style={{ background: i === 0 ? stop.color : 'rgba(255,255,255,0.25)' }} />
              <div className="h-7 w-7 flex-shrink-0">
                <stop.Icon glow={false} />
              </div>
              <span className="text-left text-[0.58rem] leading-tight transition-colors duration-200"
                style={{ color: i === 0 ? stop.color : 'rgba(255,255,255,0.5)' }}>
                {stop.label}
              </span>
            </button>
          ))}
          <div style={{ height: 20 }} />
        </div>
      </div>

      <div className="mx-3 mb-4 mt-1 text-center text-[0.5rem] uppercase tracking-widest text-white/20">
        Universo → Quark
      </div>
    </aside>
  )
}

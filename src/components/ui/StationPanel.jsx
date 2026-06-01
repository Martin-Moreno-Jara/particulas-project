// Panel-estación: tarjeta fija y centrada que aloja el contenido de una sección.
// ZoomExperience controla su escala/opacidad/visibilidad (efecto de zoom) mediante el
// ref registrado; aquí solo se define el marco con scroll interno y los controles de viaje.
export default function StationPanel({ section, index, total, registerRef, onGo, children }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-4 md:px-8">
      <div
        ref={(el) => registerRef(index, el)}
        className="station-card pointer-events-auto w-[94vw] max-w-6xl rounded-2xl border shadow-2xl shadow-black/60"
        style={{
          display: 'none',
          maxHeight: '86vh',
          overflowY: 'auto',
          background: `linear-gradient(160deg, #07070d 0%, ${section.color}2e 100%)`,
          borderColor: `${section.accent}55`,
          willChange: 'transform, opacity',
        }}
      >
        {children}

        {/* Controles de viaje (siempre accesibles al final del panel) */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/70 px-6 py-3 backdrop-blur">
          <button
            onClick={() => onGo(index - 1)}
            className="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
          >
            ⌃ {index === 0 ? 'Inicio' : 'Anterior'}
          </button>
          <span className="hidden text-xs text-text-secondary sm:block">
            Rueda del ratón para hacer zoom · {index + 1} / {total}
          </span>
          <button
            onClick={() => onGo(index + 1)}
            disabled={index === total - 1}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: section.accent }}
          >
            {index === total - 1 ? 'Fin del viaje' : 'Seguir hacia el quark ⌄'}
          </button>
        </div>
      </div>
    </div>
  )
}

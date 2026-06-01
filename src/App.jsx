import ZoomExperience from './components/ZoomExperience.jsx'

// Mensaje para pantallas pequeñas: el portal es desktop-first.
function SmallViewportWarning() {
  return (
    <div className="small-viewport-warning fixed inset-0 z-[100] flex-col items-center justify-center gap-4 bg-black p-8 text-center">
      <div className="font-display text-3xl font-bold text-text-primary">Del Universo al Quark</div>
      <p className="max-w-xs text-text-secondary">
        Esta experiencia de zoom está diseñada para pantallas de escritorio. Ábrela en una ventana de
        al menos 900 px de ancho para disfrutar del viaje completo.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <SmallViewportWarning />
      <div className="main-experience h-full w-full">
        <ZoomExperience />
      </div>
    </>
  )
}

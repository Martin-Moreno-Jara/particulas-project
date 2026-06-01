import { useEffect, useRef } from 'react'
import p5 from 'p5'
import { useInView } from '../../hooks/useInView.js'

// Envoltorio ligero de p5.js en "modo instancia". Monta el sketch una sola vez y lo
// pausa automáticamente (noLoop) cuando sale del viewport para no gastar CPU.
// El `sketch` debe ser estable (useMemo/useCallback): lee sus controles vía refs.
export default function P5Sketch({ sketch, className, pauseOffscreen = true }) {
  const hostRef = useRef(null)
  const instanceRef = useRef(null)
  const [viewRef, inView] = useInView({ threshold: 0.1 })

  // Monta / desmonta la instancia de p5 dentro del contenedor.
  useEffect(() => {
    if (!hostRef.current) return undefined
    const instance = new p5((p) => sketch(p), hostRef.current)
    instanceRef.current = instance
    return () => {
      instance.remove()
      instanceRef.current = null
    }
  }, [sketch])

  // Pausa el bucle de dibujo cuando la simulación no es visible.
  useEffect(() => {
    if (!pauseOffscreen) return
    const inst = instanceRef.current
    if (!inst) return
    if (inView) inst.loop()
    else inst.noLoop()
  }, [inView, pauseOffscreen])

  const setRefs = (el) => {
    hostRef.current = el
    viewRef.current = el
  }

  return <div ref={setRefs} className={className} />
}

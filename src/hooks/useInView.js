import { useEffect, useRef, useState } from 'react'

// Hook con IntersectionObserver: indica si un elemento está visible en el viewport.
// Se usa para pausar simulaciones (p5.js / Three.js) cuando salen de pantalla.
export function useInView({ threshold = 0.15, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}

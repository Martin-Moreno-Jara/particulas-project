import { motion } from 'framer-motion'
import { hero } from '../../data/content.js'

// Pantalla inicial: título luminoso y subtítulo. Es la "estación 0" del viaje: al
// hacer zoom hacia adentro crece y se desvanece (su transform lo controla ZoomExperience).
export default function Hero({ heroRef, onStart }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6 text-center">
      <div ref={heroRef} style={{ willChange: 'transform, opacity' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-5 font-mono text-xs uppercase tracking-[0.4em] text-accent"
        >
          Física moderna · viaje de escala
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-display text-6xl font-bold leading-[1.05] tracking-tight text-text-primary md:text-8xl"
          style={{ textShadow: '0 0 40px rgba(96,165,250,0.35)' }}
        >
          Del Universo
          <br />
          <span className="bg-gradient-to-r from-accent via-glossary to-[#ff4d8d] bg-clip-text text-transparent">
            al Quark
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-lg text-text-secondary"
        >
          {hero.subtitle}
        </motion.p>

        <motion.button
          onClick={onStart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="group pointer-events-auto mt-10 inline-flex flex-col items-center gap-2 text-text-secondary transition-colors hover:text-text-primary"
        >
          <span className="text-xs uppercase tracking-[0.3em]">Haz zoom con la rueda para comenzar</span>
          <span className="animate-float-down text-2xl">⌄</span>
        </motion.button>
      </div>
    </div>
  )
}

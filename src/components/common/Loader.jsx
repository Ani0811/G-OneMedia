import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Loader({ onComplete }) {
  useEffect(() => {
    // Found the "sweet spot" at 1200ms - fast enough but lets the animation shine
    const timer = setTimeout(onComplete, 1200)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-9999 bg-[#050508] flex flex-col items-center justify-center overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />

      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          {/* Middle Ring */}
          <motion.div
            className="absolute inset-2 rounded-full border border-r-fuchsia-500 border-t-transparent border-b-transparent border-l-transparent opacity-70"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          {/* Inner Core */}
          <motion.div
            className="w-12 h-12 bg-cyan-400 rounded-full shadow-[0_0_30px_#00f0ff] mix-blend-screen"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        {/* Text */}
        <motion.div 
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-white font-black text-2xl tracking-[0.3em] uppercase">
            G-One Media
          </h2>
          <div className="flex items-center gap-2">
            <motion.span 
              className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            />
            <motion.span 
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            />
            <motion.span 
              className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            />
            <span className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-[0.4em] ml-2">
              Initializing
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none opacity-10" />
    </div>
  )
}

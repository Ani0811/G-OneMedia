import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050508]">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Glitch text effect container */}
          <div className="relative inline-block">
            <h1 className="text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_40px_rgba(0,240,255,0.3)]">
              404
            </h1>
            {/* Pseudo glitch layers (simplified for React without complex CSS keyframes) */}
            <motion.h1 
              animate={{ x: [-2, 2, -1, 0], y: [1, -1, 2, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
              className="absolute top-0 left-0 text-[150px] md:text-[200px] font-black leading-none text-cyan-400 mix-blend-screen opacity-50 z-[-1]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
            >
              404
            </motion.h1>
            <motion.h1 
              animate={{ x: [2, -2, 1, 0], y: [-1, 1, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, repeatType: "mirror" }}
              className="absolute top-0 left-0 text-[150px] md:text-[200px] font-black leading-none text-fuchsia-500 mix-blend-screen opacity-50 z-[-1]"
              style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
            >
              404
            </motion.h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center gap-6 mt-8"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 font-bold tracking-widest uppercase text-sm">
            <AlertTriangle size={18} />
            Sector Not Found
          </div>
          
          <p className="text-xl max-w-md text-gray-400 leading-relaxed">
            The coordinates you entered lead into empty space. The page you are looking for has drifted off the grid.
          </p>

          <Link to="/" className="btn-primary mt-4 flex items-center gap-2 group">
            <Home size={18} className="group-hover:-translate-y-1 transition-transform" />
            Return to Main Hub
          </Link>
        </motion.div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />
    </div>
  )
}

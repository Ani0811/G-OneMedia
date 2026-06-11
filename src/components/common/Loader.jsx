import { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function Loader({ onComplete }) {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    // Sweet spot at 1200ms - fast enough but lets the loading bar fill
    const timer = setTimeout(onComplete, 1200)
    return () => clearTimeout(timer)
  }, [onComplete])

  const skeletonColor = isLight ? 'bg-black/5' : 'bg-white/5'

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden transition-colors duration-300 pointer-events-none"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      {/* Background subtle glow */}
      <div 
        className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] transition-all duration-300 ${
          isLight ? 'bg-cyan-500/15' : 'bg-cyan-500/10'
        }`} 
      />

      {/* Navbar Skeleton */}
      <div className="w-full py-6 px-4 md:px-8 lg:px-16 flex items-center justify-between border-b border-transparent">
        <div className={`w-36 h-10 rounded-md animate-pulse ${skeletonColor}`} />
        <div className="hidden md:flex gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-20 h-4 rounded animate-pulse ${skeletonColor}`} />
          ))}
        </div>
        <div className="flex gap-4">
          <div className={`w-10 h-10 rounded-full animate-pulse ${skeletonColor}`} />
          <div className={`hidden md:block w-32 h-10 rounded animate-pulse ${skeletonColor}`} />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="container-custom relative z-10 w-full pt-24 pb-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Content Left */}
          <div className="flex flex-col justify-center order-2 lg:order-1 gap-6">
            <div className="space-y-4">
              <div className={`w-3/4 h-12 md:h-16 rounded-xl animate-pulse ${skeletonColor}`} />
              <div className={`w-full h-12 md:h-16 rounded-xl animate-pulse ${skeletonColor}`} />
              <div className={`w-5/6 h-12 md:h-16 rounded-xl animate-pulse ${skeletonColor}`} />
            </div>
            
            <div className="space-y-3 mt-4">
              <div className={`w-full h-4 rounded animate-pulse ${skeletonColor}`} />
              <div className={`w-full h-4 rounded animate-pulse ${skeletonColor}`} />
              <div className={`w-2/3 h-4 rounded animate-pulse ${skeletonColor}`} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className={`w-40 h-12 rounded-xl animate-pulse ${skeletonColor}`} />
              <div className={`w-40 h-12 rounded-xl animate-pulse ${skeletonColor}`} />
            </div>
          </div>

          {/* Visual Right */}
          <div className="relative lg:ml-auto max-w-xl w-full order-1 lg:order-2">
            <div className={`w-full aspect-[4/3] rounded-[48px] animate-pulse ${skeletonColor}`} />
          </div>

        </div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--border-subtle)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none opacity-20" />
    </div>
  )
}

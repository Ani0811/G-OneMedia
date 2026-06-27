import { useEffect, useState, useRef, Suspense } from 'react'

export default function LazySection({ children, placeholderHeight = '200px', fallback }) {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px', // start loading slightly before it enters viewport
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const defaultFallback = (
    <div className="w-full py-12 flex justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
    </div>
  )

  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : placeholderHeight }}>
      {inView ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : null}
    </div>
  )
}

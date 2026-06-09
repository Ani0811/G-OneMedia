import { useState, useRef } from 'react'

export default function BeforeAfterSlider({ 
  beforeImage = "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=1200&auto=format&fit=crop", // Example "Old/Ugly" site 
  afterImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop", // Example "New/Clean" site
  beforeLabel = "Before",
  afterLabel = "After"
}) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const onMouseMove = (e) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const onTouchMove = (e) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  return (
    <section className="py-24 bg-bg-empty relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
            Stop Guessing. <span className="text-gradient">See The Difference.</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            A single visual is worth a thousand strategy decks. Drag the slider to see how we transform average brands into segment leaders.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full max-w-5xl mx-auto aspect-video sm:aspect-21/9 rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none shadow-2xl shadow-primary/20 border border-border-subtle"
          onMouseMove={onMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchMove={onTouchMove}
          onTouchEnd={() => setIsDragging(false)}
          onMouseDown={(e) => {
            setIsDragging(true)
            handleMove(e.clientX)
          }}
          onTouchStart={(e) => {
            setIsDragging(true)
            handleMove(e.touches[0].clientX)
          }}
        >
          {/* AFTER Image (Background) */}
          <img 
            src={afterImage} 
            alt="After" 
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" 
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-bold shadow-lg z-10 border border-white/10">
            {afterLabel}
          </div>

          {/* BEFORE Image (Clipped overlay) */}
          <div 
            className="absolute inset-0 select-none pointer-events-none"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <img 
              src={beforeImage} 
              alt="Before" 
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none filter grayscale sepia-30" 
              draggable={false}
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-bold shadow-lg z-10 border border-white/10">
              {beforeLabel}
            </div>
            {/* Dark overlay to make the bad look worse */}
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Slider Line & Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L21 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 18L3 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ArrowRight, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Testimonials() {
  const navigate = useNavigate()
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (rating) => {
    navigate(`/reviews?write=true&rating=${rating}`)
  }

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 bg-[var(--bg-secondary)]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
              <Sparkles size={10} className="text-cyan-400 animate-pulse" /> Client Feedback
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              Your Voice <span className="gradient-text">Shapes Us</span>
            </h2>
            
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              At G-One Media, we strive to engineer premium, high-converting digital experiences. 
              Whether we built your landing page, e-commerce store, or custom application, we want to hear from you. 
              Help us maintain our standards of digital excellence by sharing your experience.
            </p>

            {/* Micro details list */}
            <div className="space-y-4 mb-6">
              {[
                '100% Verified Client Feedback',
                'Transparent ratings and constructive criticism',
                'Directly reviewed by our leadership team'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-cyan-400" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Review Us Flashcard */}
          <div className="lg:col-span-6 flex items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card w-full max-w-md p-8 md:p-10 relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(0,240,255,0.2)]"
            >
              {/* Card top border glow */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              
              <div className="flex flex-col items-center text-center">
                {/* Floating chat icon */}
                <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <MessageSquare size={28} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                </div>

                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Rate G-One Media
                </h3>
                
                <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: 'var(--text-muted)' }}>
                  How has your experience been working with us? Select a star rating below to start your review.
                </p>

                {/* Interactive Rating Selectors */}
                <div className="flex gap-2 mb-8 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-all duration-150 hover:scale-125 hover:-translate-y-1 active:scale-95 cursor-pointer"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-150 ${
                          (hoverRating || 0) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-white/10 fill-white/5'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating description helper */}
                <div className="h-6 mb-6">
                  {hoverRating > 0 && (
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 animate-pulse">
                      {['', 'Needs Improvement 👎', 'Fair enough 😐', 'Good job 👍', 'Great Experience! 🔥', 'Elite Class! 👑'][hoverRating]}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate('/reviews?write=true')}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-3.5! rounded-xl shadow-lg hover:shadow-cyan-500/20"
                >
                  Write A Review
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

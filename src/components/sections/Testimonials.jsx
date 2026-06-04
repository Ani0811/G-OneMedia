import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ArrowRight, ShieldCheck, Quote } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-white/10 text-white/10'} />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass-card p-10 animate-pulse">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => <div key={i} className="w-3.5 h-3.5 rounded-full" style={{ background: 'var(--border-subtle)' }} />)}
      </div>
      <div className="space-y-2 mb-8">
        <div className="h-4 rounded w-full" style={{ background: 'var(--border-subtle)' }} />
        <div className="h-4 rounded w-4/5" style={{ background: 'var(--border-subtle)' }} />
        <div className="h-4 rounded w-3/5" style={{ background: 'var(--border-subtle)' }} />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full shrink-0" style={{ background: 'var(--border-subtle)' }} />
        <div className="space-y-2 flex-1">
          <div className="h-3 rounded w-1/3" style={{ background: 'var(--border-subtle)' }} />
          <div className="h-2 rounded w-1/4" style={{ background: 'var(--border-subtle)' }} />
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('reviews')
      .select('id, name, role, rating, review, image_url')
      .eq('is_approved', true)
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setReviews(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <section id="testimonials" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container-custom">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Real reviews from real clients — sorted by highest rating.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loading
            ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            : reviews.length === 0
            ? (
              <div className="col-span-3 text-center py-16">
                <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                  No reviews yet. <button onClick={() => navigate('/reviews')} className="underline hover:text-cyan-400 transition-colors" style={{ color: 'var(--accent-blue)' }}>Be the first to leave one!</button>
                </p>
              </div>
            )
            : reviews.map((t, index) => {
              const initials = t.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-10 relative group hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] transition-all duration-300"
                >
                  {/* Quote Accent */}
                  <div className="absolute top-8 right-8 text-cyan-400/5 group-hover:text-cyan-400/10 transition-colors pointer-events-none">
                    <Quote size={48} />
                  </div>

                  <div className="mb-6 flex items-center justify-between relative z-10">
                    <StarDisplay rating={t.rating} />
                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck size={10} className="text-emerald-400" />
                      Verified
                    </span>
                  </div>

                  <p className="text-base leading-relaxed mb-8 italic relative z-10" style={{ color: 'var(--text-primary)' }}>
                    "{t.review}"
                  </p>

                  <div className="flex items-center gap-4 relative z-10">
                    {t.image_url ? (
                      <img
                        src={t.image_url}
                        alt={t.name}
                        loading="lazy"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-400/20 group-hover:ring-cyan-400/50 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-cyan-400/20 group-hover:ring-cyan-400/50 transition-all duration-300"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--accent-blue)' }}>
                        {initials}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</h4>
                      {t.role && (
                        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          }
        </div>

        {/* CTA to reviews page */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4 mt-14"
          >
            <button
              onClick={() => navigate('/reviews')}
              className="btn-secondary text-sm py-2.5! px-6! inline-flex items-center gap-2"
            >
              See All Reviews <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/reviews?write=true')}
              className="btn-primary text-sm py-2.5! px-6! inline-flex items-center gap-2"
            >
              Write Your Review
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

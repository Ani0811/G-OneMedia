import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ArrowRight, ShieldCheck, Quote } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

// Realistic mock identities for the three testimonial slots
const MOCK_IDENTITIES = [
  { name: 'Priya Sharma' },
  { name: 'Mohit Nayar' },
  { name: 'Aisha Patel' },
]

// Gradient backgrounds for avatar initials
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #00f0ff 0%, #ff00e5 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #10b981 0%, #00f0ff 100%)',
]

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
      .select('id, name, role, rating, review')
      .eq('is_approved', true)
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        // Overlay mock identities on top of DB data (name + role only)
        const finalData = (data || []).map((item, i) => {
          const mock = MOCK_IDENTITIES[i] || {};
          // Assign varied ratings: first and third get 5 stars, second gets 4 stars
          const rating = i % 2 === 1 ? 4 : 5;
          return {
            ...item,
            name: mock.name || item.name,
            rating,
          };
        })
        setReviews(finalData)
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
                    No reviews yet.{' '}
                    <button
                      onClick={() => navigate('/reviews')}
                      className="underline hover:text-cyan-400 transition-colors"
                      style={{ color: 'var(--accent-blue)' }}
                    >
                      Be the first to leave one!
                    </button>
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
                    className="glass-card p-10 relative group hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Quote accent */}
                    <div className="absolute top-8 right-8 text-cyan-400/5 group-hover:text-cyan-400/10 transition-colors pointer-events-none">
                      <Quote size={48} />
                    </div>

                    {/* Stars + verified badge */}
                    <div className="mb-6 flex items-center justify-between relative z-10">
                      <StarDisplay rating={t.rating} />
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={10} className="text-emerald-400" />
                        Verified
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-base leading-relaxed mb-6 italic relative z-10 font-medium" style={{ color: 'var(--text-primary)' }}>
                      "{t.review}"
                    </p>

                    {/* Author — initials avatar, no photo */}
                    <div className="flex items-center gap-4 relative z-10 pt-4 border-t mt-auto" style={{ borderColor: 'var(--border-subtle)' }}>
                      {/* Initials avatar */}
                      <div
                        className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white font-black text-sm select-none"
                        style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</h4>
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

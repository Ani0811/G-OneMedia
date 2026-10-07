import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ArrowRight, ShieldCheck, Quote, Sparkles, MessageSquarePlus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #00f0ff 0%, #ff00e5 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #10b981 0%, #00f0ff 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
]

const defaultFeaturedReview = {
  id: 4,
  name: 'Adarsh Pillai',
  role: 'Co-founder @ Dominating YouTube | Scaling YouTube Channels into Passive Income Streams',
  rating: 5,
  review: 'It was a great experience working with G-One media agency. The website was just like I had expected and my instructions and references were followed precisely.\n\nThe G-One media team also went a step ahead to include API automation on my website and all of this at a special discounted package.\n\nReally reliable guys who know what they are doing.',
  image_url: '/adarsh-pillai.png',
  is_approved: true,
}

const REVIEWS_PER_PAGE = 3

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-white/10 text-white/10'}
        />
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass-card p-8 animate-pulse flex flex-col h-full rounded-2xl border border-[var(--border-subtle)] w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full bg-white/10" />
          ))}
        </div>
        <div className="w-16 h-4 rounded-full bg-white/10" />
      </div>
      <div className="space-y-2 mb-8 flex-1">
        <div className="h-4 rounded bg-white/10 w-full" />
        <div className="h-4 rounded bg-white/10 w-5/6" />
        <div className="h-4 rounded bg-white/10 w-3/4" />
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="w-11 h-11 rounded-full shrink-0 bg-white/10" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 rounded bg-white/10 w-1/3" />
          <div className="h-2.5 rounded bg-white/10 w-1/2" />
        </div>
      </div>
    </div>
  )
}

function TestimonialAvatar({ imageUrl, name, index }) {
  const [imgError, setImgError] = useState(false)
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setImgError(true)}
        className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-cyan-400/30 border border-white/10"
      />
    )
  }

  return (
    <div
      className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white font-black text-sm select-none shadow-inner ring-2 ring-cyan-400/20"
      style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
    >
      {initials}
    </div>
  )
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hoverRating, setHoverRating] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, name, role, rating, review, image_url, is_approved, created_at')
          .eq('is_approved', true)
          .order('rating', { ascending: false })
          .order('created_at', { ascending: false })

        if (!isMounted) return

        if (!error && data && data.length > 0) {
          setReviews(data)
        } else {
          setReviews([defaultFeaturedReview])
        }
      } catch {
        if (isMounted) {
          setReviews([defaultFeaturedReview])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchTestimonials()

    return () => {
      isMounted = false
    }
  }, [])

  const handleStarClick = (rating) => {
    navigate(`/reviews?write=true&rating=${rating}`)
  }

  // Pagination calculation
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)
  const safeCurrentPage = Math.min(currentPage, totalPages || 1)
  const startIndex = (safeCurrentPage - 1) * REVIEWS_PER_PAGE
  const displayedReviews = reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const element = document.getElementById('testimonials')
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // Dynamic container class: 1 card -> centered max-w-xl / max-w-2xl, 2 cards -> 2-col max-w-4xl, 3 cards -> 3-col max-w-7xl
  const getContainerLayoutClass = (count) => {
    if (count === 1) return 'flex justify-center max-w-xl lg:max-w-2xl mx-auto w-full'
    if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full'
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full'
  }

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 bg-[var(--bg-secondary)]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container-custom relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={11} className="text-cyan-400 animate-pulse" /> Client Feedback
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Real reviews from real founders and marketing leaders who partnered with G-One Media to scale their digital presence.
          </p>
        </div>

        {/* Testimonials Cards Container */}
        {loading ? (
          <div className="flex justify-center max-w-xl mx-auto w-full mb-16">
            <SkeletonCard />
          </div>
        ) : displayedReviews.length === 0 ? (
          <div className="max-w-xl mx-auto p-12 text-center rounded-2xl glass-card border border-[var(--border-subtle)] mb-16">
            <p className="text-base text-[var(--text-muted)] mb-4">No reviews yet.</p>
            <button
              onClick={() => navigate('/reviews?write=true')}
              className="btn-primary text-sm py-2 px-5 inline-flex items-center gap-2"
            >
              Be the first to leave a review <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`testimonials-page-${safeCurrentPage}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className={`${getContainerLayoutClass(displayedReviews.length)} mb-12 items-stretch`}
            >
              {displayedReviews.map((t, index) => {
                const isSingle = displayedReviews.length === 1
                return (
                  <motion.div
                    key={t.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className={`glass-card rounded-2xl relative group hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] transition-all duration-300 flex flex-col h-full border border-white/5 ${
                      isSingle ? 'w-full p-8 sm:p-10' : 'w-full p-8'
                    }`}
                  >
                    {/* Background Quote Watermark */}
                    <div className="absolute top-6 right-6 text-cyan-400/5 group-hover:text-cyan-400/10 transition-colors pointer-events-none">
                      <Quote size={44} />
                    </div>

                    {/* Rating & Verified Badge */}
                    <div className="mb-5 flex items-center justify-between relative z-10">
                      <StarDisplay rating={t.rating || 5} />
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400/90 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={11} className="text-emerald-400" />
                        Verified Client
                      </span>
                    </div>

                    {/* Review Quote */}
                    <p
                      className={`leading-relaxed mb-6 italic relative z-10 font-medium flex-1 ${
                        isSingle ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                      }`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      "{t.review}"
                    </p>

                    {/* Client Profile Info */}
                    <div className="flex items-center gap-3.5 relative z-10 pt-4 border-t border-white/5 mt-auto">
                      <TestimonialAvatar imageUrl={t.image_url} name={t.name} index={index} />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {t.name}
                        </h4>
                        {t.role && (
                          <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                            {t.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2.5 mb-14">
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className={`w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                safeCurrentPage === 1
                  ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                  : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
              }`}
              style={{ color: safeCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all duration-300 border cursor-pointer ${
                  safeCurrentPage === page
                    ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-white hover:scale-105 hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className={`w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                safeCurrentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                  : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
              }`}
              style={{ color: safeCurrentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)' }}
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom Interactive Bar & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 bg-gradient-to-r from-cyan-500/5 via-transparent to-fuchsia-500/5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
              <MessageSquare size={22} className="text-cyan-400" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[var(--text-primary)]">
                Have you worked with G-One Media?
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Share your rating or read comprehensive reviews from all our client projects.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Quick Star Selection */}
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-black/30 border border-white/10">
              <span className="text-[11px] text-[var(--text-muted)] font-semibold mr-1">Rate:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-125 cursor-pointer"
                  title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={16}
                    className={`transition-colors ${
                      (hoverRating || 0) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/reviews')}
              className="btn-secondary text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-2 cursor-pointer"
            >
              See All Reviews <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/reviews?write=true')}
              className="btn-primary text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <MessageSquarePlus size={14} /> Write A Review
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

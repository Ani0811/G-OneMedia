import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, MessageSquarePlus, ArrowLeft, ShieldCheck, Quote } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const REVIEWS_PER_PAGE = 6

// ── Lazy image with IntersectionObserver ──────────────────────────────────────
function LazyImage({ src, alt, className, fallback }) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { rootMargin: '200px' }
    )
    if (imgRef.current) observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={className + ' overflow-hidden'}>
      {inView && src ? (
        <>
          {!loaded && (
            <div className="w-full h-full animate-pulse rounded-full" style={{ background: 'var(--bg-secondary)' }} />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover rounded-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center rounded-full text-lg font-bold"
          style={{ background: 'var(--bg-secondary)', color: 'var(--accent-blue)' }}>
          {fallback}
        </div>
      )}
      {!src && (
        <div className="w-full h-full flex items-center justify-center rounded-full text-lg font-bold"
          style={{ background: 'var(--bg-secondary)', color: 'var(--accent-blue)' }}>
          {fallback}
        </div>
      )}
    </div>
  )
}

// ── Star Display (read-only) ──────────────────────────────────────────────────
function StarDisplay({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-white/10 text-white/10'}
        />
      ))}
    </div>
  )
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <div className="glass-card p-8 animate-pulse">
      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full" style={{ background: 'var(--border-subtle)' }} />
        ))}
      </div>
      <div className="space-y-3 mb-8">
        <div className="h-4 rounded-full w-full" style={{ background: 'var(--border-subtle)' }} />
        <div className="h-4 rounded-full w-5/6" style={{ background: 'var(--border-subtle)' }} />
        <div className="h-4 rounded-full w-4/6" style={{ background: 'var(--border-subtle)' }} />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full shrink-0" style={{ background: 'var(--border-subtle)' }} />
        <div className="space-y-2 flex-1">
          <div className="h-3 rounded-full w-1/3" style={{ background: 'var(--border-subtle)' }} />
          <div className="h-2 rounded-full w-1/4" style={{ background: 'var(--border-subtle)' }} />
        </div>
      </div>
    </div>
  )
}

// ── Single Review Card ────────────────────────────────────────────────────────
function ReviewCard({ review, index }) {
  const initials = review.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card p-8 flex flex-col h-full relative group hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] transition-all duration-300"
    >
      {/* Quote Accent */}
      <div className="absolute top-6 right-6 text-cyan-400/5 group-hover:text-cyan-400/10 transition-colors pointer-events-none">
        <Quote size={40} />
      </div>

      {/* Stars & Actions */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <StarDisplay rating={review.rating} />
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400/85 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck size={9} className="text-emerald-400" />
            Verified Client
          </span>
        </div>
      </div>

      {/* Review text */}
      <p className="text-base leading-relaxed mb-8 flex-1 italic relative z-10" style={{ color: 'var(--text-primary)' }}>
        "{review.review}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 relative z-10">
        <LazyImage
          src={review.image_url}
          alt={review.name}
          className="w-12 h-12 rounded-full shrink-0 ring-2"
          fallback={initials}
          style={{ '--tw-ring-color': 'rgba(0,240,255,0.3)' }}
        />
        <div>
          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{review.name}</p>
          {review.role && (
            <p className="text-[11px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {review.role}
            </p>
          )}
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Reviews Page ─────────────────────────────────────────────────────────
export default function Reviews() {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [avgRating, setAvgRating] = useState(null)

  const totalPages = Math.ceil(total / REVIEWS_PER_PAGE)

  const fetchReviews = useCallback(async (targetPage = 1, append = false) => {
    if (targetPage === 1) setLoading(true)
    else setLoadingMore(true)

    const from = (targetPage - 1) * REVIEWS_PER_PAGE
    const to = from + REVIEWS_PER_PAGE - 1

    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('is_approved', true)
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!error) {
      setReviews(prev => append ? [...prev, ...(data || [])] : (data || []))
      setTotal(count || 0)

      // Compute average rating on first load
      if (targetPage === 1 && data?.length > 0) {
        const { data: allRatings } = await supabase
          .from('reviews')
          .select('rating')
          .eq('is_approved', true)
        if (allRatings?.length > 0) {
          const avg = allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length
          setAvgRating(avg)
        }
      }
    }

    setLoading(false)
    setLoadingMore(false)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchReviews(1)
  }, [fetchReviews])

  const goToPage = async (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    await fetchReviews(p)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', paddingTop: '100px' }}>

      <section className="pb-0">
        <Helmet>
          <title>Client Reviews | G-One Media</title>
          <meta name="description" content="Read real reviews from our clients. See how G-One Media has helped businesses grow with high-converting websites and video production." />
          <meta name="keywords" content="G-One Media reviews, customer feedback, client reviews, client success, testimonials, agency ratings" />
          <link rel="canonical" href="https://ani0811.github.io/G-OneMedia/reviews" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://ani0811.github.io/G-OneMedia/reviews" />
          <meta property="og:title" content="Client Reviews | G-One Media" />
          <meta property="og:description" content="Read real reviews from our clients. See how G-One Media has helped businesses grow with high-converting websites and video production." />
          <meta property="og:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://ani0811.github.io/G-OneMedia/reviews" />
          <meta property="twitter:title" content="Client Reviews | G-One Media" />
          <meta property="twitter:description" content="Read real reviews from our clients. See how G-One Media has helped businesses grow with high-converting websites and video production." />
          <meta property="twitter:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />
        </Helmet>

        <div className="container-custom">

          {/* Navigation Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <button
              onClick={() => navigate('/')}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hover:text-cyan-400 hover:border-cyan-400/30"
              style={{
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </button>
          </motion.div>

          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', color: 'var(--accent-blue)' }}
            >
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              Client Reviews
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              What Our <span className="gradient-text">Clients Say</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg max-w-xl mx-auto mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              Real reviews from real clients. Sorted by highest rating first.
            </motion.p>

            {/* Stats bar */}
            {avgRating !== null && total > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl mx-auto"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="text-center">
                  <p className="text-3xl font-black" style={{ color: 'var(--accent-blue)' }}>
                    {avgRating.toFixed(1)}
                  </p>
                  <StarDisplay rating={Math.round(avgRating)} size={16} />
                  <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Avg Rating</p>
                </div>
                <div className="w-px h-12" style={{ background: 'var(--border-subtle)' }} />
                <div className="text-center">
                  <p className="text-3xl font-black" style={{ color: 'var(--accent-blue)' }}>{total}</p>
                  <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>Total Reviews</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ paddingTop: 0 }}>
        <div className="container-custom">

          {/* Submit CTA + success message */}
          <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {loading ? 'Loading reviews...' : `Showing ${reviews.length} of ${total} reviews`}
            </p>
          </div>



          {/* Reviews grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(REVIEWS_PER_PAGE)].map((_, i) => <ReviewSkeleton key={i} />)}
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                <MessageSquarePlus size={32} style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                No reviews yet
              </h3>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {reviews.map((review, i) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="flex justify-center mt-10">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-14 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-400/50 hover:bg-cyan-400/5"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1
                const isCurrent = p === page
                // Show first, last, current ±1, and ellipses
                const showPage = p === 1 || p === totalPages || Math.abs(p - page) <= 1
                const showEllipsisAfter = p === 1 && page > 3
                const showEllipsisBefore = p === totalPages && page < totalPages - 2

                if (!showPage && !showEllipsisAfter && !showEllipsisBefore) return null
                if (showEllipsisAfter) return (
                  <span key={`el-after-${p}`} className="px-1" style={{ color: 'var(--text-muted)' }}>...</span>
                )
                if (showEllipsisBefore) return (
                  <span key={`el-before-${p}`} className="px-1" style={{ color: 'var(--text-muted)' }}>...</span>
                )

                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${isCurrent ? 'text-black' : 'hover:border-cyan-400/50 hover:bg-cyan-400/5'}`}
                    style={isCurrent
                      ? { background: 'var(--accent-blue)', border: '1px solid transparent', color: '#000' }
                      : { border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }
                    }
                  >
                    {p}
                  </button>
                )
              })}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-400/50 hover:bg-cyan-400/5"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

        </div>
      </section>
    </div>
  )
}

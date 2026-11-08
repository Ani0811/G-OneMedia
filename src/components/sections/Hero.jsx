import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Instagram, Linkedin, Youtube, Download, Calendar, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

export default function Hero({ onScheduleCall }) {
  const [heroData, setHeroData] = useState({
    headline: 'We Help Businesses Grow with High-Converting Websites',
    subheadline: 'G-One Media bridges the gap between Sophisticated Engineering and Compelling Visual Narratives. We design and build elite Digital Ecosystems engineered to capture attention, command authority, and accelerate business growth.',
    cta_text: 'Get Started'
  })

  useEffect(() => {
    async function fetchHero() {
      const { data } = await supabase
        .from('hero_content')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single()
      
      if (data) {
        setHeroData(data)
      }
    }
    fetchHero()
  }, [])

  // Default to founder visual (Vasudev.jpeg), unless a custom non-workspace image is configured
  const founderImage = (heroData.image_url && !heroData.image_url.includes('workspace'))
    ? (heroData.image_url.startsWith('http') ? heroData.image_url : `${import.meta.env.BASE_URL}${heroData.image_url}`.replace(/\/+/g, '/'))
    : `${import.meta.env.BASE_URL}Vasudev.jpeg`.replace(/\/+/g, '/')

  return (
    <section className="relative overflow-hidden min-h-[82vh] lg:min-h-[85vh] flex items-center pt-24 pb-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-125 bg-cyan-500/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-100 bg-fuchsia-500/10 rounded-full blur-[120px] -z-10" />

      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Visual - Founder Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto max-w-lg w-full order-1 lg:order-2 mt-8 sm:mt-12 lg:mt-0"
          >
            <div 
              className="relative z-10 rounded-[44px] sm:rounded-[48px] overflow-hidden shadow-2xl shadow-cyan-500/20 p-2 sm:p-2.5 transition-all duration-700 hover:shadow-cyan-500/30 group" 
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="rounded-[36px] sm:rounded-[40px] overflow-hidden aspect-[4/4.8] lg:aspect-[4/5] relative bg-slate-950/60">
                <img
                  src={founderImage}
                  alt="Vasudev Sharma — Founder of G-One Media"
                  className="w-full h-full object-cover profile-crop opacity-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = `${import.meta.env.BASE_URL}Vasudev.jpeg`.replace(/\/+/g, '/')
                  }}
                />
                
                {/* Gradient vignette overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/15 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />

                {/* Top Badge: Role / Availability */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-lg z-20">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Agency Owner & Director</span>
                </div>

                {/* Top-Right Badge: Creative tag */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 px-3 py-1.5 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-400/25 flex items-center gap-1.5 shadow-lg z-20">
                  <Sparkles size={11} className="text-cyan-400" />
                  <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Creative Vision</span>
                </div>

                {/* Bottom Overlay Card: Founder Info + One-Click Bio Link */}
                <Link
                  to="/about/vasudev"
                  className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-300 hover:border-fuchsia-400/60 group/founderCard z-20 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-sm sm:text-base tracking-tight truncate group-hover/founderCard:text-fuchsia-300 transition-colors">
                        Vasudev Sharma
                      </h3>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 shrink-0">
                        Founder
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                      Directing bespoke visual narratives & high-converting builds
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover/founderCard:bg-fuchsia-500 group-hover/founderCard:text-black transition-all shrink-0">
                    <ArrowRight size={15} className="group-hover/founderCard:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -inset-8 bg-fuchsia-500/20 blur-[100px] -z-10 opacity-60 animate-pulse" />
            <div className="absolute top-1/2 -right-8 w-40 h-40 bg-cyan-500/20 blur-[80px] -z-10 pointer-events-none" />
          </motion.div>

          {/* Content - Second on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {heroData.tagline && (
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-3 bg-cyan-400/10 px-3.5 py-1.5 rounded-full border border-cyan-400/20 w-fit">
                {heroData.tagline}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-4 tracking-tighter text-[var(--text-primary)]">
              {heroData.headline}
            </h1>

            <p className="text-base md:text-lg mb-6 leading-relaxed max-w-130" style={{ color: 'var(--text-secondary)' }}>
              {heroData.subheadline}
            </p>

            {/* Dynamic Custom Extra Fields highlight list */}
            {heroData.extra_fields && Array.isArray(heroData.extra_fields) && heroData.extra_fields.length > 0 && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-b border-white/5 py-5">
                {heroData.extra_fields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{field.label}:</span>
                    <span className="text-xs text-[var(--text-muted)] font-medium">{field.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                to="/get-started"
                className="btn-primary hero-get-started flex items-center justify-center gap-3 group shadow-2xl shadow-cyan-500/40 px-7! py-3.5!"
              >
                {heroData.cta_text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={onScheduleCall}
                className="btn-secondary px-7! py-3.5! inline-flex items-center justify-center gap-2 hover:bg-cyan-400/5"
              >
                <Calendar size={18} className="text-cyan-400" />
                Schedule Call
              </button>
            </div>

            {/* Social Proof / Links / Resources */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/5 pt-6"
            >
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-50" style={{ color: 'var(--text-secondary)' }}>
                  Follow My Journey
                </span>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Instagram, href: "https://www.instagram.com/g1mediaofficial", color: "hover:text-fuchsia-400" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/g-one-media-agency-93581040b/", color: "hover:text-cyan-400" },
                    { icon: Youtube, href: "https://www.youtube.com/@G-OneMedia", color: "hover:text-red-500" }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-all duration-300 transform hover:scale-110 ${social.color}`}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: 'var(--border-subtle)' }} />

              <a
                href={`${import.meta.env.BASE_URL}knowledge_base/G-ONE MEDIA.pdf`.replace(/\/+/g, '/')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] transition-all border px-3 py-1.5 rounded-full"
                style={{
                  color: 'var(--accent-blue)',
                  borderColor: 'var(--border-subtle)',
                  background: 'rgba(0, 240, 255, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-blue)'
                  e.currentTarget.style.color = '#000000'
                  e.currentTarget.style.borderColor = 'var(--accent-blue)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)'
                  e.currentTarget.style.color = 'var(--accent-blue)'
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              >
                <Download size={11} /> Brochure
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

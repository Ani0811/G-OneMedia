import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const defaultFounders = [
  {
    slug: 'vasudev',
    name: 'Vasudev Sharma',
    role: 'Founder & Agency Owner',
    image: 'Vasudev.jpeg',
    accent_color: 'fuchsia',
    email: 'vasudevsharma997@gmail.com',
    socials: [
      { name: 'YouTube', url: 'https://www.youtube.com/@vasudevsharma1' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/vasudev-sharma-a8b4ab22a' },
      { name: 'Instagram', url: 'https://www.instagram.com/vasudev.sharma5/' }
    ]
  }
]

export default function About() {
  const navigate = useNavigate()
  const [team, setTeam] = useState(defaultFounders)

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (!error && data && data.length > 0) {
          const activeTeam = data.filter((m) => m.slug !== 'anirudha')
          setTeam(activeTeam.length > 0 ? activeTeam : defaultFounders)
        }
      } catch (err) {
        console.warn('Using default founders info:', err)
      }
    }
    fetchTeam()
  }, [])

  const founder = team[0] || defaultFounders[0]
  const imgSrc = founder.image?.startsWith('http')
    ? founder.image
    : `${import.meta.env.BASE_URL}${founder.image}`.replace(/\/+/g, '/')

  return (
    <section id="about" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)] -z-10" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400"
          >
            <Sparkles size={12} className="text-cyan-400" />
            Philosophy & Standards
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tightest text-[var(--text-primary)]"
          >
            Crafted with Intent, <span className="gradient-text">Engineered to Scale</span>
          </motion.h2>
          <p className="text-sm sm:text-base opacity-70 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We bridge sophisticated engineering and compelling visual narratives. Every digital ecosystem is built to command market authority and accelerate conversions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          {/* 4 Core Pillars Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 sm:p-12 md:p-14 border-white/5 relative overflow-hidden shadow-2xl shadow-black/30"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-fuchsia-500" />
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-7">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/20 text-cyan-400">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-2">Aether Fusion</h4>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Merging high-end web engineering with cinematic storytelling to build dominant digital ecosystems that stand out from cookie-cutter templates.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-400/10 flex items-center justify-center shrink-0 mt-0.5 border border-fuchsia-400/20 text-fuchsia-400">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-2">Creative Vision</h4>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Crafting high-impact visual narratives, bespoke art direction, and digital solutions engineered to hold attention and generate high-intent pipeline.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/20 text-cyan-400">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-2">Strategic Process</h4>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Seamless fusion of logic and art—moving from core positioning and wireframes to rapid prototyping, interactive polish, and production deployment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-400/10 flex items-center justify-center shrink-0 mt-0.5 border border-fuchsia-400/20 text-fuchsia-400">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-2">Unified Intent</h4>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Aligning every animation, layout decision, and micro-interaction with one clear business metric: commanding authority and maximizing customer conversion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Founder's Direct Note / Credibility Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 border border-white/10 bg-[var(--bg-card)] backdrop-blur-2xl relative overflow-hidden shadow-2xl"
          >
            {/* Ambient top glowing line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
              {/* Founder Avatar & Statement */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div 
                  onClick={() => navigate(`/about/${founder.slug}`)}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shrink-0 cursor-pointer group shadow-lg"
                >
                  <img
                    src={imgSrc}
                    alt={founder.name}
                    className="w-full h-full object-cover profile-crop transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 
                      onClick={() => navigate(`/about/${founder.slug}`)}
                      className="text-base sm:text-lg font-bold text-white tracking-tight cursor-pointer hover:text-cyan-400 transition-colors"
                    >
                      {founder.name}
                    </h4>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-fuchsia-400 px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
                      Agency Owner
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
                    "Every digital asset we build is crafted to win business. No generic templates, no friction—just bespoke creative direction and engineered conversion."
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <button
                  onClick={() => navigate(`/about/${founder.slug}`)}
                  className="btn-primary text-xs font-bold py-3 px-5 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Explore Founder Story</span>
                  <ArrowRight size={14} />
                </button>

                <a
                  href="https://wa.me/918017790952"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-xs font-bold text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                >
                  <MessageCircle size={14} className="text-fuchsia-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

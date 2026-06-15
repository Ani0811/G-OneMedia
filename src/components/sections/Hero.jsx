import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Instagram, Linkedin, Youtube, Download, Calendar } from 'lucide-react'

export default function Hero({ onScheduleCall }) {
  return (
    <section className="relative overflow-hidden min-h-[82vh] lg:min-h-[85vh] flex items-center pt-24 pb-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-125 bg-cyan-500/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-100 bg-fuchsia-500/10 rounded-full blur-[120px] -z-10" />

      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Visual - First on Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto max-w-xl w-full order-1 lg:order-2 mt-8 sm:mt-12 lg:mt-0"
          >
            <div className="relative z-10 rounded-[48px] overflow-hidden shadow-2xl shadow-cyan-500/30 p-2" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}>
              <div className="rounded-[40px] overflow-hidden aspect-4/3">
                <img
                  src={`${import.meta.env.BASE_URL}pexels-mintworkspace-18304033.jpg`.replace(/\/+/g, '/')}
                  alt="G-One Media Work"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            {/* Floating UI element */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 z-20 glass-card p-4 rounded-2xl border-white/10 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center">
                  <div className="w-5 h-5 bg-cyan-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Consultation</p>
                  <p className="text-xs font-bold">Systems Online</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -inset-8 bg-fuchsia-500/20 blur-[100px] -z-10 opacity-50 animate-pulse" />
          </motion.div>

          {/* Content - Second on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-4 tracking-tighter">
              <span className="text-white"><span className="text-[1.3em] select-none">W</span>e Help Businesses</span>{' '}
              <span className="w-gradient-animated-dark">Grow with</span>{' '}
              <span className="w-gradient-animated">High-Converting</span>{' '}
              <span className="w-gradient-animated-dark">Websites</span>
            </h1>

            <p className="text-base md:text-lg mb-8 leading-relaxed max-w-130" style={{ color: 'var(--text-secondary)' }}>
              G-One Media bridges the gap between Sophisticated Engineering and Compelling Visual Narratives. We design and build elite Digital Ecosystems engineered to capture attention, command authority, and accelerate business growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                to="/get-started"
                className="btn-primary hero-get-started flex items-center justify-center gap-3 group shadow-2xl shadow-cyan-500/40 px-7! py-3.5!"
              >
                Get Started
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
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-50 text-(--text-secondary)">
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

              <div className="h-4 w-px bg-white/10 hidden sm:block" />

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

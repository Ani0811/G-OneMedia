import { motion } from 'framer-motion'
import { Instagram, Linkedin, Youtube, Mail, MessageCircle, MapPin, ArrowUpRight, Phone } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import LegalModal from './LegalModal'

export default function Footer() {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const navigate = useNavigate()
  const [legalModalType, setLegalModalType] = useState(null)

  const scrollToSection = (e, id) => {
    e.preventDefault()

    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      return
    }

    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const capabilities = [
    { label: 'Web & App Engineering', id: 'pricing' },
    { label: 'Custom SaaS & MVPs', id: 'pricing' },
    { label: 'AI & Workflow Automations', id: 'pricing' },
    { label: 'High-Converting Landing Pages', id: 'pricing' },
    { label: 'Performance & Growth Systems', id: 'pricing' },
  ]

  const ecosystemLinks = [
    { label: 'About The Agency', type: 'anchor', target: 'about' },
    { label: 'Featured Portfolio', type: 'anchor', target: 'portfolio' },
    { label: 'Pricing & Retainers', type: 'anchor', target: 'pricing' },
    { label: 'Verified Client Reviews', type: 'route', target: '/reviews' },
    { label: '1:1 Discovery Call', type: 'route', target: '/discovery' },
    { label: 'Resource Vault', type: 'route', target: '/vault' },
  ]

  return (
    <footer className="relative pt-16 md:pt-28 pb-10 overflow-hidden border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)' }}>
      {/* Ambient Cyber Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent opacity-60" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-200 h-100 bg-cyan-500/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14 md:mb-18">
          
          {/* Column 1: Brand & Bio (4 cols on lg) */}
          <div className="flex flex-col gap-6 lg:col-span-4 lg:pr-6">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault()
                if (location.pathname !== '/') {
                  navigate('/')
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="inline-block w-fit focus:outline-none"
            >
              <img 
                src={`${import.meta.env.BASE_URL}G-One.png`.replace(/\/+/g, '/')} 
                alt="G-One Media Logo" 
                className="h-11 w-auto object-contain object-left block origin-left drop-shadow-[0_0_15px_rgba(0,240,255,0.15)]" 
                style={{ filter: theme === 'light' ? 'invert(1)' : 'none' }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerText = 'G-One Media'
                }}
              />
            </a>
            
            <p className="text-sm md:text-[15px] leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              Engineering high-performance digital ecosystems that captivate and convert. We blend cinematic aesthetics with scalable, cutting-edge code.
            </p>

            {/* Squircle Social Badges */}
            <div className="flex items-center gap-3 mt-1">
              <a 
                href="https://www.instagram.com/g1mediaofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 backdrop-blur-xs flex items-center justify-center text-[var(--text-muted)] hover:text-fuchsia-400 hover:border-fuchsia-400/50 hover:bg-fuchsia-400/10 hover:shadow-[0_0_15px_rgba(255,0,229,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/g-one-media-agency-93581040b/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 backdrop-blur-xs flex items-center justify-center text-[var(--text-muted)] hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://www.youtube.com/@G-OneMedia" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 backdrop-blur-xs flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Capabilities / Solutions (3 cols on lg) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">// CAPABILITIES</span>
              <div className="h-0.5 w-7 bg-linear-to-r from-cyan-400 to-transparent rounded-full mt-2" />
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              {capabilities.map((item) => (
                <a 
                  key={item.label} 
                  href={`#${item.id}`} 
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="group flex items-center gap-2.5 text-sm transition-all duration-300 hover:text-cyan-400 hover:translate-x-1.5 w-fit" 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/30 group-hover:bg-cyan-400 group-hover:scale-125 transition-all duration-300 shrink-0" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Ecosystem / Navigation (2.5 cols on lg) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-widest text-fuchsia-400 uppercase">// ECOSYSTEM</span>
              <div className="h-0.5 w-7 bg-linear-to-r from-fuchsia-400 to-transparent rounded-full mt-2" />
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              {ecosystemLinks.map((item) => (
                item.type === 'anchor' ? (
                  <a 
                    key={item.label} 
                    href={`#${item.target}`} 
                    onClick={(e) => scrollToSection(e, item.target)}
                    className="group flex items-center gap-2.5 text-sm transition-all duration-300 hover:text-fuchsia-400 hover:translate-x-1.5 w-fit" 
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/30 group-hover:bg-fuchsia-400 group-hover:scale-125 transition-all duration-300 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.target}
                    className="group flex items-center gap-2.5 text-sm transition-all duration-300 hover:text-fuchsia-400 hover:translate-x-1.5 w-fit"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/30 group-hover:bg-fuchsia-400 group-hover:scale-125 transition-all duration-300 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Column 4: Direct Dispatch / Contact (3 cols on lg) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">// DIRECT DISPATCH</span>
              <div className="h-0.5 w-7 bg-linear-to-r from-cyan-400 to-transparent rounded-full mt-2" />
            </div>

            <div className="flex flex-col gap-3.5 mt-1">
              {/* Location */}
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} className="text-cyan-400" />
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Location</div>
                  <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Kolkata, WB, India</span>
                  <span className="block text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>HQ • Global Remote</span>
                </div>
              </div>

              {/* Direct Email */}
              <a 
                href="mailto:anirudha.basuthakur@gmail.com" 
                className="flex items-start gap-3 text-sm group transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/15 flex items-center justify-center shrink-0 mt-0.5 transition-all">
                  <Mail size={15} className="text-cyan-400" />
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-mono uppercase tracking-wider mb-1 group-hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-muted)' }}>Direct Inquiry</div>
                  <span className="font-medium text-sm group-hover:text-cyan-400 transition-colors break-all" style={{ color: 'var(--text-primary)' }}>
                    anirudha.basuthakur@gmail.com
                  </span>
                </div>
              </a>

              {/* Founders WhatsApp Dispatch */}
              <div className="pt-2 flex flex-col gap-2">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Founders Instant Chat
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="https://wa.me/919875417275" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 hover:bg-cyan-400/10 hover:border-cyan-400/40 text-xs font-medium transition-all group"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <MessageCircle size={13} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Anirudha</span>
                  </a>
                  <a 
                    href="https://wa.me/918017790952" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 hover:bg-fuchsia-400/10 hover:border-fuchsia-400/40 text-xs font-medium transition-all group"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <MessageCircle size={13} className="text-fuchsia-400 group-hover:scale-110 transition-transform" />
                    <span>Vasudev</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Sub-Footer / Bottom Bar */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Copyright & Location Lineage */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>
              &copy; {currentYear} G-One Media Agency. All rights reserved.
            </p>
            <span className="hidden sm:inline text-xs opacity-30" style={{ color: 'var(--text-muted)' }}>|</span>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Engineered in India <span className="text-cyan-400/80">•</span> Deployed Worldwide
            </p>
          </div>

          {/* Legal Links (Sub-footer) */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            {[
              { label: 'Privacy Policy', type: 'privacy' },
              { label: 'Terms of Service', type: 'terms' },
              { label: 'Cookie Policy', type: 'cookies' },
              { label: 'Refund Policy', type: 'refund' }
            ].map((item) => (
              <button 
                key={item.label} 
                onClick={() => setLegalModalType(item.type)}
                className="transition-colors hover:text-cyan-400 cursor-pointer" 
                style={{ color: 'var(--text-muted)' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Systems Online Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-cyan-400">Systems Online</span>
          </div>
        </div>
      </div>
      
      <LegalModal 
        isOpen={!!legalModalType} 
        onClose={() => setLegalModalType(null)} 
        type={legalModalType} 
      />
    </footer>
  )
}

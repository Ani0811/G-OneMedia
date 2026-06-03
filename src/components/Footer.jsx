import { motion } from 'framer-motion'
import { Instagram, Linkedin, Youtube, Mail, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
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

  const exploreLinks = [
    { label: 'About Us', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Our Portfolio', id: 'portfolio' },
    { label: 'Pricing Plans', id: 'pricing' }
  ]
  const exploreRoutes = [
    { label: 'Client Reviews', path: '/reviews' },
    { label: 'Discovery Call', path: '/discovery' }
  ]

  return (
    <footer className="relative pt-16 md:pt-32 pb-10 overflow-hidden border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)' }}>
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-200 h-100 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8 mb-12 md:mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:pr-8 col-span-2 md:col-span-1 lg:col-span-1">
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
              className="inline-block"
            >
              <img 
                src={`${import.meta.env.BASE_URL}G-One.png`.replace(/\/+/g, '/')} 
                alt="G-One Media Logo" 
                className="h-12 w-44 object-contain object-left block origin-left" 
                style={{ filter: theme === 'light' ? 'invert(1)' : 'none' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerText = 'G-One Media';
                }}
              />
            </a>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Engineering digital ecosystems that captivate and convert. We blend cinematic visuals with high-performance code.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a 
                href="https://www.instagram.com/g1mediaofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full border border-[var(--border-subtle)] flex items-center justify-center hover:text-fuchsia-400 hover:border-fuchsia-400/50 hover:bg-fuchsia-400/10 hover:scale-110 active:scale-95 transition-all duration-300" 
                style={{ color: 'var(--text-muted)' }}
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/g-one-media-agency-93581040b/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full border border-[var(--border-subtle)] flex items-center justify-center hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-110 active:scale-95 transition-all duration-300" 
                style={{ color: 'var(--text-muted)' }}
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.youtube.com/@G-OneMedia" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full border border-[var(--border-subtle)] flex items-center justify-center hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 hover:scale-110 active:scale-95 transition-all duration-300" 
                style={{ color: 'var(--text-muted)' }}
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 col-span-1">
            <h4 className="font-bold mb-2 uppercase tracking-widest text-base">Explore</h4>
            {exploreLinks.map((item) => (
              <a 
                key={item.label} 
                href={`#${item.id}`} 
                onClick={(e) => scrollToSection(e, item.id)}
                className="text-base transition-all duration-300 hover:text-cyan-400 hover:translate-x-1 inline-block w-fit" 
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </a>
            ))}
            {exploreRoutes.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-base transition-all duration-300 hover:text-cyan-400 hover:translate-x-1 inline-block w-fit"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4 col-span-1">
            <h4 className="font-bold mb-2 uppercase tracking-widest text-base">Legal</h4>
            {[
              { label: 'Privacy Policy', type: 'privacy' },
              { label: 'Terms of Service', type: 'terms' },
              { label: 'Cookie Policy', type: 'cookies' }
            ].map((item) => (
              <button 
                key={item.label} 
                onClick={() => setLegalModalType(item.type)}
                className="text-base transition-all duration-300 hover:text-fuchsia-400 hover:translate-x-1 inline-block w-fit text-left cursor-pointer" 
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="font-bold mb-2 uppercase tracking-widest text-base">Connect</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <a 
                href="https://wa.me/919875417275" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-cyan-400 transition-all duration-300 group px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] hover:border-cyan-400/40 w-full"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 group-hover:border-cyan-400/50 transition-all shrink-0">
                  <MessageCircle size={15} className="text-cyan-400" />
                </div>
                <span className="font-medium tracking-wide">Chat with Anirudha</span>
              </a>
              <a 
                href="https://wa.me/918017790952" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-fuchsia-400 transition-all duration-300 group px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] hover:border-fuchsia-400/40 w-full"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="w-8 h-8 rounded-lg bg-fuchsia-400/10 flex items-center justify-center border border-fuchsia-400/20 group-hover:border-fuchsia-400/50 transition-all shrink-0">
                  <MessageCircle size={15} className="text-fuchsia-400" />
                </div>
                <span className="font-medium tracking-wide">Chat with Vasudev</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-sm font-medium tracking-wide text-left" style={{ color: 'var(--text-muted)' }}>
            &copy; {currentYear} G-One Media Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-bold tracking-widest uppercase text-cyan-400">Systems Online</span>
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

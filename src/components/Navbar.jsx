import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Navbar({ onScheduleCall }) {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [activeSection, setActiveSection] = useState('')
  
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)

    // Intersection Observer for Active Section
    const sections = ['services', 'portfolio', 'pricing', 'testimonials', 'about', 'contact']
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    if (location.pathname === '/') {
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) observer.observe(element)
      })
    } else {
      setActiveSection('')
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [location.pathname])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    setMobileMenuOpen(false)

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

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl' : 'py-6 bg-transparent'
      }`}
      style={isScrolled ? { background: 'var(--bg-glass)' } : {}}
    >
      <div className="container-custom flex items-center justify-between">
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
          className="flex items-center relative" 
          style={{ color: 'var(--text-primary)' }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}G-One.png`.replace(/\/+/g, '/')} 
            alt="G-One Media Logo" 
            className="h-10 w-36 object-contain object-left block relative z-10 origin-left" 
            style={{ filter: theme === 'light' ? 'invert(1)' : 'none' }}
            onError={(e) => {
              console.error("Logo failed to load", e.target.src);
              e.target.style.display = 'none';
              e.target.parentElement.innerText = 'G-One Media';
            }}
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center md:gap-6 lg:gap-10">
          {['Services', 'Portfolio', 'Pricing', 'Testimonials', 'About', 'Contact'].map((item) => {
            const id = item.toLowerCase()
            const isActive = activeSection === id
            
            return (
              <a 
                key={item} 
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className={`text-sm font-bold transition-all duration-300 relative group py-2`}
                style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
              >
                {item}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'
                  }`}
                />
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors hover:bg-white/5"
            style={{ color: 'var(--text-primary)' }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <a 
            href="#contact"
            onClick={(e) => scrollToSection(e, 'contact')}
            className="hidden md:flex btn-primary py-2.5! text-sm! px-6! items-center justify-center"
          >
            Get Started
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-primary)' }}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-8 md:hidden shadow-2xl backdrop-blur-3xl max-h-[calc(100vh-80px)] overflow-y-auto"
            style={{ 
              background: theme === 'dark' ? 'rgba(10, 10, 15, 0.98)' : 'rgba(255, 255, 255, 0.98)', 
              borderBottom: '1px solid var(--border-subtle)' 
            }}
          >
            <div className="flex flex-col gap-6">
              {['Services', 'Portfolio', 'Pricing', 'Testimonials', 'About', 'Contact'].map((item) => {
                const id = item.toLowerCase()
                const isActive = activeSection === id
                return (
                  <a 
                    key={item} 
                    href={`#${id}`}
                    onClick={(e) => scrollToSection(e, id)}
                    className={`text-2xl font-black py-4 border-b border-white/5 last:border-0 flex items-center justify-between transition-all`}
                    style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)' }}
                  >
                    {item}
                    {isActive && <motion.div layoutId="activeDot" className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />}
                  </a>
                )
              })}
              <Link
                to="/discovery"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-black py-4 border-b border-white/5 flex items-center justify-between transition-all"
                style={{ color: location.pathname === '/discovery' ? 'var(--accent-blue)' : 'var(--text-primary)' }}
              >
                Discovery Call
              </Link>
              <a 
                href="#contact"
                onClick={(e) => {
                  setMobileMenuOpen(false)
                  scrollToSection(e, 'contact')
                }}
                className="btn-primary w-full flex items-center justify-center"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

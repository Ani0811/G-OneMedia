import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Terminal, Camera, Linkedin, Github, Mail, Instagram, Youtube } from 'lucide-react'

const founders = [
  {
    slug: 'anirudha',
    name: 'Anirudha Basu Thakur',
    role: 'Co-Founder & Lead Engineer',
    icon: Terminal,
    image: 'Anirudha.jpeg',
    color: 'cyan',
    email: 'anirudha.basuthakur@gmail.com',
    socials: [
      { name: 'GitHub', url: 'https://github.com/Ani0811', icon: Github },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/anirudha-basu-thakur-686aa8253', icon: Linkedin },
      { name: 'Instagram', url: 'https://www.instagram.com/this_is_ringo_here/', icon: Instagram }
    ]
  },
  {
    slug: 'vasudev',
    name: 'Vasudev Sharma',
    role: 'Founder & Agency Owner',
    icon: Camera,
    image: 'Vasudev.jpeg',
    color: 'fuchsia',
    email: 'vasudevsharma997@gmail.com',
    socials: [
      { name: 'YouTube', url: 'https://www.youtube.com/@vasudevsharma1', icon: Youtube },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/vasudev-sharma-a8b4ab22a', icon: Linkedin },
      { name: 'Instagram', url: 'https://www.instagram.com/vasudev.sharma5/', icon: Instagram }
    ]
  }
]

export default function About() {
  const navigate = useNavigate()

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)] -z-10" />

      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400"
          >
            The Duo Behind G-One Media
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tightest"
          >
            Meet the <span className="gradient-text">Founders</span>
          </motion.h2>
          <p className="text-sm opacity-50 uppercase tracking-widest text-center mb-8">Click a photo to read the full bio</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Connecting Line (Nokia Style) */}
          <div className="hidden md:block absolute top-35 left-1/2 -translate-x-1/2 w-50 z-0 pointer-events-none">
            <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
              <motion.path
                d="M0 20 Q 50 0, 100 20 T 200 20"
                stroke="url(#nokiaGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10 10"
                initial={{ strokeDashoffset: 100, opacity: 0 }}
                whileInView={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{
                  strokeDashoffset: { duration: 10, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 1 }
                }}
              />
              <defs>
                <linearGradient id="nokiaGradient" x1="0" y1="20" x2="200" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--accent-blue)" />
                  <stop offset="1" stopColor="var(--accent-purple)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Founders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-40 mb-24 relative z-10">
            {founders.map((founder, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`relative w-full aspect-square max-w-70 mb-6 group cursor-pointer transition-all duration-500 rounded-[40px] ${founder.color === 'cyan' ? 'hover:ring-2 hover:ring-cyan-400 hover:ring-offset-2 hover:ring-offset-[var(--bg-deep)]' : 'hover:ring-2 hover:ring-fuchsia-400 hover:ring-offset-2 hover:ring-offset-[var(--bg-deep)]'}`}
                    onClick={() => navigate(`/about/${founder.slug}`)}
                  >
                    <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/10">
                      <img
                        src={`${import.meta.env.BASE_URL}${founder.image}`.replace(/\/+/g, '/')}
                        alt={founder.name}
                        className="w-full h-full object-cover profile-crop transition-all duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <h3 className={`text-xl md:text-2xl font-bold mb-1 tracking-tight text-center transition-colors group-hover:${founder.color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>{founder.name}</h3>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-center opacity-70 mb-2 ${founder.color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>{founder.role}</p>
                  
                  {/* Email Address Link */}
                  <a 
                    href={`mailto:${founder.email}`} 
                    className={`text-xs text-(--text-muted) transition-colors mb-4 flex items-center gap-1.5 font-medium tracking-wide ${founder.color === 'cyan' ? 'hover:text-cyan-400' : 'hover:text-fuchsia-400'}`}
                  >
                    <Mail size={13} className="opacity-80" />
                    {founder.email}
                  </a>

                  {/* Social Media Links */}
                  <div className="flex gap-4 justify-center items-center opacity-80">
                    {founder.socials.map((social, i) => {
                      const Icon = social.icon
                      return (
                        <a key={i} href={social.url} target="_blank" rel="noreferrer" className={`${founder.color === 'cyan' ? 'hover:text-cyan-400' : 'hover:text-fuchsia-400'} transition-colors`}>
                          <Icon size={18} />
                        </a>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Collaborative Bullet Points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14 border-white/5 relative overflow-hidden shadow-lg shadow-black/25"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-cyan-400 to-fuchsia-500" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0 mt-1 border border-cyan-400/20">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-2">Aether Fusion</h4>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Merging high-end web engineering with cinematic storytelling to build dominant digital ecosystems.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-fuchsia-400/10 flex items-center justify-center shrink-0 mt-1 border border-fuchsia-400/20">
                    <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-2">Dual Expertise</h4>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Anirudha architects scalable web solutions while Vasudev crafts high-impact visual narratives.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0 mt-1 border border-cyan-400/20">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-2">Strategic Process</h4>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Seamless fusion of logic and art—moving from core goal identification to rapid prototyping.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-fuchsia-400/10 flex items-center justify-center shrink-0 mt-1 border border-fuchsia-400/20">
                    <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-2">Unified Intent</h4>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Bridging sophisticated code and compelling art to maximize business conversion and attention.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Terminal, Camera, Linkedin, Github, Mail, Instagram, Youtube, ExternalLink, Globe } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const getSocialIcon = (name) => {
  const n = (name || '').toLowerCase()
  if (n.includes('github')) return Github
  if (n.includes('linkedin')) return Linkedin
  if (n.includes('insta')) return Instagram
  if (n.includes('youtube')) return Youtube
  if (n.includes('mail')) return Mail
  return Globe
}

const defaultFounders = [
  {
    slug: 'anirudha',
    name: 'Anirudha Basu Thakur',
    role: 'Co-Founder & Lead Engineer',
    image: 'Anirudha.jpeg',
    accent_color: 'cyan',
    email: 'anirudha.basuthakur@gmail.com',
    socials: [
      { name: 'GitHub', url: 'https://github.com/Ani0811' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/anirudha-basu-thakur-686aa8253' },
      { name: 'Instagram', url: 'https://www.instagram.com/this_is_ringo_here/' }
    ]
  },
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
          setTeam(data)
        }
      } catch (err) {
        console.warn('Using default founders info:', err)
      }
    }
    fetchTeam()
  }, [])

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
            The Team Behind G-One Media
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tightest"
          >
            Meet the <span className="gradient-text">Founders & Leadership</span>
          </motion.h2>
          <p className="text-sm opacity-50 uppercase tracking-widest text-center mb-8">Click a photo to read the full bio</p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Team Grid */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-14 lg:gap-20 mb-24 relative z-10">
            {team.map((member, index) => {
              const color = member.accent_color || (index % 2 === 0 ? 'cyan' : 'fuchsia')
              const isCyan = color === 'cyan'
              const isPurple = color === 'violet' || color === 'purple'
              const isFuchsia = color === 'fuchsia'

              const imgSrc = member.image?.startsWith('http')
                ? member.image
                : `${import.meta.env.BASE_URL}${member.image}`.replace(/\/+/g, '/')

              return (
                <motion.div
                  key={member.slug || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col items-center w-full max-w-xs"
                >
                  <div 
                    className={`relative w-full aspect-square max-w-64 mb-6 group cursor-pointer transition-all duration-500 rounded-[36px] ${
                      isCyan 
                        ? 'hover:ring-2 hover:ring-cyan-400 hover:ring-offset-2 hover:ring-offset-[var(--bg-deep)]' 
                        : isPurple
                        ? 'hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-[var(--bg-deep)]'
                        : 'hover:ring-2 hover:ring-fuchsia-400 hover:ring-offset-2 hover:ring-offset-[var(--bg-deep)]'
                    }`}
                    onClick={() => navigate(`/about/${member.slug}`)}
                  >
                    <div className="relative h-full w-full rounded-[36px] overflow-hidden border border-white/10 bg-black/40">
                      <img
                        src={imgSrc}
                        alt={member.name}
                        className="w-full h-full object-cover profile-crop transition-all duration-700 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' }}
                      />
                    </div>
                  </div>
                  
                  <h3 
                    onClick={() => navigate(`/about/${member.slug}`)}
                    className={`text-xl md:text-2xl font-bold mb-1 tracking-tight text-center cursor-pointer transition-colors ${
                      isCyan ? 'hover:text-cyan-400' : isPurple ? 'hover:text-purple-400' : 'hover:text-fuchsia-400'
                    }`}
                  >
                    {member.name}
                  </h3>
                  
                  <p className={`text-[10px] font-black uppercase tracking-[0.25em] text-center opacity-80 mb-2 ${
                    isCyan ? 'text-cyan-400' : isPurple ? 'text-purple-400' : 'text-fuchsia-400'
                  }`}>
                    {member.role}
                  </p>
                  
                  {/* Email Link */}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`} 
                      className={`text-xs text-[var(--text-muted)] transition-colors mb-4 flex items-center gap-1.5 font-medium tracking-wide ${
                        isCyan ? 'hover:text-cyan-400' : isPurple ? 'hover:text-purple-400' : 'hover:text-fuchsia-400'
                      }`}
                    >
                      <Mail size={13} className="opacity-80" />
                      {member.email}
                    </a>
                  )}

                  {/* Social Media Links */}
                  {Array.isArray(member.socials) && member.socials.length > 0 && (
                    <div className="flex gap-4 justify-center items-center opacity-80">
                      {member.socials.map((social, i) => {
                        const Icon = getSocialIcon(social.name)
                        return (
                          <a 
                            key={i} 
                            href={social.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className={`transition-colors ${
                              isCyan ? 'hover:text-cyan-400' : isPurple ? 'hover:text-purple-400' : 'hover:text-fuchsia-400'
                            }`}
                            title={social.name}
                          >
                            <Icon size={18} />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Collaborative Values Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14 border-white/5 relative overflow-hidden shadow-lg shadow-black/25"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-fuchsia-500" />
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

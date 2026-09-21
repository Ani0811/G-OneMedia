import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Terminal, Camera, Linkedin, Github, Mail, Instagram, Youtube, ExternalLink, Globe, ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
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
  /*
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
  */
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

function SoloFounderSpotlight({ member, navigate }) {
  const imgSrc = member.image?.startsWith('http')
    ? member.image
    : `${import.meta.env.BASE_URL}${member.image}`.replace(/\/+/g, '/')

  const stats = (Array.isArray(member.stats) && member.stats.length > 0)
    ? member.stats
    : [
        { value: '50+', label: 'Projects Delivered' },
        { value: '1M+', label: 'Reach Generated' },
        { value: '4+ Yrs', label: 'Domain Mastery' }
      ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative max-w-5xl mx-auto rounded-[36px] p-6 sm:p-10 lg:p-12 border border-white/10 overflow-hidden mb-24 shadow-2xl backdrop-blur-2xl bg-[var(--bg-card)] group"
    >
      {/* Decorative ambient gradient backdrop & top accent beam */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-80" />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        {/* Left Column: Visual Showcase Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            onClick={() => navigate(`/about/${member.slug}`)}
            className="group/photo cursor-pointer relative w-full max-w-[320px] sm:max-w-[350px] aspect-[4/5] rounded-[30px] p-1.5 bg-gradient-to-b from-white/20 via-white/5 to-fuchsia-500/25 shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(217,70,239,0.3)] hover:scale-[1.01]"
          >
            <div className="relative h-full w-full rounded-[26px] overflow-hidden border border-white/10 bg-black/60">
              <img
                src={imgSrc}
                alt={member.name}
                className="w-full h-full object-cover profile-crop transition-all duration-700 group-hover/photo:scale-105"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Status Pill Badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Agency Owner</span>
              </div>

              {/* Bottom Quick Card on Photo */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-xl transition-all group-hover/photo:border-fuchsia-400/50">
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{member.name}</h4>
                  <p className="text-[10px] text-fuchsia-300 font-semibold tracking-wider uppercase">{member.role}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover/photo:bg-fuchsia-500 group-hover/photo:text-black transition-colors shrink-0">
                  <ArrowRight size={14} className="group-hover/photo:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Social Icons Strip Below Portrait */}
          <div className="flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="text-[var(--text-muted)] hover:text-fuchsia-400 transition-colors p-1.5 rounded-full hover:bg-white/5"
                title={member.email}
              >
                <Mail size={16} />
              </a>
            )}
            {Array.isArray(member.socials) &&
              member.socials.map((social, i) => {
                const Icon = getSocialIcon(social.name)
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--text-muted)] hover:text-fuchsia-400 transition-colors p-1.5 rounded-full hover:bg-white/5"
                    title={social.name}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
          </div>
        </div>

        {/* Right Column: Editorial Bio, Stats & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-black uppercase tracking-[0.25em] w-fit mb-4">
            <Sparkles size={12} />
            Leadership Spotlight
          </div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2">
            {member.name}
          </h3>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-400 mb-5">
            {member.role} · Creative Director & Strategist
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] mb-6 font-normal">
            Passionate about transforming ambitious brand visions into high-converting digital platforms and visual narratives. Over the past 4+ years, Vasudev has collaborated with creators, founders, and businesses to engineer digital ecosystems that build undeniable authority and drive measurable growth.
          </p>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
            {stats.map((st, i) => (
              <div key={i} className={`text-left ${i === 1 ? 'border-x border-white/5 px-3 sm:px-4' : i === 2 ? 'pl-1 sm:pl-2' : ''}`}>
                <div className={`text-2xl sm:text-3xl font-black ${i === 0 ? 'text-white' : i === 1 ? 'text-fuchsia-400' : 'text-cyan-400'}`}>
                  {st.value}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mt-0.5">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Core Pillars Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['Brand Architecture', 'Cinematic Visuals', 'Digital Strategy', 'Growth Marketing'].map((pillar) => (
              <span
                key={pillar}
                className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--text-secondary)]"
              >
                {pillar}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate(`/about/${member.slug}`)}
              className="btn-primary inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Explore Full Bio & Vision</span>
              <ArrowRight size={15} />
            </button>

            <a
              href="https://wa.me/918017790952"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-fuchsia-400/30 text-fuchsia-400 text-xs font-bold uppercase tracking-wider hover:bg-fuchsia-500/10 hover:border-fuchsia-400 transition-all cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

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
          // Temporarily filter out Anirudha to keep Vasudev Sharma central
          const activeTeam = data.filter((m) => m.slug !== 'anirudha')
          setTeam(activeTeam.length > 0 ? activeTeam : defaultFounders)
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400"
          >
            {/* The Team Behind G-One Media */}
            Leadership & Vision
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tightest"
          >
            {/* Meet the <span className="gradient-text">Founders & Leadership</span> */}
            Meet the <span className="gradient-text">Founder</span>
          </motion.h2>
          <p className="text-sm opacity-60 max-w-lg mx-auto tracking-wide">
            The creative force and strategic vision driving high-impact digital solutions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Conditional: Solo Founder Spotlight (1 member) vs Multi-member Team Grid (2+ members) */}
          {team.length === 1 ? (
            <SoloFounderSpotlight member={team[0]} navigate={navigate} />
          ) : (
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
        )}

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
                    {/* <h4 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-2">Dual Expertise</h4> */}
                    {/* <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Anirudha architects scalable web solutions while Vasudev crafts high-impact visual narratives.</p> */}
                    <h4 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-2">Creative Vision</h4>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Vasudev crafts high-impact visual narratives and digital solutions designed to convert.</p>
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

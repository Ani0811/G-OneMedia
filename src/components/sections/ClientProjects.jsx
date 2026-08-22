import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2, Sparkles, Layers } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const ensureAbsoluteUrl = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

export default function ClientProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClientProjects()
  }, [])

  const fetchClientProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('client_projects')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Error fetching client projects:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-cyan-400" />
      </div>
    )
  }

  if (projects.length === 0) {
    return null // Hide section if no client projects are live
  }

  return (
    <section id="client-projects" className="py-24 border-t border-white/5 bg-[var(--bg-deep)]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-3 bg-cyan-400/10 px-3.5 py-1.5 rounded-full border border-cyan-400/20 w-fit">
            Shipped Applications
          </span>
          <h2 className="text-3xl lg:text-4xl font-black mb-4 tracking-tight text-white">
            Client <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            A selection of live digital platforms, marketing sites, and full-stack solutions built and shipped for our partners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            const resolvedImage = project.image?.startsWith('http') || project.image?.startsWith('data:')
              ? project.image
              : `${import.meta.env.BASE_URL}${project.image?.replace(/^\//, '')}`.replace(/\/+/g, '/')

            const techList = Array.isArray(project.technologies)
              ? project.technologies
              : []

            return (
              <motion.a
                key={project.id}
                href={ensureAbsoluteUrl(project.live_url) || '#'}
                target={project.live_url ? '_blank' : undefined}
                rel={project.live_url ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group block rounded-3xl p-5 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  {/* Visual Image container */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 border border-white/5 bg-black/40">
                    <img
                      src={resolvedImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      loading="lazy"
                    />
                    {project.live_url && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <ExternalLink size={16} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Meta details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider text-cyan-400">
                        {project.category || 'Web Application'}
                      </span>
                      {project.client_name && (
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                          {project.client_name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.live_url && (
                        <ExternalLink size={14} className="text-[var(--text-muted)] group-hover:text-cyan-400 transition-colors shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tech Stack tags */}
                {techList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-white/5">
                    {techList.map((t, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-[var(--text-secondary)] border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

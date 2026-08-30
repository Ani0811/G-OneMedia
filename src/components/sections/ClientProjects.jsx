import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const ensureAbsoluteUrl = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

const ITEMS_PER_PAGE = 3

export default function ClientProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

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

  useEffect(() => {
    fetchClientProjects()
  }, [])

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

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE)
  const safeCurrentPage = Math.min(currentPage, totalPages || 1)
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
  const displayedProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const element = document.getElementById('client-projects')
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const isSingle = displayedProjects.length === 1

  return (
    <section id="client-projects" className="py-24 border-t border-white/5 bg-[var(--bg-deep)]">
      <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-3 bg-cyan-400/10 px-3.5 py-1.5 rounded-full border border-cyan-400/20 w-fit">
            Shipped Applications
          </span>
          <h2 className="text-3xl lg:text-5xl font-black mb-4 tracking-tight text-white">
            Client <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            A selection of live digital platforms, marketing sites, and full-stack solutions built and shipped for our partners.
          </p>
        </div>

        {/* Projects Cards Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`client-projects-page-${safeCurrentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className={
              isSingle
                ? 'w-full flex justify-center'
                : displayedProjects.length === 2
                ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full'
            }
          >
            {displayedProjects.map((project, idx) => {
              const resolvedImage = project.image?.startsWith('http') || project.image?.startsWith('data:')
                ? project.image
                : `${import.meta.env.BASE_URL}${project.image?.replace(/^\//, '')}`.replace(/\/+/g, '/')

              const techList = Array.isArray(project.technologies)
                ? project.technologies
                : []

              // Single featured layout for grand presentation when 1 project is displayed
              if (isSingle) {
                return (
                  <motion.a
                    key={project.id}
                    href={ensureAbsoluteUrl(project.live_url) || '#'}
                    target={project.live_url ? '_blank' : undefined}
                    rel={project.live_url ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="group block rounded-3xl p-6 sm:p-8 lg:p-10 bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all duration-500 relative w-full max-w-5xl shadow-2xl hover:shadow-[0_12px_40px_rgba(0,240,255,0.15)]"
                  >
                    <div className="grid md:grid-cols-12 gap-8 lg:gap-10 items-center">
                      {/* Left: Large Visual Showcase */}
                      <div className="md:col-span-7 relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-xl">
                        <img
                          src={resolvedImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                          loading="lazy"
                        />
                        {project.live_url && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                            <div className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.6)] transform scale-95 group-hover:scale-100 transition-transform duration-300">
                              <span>Open Live Platform</span>
                              <ExternalLink size={16} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Rich Project Details */}
                      <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-3.5 py-1.5 rounded-full border border-cyan-400/20">
                              {project.category || 'Web Application'}
                            </span>
                            {project.client_name && (
                              <span className="text-xs text-[var(--text-muted)] font-semibold">
                                {project.client_name}
                              </span>
                            )}
                          </div>

                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white group-hover:text-cyan-400 transition-colors mb-4 flex items-center gap-2.5">
                            <span>{project.title}</span>
                            {project.live_url && (
                              <ExternalLink size={20} className="text-[var(--text-muted)] group-hover:text-cyan-400 transition-colors shrink-0" />
                            )}
                          </h3>

                          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack tags */}
                        {techList.length > 0 && (
                          <div className="pt-5 border-t border-white/10">
                            <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--text-muted)] block mb-2.5">
                              Technologies & Frameworks
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {techList.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white border border-white/10 font-semibold"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.a>
                )
              }

              // Standard multi-card layout (2 or 3 cards)
              return (
                <motion.a
                  key={project.id}
                  href={ensureAbsoluteUrl(project.live_url) || '#'}
                  target={project.live_url ? '_blank' : undefined}
                  rel={project.live_url ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group block rounded-3xl p-6 sm:p-7 bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300 relative flex flex-col justify-between h-full w-full shadow-lg hover:shadow-[0_8px_30px_rgba(0,240,255,0.12)]"
                >
                  <div className="flex flex-col grow">
                    {/* Visual Image container */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border border-white/10 bg-black/40">
                      <img
                        src={resolvedImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        loading="lazy"
                      />
                      {project.live_url && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                          <div className="w-12 h-12 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <ExternalLink size={18} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Meta details */}
                    <div className="space-y-3 grow flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-md border border-cyan-400/20">
                          {project.category || 'Web Application'}
                        </span>
                        {project.client_name && (
                          <span className="text-xs text-[var(--text-muted)] font-medium">
                            {project.client_name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        {project.live_url && (
                          <ExternalLink size={16} className="text-[var(--text-muted)] group-hover:text-cyan-400 transition-colors shrink-0" />
                        )}
                      </div>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 grow">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack tags */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 mt-5 border-t border-white/5">
                      {techList.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-[var(--text-secondary)] border border-white/5 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.a>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-14">
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className={`w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                safeCurrentPage === 1
                  ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                  : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
              }`}
              style={{ color: safeCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}
              aria-label="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-11 h-11 rounded-xl text-xs font-black transition-all duration-300 border cursor-pointer ${
                  safeCurrentPage === page
                    ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-white hover:scale-105 hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className={`w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                safeCurrentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                  : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
              }`}
              style={{ color: safeCurrentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)' }}
              aria-label="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

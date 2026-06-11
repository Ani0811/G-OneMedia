import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Code2, Film, Bot, TrendingUp, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Code2,
    title: 'Web Engineering',
    slug: 'web-engineering',
    description: 'High-performance, scalable web solutions built with cutting-edge tech stacks for maximum speed and security.',
    bgImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
  }
]

export default function Services() {
  const navigate = useNavigate()

  return (
    <section id="services" className="relative pt-12 pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'var(--bg-deep)', opacity: 0.85 }} />
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="Services Background" 
          className="w-full h-full object-cover opacity-30 blur-sm scale-105" 
        />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-deep)] to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-deep)] to-transparent z-10" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Core <span className="gradient-text">Competencies</span></h2>
          <p className="max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>Specialized solutions engineered for measurable impact.</p>
        </div>

        <div className="flex justify-center max-w-xl md:max-w-2xl mx-auto w-full">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/services/${service.slug}`)}
              className="glass-card p-10 relative overflow-hidden group cursor-pointer hover:ring-1 hover:ring-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-300 w-full"
            >
              {/* Profound background image */}
              <div 
                className="absolute inset-0 -z-20 bg-cover bg-center opacity-15 dark:opacity-20 group-hover:opacity-35 dark:group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                style={{ backgroundImage: `url(${service.bgImage})` }}
              />

              {/* Theme-aware gradient overlay for maximum readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/85 to-[var(--bg-deep)]/20 opacity-90 group-hover:opacity-80 transition-opacity duration-500 -z-10 pointer-events-none" />

              {/* Hover highlight background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--border-subtle)', boxShadow: '0 0 15px rgba(0,240,255,0.2)' }}>
                  <service.icon size={24} className="text-cyan-400 group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors drop-shadow-sm">{service.title}</h3>
                <p className="leading-relaxed text-sm text-[var(--text-secondary)] transition-colors">
                  {service.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fuchsia-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 drop-shadow-[0_0_8px_rgba(255,0,229,0.6)]">
                  Explore Service <ArrowRightTiny />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArrowRightTiny() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  )
}

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, Palette, Clapperboard, Rocket, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'We learn your goals, audience, and brand identity through deep-dive sessions and market analysis.',
    details: ['Stakeholder interviews', 'Competitor analysis', 'Technical requirements', 'Project roadmap'],
  },
  {
    icon: Palette,
    title: 'Design & Build',
    description: 'Wireframes to pixel-perfect, responsive websites with custom interactions and premium aesthetics.',
    details: ['UI/UX wireframing', 'Design system creation', 'Responsive development', 'Code reviews'],
  },
  {
    icon: Clapperboard,
    title: 'Content & Media',
    description: 'Engaging video content, brand assets, and marketing collateral crafted for your brand.',
    details: ['Video production', 'Motion graphics', 'Brand guidelines', 'Social media assets'],
  },
  {
    icon: Rocket,
    title: 'Launch & Scale',
    description: 'Deploy, optimize, and watch your business grow with ongoing support and iteration.',
    details: ['Performance testing', 'SEO optimization', 'Analytics setup', 'Post-launch support'],
  },
]

export default function Process() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  })

  // The glowing line grows as user scrolls
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="process">
      <div className="container-custom">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Our <span className="gradient-text">Process</span>
          </motion.h2>
          <p className="max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A streamlined workflow designed for speed and quality.
          </p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative max-w-3xl mx-auto">
          {/* Static background track */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2"
            style={{ background: 'var(--border-subtle)' }}
          />

          {/* Animated glowing progress line */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 w-[2px] md:-translate-x-1/2 origin-top"
            style={{
              height: lineHeight,
              background: 'linear-gradient(to bottom, #00f0ff, #ff00e5)',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.2)',
            }}
          />

          {/* Step Nodes */}
          <div className="space-y-16 md:space-y-24 relative">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Node circle on the timeline */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center"
                    style={{
                      borderColor: 'var(--bg-deep)',
                      background: 'linear-gradient(135deg, #00f0ff 0%, #ff00e5 100%)',
                      boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
                    }}
                  >
                    <span className="text-xs font-black text-black">0{index + 1}</span>
                  </motion.div>

                  {/* Content Card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-40px)] ${
                    isEven ? 'md:pr-4' : 'md:pl-4 md:ml-auto'
                  }`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="glass-card p-6 lg:p-8 group hover:border-cyan-500/30 transition-all"
                    >
                      {/* Icon & Title */}
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                          style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--border-subtle)' }}
                        >
                          <step.icon size={20} className="text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]" />
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                        {step.description}
                      </p>

                      {/* Detail checklist */}
                      <div className="space-y-2.5">
                        {step.details.map((detail, di) => (
                          <motion.div
                            key={di}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + di * 0.1 }}
                            className="flex items-center gap-2.5 text-xs"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <CheckCircle size={14} className="text-cyan-400/60 shrink-0" />
                            {detail}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Code2, Bot, Video, Rocket, Calendar, Database, Server, Smartphone, Globe, Workflow, Activity, Layout, Zap, MessageSquare, Share2, Layers, Search, PenTool, Clapperboard, MonitorPlay, PlaySquare, Settings, Target, TrendingUp, Users, BarChart } from 'lucide-react'
import { useEffect } from 'react'

const services = {
  'web-engineering': {
    icon: Code2,
    title: 'Web Engineering',
    tagline: 'High-performance digital products built to scale',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    gradient: 'from-cyan-900/40 via-blue-900/20 to-[#050508]',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-400/10',
    accentBorder: 'border-cyan-400/20',
    accentGlow: 'shadow-[0_0_30px_rgba(0,240,255,0.2)]',
    description:
      'We architect and build robust, scalable web applications using modern technology stacks. From fast landing pages to complex SaaS platforms, every product is engineered for performance, security, and long-term maintainability.',
    features: [
      { text: 'Full-stack React / Next.js development', icon: Layout },
      { text: 'E-commerce with integrated payment gateways (Razorpay, Stripe)', icon: Globe },
      { text: 'Real-time features via WebSockets and SSE', icon: Zap },
      { text: 'REST & GraphQL API design and development', icon: Server },
      { text: 'PostgreSQL / Supabase database architecture', icon: Database },
      { text: 'CI/CD pipelines and cloud deployment (Vercel, Render, AWS)', icon: Workflow },
      { text: 'Performance optimization — 90+ Lighthouse scores', icon: Activity },
      { text: 'Accessibility-first and mobile-responsive design', icon: Smartphone },
    ],
    process: [
      { step: '01', title: 'Discovery & Architecture', desc: 'We map out your requirements, tech stack, and system design before writing a single line of code.' },
      { step: '02', title: 'Build & Iterate', desc: 'Agile sprints with weekly demos. You see real progress, not promises.' },
      { step: '03', title: 'Launch & Handoff', desc: 'Full deployment, documentation, and a knowledge-transfer session so your team owns it.' },
    ],
    priceRange: '₹25,000 – ₹2,00,000+',
    timeline: '2 – 8 weeks',
  },
  'ai-agents': {
    icon: Bot,
    title: 'AI Agents',
    tagline: 'Intelligent automation that works while you sleep',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
    gradient: 'from-fuchsia-900/40 via-purple-900/20 to-[#050508]',
    accentColor: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-400/10',
    accentBorder: 'border-fuchsia-400/20',
    accentGlow: 'shadow-[0_0_30px_rgba(217,70,239,0.2)]',
    description:
      'We build custom AI agents and automation pipelines powered by the latest large language models. From customer support bots to autonomous data pipelines, our agents handle repetitive work so your team can focus on what matters.',
    features: [
      { text: 'Custom chatbots on Gemini, GPT-4o, Claude APIs', icon: MessageSquare },
      { text: 'WhatsApp, Telegram, and web channel integrations', icon: Share2 },
      { text: 'RAG pipelines with your own knowledge base', icon: Layers },
      { text: 'Human-in-the-loop escalation and handoff flows', icon: Users },
      { text: 'Multi-agent orchestration for complex workflows', icon: Workflow },
      { text: 'Structured output parsing and function calling', icon: Code2 },
      { text: 'Automated reporting and data analysis agents', icon: BarChart },
      { text: 'Webhook-driven event automation', icon: Zap },
    ],
    process: [
      { step: '01', title: 'Use Case Definition', desc: 'We identify the highest-ROI automation opportunities and define success metrics.' },
      { step: '02', title: 'Prototype & Train', desc: 'A working prototype in 5–7 days. We fine-tune on your data until it performs.' },
      { step: '03', title: 'Deploy & Monitor', desc: 'Production deployment with logging, error tracking, and ongoing optimisation.' },
    ],
    priceRange: '₹15,000 – ₹1,50,000+',
    timeline: '1 – 4 weeks',
  },
  'content-creation': {
    icon: Video,
    title: 'Content Creation',
    tagline: 'Cinematic storytelling that captures and converts',
    image: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2071&auto=format&fit=crop',
    gradient: 'from-orange-900/40 via-rose-900/20 to-[#050508]',
    accentColor: 'text-orange-400',
    accentBg: 'bg-orange-400/10',
    accentBorder: 'border-orange-400/20',
    accentGlow: 'shadow-[0_0_30px_rgba(251,146,60,0.2)]',
    description:
      'We produce professional video content that tells your brand story and drives measurable engagement. From high-energy Instagram Reels to cinematic YouTube productions, every frame is crafted with intent.',
    features: [
      { text: 'Instagram Reels and short-form content', icon: Smartphone },
      { text: 'YouTube videos with custom motion graphics', icon: MonitorPlay },
      { text: 'Cinematic brand films and product showcases', icon: Clapperboard },
      { text: 'Vlog series and documentary-style content', icon: PlaySquare },
      { text: 'Script writing and storyboarding', icon: PenTool },
      { text: 'Professional colour grading and sound design', icon: Settings },
      { text: 'Thumbnail and cover art design', icon: Layout },
      { text: 'Content calendar planning and strategy', icon: Calendar },
    ],
    process: [
      { step: '01', title: 'Brief & Storyboard', desc: 'We develop a creative brief, script, and storyboard aligned with your brand goals.' },
      { step: '02', title: 'Production', desc: 'Filming, motion graphics, and editing with multiple revision rounds.' },
      { step: '03', title: 'Delivery & Optimisation', desc: 'Export in all required formats with publishing strategy recommendations.' },
    ],
    priceRange: '₹8,000 – ₹80,000 per project',
    timeline: '3 – 14 days',
  },
  'digital-consultation': {
    icon: Rocket,
    title: 'Digital Consultation',
    tagline: 'Data-driven strategy to scale your digital presence',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    gradient: 'from-emerald-900/40 via-teal-900/20 to-[#050508]',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-400/10',
    accentBorder: 'border-emerald-400/20',
    accentGlow: 'shadow-[0_0_30px_rgba(52,211,153,0.2)]',
    description:
      'Strategic digital guidance for businesses ready to scale. We audit your existing digital infrastructure, identify growth bottlenecks, and build an actionable roadmap to increase reach, leads, and revenue.',
    features: [
      { text: 'Full digital audit (website, SEO, social, analytics)', icon: Search },
      { text: 'Competitor and market landscape analysis', icon: Target },
      { text: 'Growth roadmap with prioritised action items', icon: TrendingUp },
      { text: 'Marketing automation strategy', icon: Zap },
      { text: 'Conversion rate optimisation (CRO)', icon: Activity },
      { text: 'Social media strategy and content calendar', icon: Share2 },
      { text: 'Google Analytics 4 setup and custom dashboards', icon: BarChart },
      { text: 'Monthly performance reviews and iteration', icon: Users },
    ],
    process: [
      { step: '01', title: 'Audit & Research', desc: 'A deep dive into your current state — analytics, competitors, audience, and tech stack.' },
      { step: '02', title: 'Strategy Development', desc: 'A prioritised 90-day roadmap with specific, measurable goals.' },
      { step: '03', title: 'Execution Support', desc: 'Ongoing support as you implement — weekly check-ins and monthly reviews.' },
    ],
    priceRange: '₹10,000 – ₹50,000/month',
    timeline: 'Ongoing engagement',
  },
}

export default function ServiceDetail({ onScheduleCall }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const service = services[slug]

  // Fix scroll bug
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!service) {
    return (
      <section className="py-32">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Service Not Found
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            This service page doesn't exist yet.
          </p>
          <Link to="/#services" className="btn-primary inline-block">← Back to Services</Link>
        </div>
      </section>
    )
  }

  const Icon = service.icon

  // Custom hover classes matching the service accent color
  const accentHoverClasses = {
    'text-cyan-400': 'hover:text-cyan-400 hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    'text-fuchsia-400': 'hover:text-fuchsia-400 hover:border-fuchsia-400/30 hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]',
    'text-orange-400': 'hover:text-orange-400 hover:border-orange-400/30 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    'text-emerald-400': 'hover:text-emerald-400 hover:border-emerald-400/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  }
  const hoverClass = accentHoverClasses[service.accentColor] || 'hover:text-cyan-400 hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]';

  return (
    <section className="pt-28 pb-24 relative min-h-screen">
      {/* Background Ambient Glow */}
      <div className={`absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b ${service.gradient} opacity-30 -z-20`} />

      <div className="container-custom">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12 mt-4 relative z-30">
          <button
            onClick={() => navigate(-1)}
            className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${hoverClass}`}
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back</span>
          </button>
        </motion.div>

        {/* Header Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${service.accentBg} border ${service.accentBorder} ${service.accentGlow}`}>
              <Icon size={28} className={service.accentColor} />
            </div>
            <div className={`inline-block text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full mb-4 ${service.accentBg} ${service.accentColor} border ${service.accentBorder} w-fit`}>
              Service
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              {service.title}
            </h1>
            <p className={`text-xl font-semibold mb-6 ${service.accentColor}`}>{service.tagline}</p>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={onScheduleCall}
                className="btn-primary inline-flex items-center justify-center gap-3 group px-7! py-3.5!"
              >
                <Calendar size={18} />
                Schedule a Call
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/get-started"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-7! py-3.5!"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>

          {/* Right Side Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 mt-8 lg:mt-0"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl p-2" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}>
              <div className="rounded-[32px] overflow-hidden aspect-[4/3]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            {/* Ambient glow behind the image */}
            <div className={`absolute -inset-10 bg-gradient-to-tr ${service.gradient} blur-[80px] -z-10 opacity-60`} />
          </motion.div>
        </div>

        {/* Two-column: Features + Process */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20 relative z-30">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 lg:p-10"
          >
            <h2 className="text-2xl font-black mb-8" style={{ color: 'var(--text-primary)' }}>
              What's <span className="gradient-text">Included</span>
            </h2>
            <ul className="space-y-4">
              {service.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${service.accentBg} border ${service.accentBorder}`}>
                    <feature.icon size={14} className={service.accentColor} />
                  </div>
                  <span className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {feature.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Process + Pricing */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="glass-card p-8 lg:p-10"
            >
              <h2 className="text-2xl font-black mb-8" style={{ color: 'var(--text-primary)' }}>
                Our <span className="gradient-text">Process</span>
              </h2>
              <div className="space-y-6">
                {service.process.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5"
                  >
                    <div className={`text-2xl font-black leading-none flex-shrink-0 ${service.accentColor} opacity-40`}>
                      {step.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pricing card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`glass-card p-8 border ${service.accentBorder} ${service.accentGlow}`}
            >
              <h3 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                Investment Range
              </h3>
              <div className={`text-2xl font-black mb-2 ${service.accentColor}`}>{service.priceRange}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Typical timeline: <span style={{ color: 'var(--text-secondary)' }}>{service.timeline}</span>
              </div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Final pricing depends on scope, complexity, and integrations. Book a free discovery call for a custom quote.
              </p>
            </motion.div>
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 lg:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-50 z-0`} />
          <img 
            src={service.image} 
            alt="CTA Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105 -z-10"
          />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to get started?
            </h2>
            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Book a free 30-minute discovery call. We'll scope your project and send you a no-obligation quote within 24 hours.
            </p>
            <button
              onClick={onScheduleCall}
              className="btn-primary inline-flex items-center gap-3 group px-8! py-4!"
            >
              <Calendar size={20} />
              Book Free Discovery Call
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Zap, Building2, Layout, Video, Cpu, Target, Clock } from 'lucide-react'
import PaymentModal from '../features/PaymentModal'

const pricingData = {
  'Websites & Apps': {
    icon: Layout,
    packages: [
      {
        name: 'Starter', icon: Sparkles,
        price: { INR: '₹10,000', USD: '$150', EUR: '€140' },
        period: '/ project',
        duration: '3 - 5 days',
        description: 'Perfect for local businesses',
        features: ['Up to 5 Pages', 'Responsive Design', 'Contact Form', 'Basic SEO']
      },
      {
        name: 'Growth', icon: Zap,
        price: { INR: '₹20,000', USD: '$250', EUR: '€230' },
        period: '/ project',
        duration: '1 - 2 weeks',
        description: 'For scaling companies',
        features: ['Custom UI Design', 'CMS Integration', 'Advanced Animations', 'Performance Optimization']
      },
      {
        name: 'Premium', icon: Building2,
        price: { INR: '₹50,000', USD: '$600', EUR: '€550' },
        period: '/ project',
        duration: '3 - 4 weeks',
        description: 'Enterprise level solutions',
        features: ['Advanced Integrations', 'Custom Dashboards', 'Workflow Automations', 'AI Features']
      }
    ]
  }
}

const individualServicesData = {
  'Development': [
    { name: 'Landing Page', price: { INR: '15K - 30K', USD: '$200 - $400', EUR: '€180 - €360' }, duration: '2 - 4 days', icon: 'landing-page.png' },
    { name: 'Business Website', price: { INR: '30K - 80K', USD: '$400 - $1,000', EUR: '€365 - €910' }, duration: '5 - 10 days', icon: 'software-application.png' },
    { name: 'Custom Dashboard / Web App', price: { INR: '80K - 2L', USD: '$1,000 - $2,500', EUR: '€915 - €2,285' }, duration: '2 - 4 weeks', icon: 'business-intelligence.png' },
    { name: 'MVP Development', price: { INR: '1L - 4L', USD: '$1,200 - $5,000', EUR: '€1,100 - €4,570' }, duration: '3 - 6 weeks', icon: 'innovation.png' },
    { name: 'AI Chatbot Integration', price: { INR: '25K - 75K', USD: '$300 - $900', EUR: '€275 - €820' }, duration: '4 - 7 days', icon: 'chatbot.png' },
    { name: 'Custom LLM Training', price: { INR: '50K - 1.5L', USD: '$600 - $1,800', EUR: '€550 - €1,650' }, duration: '1 - 2 weeks', icon: 'robot.png' },
    { name: 'WhatsApp Bot Integration', price: { INR: '30K - 80K', USD: '$400 - $1,000', EUR: '€365 - €910' }, duration: '4 - 7 days', icon: 'whatsapp.png' },
    { name: 'Maintenance Retainer', price: { INR: '10K - 30K / mo', USD: '$150 - $400 / mo', EUR: '€135 - €365 / mo' }, duration: 'Monthly', icon: 'mechanic.png' },
    { name: 'Discovery Call 1:1 (Paid)', price: { INR: '500 / 30 mins', USD: '$20 / 30 mins', EUR: '€18 / 30 mins' }, duration: '30 mins', icon: 'customize.png', link: 'https://calendly.com/g-onemedia/discovery-call' }
  ]
}

export default function Pricing({ onScheduleCall }) {
  const [currency, setCurrency] = useState('INR')
  const [activeCategory, setActiveCategory] = useState('Websites & Apps')
  const [activeIndividualSub, setActiveIndividualSub] = useState('Development')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedPlanName, setSelectedPlanName] = useState('')
  const [defaultAmount, setDefaultAmount] = useState('')

  const currentData = pricingData[activeCategory]

  return (
    <section id="pricing" className="py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>Transparent <span className="gradient-text">Pricing</span></h2>
          <p className="max-w-xl mx-auto mb-10 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Choose the specific vertical and find the plan that perfectly accelerates your business.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-black/10 border border-white/5 backdrop-blur-sm">
              {Object.keys(pricingData).map((cat) => {
                const IconName = pricingData[cat].icon
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive
                      ? 'bg-(--accent-blue) text-black shadow-lg'
                      : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-white/5'
                      }`}
                  >
                    <IconName size={16} className={isActive ? 'text-black' : ''} />
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Currency Toggle */}
            <div className="flex justify-center items-center gap-2 p-1.5 rounded-2xl bg-black/10 border border-white/5 backdrop-blur-sm">
              {['INR', 'USD', 'EUR'].map(curr => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-grid`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
          >
            {currentData.packages.map((plan, index) => (
              <motion.div
                key={plan.name}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="glass-card p-8 lg:p-10 relative overflow-hidden flex flex-col group cursor-pointer transition-all duration-300"
              >
                {/* Hover background glow */}
                <div className="absolute inset-0 bg-linear-to-br from-(--accent-blue)/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Subtle background icon */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:opacity-10">
                  <plan.icon size={80} className="text-cyan-500" />
                </div>

                <div className="relative z-10 grow flex flex-col">
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-6 self-start">
                    {plan.name}
                  </span>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black tracking-tighter text-(--text-primary) group-hover:text-cyan-400 transition-colors duration-300">
                      {plan.price[currency]}
                    </span>
                  </div>
                  
                  {/* Period & Duration */}
                  <div className="flex items-center gap-3 mb-6 text-xs font-semibold text-(--text-muted) tracking-wide">
                    <span className="group-hover:text-cyan-400/80 transition-colors duration-300">
                      {plan.period}
                    </span>
                    {plan.duration && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
                        <span className="flex items-center gap-1.5 group-hover:text-cyan-400/80 transition-colors duration-300">
                          <Clock size={12} className="shrink-0" />
                          {plan.duration}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm mb-8 font-medium text-(--text-secondary)">{plan.description}</p>

                  <div className="space-y-4 mb-10 grow">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/30 transition-colors">
                          <Check size={12} className="text-cyan-400" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <a
                    href="#checkout"
                    onClick={(e) => {
                      e.preventDefault()
                      let initialAmt = ''
                      const inrStr = plan.price.INR
                      if (inrStr.includes('K')) {
                        const match = inrStr.match(/\d+/)
                        if (match) initialAmt = String(Number(match[0]) * 1000)
                      } else {
                        initialAmt = inrStr.replace(/[^\d]/g, '') || '5000'
                      }

                      setSelectedPlanName(`${plan.name} (${activeCategory})`)
                      setDefaultAmount(initialAmt)
                      setIsPaymentOpen(true)
                    }}
                    className="w-full py-4 text-sm font-bold rounded-xl transition-all duration-300 bg-transparent border border-[var(--border-subtle)] hover:border-cyan-500/50 hover:bg-cyan-500/10 text-(--text-primary) flex items-center justify-center"
                  >
                    Pay Now
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Individual Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeIndividualSub}-grid`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Individual Services</h3>
              <p className="text-base mt-3 mb-8" style={{ color: 'var(--text-muted)' }}>Need a specific service? Select individually.</p>

              {/* Sub-section swap toggle */}
              <div className="inline-flex p-1 rounded-xl bg-black/10 border border-white/5 backdrop-blur-sm mx-auto">
                {['Development'].map((sub) => {
                  const isActive = activeIndividualSub === sub
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveIndividualSub(sub)}
                      className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isActive
                        ? 'bg-(--accent-blue) text-black shadow-md'
                        : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-white/5'
                        }`}
                    >
                      {sub}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {individualServicesData[activeIndividualSub].map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="group relative p-8 rounded-3xl glass-card transition-all duration-300 border border-white/10 hover:border-cyan-500/50 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_8px_30px_rgb(0,240,255,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-cyan-500/0 group-hover:from-cyan-500/5 transition-all duration-500" />

                  <div className="relative z-10 flex flex-col h-full gap-8">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-xl leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {service.name}
                      </h4>
                      <div className="flex items-center justify-center shrink-0">
                        {service.icon ? (
                          <img 
                            src={`${import.meta.env.BASE_URL || '/'}Archive/${service.icon}`.replace(/\/+/g, '/')} 
                            alt={service.name} 
                            className="w-14 h-14 object-contain opacity-85 transition-transform duration-300 group-hover:scale-120 group-hover:opacity-100" 
                          />
                        ) : (
                          <Sparkles size={32} className="text-cyan-400 transition-transform duration-300 group-hover:scale-120" />
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="font-black text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                          {currency === 'INR' 
                            ? '₹' + service.price.INR 
                            : currency === 'EUR' 
                              ? service.price.EUR 
                              : service.price.USD}
                        </div>
                        {service.duration && (
                          <div className="flex items-center gap-1.5 text-xs text-(--text-muted) group-hover:text-cyan-400/80 transition-colors duration-300">
                            <Clock size={12} className="shrink-0" />
                            <span>Duration: {service.duration}</span>
                          </div>
                        )}
                      </div>

                      {service.link ? (
                        <a
                          href={service.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-6 text-sm font-bold rounded-xl transition-all duration-300 border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400 text-[var(--text-primary)] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center gap-2 group-hover:border-cyan-400/30"
                        >
                          Book Instantly
                        </a>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            let initialAmt = ''
                            const inrStr = service.price.INR
                            if (inrStr.includes('L') && !inrStr.split('L')[0].includes('K')) {
                              const match = inrStr.match(/\d+/)
                              if (match) initialAmt = String(Number(match[0]) * 100000)
                            } else if (inrStr.includes('K')) {
                              const match = inrStr.match(/\d+/)
                              if (match) initialAmt = String(Number(match[0]) * 1000)
                            } else {
                              initialAmt = inrStr.replace(/[^\d]/g, '') || '5000'
                            }

                            setSelectedPlanName(`${service.name} (${activeIndividualSub})`)
                            setDefaultAmount(initialAmt)
                            setIsPaymentOpen(true)
                          }}
                          className="w-full py-3 px-6 text-sm font-bold rounded-xl transition-all duration-300 border border-[var(--border-subtle)] hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400 text-[var(--text-primary)] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center gap-2 group-hover:border-cyan-400/30"
                        >
                          Select Service
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        defaultAmount={defaultAmount}
        planName={selectedPlanName}
      />
    </section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Zap, Building2, Layout, Clock } from 'lucide-react'
import PaymentModal from '../features/PaymentModal'

const pricingData = {
  'Websites & Apps': {
    icon: Layout,
    packages: [
      {
        name: 'Starter', icon: Sparkles,
        originalPrice: { INR: '₹9,999', USD: '$149', EUR: '€139' },
        price: { INR: '₹4,999', USD: '$74', EUR: '€69' },
        period: '/ project',
        duration: '3 - 5 days',
        description: 'Perfect for local businesses',
        features: ['Up to 5 Pages', 'Responsive Design', 'Contact Form', 'Basic SEO']
      },
      {
        name: 'Growth', icon: Zap,
        originalPrice: { INR: '₹19,999', USD: '$249', EUR: '€229' },
        price: { INR: '₹9,999', USD: '$124', EUR: '€114' },
        period: '/ project',
        duration: '1 - 2 weeks',
        description: 'For scaling companies',
        features: ['Custom UI Design', 'CMS Integration', 'Advanced Animations', 'Performance Optimization']
      },
      {
        name: 'Premium', icon: Building2,
        originalPrice: { INR: '₹49,999', USD: '$599', EUR: '€549' },
        price: { INR: '₹24,999', USD: '$299', EUR: '€274' },
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
    { name: 'Discovery Call 1:1 (Free)', price: { INR: 'Free', USD: 'Free', EUR: 'Free' }, duration: '30 mins', icon: 'customize.png', link: 'https://calendly.com/g-onemedia/discovery-call' },
    { name: 'Landing Page', originalPrice: { INR: '₹14,999 - ₹29,999', USD: '$199 - $399', EUR: '€179 - €359' }, price: { INR: '₹7,499 - ₹14,999', USD: '$99 - $199', EUR: '€89 - €179' }, duration: '2 - 4 days', icon: 'landing-page.png' },
    { name: 'Business Website', originalPrice: { INR: '₹29,999 - ₹79,999', USD: '$399 - $999', EUR: '€359 - €909' }, price: { INR: '₹14,999 - ₹39,999', USD: '$199 - $499', EUR: '€179 - €454' }, duration: '5 - 10 days', icon: 'software-application.png' },
    { name: 'Custom Dashboard / Web App', originalPrice: { INR: '₹79,999 - ₹1,99,999', USD: '$999 - $2,499', EUR: '€909 - €2,279' }, price: { INR: '₹39,999 - ₹99,999', USD: '$499 - $1,249', EUR: '€454 - €1,139' }, duration: '2 - 4 weeks', icon: 'business-intelligence.png' },
    { name: 'MVP Development', originalPrice: { INR: '₹99,999 - ₹3,99,999', USD: '$1,199 - $4,999', EUR: '€1,099 - €4,569' }, price: { INR: '₹49,999 - ₹1,99,999', USD: '$599 - $2,499', EUR: '€549 - €2,284' }, duration: '3 - 6 weeks', icon: 'innovation.png' },
    { name: 'AI Chatbot Integration', originalPrice: { INR: '₹24,999 - ₹74,999', USD: '$299 - $899', EUR: '€269 - €819' }, price: { INR: '₹12,499 - ₹37,499', USD: '$149 - $449', EUR: '€134 - €409' }, duration: '4 - 7 days', icon: 'chatbot.png' },
    { name: 'Custom LLM Training', originalPrice: { INR: '₹49,999 - ₹1,49,999', USD: '$599 - $1,799', EUR: '€549 - €1,649' }, price: { INR: '₹24,999 - ₹74,999', USD: '$299 - $899', EUR: '€274 - €824' }, duration: '1 - 2 weeks', icon: 'robot.png' },
    { name: 'WhatsApp Bot Integration', originalPrice: { INR: '₹29,999 - ₹79,999', USD: '$399 - $999', EUR: '€359 - €909' }, price: { INR: '₹14,999 - ₹39,999', USD: '$199 - $499', EUR: '€179 - €454' }, duration: '4 - 7 days', icon: 'whatsapp.png' },
    { name: 'Maintenance Retainer', originalPrice: { INR: '₹9,999 - ₹29,999 / mo', USD: '$149 - $399 / mo', EUR: '€129 - €359 / mo' }, price: { INR: '₹4,999 - ₹14,999 / mo', USD: '$74 - $199 / mo', EUR: '€64 - €179 / mo' }, duration: 'Monthly', icon: 'mechanic.png' }
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500/20 via-pink-500/20 to-cyan-500/20 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-black uppercase tracking-widest mb-6 animate-pulse shadow-[0_0_15px_rgba(255,0,229,0.2)]">
            <Sparkles size={14} className="text-fuchsia-400" />
            🔥 Special Offer: 50% OFF Applied on All Plans
          </div>

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
                      ? 'bg-[var(--accent-blue)] text-black shadow-lg'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
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
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-blue)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Subtle background icon */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:opacity-10">
                  <plan.icon size={80} className="text-cyan-500" />
                </div>

                <div className="relative z-10 grow flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                      {plan.name}
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(255,0,229,0.4)]">
                      50% OFF
                    </span>
                  </div>

                  <div className="flex flex-col mb-2">
                    {plan.originalPrice && (
                      <span className="text-xs font-bold line-through text-[var(--text-muted)] opacity-70 mb-0.5">
                        {plan.originalPrice[currency]}
                      </span>
                    )}
                    <span className="text-4xl font-black tracking-tighter text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors duration-300">
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
                      const inrStr = plan.price.INR
                      const firstPart = inrStr.split('-')[0]
                      const initialAmt = firstPart.replace(/[^\d]/g, '') || '5000'

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
                      <div className="flex flex-col gap-1">
                        {service.originalPrice && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold line-through text-[var(--text-muted)] opacity-70">
                              {service.originalPrice[currency]}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white uppercase tracking-wider shadow-[0_0_8px_rgba(255,0,229,0.4)]">
                              50% OFF
                            </span>
                          </div>
                        )}
                        <div className="font-black text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                          {service.price[currency]}
                        </div>
                        {service.duration && (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] group-hover:text-cyan-400/80 transition-colors duration-300 mt-1">
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
                            const inrStr = service.price.INR
                            const firstPart = inrStr.split('-')[0]
                            const initialAmt = firstPart.replace(/[^\d]/g, '') || '5000'

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

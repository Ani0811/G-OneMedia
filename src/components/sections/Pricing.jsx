import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Zap, Building2, Layout, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const defaultPricingData = {
  'Websites & Apps': {
    icon: Layout,
    packages: [
      {
        id: 1,
        name: 'Starter', icon: Sparkles,
        originalPrice: { INR: '₹10,999', USD: '$139', EUR: '€129' },
        price: { INR: '₹5,999', USD: '$79', EUR: '€75' },
        period: '/ project',
        duration: '3 - 5 days',
        description: 'Perfect for local businesses',
        features: ['Up to 5 Pages', 'Responsive Design', 'Contact Form', 'Basic SEO']
      },
      {
        id: 2,
        name: 'Growth', icon: Zap,
        originalPrice: { INR: '₹22,999', USD: '$279', EUR: '€259' },
        price: { INR: '₹12,999', USD: '$169', EUR: '€159' },
        period: '/ project',
        duration: '1 - 2 weeks',
        description: 'For scaling companies',
        features: ['Custom UI Design', 'CMS Integration', 'Advanced Animations', 'Performance Optimization']
      },
      {
        id: 3,
        name: 'Premium', icon: Building2,
        originalPrice: { INR: '₹42,999', USD: '$529', EUR: '€489' },
        price: { INR: '₹23,999', USD: '$299', EUR: '€279' },
        period: '/ project',
        duration: '3 - 4 weeks',
        description: 'Enterprise level solutions',
        features: ['Advanced Integrations', 'Custom Dashboards', 'Workflow Automations', 'AI Features']
      }
    ]
  }
}

const defaultIndividualServices = {
  'Development': [
    { name: 'Discovery Call 1:1 (Free)', price: { INR: 'Free', USD: 'Free', EUR: 'Free' }, duration: '30 mins', icon: 'customize.png', link: 'https://calendly.com/g-onemedia/discovery-call' },
    { name: 'Landing Page', originalPrice: { INR: '₹16,999 - ₹32,999', USD: '$219 - $419', EUR: '€199 - €389' }, price: { INR: '₹8,499 - ₹16,999', USD: '$109 - $219', EUR: '€99 - €199' }, duration: '2 - 4 days', icon: 'landing-page.png' },
    { name: 'Business Website', originalPrice: { INR: '₹32,999 - ₹84,999', USD: '$429 - $1,049', EUR: '€389 - €959' }, price: { INR: '₹16,999 - ₹42,999', USD: '$219 - $549', EUR: '€199 - €499' }, duration: '5 - 10 days', icon: 'software-application.png' },
    { name: 'Custom Dashboard / Web App', originalPrice: { INR: '₹84,999 - ₹2,14,999', USD: '$1,099 - $2,699', EUR: '€989 - €2,449' }, price: { INR: '₹42,999 - ₹1,09,999', USD: '$549 - $1,399', EUR: '€499 - €1,269' }, duration: '2 - 4 weeks', icon: 'business-intelligence.png' },
    { name: 'MVP Development', originalPrice: { INR: '₹1,09,999 - ₹4,29,999', USD: '$1,299 - $5,399', EUR: '€1,189 - €4,899' }, price: { INR: '₹54,999 - ₹2,19,999', USD: '$689 - $2,749', EUR: '€629 - €2,499' }, duration: '3 - 6 weeks', icon: 'innovation.png' },
    { name: 'AI Chatbot Integration', originalPrice: { INR: '₹27,999 - ₹81,999', USD: '$329 - $979', EUR: '€299 - €889' }, price: { INR: '₹13,999 - ₹41,999', USD: '$169 - $499', EUR: '€149 - €449' }, duration: '4 - 7 days', icon: 'chatbot.png' },
    { name: 'Custom LLM Training', originalPrice: { INR: '₹54,999 - ₹1,64,999', USD: '$659 - $1,979', EUR: '€599 - €1,799' }, price: { INR: '₹27,999 - ₹82,999', USD: '$339 - $999', EUR: '€299 - €899' }, duration: '1 - 2 weeks', icon: 'robot.png' },
    { name: 'WhatsApp Bot Integration', originalPrice: { INR: '₹32,999 - ₹84,999', USD: '$429 - $1,049', EUR: '€389 - €959' }, price: { INR: '₹16,999 - ₹42,999', USD: '$219 - $549', EUR: '€199 - €499' }, duration: '4 - 7 days', icon: 'whatsapp.png' },
    { name: 'Maintenance Retainer', originalPrice: { INR: '₹11,999 - ₹32,999 / mo', USD: '$159 - $429 / mo', EUR: '€139 - €389 / mo' }, price: { INR: '₹5,999 - ₹16,999 / mo', USD: '$79 - $219 / mo', EUR: '€69 - €199 / mo' }, duration: 'Monthly', icon: 'mechanic.png' }
  ]
}

const getIconForName = (name) => {
  if (name?.toLowerCase().includes('starter')) return Sparkles
  if (name?.toLowerCase().includes('growth')) return Zap
  return Building2
}

export default function Pricing({ onScheduleCall }) {
  const [currency, setCurrency] = useState('INR')
  const [activeCategory, setActiveCategory] = useState('Websites & Apps')
  const [activeIndividualSub, setActiveIndividualSub] = useState('Development')
  
  const [pricingData, setPricingData] = useState(defaultPricingData)
  const [individualServicesData, setIndividualServicesData] = useState(defaultIndividualServices)

  useEffect(() => {
    async function fetchPricingFromDb() {
      try {
        // Fetch Packages
        const { data: dbPackages } = await supabase
          .from('pricing_packages')
          .select('*')
          .order('id', { ascending: true })

        if (dbPackages && dbPackages.length > 0) {
          const grouped = {}
          dbPackages.forEach(pkg => {
            const cat = pkg.category || 'Websites & Apps'
            if (!grouped[cat]) {
              grouped[cat] = { icon: Layout, packages: [] }
            }
            grouped[cat].packages.push({
              id: pkg.id,
              name: pkg.name,
              icon: getIconForName(pkg.name),
              originalPrice: {
                INR: pkg.original_price_inr || '',
                USD: pkg.original_price_usd || '',
                EUR: pkg.original_price_eur || '',
              },
              price: {
                INR: pkg.price_inr,
                USD: pkg.price_usd,
                EUR: pkg.price_eur,
              },
              period: pkg.period || '/ project',
              duration: pkg.duration || '',
              description: pkg.description || '',
              features: Array.isArray(pkg.features) ? pkg.features : []
            })
          })
          setPricingData(grouped)
          if (!grouped[activeCategory]) {
            setActiveCategory(Object.keys(grouped)[0])
          }
        }

        // Fetch Services
        const { data: dbServices } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true })

        if (dbServices && dbServices.length > 0) {
          const groupedServices = {}
          dbServices.forEach(srv => {
            const cat = srv.category || 'Development'
            if (!groupedServices[cat]) groupedServices[cat] = []
            groupedServices[cat].push({
              id: srv.id,
              name: srv.name,
              originalPrice: srv.original_price_inr ? {
                INR: srv.original_price_inr,
                USD: srv.original_price_usd,
                EUR: srv.original_price_eur,
              } : null,
              price: {
                INR: srv.price_inr,
                USD: srv.price_usd,
                EUR: srv.price_eur,
              },
              duration: srv.duration,
              icon: srv.icon,
              link: srv.link,
            })
          })
          setIndividualServicesData(groupedServices)
          if (!groupedServices[activeIndividualSub]) {
            setActiveIndividualSub(Object.keys(groupedServices)[0])
          }
        }
      } catch (err) {
        console.warn('Using fallback pricing data:', err)
      }
    }

    fetchPricingFromDb()
  }, [])

  const currentData = pricingData[activeCategory] || pricingData[Object.keys(pricingData)[0]] || { icon: Layout, packages: [] }
  const currentServices = individualServicesData[activeIndividualSub] || []

  return (
    <section id="pricing" className="py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-fuchsia-500/20 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest mb-6 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles size={14} className="text-amber-400" />
            🔥 New Offer: Special Discounted Rates Applied Across All Packages
          </div>

          <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="max-w-xl mx-auto mb-10 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Choose the specific vertical and find the plan that perfectly accelerates your business.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            {/* Category Tabs */}
            {Object.keys(pricingData).length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-black/10 border border-white/5 backdrop-blur-sm">
                {Object.keys(pricingData).map((cat) => {
                  const IconName = pricingData[cat].icon || Layout
                  const isActive = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
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
            )}

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
            {currentData.packages.map((plan) => (
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
                  {plan.icon && <plan.icon size={80} className="text-cyan-500" />}
                </div>

                <div className="relative z-10 grow flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                      {plan.name}
                    </span>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 text-white text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                      NEW OFFER
                    </span>
                  </div>

                  <div className="flex flex-col mb-3">
                    {plan.originalPrice?.[currency] && (
                      <span className="text-xl lg:text-2xl font-black text-cyan-400/50 line-through decoration-cyan-400/70 decoration-3 mb-1 tracking-tight">
                        {plan.originalPrice[currency]}
                      </span>
                    )}
                    <motion.div
                      key={`${plan.price?.[currency]}-${currency}`}
                      initial={{ scale: 0.85, opacity: 0, y: 8 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="inline-block"
                    >
                      <span className="text-4xl lg:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-cyan-300 drop-shadow-[0_0_18px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform duration-300 inline-block">
                        {plan.price?.[currency]}
                      </span>
                    </motion.div>
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
                    {(plan.features || []).map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/30 transition-colors">
                          <Check size={12} className="text-cyan-400" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (onScheduleCall) onScheduleCall()
                    }}
                    className="w-full py-4 text-sm font-bold rounded-xl transition-all duration-300 bg-transparent border border-[var(--border-subtle)] hover:border-cyan-500/50 hover:bg-cyan-500/10 text-[var(--text-primary)] flex items-center justify-center cursor-pointer"
                  >
                    Schedule a Call
                  </button>
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
              {Object.keys(individualServicesData).length > 1 && (
                <div className="inline-flex p-1 rounded-xl bg-black/10 border border-white/5 backdrop-blur-sm mx-auto">
                  {Object.keys(individualServicesData).map((sub) => {
                    const isActive = activeIndividualSub === sub
                    return (
                      <button
                        key={sub}
                        onClick={() => setActiveIndividualSub(sub)}
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                          isActive
                            ? 'bg-[var(--accent-blue)] text-black shadow-md'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                        }`}
                      >
                        {sub}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentServices.map((service, index) => (
                <motion.div
                  key={service.id || index}
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
                        {service.originalPrice?.[currency] && (
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-base lg:text-lg font-black text-cyan-400/50 line-through decoration-cyan-400/70 decoration-3 tracking-tight">
                              {service.originalPrice[currency]}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 text-white uppercase tracking-wider shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                              NEW OFFER
                            </span>
                          </div>
                        )}
                        <motion.div
                          key={`${service.name}-${currency}-${service.price?.[currency]}`}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 22 }}
                          className="font-black text-2xl lg:text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                        >
                          {service.price?.[currency]}
                        </motion.div>
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
                            if (onScheduleCall) onScheduleCall()
                          }}
                          className="w-full py-3 px-6 text-sm font-bold rounded-xl transition-all duration-300 border border-[var(--border-subtle)] hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400 text-[var(--text-primary)] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center gap-2 group-hover:border-cyan-400/30"
                        >
                          Schedule a Call
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
    </section>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CheckCircle2, Sparkles, Zap, Building2, Layout, Clock, ChevronLeft, ChevronRight, ChevronDown, TableProperties, Minus, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { convertInrToUsd, convertInrToEur } from '../../utils/currencyConverter'

const PACKAGES_PER_PAGE = 3
const SERVICES_PER_PAGE = 6

const comparisonFeatures = [
  { category: 'Scope & Architecture', name: 'Page Scope', starter: 'Up to 5–7 Pages', advanced: 'Up to 10–15 Dynamic Pages' },
  { category: 'Scope & Architecture', name: 'Modern UI/UX Design', starter: 'Standard Modern UI/UX', advanced: 'Modern UI/UX + Advanced Animations' },
  { category: 'Scope & Architecture', name: 'Mobile, Tablet & Desktop Responsive', starter: true, advanced: true },
  { category: 'Marketing & SEO', name: 'Search Engine Optimization', starter: 'Basic SEO Setup', advanced: 'Advanced SEO & Schema Setup' },
  { category: 'Marketing & SEO', name: 'Social Media Integration', starter: true, advanced: true },
  { category: 'Performance & Setup', name: 'Speed & Performance Optimization', starter: true, advanced: true },
  { category: 'Performance & Setup', name: 'Domain & Hosting Setup Assistance', starter: true, advanced: true },
  { category: 'Performance & Setup', name: 'SSL & Security Setup', starter: true, advanced: true },
  { category: 'Performance & Setup', name: 'Website Deployment', starter: true, advanced: true },
  { category: 'Support', name: 'Ongoing Support & Care', starter: 'Ongoing Basic Support', advanced: 'Ongoing Priority Support' },
  { category: 'Advanced Functionality', name: 'Dynamic Website Functionality & Database', starter: false, advanced: true },
  { category: 'Advanced Functionality', name: 'CMS Integration (Content Management)', starter: false, advanced: true },
  { category: 'Advanced Functionality', name: 'WhatsApp / AI Chatbot Integration', starter: false, advanced: true },
  { category: 'Advanced Functionality', name: 'Payment Gateway Integration (if required)', starter: false, advanced: true },
  { category: 'Automation & Leads', name: 'Automated Enquiry & Lead Capture Management', starter: false, advanced: true },
  { category: 'Automation & Leads', name: 'Email Notifications & Automated Workflows', starter: false, advanced: true },
  { category: 'Automation & Leads', name: 'Custom API Automation & Integrations', starter: false, advanced: true },
  { category: 'Analytics', name: 'Analytics & Conversion Tracking', starter: false, advanced: true },
]

const defaultPricingData = {
  'Websites & Apps': {
    icon: Layout,
    packages: [
      {
        id: 1,
        name: 'Starter',
        icon: Sparkles,
        isPopular: false,
        originalPrice: { INR: '₹32,999', USD: '$409', EUR: '€379' },
        price: { INR: '₹10,999', USD: '$139', EUR: '€129' },
        period: '/ project',
        duration: '3 - 5 days',
        description: 'Perfect for local businesses and personal portfolios',
        features: [
          'Up to 5–7 Pages',
          'Modern UI/UX Design',
          'Mobile, Tablet & Desktop Responsive',
          'Basic SEO Setup',
          'Social Media Integration',
          'Speed & Performance Optimization',
          'Domain & Hosting Setup Assistance',
          'SSL / Security Setup',
          'Website Deployment',
          'Ongoing Basic Support & Maintenance'
        ]
      },
      {
        id: 2,
        name: 'ADVANCED SMART WEBSITE',
        icon: Zap,
        isPopular: true,
        originalPrice: { INR: '₹48,999', USD: '$599', EUR: '€549' },
        price: { INR: '₹22,999', USD: '$289', EUR: '€269' },
        period: '/ project',
        duration: '1 - 2 weeks',
        description: 'For businesses that need more than a simple website and want to automate customer interaction and business processes.',
        features: [
          'Up to 10–15 Dynamic Pages',
          'Advanced Animations & Micro-Interactions',
          'Dynamic Website Functionality & Database',
          'CMS Integration (Content Management)',
          'WhatsApp / Chatbot Integration',
          'Payment Gateway Integration (if required)',
          'Automated Enquiry & Lead Capture Management',
          'Email Notifications & Workflow Automation',
          'Custom API Automation & Integrations',
          'Advanced SEO, Analytics & Conversion Tracking'
        ]
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

  const [packagePage, setPackagePage] = useState(1)
  const [servicePage, setServicePage] = useState(1)
  const [showComparison, setShowComparison] = useState(false)

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
            const isPop = pkg.id === 2 || pkg.name?.toLowerCase().includes('advanced')
            grouped[cat].packages.push({
              id: pkg.id,
              name: pkg.name,
              icon: getIconForName(pkg.name),
              isPopular: isPop,
              includesAllBase: isPop,
              originalPrice: {
                INR: pkg.original_price_inr || '',
                USD: pkg.original_price_usd || (pkg.original_price_inr ? convertInrToUsd(pkg.original_price_inr) : ''),
                EUR: pkg.original_price_eur || (pkg.original_price_inr ? convertInrToEur(pkg.original_price_inr) : ''),
              },
              price: {
                INR: pkg.price_inr,
                USD: pkg.price_usd || convertInrToUsd(pkg.price_inr),
                EUR: pkg.price_eur || convertInrToEur(pkg.price_inr),
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
                USD: srv.original_price_usd || convertInrToUsd(srv.original_price_inr),
                EUR: srv.original_price_eur || convertInrToEur(srv.original_price_inr),
              } : null,
              price: {
                INR: srv.price_inr,
                USD: srv.price_usd || convertInrToUsd(srv.price_inr),
                EUR: srv.price_eur || convertInrToEur(srv.price_inr),
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
  const allPackages = currentData.packages || []
  const packageTotalPages = Math.ceil(allPackages.length / PACKAGES_PER_PAGE)
  const safePackagePage = Math.min(packagePage, packageTotalPages || 1)
  const paginatedPackages = allPackages.slice((safePackagePage - 1) * PACKAGES_PER_PAGE, safePackagePage * PACKAGES_PER_PAGE)

  const currentServices = individualServicesData[activeIndividualSub] || []
  const serviceTotalPages = Math.ceil(currentServices.length / SERVICES_PER_PAGE)
  const safeServicePage = Math.min(servicePage, serviceTotalPages || 1)
  const paginatedServices = currentServices.slice((safeServicePage - 1) * SERVICES_PER_PAGE, safeServicePage * SERVICES_PER_PAGE)

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setPackagePage(1)
  }

  const handleIndividualSubChange = (sub) => {
    setActiveIndividualSub(sub)
    setServicePage(1)
  }

  // Dynamic grid layouts for centering when 1 or 2 items exist
  const getPackageContainerClass = (count) => {
    if (count === 1) return 'flex justify-center max-w-md mx-auto w-full mb-14'
    if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full mb-14'
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mb-14'
  }

  const getServiceContainerClass = (count) => {
    if (count === 1) return 'flex justify-center max-w-md mx-auto w-full'
    if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full'
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full'
  }

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
                      onClick={() => handleCategoryChange(cat)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
            key={`${activeCategory}-page-${safePackagePage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className={getPackageContainerClass(paginatedPackages.length)}
          >
            {paginatedPackages.map((plan) => {
              const isPopular = plan.isPopular || plan.name?.toLowerCase().includes('advanced')
              const includesAllBase = isPopular || plan.name?.toLowerCase().includes('advanced')

              return (
                <motion.div
                  key={plan.name}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className={`relative rounded-3xl p-8 lg:p-10 overflow-hidden flex flex-col justify-between group transition-all duration-300 h-full backdrop-blur-xl ${
                    isPopular
                      ? 'border-2 border-cyan-400/50 bg-gradient-to-b from-[#0b172a] via-[#08111e] to-[#050811] shadow-[0_25px_60px_-15px_rgba(0,240,255,0.22)] ring-1 ring-cyan-400/30'
                      : 'border border-white/10 bg-[#070b14]/90 shadow-xl'
                  } ${
                    paginatedPackages.length === 1 ? 'w-full max-w-md' : 'w-full'
                  }`}
                >
                  {/* Floating Most Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-b-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-black text-[10px] font-black uppercase tracking-widest shadow-[0_4px_25px_rgba(0,240,255,0.5)] flex items-center gap-1.5 z-20">
                      <Sparkles size={12} className="fill-black text-black" />
                      <span>Most Popular • Flagship Solution</span>
                    </div>
                  )}

                  {/* Subtle background ambient glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isPopular ? 'opacity-30' : ''}`} />

                  {/* Subtle background icon */}
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:opacity-10">
                    {plan.icon && <plan.icon size={80} className="text-cyan-500" />}
                  </div>

                  <div className="relative z-10 grow flex flex-col pt-1">
                    {/* Header tier and tag */}
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className={`inline-block px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        isPopular
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                          : 'bg-white/5 text-slate-300 border border-white/10'
                      }`}>
                        {plan.name}
                      </span>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 text-white text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                        NEW OFFER
                      </span>
                    </div>

                    {/* Price with Neon glow */}
                    <div className="flex flex-col mb-3 min-h-[72px] justify-end">
                      {plan.originalPrice?.[currency] ? (
                        <span className="text-xl lg:text-2xl font-black text-cyan-400/50 line-through decoration-cyan-400/70 decoration-2 mb-1 tracking-tight">
                          {plan.originalPrice[currency]}
                        </span>
                      ) : (
                        <div className="h-7 mb-1" />
                      )}
                      <motion.div
                        key={`${plan.price?.[currency]}-${currency}`}
                        initial={{ scale: 0.9, opacity: 0, y: 8 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                        className="inline-block"
                      >
                        <span className="text-4xl lg:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-cyan-300 drop-shadow-[0_0_22px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-transform duration-300 inline-block">
                          {plan.price?.[currency]}
                        </span>
                      </motion.div>
                    </div>

                    {/* Period & Duration */}
                    <div className="flex items-center gap-3 mb-6 text-xs font-semibold text-[var(--text-muted)] tracking-wide">
                      <span className="text-slate-400 font-medium">
                        {plan.period}
                      </span>
                      {plan.duration && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                          <span className="flex items-center gap-1.5 text-cyan-300/90 font-medium">
                            <Clock size={12} className="shrink-0 text-cyan-400" />
                            {plan.duration}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm mb-6 font-medium text-slate-300 leading-relaxed min-h-[44px]">
                      {plan.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-3 mb-8 grow">
                      {includesAllBase ? (
                        <>
                          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.08)] mb-3.5">
                            <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                            <span>Includes All 10 Starter Features, plus:</span>
                          </div>

                          {(plan.features || []).map((feature, idx) => (
                            <div key={`${feature}-${idx}`} className="flex items-center gap-3 text-sm text-slate-100">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                                <Check size={12} />
                              </div>
                              <span className="flex-1 font-medium">{feature}</span>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-0.5">
                            Foundational Scope:
                          </div>

                          {(plan.features || []).map((feature, idx) => (
                            <div key={`${feature}-${idx}`} className="flex items-center gap-3 text-sm text-slate-300">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                <Check size={12} />
                              </div>
                              <span className="flex-1">{feature}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        if (onScheduleCall) onScheduleCall()
                      }}
                      className={
                        isPopular
                          ? "w-full py-4 text-sm font-black rounded-xl transition-all duration-300 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 text-black shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.65)] hover:scale-[1.02] flex items-center justify-center cursor-pointer mt-auto tracking-wide"
                          : "w-full py-4 text-sm font-bold rounded-xl transition-all duration-300 border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400 text-white hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center cursor-pointer mt-auto tracking-wide"
                      }
                    >
                      Schedule a Call
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Side-by-Side Feature Comparison Drawer */}
        {activeCategory === 'Websites & Apps' && (
          <div className="mt-2 mb-16 max-w-4xl mx-auto">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowComparison(!showComparison)}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/15 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] cursor-pointer"
              >
                <TableProperties size={15} />
                <span>{showComparison ? 'Hide Side-by-Side Feature Matrix' : 'Compare All Features Side-by-Side'}</span>
                <ChevronDown size={15} className={`transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden mt-8"
                >
                  <div className="rounded-3xl border border-cyan-500/25 bg-[#070c18]/95 backdrop-blur-md overflow-hidden shadow-2xl p-5 sm:p-7">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="py-3 px-4 font-bold text-slate-300">Feature</th>
                            <th className="py-3 px-4 font-bold text-slate-300 text-center w-36 sm:w-44">Starter (₹10,999)</th>
                            <th className="py-3 px-4 font-bold text-cyan-300 text-center w-48 sm:w-56 bg-cyan-500/10 rounded-t-xl border-t border-x border-cyan-500/20">
                              Advanced Smart Website (₹22,999)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {comparisonFeatures.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 text-slate-200 font-medium">
                                <span className="block text-slate-200">{row.name}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{row.category}</span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {row.starter === true ? (
                                  <span className="inline-flex w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 items-center justify-center">
                                    <Check size={12} />
                                  </span>
                                ) : row.starter === false ? (
                                  <span className="inline-flex w-5 h-5 text-slate-600 items-center justify-center">
                                    <Minus size={14} />
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400 font-medium">{row.starter}</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center bg-cyan-500/[0.04] border-x border-cyan-500/10">
                                {row.advanced === true ? (
                                  <span className="inline-flex w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 items-center justify-center ring-1 ring-cyan-400/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                                    <Check size={12} />
                                  </span>
                                ) : row.advanced === false ? (
                                  <span className="inline-flex w-5 h-5 text-slate-600 items-center justify-center">
                                    <Minus size={14} />
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-cyan-300">{row.advanced}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span>✦ Both tiers include responsive build, full source code delivery, and deployment assistance.</span>
                      <span className="text-cyan-400 font-medium flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-400" /> 100% Launch Guarantee
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Packages Pagination */}
        {packageTotalPages > 1 && (
          <div className="flex items-center justify-center gap-3 -mt-6 mb-20">
            <button
              onClick={() => setPackagePage(safePackagePage - 1)}
              disabled={safePackagePage === 1}
              className={`w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                safePackagePage === 1
                  ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                  : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
              }`}
              style={{ color: safePackagePage === 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}
              aria-label="Previous Package Page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: packageTotalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPackagePage(page)}
                className={`w-11 h-11 rounded-xl text-xs font-black transition-all duration-300 border cursor-pointer ${
                  safePackagePage === page
                    ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-white hover:scale-105 hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setPackagePage(safePackagePage + 1)}
              disabled={safePackagePage === packageTotalPages}
              className={`w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                safePackagePage === packageTotalPages
                  ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                  : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
              }`}
              style={{ color: safePackagePage === packageTotalPages ? 'var(--text-muted)' : 'var(--text-primary)' }}
              aria-label="Next Package Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Individual Services Section */}
        <div className="w-full mt-16 pt-16 border-t border-white/5">
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
                      onClick={() => handleIndividualSubChange(sub)}
                      className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
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

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeIndividualSub}-page-${safeServicePage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className={getServiceContainerClass(paginatedServices.length)}
            >
              {paginatedServices.map((service, index) => (
                <motion.div
                  key={service.id || index}
                  whileHover={{ y: -5 }}
                  className={`group relative p-8 rounded-3xl glass-card transition-all duration-300 border border-white/10 hover:border-cyan-500/50 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_8px_30px_rgb(0,240,255,0.15)] h-full ${
                    paginatedServices.length === 1 ? 'w-full max-w-md' : 'w-full'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-cyan-500/0 group-hover:from-cyan-500/5 transition-all duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
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
                      <div className="flex flex-col gap-1 min-h-[80px] justify-end">
                        {service.originalPrice?.[currency] ? (
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-base lg:text-lg font-black text-cyan-400/50 line-through decoration-cyan-400/70 decoration-3 tracking-tight">
                              {service.originalPrice[currency]}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 text-white uppercase tracking-wider shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                              NEW OFFER
                            </span>
                          </div>
                        ) : (
                          <div className="h-6 mb-0.5" />
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
                          className="w-full py-3 px-6 text-sm font-bold rounded-xl transition-all duration-300 border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400 text-[var(--text-primary)] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center gap-2 group-hover:border-cyan-400/30 cursor-pointer"
                        >
                          Book Instantly
                        </a>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            if (onScheduleCall) onScheduleCall()
                          }}
                          className="w-full py-3 px-6 text-sm font-bold rounded-xl transition-all duration-300 border border-[var(--border-subtle)] hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-400 text-[var(--text-primary)] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center gap-2 group-hover:border-cyan-400/30 cursor-pointer"
                        >
                          Schedule a Call
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Individual Services Pagination Controls */}
          {serviceTotalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-14">
              <button
                onClick={() => setServicePage(safeServicePage - 1)}
                disabled={safeServicePage === 1}
                className={`w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                  safeServicePage === 1
                    ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                    : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
                }`}
                style={{ color: safeServicePage === 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}
                aria-label="Previous Service Page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: serviceTotalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setServicePage(page)}
                  className={`w-11 h-11 rounded-xl text-xs font-black transition-all duration-300 border cursor-pointer ${
                    safeServicePage === page
                      ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                      : 'border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-white hover:scale-105 hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setServicePage(safeServicePage + 1)}
                disabled={safeServicePage === serviceTotalPages}
                className={`w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                  safeServicePage === serviceTotalPages
                    ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                    : 'hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 hover:bg-cyan-400/5 cursor-pointer text-white'
                }`}
                style={{ color: safeServicePage === serviceTotalPages ? 'var(--text-muted)' : 'var(--text-primary)' }}
                aria-label="Next Service Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

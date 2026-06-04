import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Video, Bot, TrendingUp, ChevronRight, ChevronLeft, Calculator, Send, Check, Sparkles } from 'lucide-react'

const serviceOptions = [
  { id: 'website', label: 'Website / Web App', icon: Code, basePrice: 15000, description: 'React, Next.js, full-stack solutions' },
  { id: 'video', label: 'Video Production', icon: Video, basePrice: 10000, description: 'Reels, YouTube, cinematic content' },
  { id: 'ai', label: 'AI Agent / Chatbot', icon: Bot, basePrice: 25000, description: 'Custom LLM bots and automation' },
  { id: 'marketing', label: 'Digital Marketing', icon: TrendingUp, basePrice: 10000, description: 'SEO, ads, social media strategy' },
]

const featureAddons = {
  website: [
    { id: 'cms', label: 'CMS Integration', price: 8000 },
    { id: 'ecommerce', label: 'E-Commerce / Payments', price: 15000 },
    { id: 'animations', label: 'Advanced Animations', price: 5000 },
    { id: 'dashboard', label: 'Custom Dashboard', price: 20000 },
    { id: 'seo', label: 'SEO Optimization', price: 5000 },
    { id: 'auth', label: 'User Authentication', price: 8000 },
  ],
  video: [
    { id: 'motion-gfx', label: 'Motion Graphics', price: 5000 },
    { id: 'scripting', label: 'Scripting & Strategy', price: 4000 },
    { id: 'thumbnail', label: 'Thumbnail Design (5)', price: 2000 },
    { id: 'subtitles', label: 'Subtitles & Captions', price: 1500 },
    { id: 'channel-mgmt', label: 'Channel Management', price: 15000 },
  ],
  ai: [
    { id: 'multi-channel', label: 'Multi-Channel (Web + WhatsApp)', price: 10000 },
    { id: 'crm', label: 'CRM / ERP Integration', price: 12000 },
    { id: 'training', label: 'Custom LLM Training', price: 20000 },
    { id: 'analytics', label: 'Sentiment Analytics', price: 8000 },
    { id: 'scheduling', label: 'Appointment Scheduling', price: 5000 },
  ],
  marketing: [
    { id: 'meta-ads', label: 'Meta / Google Ads', price: 15000 },
    { id: 'email-flow', label: 'Email Marketing Flow', price: 8000 },
    { id: 'branding', label: 'Brand Identity Design', price: 20000 },
    { id: 'content', label: 'Content Strategy', price: 10000 },
    { id: 'analytics-dashboard', label: 'Analytics Dashboard', price: 12000 },
  ],
}

const urgencyOptions = [
  { id: 'relaxed', label: 'Flexible (4-6 weeks)', multiplier: 1.0, tag: 'Standard' },
  { id: 'normal', label: 'Normal (2-4 weeks)', multiplier: 1.15, tag: '15% premium' },
  { id: 'rush', label: 'Rush (1-2 weeks)', multiplier: 1.35, tag: '35% premium' },
]

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
}

export default function BudgetCalculator() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState({})
  const [urgency, setUrgency] = useState('relaxed')
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const totalSteps = 4

  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleFeature = (serviceId, featureId) => {
    setSelectedFeatures(prev => {
      const current = prev[serviceId] || []
      return {
        ...prev,
        [serviceId]: current.includes(featureId)
          ? current.filter(f => f !== featureId)
          : [...current, featureId]
      }
    })
  }

  const calculateTotal = () => {
    let total = 0
    selectedServices.forEach(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId)
      if (service) total += service.basePrice
      const features = selectedFeatures[serviceId] || []
      features.forEach(fId => {
        const addon = (featureAddons[serviceId] || []).find(f => f.id === fId)
        if (addon) total += addon.price
      })
    })
    const mult = urgencyOptions.find(u => u.id === urgency)?.multiplier || 1
    return Math.round(total * mult)
  }

  const formatINR = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
    if (num >= 1000) return `₹${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`
    return `₹${num}`
  }

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, totalSteps - 1)) }
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)) }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return
    setSubmitting(true)
    try {
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:3001'
        : (import.meta.env.VITE_API_BACKEND_URL || '')

      const serviceNames = selectedServices.map(id => serviceOptions.find(s => s.id === id)?.label).join(', ')
      const featureNames = selectedServices.map(id => {
        const feats = (selectedFeatures[id] || []).map(fId =>
          (featureAddons[id] || []).find(f => f.id === fId)?.label
        ).filter(Boolean)
        return feats.length ? `${serviceOptions.find(s => s.id === id)?.label}: ${feats.join(', ')}` : null
      }).filter(Boolean).join(' | ')

      const urgencyLabel = urgencyOptions.find(u => u.id === urgency)?.label
      const total = calculateTotal()

      const message = [
        `📊 Budget Estimate Request`,
        `Services: ${serviceNames}`,
        featureNames ? `Add-ons: ${featureNames}` : '',
        `Timeline: ${urgencyLabel}`,
        `Estimated Budget: ${formatINR(total)}`,
        formData.notes ? `Notes: ${formData.notes}` : '',
      ].filter(Boolean).join('\n')

      await fetch(`${API_BASE.replace(/\/$/, '')}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, message }),
      })
      setSubmitted(true)
    } catch {
      // Silently handle — the CTA section is always available as a fallback
    } finally {
      setSubmitting(false)
    }
  }

  const total = calculateTotal()
  const canProceedStep0 = selectedServices.length > 0
  const canProceedStep2 = true // urgency always has a default
  const canSubmit = formData.name.trim() && formData.email.trim()

  return (
    <section id="estimate" className="py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black mb-6 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Project <span className="gradient-text">Estimator</span>
          </motion.h2>
          <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
            Configure your ideal project and get an instant budget estimate.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-10">
            {['Services', 'Features', 'Timeline', 'Submit'].map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-white/10'
                }`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  i <= step ? 'text-cyan-400' : 'text-[var(--text-muted)]'
                }`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Floating Total Badge */}
          {selectedServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-8 py-3 px-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Calculator size={16} className="text-cyan-400" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Estimated Total:</span>
              <span className="text-2xl font-black tracking-tighter text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                {formatINR(total)}
              </span>
            </motion.div>
          )}

          {/* Step Content */}
          <div className="glass-card p-8 lg:p-10 min-h-[340px] relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    What do you need?
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Select all services that apply.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {serviceOptions.map(service => {
                      const isSelected = selectedServices.includes(service.id)
                      return (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`group relative flex items-start gap-4 p-5 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                            isSelected
                              ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'bg-cyan-500/20' : 'bg-white/5'
                          }`}>
                            <service.icon size={20} className={isSelected ? 'text-cyan-400' : 'text-[var(--text-muted)]'} />
                          </div>
                          <div>
                            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{service.label}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{service.description}</div>
                            <div className="text-xs font-bold text-cyan-400 mt-1.5">from {formatINR(service.basePrice)}</div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                              <Check size={12} className="text-black" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Customize with add-ons
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Optional features to enhance your project.</p>
                  <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                    {selectedServices.map(serviceId => {
                      const service = serviceOptions.find(s => s.id === serviceId)
                      const addons = featureAddons[serviceId] || []
                      return (
                        <div key={serviceId}>
                          <div className="flex items-center gap-2 mb-3">
                            <service.icon size={14} className="text-cyan-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">{service.label}</span>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {addons.map(addon => {
                              const isSelected = (selectedFeatures[serviceId] || []).includes(addon.id)
                              return (
                                <button
                                  key={addon.id}
                                  onClick={() => toggleFeature(serviceId, addon.id)}
                                  className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                                      : 'border-white/5 hover:border-white/15 text-[var(--text-secondary)]'
                                  }`}
                                >
                                  <span className="font-medium">{addon.label}</span>
                                  <span className={`text-xs font-bold ${isSelected ? 'text-cyan-400' : 'text-[var(--text-muted)]'}`}>
                                    +{formatINR(addon.price)}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    How soon do you need this?
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Faster timelines incur a premium.</p>
                  <div className="space-y-3">
                    {urgencyOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setUrgency(opt.id)}
                        className={`w-full flex items-center justify-between px-6 py-5 rounded-xl border transition-all cursor-pointer ${
                          urgency === opt.id
                            ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{opt.label}</div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          urgency === opt.id ? 'bg-cyan-400/20 text-cyan-400' : 'bg-white/5 text-[var(--text-muted)]'
                        }`}>
                          {opt.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && !submitted && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Get your estimate
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>We'll reach out within 24 hours with a detailed proposal.</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
                    />
                    <textarea
                      placeholder="Additional notes (optional)"
                      value={formData.notes}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && submitted && (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
                    <Sparkles size={28} className="text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Estimate Sent!</h3>
                  <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
                    Thank you, {formData.name}! We've received your project estimate of <strong className="text-cyan-400">{formatINR(total)}</strong> and will reach out within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {!submitted && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goBack}
                disabled={step === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  step === 0
                    ? 'opacity-30 cursor-not-allowed text-[var(--text-muted)]'
                    : 'text-[var(--text-primary)] hover:bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                <ChevronLeft size={16} /> Back
              </button>

              {step < totalSteps - 1 ? (
                <button
                  onClick={goNext}
                  disabled={step === 0 && !canProceedStep0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    step === 0 && !canProceedStep0
                      ? 'opacity-30 cursor-not-allowed bg-white/5 text-[var(--text-muted)]'
                      : 'bg-cyan-400 text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:-translate-y-0.5'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    !canSubmit || submitting
                      ? 'opacity-30 cursor-not-allowed bg-white/5 text-[var(--text-muted)]'
                      : 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:-translate-y-0.5'
                  }`}
                >
                  {submitting ? 'Sending...' : <><Send size={14} /> Submit Estimate</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

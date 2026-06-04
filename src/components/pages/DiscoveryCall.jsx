import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, User, Mail, Building2, Globe, Briefcase, DollarSign, MessageSquare, Megaphone, Send, CheckCircle, Loader, AlertCircle } from 'lucide-react'

const SERVICE_OPTIONS = ['Web Engineering', 'AI Agents', 'Content Creation', 'Digital Consultation', 'Multiple Services']
const BUDGET_OPTIONS = ['Under ₹15,000', '₹15,000 – ₹50,000', '₹50,000 – ₹1,50,000', '₹1,50,000+', 'Not sure yet']

export default function DiscoveryCall() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [fields, setFields] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    service: '',
    budget: '',
    details: '',
    referral: ''
  })

  const set = (key) => (e) => setFields(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fields.name || !fields.email || !fields.service || !fields.details) return

    setStatus('loading')

    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:3001'
      : (import.meta.env.VITE_API_BACKEND_URL || '')
    const apiEndpoint = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/discovery` : '/api/discovery'

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (!res.ok) throw new Error('Failed to submit discovery call booking')
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const inputClass = "w-full bg-black/5 dark:bg-white/5 border rounded-xl px-4 py-3 outline-none transition-all text-sm focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20"
  const inputStyle = { borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }
  const labelClass = "text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2"
  const labelStyle = { color: 'var(--text-muted)' }

  return (
    <section className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      <Helmet>
        <title>Book a Discovery Call | G-One Media</title>
        <meta name="description" content="Schedule a discovery call with G-One Media to discuss your project, business goals, and see how we can help you scale." />
        <link rel="canonical" href="https://ani0811.github.io/G-OneMedia/discovery" />
      </Helmet>
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/8 rounded-full blur-[120px] -z-10" />

      <div className="container-custom max-w-2xl">
        {/* Navigation Buttons */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10 flex flex-wrap gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-colors bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-colors bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
            ✦ Discovery Call Questionnaire
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-3 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Schedule a <span className="gradient-text">Discovery Call</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Let's dissect your requirements and map out the system architecture. Fill out the brief below so we can make the most out of our call.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 lg:p-10"
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Discovery Request Received!
                </h2>
                <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Thank you! We've logged your profile details. Our founders will review your goals and reach out within 24 hours to coordinate slot timings.
                </p>
                <Link to="/" className="btn-secondary inline-flex items-center gap-2 px-6! py-3!">
                  ← Back to Home
                </Link>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}><User size={12} /> Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      className={inputClass}
                      style={inputStyle}
                      value={fields.name}
                      onChange={set('name')}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}><Mail size={12} /> Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="you@company.com"
                      className={inputClass}
                      style={inputStyle}
                      value={fields.email}
                      onChange={set('email')}
                    />
                  </div>
                </div>

                {/* Row 2: Company + Website */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}><Building2 size={12} /> Company / Brand Name</label>
                    <input
                      type="text"
                      placeholder="Your brand name"
                      className={inputClass}
                      style={inputStyle}
                      value={fields.company}
                      onChange={set('company')}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}><Globe size={12} /> Website or Social Link</label>
                    <input
                      type="text"
                      placeholder="https://example.com"
                      className={inputClass}
                      style={inputStyle}
                      value={fields.website}
                      onChange={set('website')}
                    />
                  </div>
                </div>

                {/* Row 3: Service + Budget */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}><Briefcase size={12} /> Service Focus *</label>
                    <select
                      required
                      className={`${inputClass} appearance-none cursor-pointer`}
                      style={inputStyle}
                      value={fields.service}
                      onChange={set('service')}
                    >
                      <option value="" style={{ background: 'var(--bg-primary)' }}>Select primary service…</option>
                      {SERVICE_OPTIONS.map(opt => (
                        <option key={opt} value={opt} style={{ background: 'var(--bg-primary)' }}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}><DollarSign size={12} /> Estimated Budget</label>
                    <select
                      className={`${inputClass} appearance-none cursor-pointer`}
                      style={inputStyle}
                      value={fields.budget}
                      onChange={set('budget')}
                    >
                      <option value="" style={{ background: 'var(--bg-primary)' }}>Select budget range…</option>
                      {BUDGET_OPTIONS.map(opt => (
                        <option key={opt} value={opt} style={{ background: 'var(--bg-primary)' }}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass} style={labelStyle}><MessageSquare size={12} /> Describe your business goals & requirements *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your brand, what problems you are facing, what outcomes you expect from G-One Media, and any deadlines..."
                    className={`${inputClass} resize-none h-28`}
                    style={inputStyle}
                    value={fields.details}
                    onChange={set('details')}
                  />
                </div>

                {/* Referral */}
                <div>
                  <label className={labelClass} style={labelStyle}><Megaphone size={12} /> How did you hear about us?</label>
                  <input
                    type="text"
                    placeholder="e.g. YouTube, Twitter, Referral..."
                    className={inputClass}
                    style={inputStyle}
                    value={fields.referral}
                    onChange={set('referral')}
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm px-4 py-2.5 rounded-xl bg-red-400/10 border border-red-400/20"
                  >
                    <AlertCircle size={16} />
                    Something went wrong. Please check your connection and try again.
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4! rounded-2xl shadow-xl"
                >
                  {status === 'loading' ? (
                    <><Loader size={20} className="animate-spin" /> Submitting Request…</>
                  ) : (
                    <>Submit Discovery Brief <Send size={18} /></>
                  )}
                </motion.button>

                <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  Your details are secure. We'll coordinate a time with you within 24 hours.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

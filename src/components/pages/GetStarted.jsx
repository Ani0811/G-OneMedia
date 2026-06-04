import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Building2, Briefcase, DollarSign, MessageSquare, Send, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const SERVICE_OPTIONS = ['Web Engineering', 'AI Agents', 'Content Creation', 'Digital Consultation', 'Multiple Services']
const BUDGET_OPTIONS = ['Under ₹15,000', '₹15,000 – ₹50,000', '₹50,000 – ₹1,50,000', '₹1,50,000+', 'Not sure yet']

export default function GetStarted() {
  const navigate = useNavigate()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [fields, setFields] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    description: '',
  })

  const set = (key) => (e) => setFields(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:3001'
      : (import.meta.env.VITE_API_BACKEND_URL || '')
    const apiEndpoint = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/contact` : '/api/contact'

    // Save lead to Supabase (fire-and-forget — don't block on this)
    supabase.from('leads').insert([{
      name: fields.name,
      email: fields.email,
      company: fields.company || null,
      service: fields.service || null,
      budget: fields.budget || null,
      description: fields.description || null,
    }]).then(({ error }) => {
      if (error) console.warn('[GetStarted] Supabase lead insert error:', error)
    })

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          message: `Company: ${fields.company || 'N/A'}\nService: ${fields.service || 'N/A'}\nBudget: ${fields.budget || 'N/A'}\n\n${fields.description}`,
          subject: `New Lead from Get Started — ${fields.service || 'General'}`,
        }),
      })

      if (!res.ok) throw new Error('Failed to send')
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
      {/* Background glows */}
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
            to="/#portfolio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-colors bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            Back to Portfolio
          </Link>

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
            Free Consultation
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-3 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Let's Build <span className="gradient-text">Something Great</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tell us about your project. We'll review it and get back to you within 24 hours with a custom plan and quote.
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
                  Message Received!
                </h2>
                <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                  We'll review your project and reach out within 24 hours with a custom plan.
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
                    <label className={labelClass} style={labelStyle}><Mail size={12} /> Email *</label>
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

                {/* Company */}
                <div>
                  <label className={labelClass} style={labelStyle}><Building2 size={12} /> Company / Brand <span className="opacity-50">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    className={inputClass}
                    style={inputStyle}
                    value={fields.company}
                    onChange={set('company')}
                  />
                </div>

                {/* Row 2: Service + Budget */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}><Briefcase size={12} /> Service Needed</label>
                    <select
                      className={`${inputClass} appearance-none cursor-pointer`}
                      style={inputStyle}
                      value={fields.service}
                      onChange={set('service')}
                    >
                      <option value="" style={{ background: 'var(--bg-primary)' }}>Select a service…</option>
                      {SERVICE_OPTIONS.map(opt => (
                        <option key={opt} value={opt} style={{ background: 'var(--bg-primary)' }}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}><DollarSign size={12} /> Budget Range</label>
                    <select
                      className={`${inputClass} appearance-none cursor-pointer`}
                      style={inputStyle}
                      value={fields.budget}
                      onChange={set('budget')}
                    >
                      <option value="" style={{ background: 'var(--bg-primary)' }}>Select budget…</option>
                      {BUDGET_OPTIONS.map(opt => (
                        <option key={opt} value={opt} style={{ background: 'var(--bg-primary)' }}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass} style={labelStyle}><MessageSquare size={12} /> Tell us about your project *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What are you building? What problems are you trying to solve? Any specific requirements or deadlines?"
                    className={`${inputClass} resize-none h-28`}
                    style={inputStyle}
                    value={fields.description}
                    onChange={set('description')}
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4! rounded-2xl shadow-xl"
                >
                  {status === 'loading' ? (
                    <><Loader size={20} className="animate-spin" /> Sending…</>
                  ) : (
                    <>Send My Brief <Send size={18} /></>
                  )}
                </motion.button>

                <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  No spam. We'll reply within 24 hours with a custom quote.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Mail, Briefcase, DollarSign, Send, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ScheduleModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle') // idle | loading | success
  const [fields, setFields] = useState({
    name: '',
    email: '',
    service: 'Websites',
    budget: 'Package',
    details: ''
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const budgetOptions = ['Package', 'Individual Service']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:3001'
      : (import.meta.env.VITE_API_BACKEND_URL || '')
    const apiEndpoint = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/contact` : '/api/contact'

    try {
      // 1. Save booking to Supabase immediately (fast path)
      const { error: dbError } = await supabase.from('bookings').insert([{
        name: fields.name,
        email: fields.email,
        service: fields.service,
        budget: fields.budget,
        details: fields.details || null,
      }])

      if (dbError) {
        // DB failed — fall back to email-only path, don't block
        console.warn('[Schedule] Supabase insert failed, falling back to email only:', dbError)
      }

      // 2. Show success immediately (don't wait for email)
      setStatus('success')
      setTimeout(() => {
        onClose()
        setStatus('idle')
        setFields({ name: '', email: '', service: 'Websites', budget: 'Package', details: '' })
      }, 3000)

      // 3. Fire email in background (no await — user doesn't wait for SMTP)
      fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          subject: `Discovery Call Request: ${fields.service}`
        }),
      }).catch(err => console.warn('[Schedule] Background email failed:', err))

    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md dark:bg-black/80 dark:backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl glass-card overflow-hidden shadow-2xl"
            style={{ 
              maxHeight: 'calc(100vh - 40px)',
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all z-20"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <Calendar size={12} /> Priority Booking
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                  Schedule a <span className="gradient-text">Discovery Call</span>
                </h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Let's discuss your vision and how we can engineer a digital ecosystem that dominates your market.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-20 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 mx-auto mb-6">
                      <CheckCircle size={40} className="text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Request Received!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>We'll reach out shortly to confirm your slot.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          <User size={12} /> Full Name
                        </label>
                        <input 
                          required
                          type="text"
                          placeholder="Your name"
                          className="w-full bg-black/5 dark:bg-white/5 border rounded-xl px-4 py-2.5 outline-none transition-all"
                          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                          value={fields.name}
                          onChange={e => setFields({...fields, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          <Mail size={12} /> Email Address
                        </label>
                        <input 
                          required
                          type="email"
                          placeholder="gmedia774@gmail.com"
                          className="w-full bg-black/5 dark:bg-white/5 border rounded-xl px-4 py-2.5 outline-none transition-all"
                          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                          value={fields.email}
                          onChange={e => setFields({...fields, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          <Briefcase size={12} /> Service
                        </label>
                        <select 
                          className="w-full bg-black/5 dark:bg-white/5 border rounded-xl px-4 py-2.5 outline-none transition-all appearance-none cursor-pointer"
                          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                          value={fields.service}
                          onChange={e => setFields({...fields, service: e.target.value})}
                        >
                          <option value="Websites" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Websites</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <DollarSign size={12} /> Budget
                          </label>
                        </div>
                        <select 
                          className="w-full bg-black/5 dark:bg-white/5 border rounded-xl px-4 py-2.5 outline-none transition-all appearance-none cursor-pointer"
                          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                          value={fields.budget}
                          onChange={e => setFields({...fields, budget: e.target.value})}
                        >
                          {budgetOptions.map(opt => (
                            <option key={opt} value={opt} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        Project Description <span className="opacity-50">(optional)</span>
                      </label>
                      <textarea 
                        rows="3"
                        placeholder="Tell us about your project goals..."
                        className="w-full bg-black/5 dark:bg-white/5 border rounded-xl px-4 py-2.5 outline-none transition-all resize-none h-24"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                        value={fields.details}
                        onChange={e => setFields({...fields, details: e.target.value})}
                      />
                    </div>

                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm px-4 py-2 rounded-xl bg-red-400/10 border border-red-400/20"
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
                      className="btn-primary w-full flex items-center justify-center gap-3 py-4 rounded-2xl shadow-xl"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader size={20} className="animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          Schedule My Call
                          <Send size={18} />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

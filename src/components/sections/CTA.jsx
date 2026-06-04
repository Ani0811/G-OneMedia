import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, CheckCircle, AlertCircle, Loader, Instagram, Linkedin, Youtube } from 'lucide-react'

// Replace with actual WhatsApp numbers in international format (no + or spaces)
const FOUNDERS_WHATSAPP = {
  anirudha: '919875417275',
  vasudev: '918017790952'
}

const inputClass = `
  w-full bg-transparent border rounded-xl px-5 py-4 outline-none transition-all duration-300
  placeholder:opacity-40 focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.1)]
`

export default function CTA() {
  const API_BASE = import.meta.env.DEV
    ? 'http://localhost:3001'
    : (import.meta.env.VITE_API_BACKEND_URL || '')
  const formRef = useRef()
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = (e) =>
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fields.name || !fields.email || !fields.message) return

    setStatus('loading')
    try {
      const apiEndpoint = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/contact` : '/api/contact'
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setFields({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const getWhatsappUrl = (num) => `https://wa.me/${num}?text=${encodeURIComponent(
    "Hi! I'm interested in working with G-One Media. Can we talk?"
  )}`

  return (
    <section id="contact" className="pb-32 pt-20">
      <div className="container-custom">
        <div
          className="relative rounded-[40px] p-8 md:p-16 lg:p-20 border shadow-2xl"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          {/* Animated Background with its own overflow clipping */}
          <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-cyan-600/5 via-transparent to-fuchsia-600/5 -z-10" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse -z-10" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse -z-10" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 relative z-10">
            {/* Left side: Text + WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col h-full py-8"
            >
              <div>
                <h2
                  className="text-4xl md:text-5xl lg:text-5xl font-black mb-6 tracking-tighter leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Let's start your <br />
                  <span className="gradient-text">next project</span>
                </h2>
                <p className="text-lg mb-10 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                  Ready to upgrade your digital presence? Fill out the form or reach out directly on
                  WhatsApp for an immediate response.
                </p>
              </div>

              <div className="relative w-fit mt-auto">
                <motion.a
                  href="https://chat.whatsapp.com/BshakaceNC7BahYMoNdiK4"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold text-white transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    boxShadow: '0 10px 30px -10px rgba(37, 211, 102, 0.5)',
                  }}
                >
                  <MessageCircle size={22} />
                  Chat on WhatsApp
                </motion.a>
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-col gap-4 border-t border-white/5 pt-6"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-50" style={{ color: 'var(--text-secondary)' }}>
                  Connect with us
                </span>
                <div className="flex items-center gap-4">
                  {[
                    { icon: Instagram, href: "https://www.instagram.com/g1mediaofficial", color: "hover:text-fuchsia-400" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/g-one-media-agency-93581040b/", color: "hover:text-cyan-400" },
                    { icon: Youtube, href: "https://www.youtube.com/@G-OneMedia", color: "hover:text-red-500" }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-all duration-300 transform hover:scale-110 ${social.color}`}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right side: Email Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-4xl border"
              style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-subtle)' }}
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center gap-4 h-full py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/30">
                      <CheckCircle className="text-cyan-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-secondary text-xs! py-2! px-5! mt-2"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={fields.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className={inputClass}
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className={inputClass}
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Project Details
                      </label>
                      <textarea
                        name="message"
                        value={fields.message}
                        onChange={handleChange}
                        placeholder="Tell us about your goals..."
                        rows="4"
                        required
                        className={`${inputClass} resize-none`}
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                      />
                    </div>

                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm px-3 py-2 rounded-lg bg-red-400/10 border border-red-400/20"
                      >
                        <AlertCircle size={16} />
                        Something went wrong. Please try again or use WhatsApp.
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={status === 'loading'}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full flex justify-center items-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCcw, CheckCircle, Loader, AlertCircle, Mail, Hash, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function RefundRequest() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [email, setEmail] = useState('')
  const [paymentId, setPaymentId] = useState(searchParams.get('payment_id') || '')
  const [errorMessage, setErrorMessage] = useState('')

  const handleRefund = async (e) => {
    e.preventDefault()

    if (!email || !paymentId) {
      setErrorMessage('Please provide both Email and Payment ID')
      setStatus('error')
      return
    }

    setStatus('loading')

    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:3001'
      : (import.meta.env.VITE_API_BACKEND_URL || '')
    const apiEndpoint = API_BASE ? `${API_BASE.replace(/\/$/, '')}` : ''

    try {
      const res = await fetch(`${apiEndpoint}/api/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, payment_id: paymentId }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to process refund')
      }
      
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setTimeout(() => {
          setStatus('idle')
          setEmail('')
          setPaymentId('')
        }, 5000)
      } else {
        throw new Error(data.message || 'Refund failed.')
      }

    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container-custom relative z-10 w-full max-w-lg">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-cyan-400 transition-colors mb-8"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div 
          className="glass-card p-8 md:p-10 border shadow-2xl relative w-full"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-fuchsia-400/10 flex items-center justify-center border border-fuchsia-400/20 shrink-0">
              <ShieldCheck size={24} className="text-fuchsia-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Request Refund
              </h1>
            </div>
          </div>
          
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Enter your email and payment ID to initiate an instant refund back to your original payment method.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-fuchsia-400/10 flex items-center justify-center border border-fuchsia-400/20 mx-auto mb-4">
                  <CheckCircle size={32} className="text-fuchsia-400" />
                </div>
                <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Refund Initiated</h4>
                <p className="text-sm px-4" style={{ color: 'var(--text-muted)' }}>
                  Your refund request has been successfully submitted and processed. An email confirmation has been sent.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleRefund} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <Mail size={12} /> Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-black/10 dark:bg-white/5 border rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-all text-sm font-bold"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <p className="text-[10px] opacity-70 mt-1" style={{ color: 'var(--text-muted)' }}>
                    Must match the email used during payment.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <Hash size={12} /> Payment ID
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="pay_xxxxxxxxxxxxxx"
                    className="w-full bg-black/10 dark:bg-white/5 border rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-all text-sm font-bold"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                    value={paymentId}
                    onChange={e => setPaymentId(e.target.value)}
                  />
                  <p className="text-[10px] opacity-70 mt-1" style={{ color: 'var(--text-muted)' }}>
                    Find this in your transaction confirmation email.
                  </p>
                </div>

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm px-4 py-2.5 rounded-xl bg-red-400/10 border border-red-400/20"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span className="text-xs">{errorMessage || 'Refund failed to process.'}</span>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-xl mt-8 transition-all font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(45deg, #d946ef, #a855f7)' }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Request Refund
                      <RefreshCcw size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, CheckCircle, Loader, AlertCircle, DollarSign, Wallet } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PaymentModal({ isOpen, onClose, defaultAmount, planName }) {
  const [status, setStatus] = useState('idle') // idle | loading | verifying | success | error
  const [amount, setAmount] = useState(defaultAmount || '')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount || '')
      setStatus('idle')
      setErrorMessage('')
    }
  }, [isOpen, defaultAmount])

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

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!amount || isNaN(amount) || Number(amount) < 1) {
      alert('Please enter a valid amount')
      return
    }

    setStatus('loading')

    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:3001'
      : (import.meta.env.VITE_API_BACKEND_URL || '')
    const apiEndpoint = API_BASE ? `${API_BASE.replace(/\/$/, '')}` : ''
    console.log('Payment checkout initiated. Target API endpoint:', `${apiEndpoint}/api/create-order`)

    try {
      // 1. Create order on backend
      const res = await fetch(`${apiEndpoint}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), receipt: planName }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to create order')
      }
      const order = await res.json()

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'G-One Media',
        description: `Payment for ${planName}`,
        order_id: order.id,
        handler: async function (response) {
          setStatus('verifying')
          try {
            // 3. Verify payment on backend
            const verifyRes = await fetch(`${apiEndpoint}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              setStatus('success')
              setTimeout(() => {
                onClose()
              }, 2500) // Auto-close after 2.5 seconds
            } else {
              setStatus('error')
              setErrorMessage(verifyData.message || 'Payment verification failed.')
            }
          } catch (error) {
            console.error(error)
            setStatus('error')
            setErrorMessage('Failed to verify payment with backend.')
          }
        },
        theme: {
          color: '#06b6d4'
        }
      }

      // Check if Razorpay is loaded; if not, load it as fallback dynamically
      if (!window.Razorpay) {
        console.log('[Razorpay] SDK not yet initialized. Triggering on-demand fallback loading...');
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.async = true
          script.onload = () => {
            console.log('[Razorpay] SDK loaded successfully via fallback.');
            resolve();
          }
          script.onerror = () => reject(new Error('Razorpay SDK failed to load. Please check your internet connection.'))
          document.body.appendChild(script)
        })
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error)
        setStatus('idle')
      })
      rzp.open()

      // We set status back to idle while the modal is open 
      // so the UI doesn't just show a spinner indefinitely if they close the modal
      setStatus('idle')

    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
      setTimeout(() => setStatus('idle'), 5000)
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
            className="relative w-full max-w-md glass-card overflow-hidden shadow-2xl"
            style={{
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

            <div className="p-6 md:p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <Wallet size={12} /> Secure Checkout
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                  Complete <span className="gradient-text">Payment</span>
                </h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Enter the amount you wish to pay for <strong className="text-cyan-400">{planName}</strong>.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 mx-auto mb-6">
                      <CheckCircle size={40} className="text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Payment Successful!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Thank you for your payment. We will be in touch shortly.</p>
                  </motion.div>
                ) : status === 'verifying' ? (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 mx-auto mb-6">
                      <Loader size={40} className="text-cyan-400 animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Verifying Payment...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Please do not close this window or refresh the page.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <DollarSign size={12} /> Amount (INR)
                      </label>
                      <input
                        required
                        type="number"
                        min="1"
                        placeholder="e.g. 5000"
                        className="w-full bg-black/5 dark:bg-white/5 border rounded-xl px-4 py-3 outline-none transition-all text-xl font-bold"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                      />
                      <p className="text-xs mt-2 opacity-70">
                        You can pay a booking deposit or the full amount.
                      </p>
                    </div>

                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm px-4 py-2 rounded-xl bg-red-400/10 border border-red-400/20"
                      >
                        <AlertCircle size={16} />
                        {errorMessage || 'Payment verification failed or was cancelled.'}
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full flex items-center justify-center gap-3 py-4 rounded-2xl shadow-xl mt-6"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ₹{amount || '0'}
                          <CreditCard size={18} />
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

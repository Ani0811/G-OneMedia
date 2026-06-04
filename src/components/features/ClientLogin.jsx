import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { Helmet } from 'react-helmet-async'

export default function ClientLogin() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      navigate('/portal/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <Helmet>
            <title>Client Portal | G-One Media</title>
            <meta name="description" content="Secure client portal for G-One Media. Access your dashboard, project milestones, and deliverables." />
            <link rel="canonical" href="https://ani0811.github.io/G-OneMedia/portal" />
          </Helmet>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #ff00e5 100%)', boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}>
              <Shield size={28} className="text-black" />
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
              Client <span className="gradient-text">Portal</span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Access your project dashboard and milestones.
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 lg:p-10"
          >
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-4 rounded-xl border border-white/10 bg-white/5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  loading || !email || !password
                    ? 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                    : 'bg-cyan-400 text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:-translate-y-0.5'
                }`}
              >
                {loading ? 'Signing in...' : <><ArrowRight size={16} /> Sign In</>}
              </button>
            </form>

            <p className="text-center text-[10px] mt-6 font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Credentials provided by G-One Media
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, Loader2, ShieldCheck, Eye, EyeOff, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'
import { useAdminAuth } from '../../../context/AdminAuthContext'

export default function AdminLogin() {
  const { admin, loading: authLoading } = useAdminAuth()
  const [mode, setMode] = useState('login') // 'login' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // If incoming link contains password recovery token, forward to reset password view
    if (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
      navigate(`/admin/reset-password${window.location.search}${window.location.hash}`, { replace: true })
      return
    }

    if (!authLoading && admin && mode === 'login') {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [admin, authLoading, navigate, mode])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      setError(signInError.message || 'Invalid credentials. Access denied.')
      setLoading(false)
    } else if (data?.session) {
      navigate('/admin/dashboard')
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your administrator email address.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (resetError) {
        throw resetError
      }

      setSuccessMessage('Password recovery link sent! Please check your inbox and follow the instructions.')
    } catch (err) {
      const errMsg = err.message || ''
      if (errMsg.toLowerCase().includes('rate limit')) {
        setError('Email rate limit exceeded: Supabase imposes a temporary cooldown (3–4 emails/hr) on auth requests. Please check your inbox/spam for earlier emails or wait a few minutes before trying again.')
      } else {
        setError(errMsg || 'Failed to send recovery email. Please check the email address and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-deep)]">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-blue)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--accent-purple)]/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to site header link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-cyan-400 transition-colors p-1 rounded-lg"
          >
            <ArrowLeft size={14} /> Back to main website
          </Link>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden">
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-blue)] to-transparent opacity-50" />
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <Link to="/" title="Go to homepage">
                <img 
                  src={`${import.meta.env.BASE_URL}G-One.png`.replace(/\/+/g, '/')} 
                  alt="G-One Media Logo" 
                  className="h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'inline-flex';
                  }}
                />
              </Link>
              <div className="hidden items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <ShieldCheck className="w-7 h-7 text-[var(--accent-blue)]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] mb-1">
              {mode === 'login' ? 'Admin Portal' : 'Reset Password'}
            </h1>
            <p className="text-[var(--text-muted)] text-xs">
              {mode === 'login'
                ? 'Authorized administrators only'
                : 'Enter your registered email to receive a recovery link'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3.5 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium leading-relaxed"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center font-medium leading-relaxed flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Admin Email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-11 pr-11 py-3.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex items-center justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccessMessage(null)
                    setMode('forgot')
                  }}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-5 group text-sm cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-3.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Registered Admin Email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-5 group text-sm cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <KeyRound size={16} /> Send Recovery Link
                  </span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccessMessage(null)
                    setMode('login')
                  }}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}


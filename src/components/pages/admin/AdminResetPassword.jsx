import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Loader2, ShieldCheck, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'

export default function AdminResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [sessionChecking, setSessionChecking] = useState(true)
  const [hasValidSession, setHasValidSession] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has an active recovery session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setHasValidSession(true)
        }
      } catch (err) {
        console.warn('Session check warning:', err)
      } finally {
        setSessionChecking(false)
      }
    }

    checkSession()

    // Listen for auth events (e.g. PASSWORD_RECOVERY)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session?.user) {
        setHasValidSession(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.')
      return
    }

    setLoading(true)

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 2500)
    } catch (err) {
      setError(err.message || 'Failed to update password. The link may have expired or is invalid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-deep)]">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-blue)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--accent-purple)]/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-cyan-400 transition-colors p-1 rounded-lg"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden">
          {/* Top border glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-blue)] to-transparent opacity-50" />

          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <Link to="/" title="Go to homepage">
                <img
                  src={`${import.meta.env.BASE_URL}G-One.png`.replace(/\/+/g, '/')}
                  alt="G-One Media Logo"
                  className="h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const fallback = e.target.nextElementSibling
                    if (fallback) fallback.style.display = 'inline-flex'
                  }}
                />
              </Link>
              <div className="hidden items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <ShieldCheck className="w-7 h-7 text-[var(--accent-blue)]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] mb-1">
              Set New Password
            </h1>
            <p className="text-[var(--text-muted)] text-xs">
              Choose a strong password for your administrator account
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Password Updated!</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Your password has been successfully reset. Redirecting to the admin dashboard...
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="btn-primary w-full py-3 text-xs uppercase tracking-wider mt-4"
                >
                  Go to Dashboard Now
                </button>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleResetPassword} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium leading-relaxed flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {!sessionChecking && !hasValidSession && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center font-medium leading-relaxed mb-2">
                    Tip: Ensure you opened this page from the password recovery email link. If the link expired, please request a new one.
                  </div>
                )}

                <div className="space-y-3.5">
                  {/* New Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password (min 6 characters)"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-11 py-3.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-11 py-3.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
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
                    <span>Update Password & Sign In</span>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

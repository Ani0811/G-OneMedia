import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, FileText, Cookie, RefreshCcw, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../../utils/cookies'

export default function LegalModal({ isOpen, onClose, type }) {
  const navigate = useNavigate()
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

  if (!isOpen) return null

  const getDetails = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: Shield,
          color: 'text-cyan-400',
          bg: 'bg-cyan-400/10',
          border: 'border-cyan-400/20',
          content: (
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>Welcome to G-One Media's Privacy Policy. This policy describes how we collect, use, and handle your information when you use our website, products, and services.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>1. Information We Collect</h3>
              <p>We may collect information you provide directly to us, such as your name, email address, and project details when you request a quote or contact us.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>2. How We Use Information</h3>
              <p>We use the information we collect to communicate with you, process transactions, and improve our services.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>3. Information Sharing</h3>
              <p>We do not share your personal information with third parties except as necessary to provide our services or comply with the law.</p>
              <p className="mt-8 text-xs opacity-50">Last updated: May 2026</p>
            </div>
          )
        }
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          color: 'text-fuchsia-400',
          bg: 'bg-fuchsia-400/10',
          border: 'border-fuchsia-400/20',
          content: (
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access our services.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>1. Services</h3>
              <p>G-One Media provides digital agency services including web development, AI automation, and content creation.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>2. Intellectual Property</h3>
              <p>Upon full payment, the client owns the final deliverables. We retain the right to showcase the work in our portfolio unless agreed otherwise.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>3. Limitation of Liability</h3>
              <p>In no event shall G-One Media be liable for any indirect, incidental, special, consequential or punitive damages.</p>
              <p className="mt-8 text-xs opacity-50">Last updated: May 2026</p>
            </div>
          )
        }
      case 'cookies':
        return {
          title: 'Cookie Policy',
          icon: Cookie,
          color: 'text-orange-400',
          bg: 'bg-orange-400/10',
          border: 'border-orange-400/20',
          content: (
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>This Cookie Policy explains how G-One Media uses cookies and similar technologies to recognize you when you visit our website.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>1. What are cookies?</h3>
              <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>2. Why do we use cookies?</h3>
              <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>3. How can I control cookies?</h3>
              <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by resetting your choices below to display the consent dialog again.</p>
              
              <div className="mt-6 p-4 rounded-xl border border-dashed border-orange-400/20 bg-orange-400/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Manage Cookie Preferences</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Clicking reset will remove your choices and show the consent dialog again.</p>
                </div>
                <button
                  onClick={() => {
                    deleteCookie('g1media_cookie_consent')
                    deleteCookie('_ga')
                    deleteCookie('_gid')
                    deleteCookie('_gat')
                    const hostParts = window.location.hostname.split('.')
                    if (hostParts.length >= 2) {
                      const domain = '.' + hostParts.slice(-2).join('.')
                      document.cookie = `_ga=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure`
                      document.cookie = `_gid=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure`
                    }
                    window.location.reload()
                  }}
                  className="btn-secondary py-2! px-4! text-xs! whitespace-nowrap cursor-pointer hover:bg-orange-400/10 hover:border-orange-400/50 hover:text-orange-400!"
                >
                  Reset Preferences
                </button>
              </div>
              
              <p className="mt-8 text-xs opacity-50">Last updated: May 2026</p>
            </div>
          )
        }
      case 'refund':
        return {
          title: 'Refund & Cancellation Policy',
          icon: RefreshCcw,
          color: 'text-emerald-400',
          bg: 'bg-emerald-400/10',
          border: 'border-emerald-400/20',
          content: (
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>At G-One Media, we are committed to client satisfaction. Our refund and cancellation terms are designed to be transparent, straightforward, and fair.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>1. Milestone-Based Assurance</h3>
              <p>Work is delivered in transparent project sprints. If you are not satisfied with initial design prototypes or milestone directions before final deployment, you may request a project review or partial refund.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>2. Eligibility Criteria</h3>
              <p>Refund requests must be initiated within 14 calendar days of payment milestone receipt and prior to production asset handoff or server deployment.</p>
              <h3 className="font-bold mt-6 mb-2" style={{ color: 'var(--text-primary)' }}>3. Dedicated Refund Portal</h3>
              <p>We provide a streamlined automated refund request portal for active client engagements and invoices.</p>
              
              <div className="mt-6 p-4 rounded-xl border border-dashed border-emerald-400/20 bg-emerald-400/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Submit a Refund Request</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Lookup your payment ID and initiate an automated review.</p>
                </div>
                <button
                  onClick={() => {
                    onClose()
                    navigate('/refund')
                  }}
                  className="btn-secondary py-2! px-4! text-xs! whitespace-nowrap cursor-pointer hover:bg-emerald-400/10 hover:border-emerald-400/50 hover:text-emerald-400! flex items-center gap-1.5"
                >
                  <span>Open Portal</span>
                  <ArrowRight size={14} />
                </button>
              </div>
              
              <p className="mt-8 text-xs opacity-50">Last updated: May 2026</p>
            </div>
          )
        }
      default:
        return null
    }
  }

  const details = getDetails()
  if (!details) return null
  const Icon = details.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${details.bg} border ${details.border}`}>
                <Icon size={20} className={details.color} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{details.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {details.content}
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary py-2! px-6! text-sm!"
            >
              Understand
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

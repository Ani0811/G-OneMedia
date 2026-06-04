import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { getCookie, setCookie, deleteCookie } from '../../utils/cookies'
import { initGA } from '../../utils/analytics'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = getCookie('g1media_cookie_consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setCookie('g1media_cookie_consent', 'accepted', 365)
    setIsVisible(false)
    initGA() // Boot GA immediately
  }

  const handleReject = () => {
    setCookie('g1media_cookie_consent', 'rejected', 365)
    setIsVisible(false)
    
    // Clean up GA cookies if they exist
    deleteCookie('_ga')
    deleteCookie('_gid')
    deleteCookie('_gat')
    
    // Clean domain-scoped GA cookies
    const hostParts = window.location.hostname.split('.')
    if (hostParts.length >= 2) {
      const domain = '.' + hostParts.slice(-2).join('.')
      document.cookie = `_ga=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure`
      document.cookie = `_gid=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure`
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center p-4 pointer-events-none">
          {/* Floating Card Container */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="w-full max-w-3xl bg-[#0c0c12]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:border-cyan-400/20 transition-colors duration-500 pointer-events-auto"
          >
            <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Info Section */}
              <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center border border-cyan-400/20 shrink-0 shadow-inner">
                  <Cookie size={18} className="text-cyan-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-xs md:text-sm tracking-tight text-white flex items-center gap-1.5">
                    Cookie Preferences
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </h3>
                  <p className="text-[11px] md:text-xs leading-relaxed max-w-xl text-slate-300">
                    We use cookies to optimize performance, analyze traffic, and personalize content. By accepting, you consent to our policies.
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
                <button 
                  onClick={handleReject}
                  className="flex-1 md:flex-initial px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  Reject
                </button>
                <button 
                  onClick={handleAccept}
                  className="flex-1 md:flex-initial px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-[10px] font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer whitespace-nowrap"
                >
                  Accept
                </button>
                <button 
                  onClick={handleReject}
                  className="hidden md:flex w-7 h-7 rounded-full items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

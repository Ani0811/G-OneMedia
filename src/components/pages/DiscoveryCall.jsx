import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'

export default function DiscoveryCall() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      <Helmet>
        <title>Book a Discovery Call | G-One Media</title>
        <meta name="description" content="Schedule a discovery call with G-One Media to discuss your project, business goals, and see how we can help you scale." />
        <meta name="keywords" content="G-One Media, discovery call, book consultation, marketing strategy call, agency consultation" />
        <link rel="canonical" href="https://ani0811.github.io/G-OneMedia/discovery" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ani0811.github.io/G-OneMedia/discovery" />
        <meta property="og:title" content="Book a Discovery Call | G-One Media" />
        <meta property="og:description" content="Schedule a discovery call with G-One Media to discuss your project, business goals, and see how we can help you scale." />
        <meta property="og:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ani0811.github.io/G-OneMedia/discovery" />
        <meta property="twitter:title" content="Book a Discovery Call | G-One Media" />
        <meta property="twitter:description" content="Schedule a discovery call with G-One Media to discuss your project, business goals, and see how we can help you scale." />
        <meta property="twitter:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />
      </Helmet>

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/8 rounded-full blur-[120px] -z-10" />

      <div className="container-custom max-w-4xl">
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
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
            ✦ Discovery Call Booking
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-3 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Schedule a <span className="gradient-text">Discovery Call</span>
          </h1>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Let's dissect your requirements and map out the system architecture. Pick a time below to get started.
          </p>
        </motion.div>

        {/* Calendly Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-2 overflow-hidden"
        >
          <iframe 
            src="https://calendly.com/gmedia774/30min?hide_event_type_details=1&hide_gdpr_banner=1" 
            width="100%" 
            height="700" 
            frameBorder="0"
            className="rounded-xl bg-white w-full border-none"
            title="Book a Discovery Call"
          ></iframe>
        </motion.div>
      </div>
    </section>
  )
}

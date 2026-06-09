import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, CheckCircle2, Lock, Zap, Globe2, BarChart3, Users } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

const STATS = [
  { icon: <TrendingUp size={18} />, value: '340%', label: 'Avg. Traffic Lift' },
  { icon: <BarChart3 size={18} />, value: '2.4×', label: 'ROAS Increase' },
  { icon: <Users size={18} />, value: '120+', label: 'Brands Scaled' },
  { icon: <Globe2 size={18} />, value: '18', label: 'Countries Reached' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
}

export default function TrendingBreakdown() {
  const [campaign, setCampaign] = useState(null)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { fetchActiveCampaign() }, [])

  const fetchActiveCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_campaigns')
        .select('*')
        .eq('is_active', true)
        .single()
      if (error) throw error
      if (data) setCampaign(data)
    } catch {
      setCampaign({
        event_month: 'June 2026',
        event_name: 'FIFA World Cup 2026',
        headline: 'How Brands Are Capitalizing on the World Cup Traffic Surge',
        description: 'The upcoming World Cup is driving massive global engagement. Top e-commerce brands are pivoting their messaging to ride the wave — here\'s exactly how you can apply these tactics to your store.',
        bullets: [
          'Real-time action triggers (flash sales when a team scores)',
          'Geo-targeted ads around host cities for hyper-local relevance',
          'Tournament-style bracket promotions for compounding engagement',
        ],
        image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !campaign?.id) return
    setIsSubmitting(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('trending_campaign_leads')
        .insert([{ campaign_id: campaign.id, email }])
      if (error) throw error
      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!campaign) return null

  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Ambient glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div className="container-custom relative z-10">

        {/* ── Section label ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
            style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)', color: '#f87171' }}>
            <TrendingUp size={13} />
            Live Trend Report
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            {campaign.event_month}
          </span>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
          className="text-4xl md:text-5xl font-black mb-4 max-w-2xl leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Capitalise on the
          <span className="gradient-text block">{campaign.event_name}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg max-w-xl mb-16"
          style={{ color: 'var(--text-secondary)' }}
        >
          Global events create massive traffic windows. Here's the exact playbook top brands are running right now.
        </motion.p>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.14 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {STATS.map((s, i) => (
            <div key={i} className="glass-card p-5 flex items-center gap-4 hover:scale-[1.03] transition-transform duration-300">
              <div className="p-2.5 rounded-xl shrink-0"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left: Image card (3 cols) */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl ring-1"
            style={{ boxShadow: '0 32px 80px -16px rgba(239,68,68,0.25)', ringColor: 'rgba(255,255,255,0.08)' }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(5,5,8,1) 0%, rgba(5,5,8,0.6) 35%, transparent 65%)' }} />

            <img
              src={campaign.image_url}
              alt={campaign.event_name}
              className="w-full aspect-[4/3] object-cover transition-transform duration-[2s] hover:scale-105"
            />

            {/* Bottom overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
                  style={{ background: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.4)', color: '#fca5a5' }}>
                  <Zap size={11} />
                  {campaign.event_name}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight max-w-lg">
                {campaign.headline}
              </h3>

              {/* Mini tag row */}
              <div className="flex flex-wrap gap-2">
                {['SEO', 'Paid Ads', 'CRO', 'Email'].map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Breakdown + lead capture (2 cols) */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Description card */}
            <div className="glass-card p-7 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)' }} />
              <p className="text-base leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>
                {campaign.description}
              </p>
            </div>

            {/* Tactic bullets card */}
            <div className="glass-card p-7">
              <p className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: 'var(--text-muted)' }}>
                Winning Tactics
              </p>
              <ul className="space-y-4">
                {campaign.bullets?.map((bullet, idx) => (
                  <motion.li
                    key={idx}
                    custom={idx + 2}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full"
                      style={{ background: 'rgba(239,68,68,0.15)' }}>
                      <CheckCircle2 size={12} style={{ color: '#f87171' }} />
                    </div>
                    <span className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {bullet}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Lead capture card */}
            <div className="glass-card p-7 relative overflow-hidden"
              style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.04) 0%, transparent 60%)' }} />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Lock size={15} style={{ color: '#f87171' }} />
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Unlock the Full Implementation Playbook
                </p>
              </div>
              <p className="text-xs mb-5 relative z-10" style={{ color: 'var(--text-muted)' }}>
                Free. Sent instantly to your inbox.
              </p>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl border"
                  style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#4ade80' }}
                >
                  <CheckCircle2 size={20} />
                  <p className="font-semibold text-sm">Playbook on its way — check your inbox!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative z-10">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    style={{
                      background: 'var(--bg-deep)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60 text-sm"
                    style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff' }}
                  >
                    {isSubmitting ? 'Sending…' : 'Get the Playbook'}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>
                </form>
              )}
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

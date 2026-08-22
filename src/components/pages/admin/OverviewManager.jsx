import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, PhoneCall, Star, FolderGit2, ArrowUpRight, CheckCircle2, Clock, Mail, RefreshCw, ExternalLink } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'

export default function OverviewManager({ onNavigateTab }) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    leadsCount: 0,
    callsCount: 0,
    reviewsCount: 0,
    projectsCount: 0,
    avgRating: 5.0,
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [recentCalls, setRecentCalls] = useState([])

  const fetchOverviewData = async () => {
    try {
      // 1. Leads
      const { data: leads, count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5)

      // 2. Discovery Calls
      const { data: calls, count: callsCount } = await supabase
        .from('discovery_calls')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5)

      // 3. Reviews
      const { data: reviews, count: reviewsCount } = await supabase
        .from('reviews')
        .select('rating', { count: 'exact' })

      // 4. Portfolio Projects
      const { count: projectsCount } = await supabase
        .from('portfolio_projects')
        .select('*', { count: 'exact', head: true })

      // 5. Team Members
      const { count: teamCount } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      let avg = 5.0
      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((acc, r) => acc + (r.rating || 5), 0)
        avg = (total / reviews.length).toFixed(1)
      }

      setStats({
        leadsCount: leadsCount || 0,
        callsCount: callsCount || 0,
        reviewsCount: reviewsCount || 0,
        projectsCount: projectsCount || 0,
        teamCount: teamCount || 0,
        avgRating: avg,
      })

      setRecentLeads(leads || [])
      setRecentCalls(calls || [])
    } catch (err) {
      console.error('Error fetching overview stats:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchOverviewData()
  }

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats.leadsCount,
      label: 'Form Submissions',
      icon: Users,
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      tab: 'leads',
    },
    {
      title: 'Discovery Calls',
      value: stats.callsCount,
      label: 'Scheduled Sessions',
      icon: PhoneCall,
      color: 'from-purple-500/20 to-indigo-500/20',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      tab: 'leads',
    },
    {
      title: 'Client Reviews',
      value: `${stats.reviewsCount} (${stats.avgRating}★)`,
      label: 'Approved Testimonials',
      icon: Star,
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      tab: 'testimonials',
    },
    {
      title: 'Portfolio Showcase',
      value: stats.projectsCount,
      label: 'Active Case Studies',
      icon: FolderGit2,
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      tab: 'portfolio',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner with Supabase Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-[var(--border-subtle)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">System Overview</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Real-time telemetry and management controls for G-One Media
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Supabase Live
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onNavigateTab && onNavigateTab(card.tab)}
              className={`p-5 rounded-2xl glass-card border ${card.border} bg-gradient-to-br ${card.color} hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-white/5 ${card.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-1">
                {loading ? '...' : card.value}
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>{card.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-cyan-400 font-semibold">
                  Manage <ArrowUpRight size={12} />
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Hero Headline', tab: 'hero', desc: 'Homepage Copy' },
          { label: 'Pricing Packages', tab: 'pricing', desc: 'Pricing Tiers' },
          { label: 'Services', tab: 'services', desc: 'Deliverables' },
          { label: 'Team & Founders', tab: 'team', desc: 'Profiles & Bios' },
          { label: 'Review Moderation', tab: 'testimonials', desc: 'Client Feedback' },
          { label: 'Admins & Access', tab: 'admins', desc: 'Roles & Staff' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigateTab && onNavigateTab(action.tab)}
            className="p-4 rounded-xl glass-card border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/40 hover:bg-[var(--accent-blue)]/5 transition-all text-left group cursor-pointer"
          >
            <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
              {action.label}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{action.desc}</div>
          </button>
        ))}
      </div>

      {/* Recent Leads & Inquiries Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Form Leads */}
        <div className="p-6 rounded-2xl glass-card border border-[var(--border-subtle)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Users size={18} className="text-cyan-400" />
              Recent Form Leads
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('leads')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                No recent leads captured yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[var(--text-muted)]">
                    <th className="pb-2 font-semibold">Client</th>
                    <th className="pb-2 font-semibold">Service</th>
                    <th className="pb-2 font-semibold">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5">
                        <div className="font-bold text-[var(--text-primary)]">{lead.name}</div>
                        <a href={`mailto:${lead.email}`} className="text-[11px] text-[var(--text-muted)] hover:text-cyan-400">
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-2.5 text-[var(--text-secondary)]">{lead.service || 'General'}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-cyan-300 text-[10px] font-semibold">
                          {lead.budget || 'Custom'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Discovery Calls */}
        <div className="p-6 rounded-2xl glass-card border border-[var(--border-subtle)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <PhoneCall size={18} className="text-purple-400" />
              Recent Discovery Calls
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('leads')}
              className="text-xs text-purple-400 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            {recentCalls.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                No discovery calls scheduled yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[var(--text-muted)]">
                    <th className="pb-2 font-semibold">Client</th>
                    <th className="pb-2 font-semibold">Scheduled Date</th>
                    <th className="pb-2 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5">
                        <div className="font-bold text-[var(--text-primary)]">{call.name}</div>
                        <a href={`mailto:${call.email}`} className="text-[11px] text-[var(--text-muted)] hover:text-purple-400">
                          {call.email}
                        </a>
                      </td>
                      <td className="py-2.5 text-[var(--text-secondary)]">{call.date || 'Pending'}</td>
                      <td className="py-2.5 text-purple-300 font-semibold">{call.time || 'TBD'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

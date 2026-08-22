import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { Loader2, Users, PhoneCall, Calendar, Mail, Trash2, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react'

export default function LeadsManager() {
  const [activeSubTab, setActiveSubTab] = useState('leads') // 'leads' | 'calls' | 'bookings'
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState([])
  const [calls, setCalls] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [leadsRes, callsRes, bookingsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('discovery_calls').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      ])

      if (leadsRes.data) setLeads(leadsRes.data)
      if (callsRes.data) setCalls(callsRes.data)
      if (bookingsRes.data) setBookings(bookingsRes.data)
    } catch (err) {
      console.error('Error fetching leads:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id)
      if (error) throw error
      setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)))
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleDeleteLead = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      if (table === 'leads') setLeads(leads.filter((l) => l.id !== id))
      if (table === 'discovery_calls') setCalls(calls.filter((c) => c.id !== id))
      if (table === 'bookings') setBookings(bookings.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Error deleting record:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-[var(--accent-blue)]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Inquiries & Leads Hub</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Client contacts, scheduled discovery calls, and project consultation requests
          </p>
        </div>

        {/* Subtab selector */}
        <div className="flex p-1 rounded-xl bg-black/20 border border-white/5 text-xs">
          <button
            onClick={() => setActiveSubTab('leads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'leads' ? 'bg-[var(--accent-blue)] text-black' : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <Users size={14} /> Form Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveSubTab('calls')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'calls' ? 'bg-[var(--accent-blue)] text-black' : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <PhoneCall size={14} /> Discovery Calls ({calls.length})
          </button>
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'bookings' ? 'bg-[var(--accent-blue)] text-black' : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <Calendar size={14} /> Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {/* Leads Table */}
      {activeSubTab === 'leads' && (
        <div className="overflow-x-auto rounded-2xl glass-card border border-[var(--border-subtle)]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <th className="p-4 font-bold">Client / Company</th>
                <th className="p-4 font-bold">Service</th>
                <th className="p-4 font-bold">Budget</th>
                <th className="p-4 font-bold">Details / Message</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">No form leads found.</td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[var(--text-primary)]">{l.name}</div>
                      <div className="text-[11px] text-cyan-400">{l.company || 'Individual'}</div>
                      <a href={`mailto:${l.email}`} className="text-[11px] text-[var(--text-muted)] hover:underline">
                        {l.email}
                      </a>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">{l.service || 'General'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-cyan-300 font-semibold">
                        {l.budget || 'Custom'}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-muted)] max-w-xs truncate" title={l.description}>
                      {l.description || 'No description provided'}
                    </td>
                    <td className="p-4">
                      <select
                        value={l.status || 'new'}
                        onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                        className="px-2 py-1 bg-black/40 border border-white/10 rounded-lg text-[11px] font-semibold text-cyan-300 outline-none"
                      >
                        <option value="new" className="bg-slate-900">New</option>
                        <option value="contacted" className="bg-slate-900">Contacted</option>
                        <option value="converted" className="bg-slate-900">Converted</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteLead('leads', l.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Discovery Calls Table */}
      {activeSubTab === 'calls' && (
        <div className="overflow-x-auto rounded-2xl glass-card border border-[var(--border-subtle)]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <th className="p-4 font-bold">Client / Company</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">Scheduled Date</th>
                <th className="p-4 font-bold">Time Slot</th>
                <th className="p-4 font-bold">Message</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {calls.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">No discovery calls scheduled yet.</td>
                </tr>
              ) : (
                calls.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[var(--text-primary)]">{c.name}</div>
                      <div className="text-[11px] text-purple-400">{c.company || 'Direct'}</div>
                    </td>
                    <td className="p-4">
                      <div><a href={`mailto:${c.email}`} className="text-cyan-400 hover:underline">{c.email}</a></div>
                      <div className="text-[11px] text-[var(--text-muted)]">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)] font-semibold">{c.date || 'Pending'}</td>
                    <td className="p-4 text-purple-300 font-bold">{c.time || 'TBD'}</td>
                    <td className="p-4 text-[var(--text-muted)] max-w-xs truncate">{c.message || '-'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteLead('discovery_calls', c.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings Table */}
      {activeSubTab === 'bookings' && (
        <div className="overflow-x-auto rounded-2xl glass-card border border-[var(--border-subtle)]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <th className="p-4 font-bold">Client Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Service</th>
                <th className="p-4 font-bold">Budget</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">No modal bookings found.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-[var(--text-primary)]">{b.name}</td>
                    <td className="p-4"><a href={`mailto:${b.email}`} className="text-cyan-400 hover:underline">{b.email}</a></td>
                    <td className="p-4 text-[var(--text-secondary)]">{b.service}</td>
                    <td className="p-4 text-cyan-300 font-semibold">{b.budget || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold capitalize">
                        {b.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteLead('bookings', b.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

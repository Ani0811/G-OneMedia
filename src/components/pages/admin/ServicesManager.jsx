import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { Loader2, Plus, Trash2, Edit, X, Save, Clock, ExternalLink, Sparkles, RefreshCw } from 'lucide-react'
import { convertInrToUsd, convertInrToEur } from '../../../utils/currencyConverter'

export default function ServicesManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [services, setServices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Development',
    duration: '',
    price_inr: '',
    price_usd: '',
    price_eur: '',
    original_price_inr: '',
    original_price_usd: '',
    original_price_eur: '',
    link: '',
    icon: 'landing-page.png',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      if (data) setServices(data)
    } catch (err) {
      console.error('Error fetching services:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    const defaultInr = '₹8,499'
    const defaultOrigInr = '₹16,999'
    setFormData({
      name: '',
      category: 'Development',
      duration: '3 - 5 days',
      price_inr: defaultInr,
      price_usd: convertInrToUsd(defaultInr) || '$109',
      price_eur: convertInrToEur(defaultInr) || '€99',
      original_price_inr: defaultOrigInr,
      original_price_usd: convertInrToUsd(defaultOrigInr) || '$219',
      original_price_eur: convertInrToEur(defaultOrigInr) || '€199',
      link: '',
      icon: 'landing-page.png',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (srv) => {
    setEditingId(srv.id)
    setFormData({
      name: srv.name || '',
      category: srv.category || 'Development',
      duration: srv.duration || '',
      price_inr: srv.price_inr || '',
      price_usd: srv.price_usd || convertInrToUsd(srv.price_inr) || '',
      price_eur: srv.price_eur || convertInrToEur(srv.price_inr) || '',
      original_price_inr: srv.original_price_inr || '',
      original_price_usd: srv.original_price_usd || (srv.original_price_inr ? convertInrToUsd(srv.original_price_inr) : ''),
      original_price_eur: srv.original_price_eur || (srv.original_price_inr ? convertInrToEur(srv.original_price_inr) : ''),
      link: srv.link || '',
      icon: srv.icon || 'landing-page.png',
    })
    setIsModalOpen(true)
  }

  const handleInrChange = (val) => {
    const autoUsd = convertInrToUsd(val)
    const autoEur = convertInrToEur(val)
    setFormData((prev) => ({
      ...prev,
      price_inr: val,
      price_usd: autoUsd || prev.price_usd,
      price_eur: autoEur || prev.price_eur,
    }))
  }

  const handleOriginalInrChange = (val) => {
    const autoUsd = convertInrToUsd(val)
    const autoEur = convertInrToEur(val)
    setFormData((prev) => ({
      ...prev,
      original_price_inr: val,
      original_price_usd: autoUsd || prev.original_price_usd,
      original_price_eur: autoEur || prev.original_price_eur,
    }))
  }

  const handleRecomputeCurrencies = () => {
    if (formData.price_inr) {
      setFormData((prev) => ({
        ...prev,
        price_usd: convertInrToUsd(prev.price_inr),
        price_eur: convertInrToEur(prev.price_inr),
        original_price_usd: prev.original_price_inr ? convertInrToUsd(prev.original_price_inr) : prev.original_price_usd,
        original_price_eur: prev.original_price_inr ? convertInrToEur(prev.original_price_inr) : prev.original_price_eur,
      }))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return
    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setServices(services.filter((s) => s.id !== id))
    } catch (err) {
      console.error('Error deleting service:', err)
      alert('Failed to delete service: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: formData.name,
      category: formData.category,
      duration: formData.duration,
      price_inr: formData.price_inr,
      price_usd: formData.price_usd || convertInrToUsd(formData.price_inr),
      price_eur: formData.price_eur || convertInrToEur(formData.price_inr),
      original_price_inr: formData.original_price_inr || null,
      original_price_usd: formData.original_price_usd || (formData.original_price_inr ? convertInrToUsd(formData.original_price_inr) : null),
      original_price_eur: formData.original_price_eur || (formData.original_price_inr ? convertInrToEur(formData.original_price_inr) : null),
      link: formData.link || null,
      icon: formData.icon,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('services').insert([payload])
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchServices()
    } catch (err) {
      console.error('Error saving service:', err)
      alert('Error saving service: ' + err.message)
    } finally {
      setSaving(false)
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
          <h2 className="text-xl sm:text-2xl font-black">Individual Services</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Manage individual service offerings with automatic INR → USD/EUR currency conversion
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-blue)] text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto rounded-2xl glass-card border border-[var(--border-subtle)] -webkit-overflow-scrolling-touch">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
              <th className="p-4 font-bold">Service Name</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Duration</th>
              <th className="p-4 font-bold">Price (INR)</th>
              <th className="p-4 font-bold">Price (USD)</th>
              <th className="p-4 font-bold">Price (EUR)</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[var(--text-muted)]">
                  No individual services found. Click "Add New Service" to create one.
                </td>
              </tr>
            ) : (
              services.map((srv) => (
                <tr key={srv.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-[var(--text-primary)]">{srv.name}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{srv.category}</td>
                  <td className="p-4 text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" />
                      {srv.duration || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-cyan-300 font-semibold">{srv.price_inr}</td>
                  <td className="p-4 text-purple-300 font-semibold">{srv.price_usd || convertInrToUsd(srv.price_inr)}</td>
                  <td className="p-4 text-blue-300 font-semibold">{srv.price_eur || convertInrToEur(srv.price_inr)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto overscroll-contain">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg my-auto rounded-2xl sm:rounded-3xl glass-card border border-white/10 shadow-2xl p-5 sm:p-7 bg-[var(--bg-primary)] max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                      {editingId ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Enter price in INR to auto-convert USD ($) & EUR (€)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs overscroll-contain">
                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. AI Chatbot Integration"
                    className="w-full px-3.5 py-2.5 bg-black/25 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Development"
                      className="w-full px-3 py-2 bg-black/25 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 4 - 7 days"
                      className="w-full px-3 py-2 bg-black/25 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Price section with auto-convert */}
                <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                      <Sparkles size={13} className="text-cyan-400" />
                      Service Pricing (Auto-Converted)
                    </span>
                    <button
                      type="button"
                      onClick={handleRecomputeCurrencies}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold hover:underline"
                      title="Sync USD and EUR from INR"
                    >
                      <RefreshCw size={10} /> Auto-Sync
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="font-semibold text-[var(--text-secondary)] block mb-1 text-[11px]">
                        Price (INR ₹) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.price_inr}
                        onChange={(e) => handleInrChange(e.target.value)}
                        placeholder="₹13,999"
                        className="w-full px-3 py-2 bg-black/40 border border-cyan-500/30 rounded-xl text-[var(--text-primary)] font-semibold outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[var(--text-secondary)] block mb-1 text-[11px]">
                        Price (USD $)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.price_usd}
                        onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                        placeholder="$169"
                        className="w-full px-3 py-2 bg-black/30 border border-[var(--border-subtle)] rounded-xl text-purple-300 font-semibold outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[var(--text-secondary)] block mb-1 text-[11px]">
                        Price (EUR €)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.price_eur}
                        onChange={(e) => setFormData({ ...formData, price_eur: e.target.value })}
                        placeholder="€149"
                        className="w-full px-3 py-2 bg-black/30 border border-[var(--border-subtle)] rounded-xl text-blue-300 font-semibold outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Original price section */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-muted)] text-[11px]">
                      Original / Strikethrough Price (Optional)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="font-medium text-[var(--text-muted)] block mb-1 text-[10px]">
                        Original (INR ₹)
                      </label>
                      <input
                        type="text"
                        value={formData.original_price_inr}
                        onChange={(e) => handleOriginalInrChange(e.target.value)}
                        placeholder="₹27,999"
                        className="w-full px-3 py-2 bg-black/30 border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-[var(--text-muted)] block mb-1 text-[10px]">
                        Original (USD $)
                      </label>
                      <input
                        type="text"
                        value={formData.original_price_usd}
                        onChange={(e) => setFormData({ ...formData, original_price_usd: e.target.value })}
                        placeholder="$329"
                        className="w-full px-3 py-2 bg-black/30 border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-[var(--text-muted)] block mb-1 text-[10px]">
                        Original (EUR €)
                      </label>
                      <input
                        type="text"
                        value={formData.original_price_eur}
                        onChange={(e) => setFormData({ ...formData, original_price_eur: e.target.value })}
                        placeholder="€299"
                        className="w-full px-3 py-2 bg-black/30 border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">
                    Direct External Booking Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://calendly.com/... (optional)"
                    className="w-full px-3.5 py-2.5 bg-black/25 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Sticky Action Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent-blue)] text-black font-bold hover:bg-cyan-400 disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save Service
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

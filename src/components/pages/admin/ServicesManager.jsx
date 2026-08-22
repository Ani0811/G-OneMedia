import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { Loader2, Plus, Trash2, Edit, X, Save, Clock, ExternalLink } from 'lucide-react'

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
    setFormData({
      name: '',
      category: 'Development',
      duration: '3 - 5 days',
      price_inr: '₹8,499',
      price_usd: '$109',
      price_eur: '€99',
      original_price_inr: '₹16,999',
      original_price_usd: '$219',
      original_price_eur: '€199',
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
      price_usd: srv.price_usd || '',
      price_eur: srv.price_eur || '',
      original_price_inr: srv.original_price_inr || '',
      original_price_usd: srv.original_price_usd || '',
      original_price_eur: srv.original_price_eur || '',
      link: srv.link || '',
      icon: srv.icon || 'landing-page.png',
    })
    setIsModalOpen(true)
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
      price_usd: formData.price_usd,
      price_eur: formData.price_eur,
      original_price_inr: formData.original_price_inr || null,
      original_price_usd: formData.original_price_usd || null,
      original_price_eur: formData.original_price_eur || null,
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
            Manage individual service offerings and custom deliverables
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-blue)] text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto rounded-2xl glass-card border border-[var(--border-subtle)]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
              <th className="p-4 font-bold">Service Name</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Duration</th>
              <th className="p-4 font-bold">Price (INR)</th>
              <th className="p-4 font-bold">Price (USD)</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
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
                  <td className="p-4 text-purple-300 font-semibold">{srv.price_usd}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg my-8 rounded-3xl glass-card border border-white/10 shadow-2xl p-6 sm:p-8 bg-[var(--bg-primary)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <h3 className="text-lg font-black text-[var(--text-primary)]">
                  {editingId ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. AI Chatbot Integration"
                    className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Development"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 4 - 7 days"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Price (INR) *</label>
                    <input
                      type="text"
                      required
                      value={formData.price_inr}
                      onChange={(e) => setFormData({ ...formData, price_inr: e.target.value })}
                      placeholder="₹13,999"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Price (USD) *</label>
                    <input
                      type="text"
                      required
                      value={formData.price_usd}
                      onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                      placeholder="$169"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Price (EUR) *</label>
                    <input
                      type="text"
                      required
                      value={formData.price_eur}
                      onChange={(e) => setFormData({ ...formData, price_eur: e.target.value })}
                      placeholder="€149"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Direct External Booking Link (Optional)</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://calendly.com/... (optional)"
                    className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent-blue)] text-black font-bold hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
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

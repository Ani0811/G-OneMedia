import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { Loader2, Plus, Trash2, Edit, X, Save, Check, Sparkles } from 'lucide-react'

export default function PricingManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [packages, setPackages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Websites & Apps',
    description: '',
    duration: '',
    period: '/ project',
    price_inr: '',
    price_usd: '',
    price_eur: '',
    original_price_inr: '',
    original_price_usd: '',
    original_price_eur: '',
    features: [''],
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      if (data) setPackages(data)
    } catch (err) {
      console.error('Error fetching packages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      name: '',
      category: 'Websites & Apps',
      description: '',
      duration: '1 - 2 weeks',
      period: '/ project',
      price_inr: '₹12,999',
      price_usd: '$169',
      price_eur: '€159',
      original_price_inr: '₹22,999',
      original_price_usd: '$279',
      original_price_eur: '€259',
      features: ['Responsive Design', 'Custom UI/UX', 'SEO Optimization'],
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (pkg) => {
    setEditingId(pkg.id)
    setFormData({
      name: pkg.name || '',
      category: pkg.category || 'Websites & Apps',
      description: pkg.description || '',
      duration: pkg.duration || '',
      period: pkg.period || '/ project',
      price_inr: pkg.price_inr || '',
      price_usd: pkg.price_usd || '',
      price_eur: pkg.price_eur || '',
      original_price_inr: pkg.original_price_inr || '',
      original_price_usd: pkg.original_price_usd || '',
      original_price_eur: pkg.original_price_eur || '',
      features: Array.isArray(pkg.features) && pkg.features.length > 0 ? pkg.features : [''],
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing package?')) return
    try {
      const { error } = await supabase.from('pricing_packages').delete().eq('id', id)
      if (error) throw error
      setPackages(packages.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Error deleting package:', err)
      alert('Failed to delete package: ' + err.message)
    }
  }

  const handleFeatureChange = (index, val) => {
    const updated = [...formData.features]
    updated[index] = val
    setFormData({ ...formData, features: updated })
  }

  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const removeFeatureInput = (index) => {
    const updated = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: updated.length ? updated : [''] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      duration: formData.duration,
      period: formData.period,
      price_inr: formData.price_inr,
      price_usd: formData.price_usd,
      price_eur: formData.price_eur,
      original_price_inr: formData.original_price_inr || null,
      original_price_usd: formData.original_price_usd || null,
      original_price_eur: formData.original_price_eur || null,
      features: formData.features.filter((f) => f.trim() !== ''),
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('pricing_packages')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('pricing_packages')
          .insert([payload])
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchPackages()
    } catch (err) {
      console.error('Error saving package:', err)
      alert('Error saving package: ' + err.message)
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
          <h2 className="text-xl sm:text-2xl font-black">Pricing Packages</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Manage pricing tiers displayed on the website
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-blue)] text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add New Tier
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl glass-card border border-[var(--border-subtle)] text-[var(--text-muted)] text-sm">
            No pricing packages found. Click "Add New Tier" to create your first package.
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-6 rounded-2xl glass-card border border-[var(--border-subtle)] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                    {pkg.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">
                    {pkg.category}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    {pkg.price_inr} <span className="text-xs font-normal text-[var(--text-muted)]">/ {pkg.price_usd}</span>
                  </div>
                  {pkg.duration && (
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      Timeline: {pkg.duration}
                    </div>
                  )}
                </div>

                <p className="text-xs text-[var(--text-secondary)] mb-4">{pkg.description}</p>

                <div className="space-y-1.5 mb-6">
                  {(pkg.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Check size={12} className="text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-all cursor-pointer"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl my-8 rounded-3xl glass-card border border-white/10 shadow-2xl p-6 sm:p-8 bg-[var(--bg-primary)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <h3 className="text-lg font-black text-[var(--text-primary)]">
                  {editingId ? 'Edit Pricing Package' : 'Create Pricing Package'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Plan Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Growth"
                      className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Websites & Apps"
                      className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
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
                      placeholder="₹12,999"
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
                      placeholder="€159"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Timeline / Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 1 - 2 weeks"
                      className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Billing Period</label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="e.g. / project"
                      className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Description</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description of this package target audience"
                    className="w-full px-3.5 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                {/* Features List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-[var(--text-secondary)]">Features Included</label>
                    <button
                      type="button"
                      onClick={addFeatureInput}
                      className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          placeholder={`Feature #${idx + 1}`}
                          className="flex-1 px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="p-2 text-[var(--text-muted)] hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-blue)] text-black font-bold hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save Package
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

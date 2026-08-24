import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { Loader2, Trash2, CheckCircle2, XCircle, Star, Plus, X, Save } from 'lucide-react'

export default function ReviewsManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('all') // 'all' | 'approved' | 'pending'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    review: '',
    image_url: '',
    is_approved: true,
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setReviews(data)
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleApproval = async (rev) => {
    try {
      const updatedStatus = !rev.is_approved
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: updatedStatus })
        .eq('id', rev.id)

      if (error) throw error
      setReviews(reviews.map((r) => (r.id === rev.id ? { ...r, is_approved: updatedStatus } : r)))
    } catch (err) {
      console.error('Error updating review status:', err)
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id)
      if (error) throw error
      setReviews(reviews.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Error deleting review:', err)
      alert('Failed to delete review: ' + err.message)
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase.from('reviews').insert([formData])
      if (error) throw error

      setIsModalOpen(false)
      fetchReviews()
    } catch (err) {
      console.error('Error creating review:', err)
      alert('Failed to create review: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'approved') return r.is_approved
    if (filter === 'pending') return !r.is_approved
    return true
  })

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
          <h2 className="text-xl sm:text-2xl font-black">Client Testimonials & Reviews</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Moderate incoming client feedback and add verified testimonials
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filters */}
          <div className="flex p-1 rounded-xl bg-black/20 border border-white/5 text-xs">
            {['all', 'approved', 'pending'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                  filter === f ? 'bg-[var(--accent-blue)] text-black' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[var(--accent-blue)] text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Plus size={14} /> Add Review
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl glass-card border border-[var(--border-subtle)] text-[var(--text-muted)] text-sm">
            No testimonials match the selected filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-2xl glass-card border flex flex-col justify-between transition-all ${
                rev.is_approved ? 'border-[var(--border-subtle)]' : 'border-amber-500/30 bg-amber-500/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {rev.image_url ? (
                      <img
                        src={rev.image_url}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-400">
                        {rev.name?.charAt(0) || 'C'}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-[var(--text-primary)]">{rev.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{rev.role || 'Client'}</div>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed mb-4">
                  "{rev.review}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => toggleApproval(rev)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    rev.is_approved
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  }`}
                >
                  {rev.is_approved ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  {rev.is_approved ? 'Approved' : 'Pending Approval'}
                </button>

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto overscroll-contain">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg my-auto rounded-2xl sm:rounded-3xl glass-card border border-white/10 shadow-2xl p-5 sm:p-7 bg-[var(--bg-primary)] max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 shrink-0">
                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">Add Verified Testimonial</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs overscroll-contain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Arjun Mehta"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Role / Company</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Founder, NovaTech"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Star Rating (1-5)</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    >
                      <option value="5" className="bg-slate-900">5 Stars (Excellent)</option>
                      <option value="4" className="bg-slate-900">4 Stars (Great)</option>
                      <option value="3" className="bg-slate-900">3 Stars (Average)</option>
                      <option value="2" className="bg-slate-900">2 Stars (Poor)</option>
                      <option value="1" className="bg-slate-900">1 Star (Bad)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Client Avatar URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Review Content *</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Enter the client testimonial text here..."
                    className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

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
                    Save Testimonial
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

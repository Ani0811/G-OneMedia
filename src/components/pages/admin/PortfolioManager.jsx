import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { Loader2, Plus, Trash2, Edit, X, Save, Eye, EyeOff, ExternalLink } from 'lucide-react'

export default function PortfolioManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [projects, setProjects] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Websites',
    category: 'Full Stack',
    description: '',
    image: '',
    link: '',
    case_study_slug: '',
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      if (data) setProjects(data)
    } catch (err) {
      console.error('Error fetching portfolio projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      title: '',
      type: 'Websites',
      category: 'SaaS • Full Stack',
      description: '',
      image: '',
      link: '',
      case_study_slug: '',
      sort_order: projects.length,
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (proj) => {
    setEditingId(proj.id)
    setFormData({
      title: proj.title || '',
      type: proj.type || 'Websites',
      category: proj.category || '',
      description: proj.description || '',
      image: proj.image || '',
      link: proj.link || '',
      case_study_slug: proj.case_study_slug || '',
      sort_order: proj.sort_order || 0,
      is_active: proj.is_active ?? true,
    })
    setIsModalOpen(true)
  }

  const toggleActive = async (proj) => {
    try {
      const newStatus = !proj.is_active
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ is_active: newStatus })
        .eq('id', proj.id)
      if (error) throw error
      setProjects(projects.map((p) => (p.id === proj.id ? { ...p, is_active: newStatus } : p)))
    } catch (err) {
      console.error('Error toggling status:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio project?')) return
    try {
      const { error } = await supabase.from('portfolio_projects').delete().eq('id', id)
      if (error) throw error
      setProjects(projects.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: formData.title,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      link: formData.link || null,
      case_study_slug: formData.case_study_slug || null,
      sort_order: parseInt(formData.sort_order) || 0,
      is_active: formData.is_active,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('portfolio_projects').insert([payload])
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchProjects()
    } catch (err) {
      console.error('Error saving portfolio project:', err)
      alert('Error saving project: ' + err.message)
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
          <h2 className="text-xl sm:text-2xl font-black">Portfolio Projects</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Manage showcase projects displayed on the portfolio section
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-blue)] text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl glass-card border border-[var(--border-subtle)] text-[var(--text-muted)] text-sm">
            No portfolio projects found. Click "Add Project" to upload one.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className={`p-5 rounded-2xl glass-card border transition-all flex flex-col justify-between ${
                proj.is_active ? 'border-[var(--border-subtle)] hover:border-cyan-500/40' : 'border-red-500/20 opacity-70'
              }`}
            >
              <div>
                {proj.image && (
                  <div className="rounded-xl overflow-hidden aspect-video mb-3 bg-black/40 relative">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-cyan-300">
                        {proj.type}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{proj.title}</h3>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">#{proj.sort_order}</span>
                </div>
                <div className="text-[11px] text-cyan-400 mb-2 font-medium">{proj.category}</div>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4">{proj.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                <button
                  onClick={() => toggleActive(proj)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                    proj.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                  }`}
                >
                  {proj.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                  {proj.is_active ? 'Active' : 'Hidden'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
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
                  {editingId ? 'Edit Project' : 'Add New Portfolio Project'}
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
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. FitFlow Gym SaaS"
                    className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    >
                      <option value="Websites" className="bg-slate-900">Websites</option>
                      <option value="Client Projects" className="bg-slate-900">Client Projects</option>
                      <option value="AI Agents" className="bg-slate-900">AI Agents</option>
                      <option value="Reels" className="bg-slate-900">Reels</option>
                      <option value="YT Videos" className="bg-slate-900">YT Videos</option>
                      <option value="Vlogs" className="bg-slate-900">Vlogs</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Food SaaS • Full Stack"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Cover Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or relative path"
                    className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Description *</label>
                  <textarea
                    rows="2"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short summary of results and deliverables"
                    className="w-full px-3.5 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Case Study Slug</label>
                    <input
                      type="text"
                      value={formData.case_study_slug}
                      onChange={(e) => setFormData({ ...formData, case_study_slug: e.target.value })}
                      placeholder="e.g. fitflow-saas"
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                      className="w-full px-3 py-2 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>
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
                    Save Project
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

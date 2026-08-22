import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  FolderGit2, 
  Search, 
  Upload, 
  Link as LinkIcon,
  Layers,
  Sparkles
} from 'lucide-react'

export default function ClientProjectsManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [projects, setProjects] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'active' | 'inactive'
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    category: 'Web Application',
    description: '',
    image: '',
    live_url: '',
    technologies: '',
    sort_order: 0,
    is_active: true,
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchClientProjects()
  }, [])

  const fetchClientProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('client_projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      if (data) setProjects(data)
    } catch (err) {
      console.error('Error fetching client projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      title: '',
      client_name: '',
      category: 'Web Application',
      description: '',
      image: '',
      live_url: '',
      technologies: 'React, Node.js, TailwindCSS',
      sort_order: projects.length + 1,
      is_active: true,
    })
    setMessage(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (proj) => {
    setEditingId(proj.id)
    const techString = Array.isArray(proj.technologies) 
      ? proj.technologies.join(', ') 
      : (proj.technologies || '')

    setFormData({
      title: proj.title || '',
      client_name: proj.client_name || '',
      category: proj.category || 'Web Application',
      description: proj.description || '',
      image: proj.image || '',
      live_url: proj.live_url || '',
      technologies: techString,
      sort_order: proj.sort_order ?? 0,
      is_active: proj.is_active ?? true,
    })
    setMessage(null)
    setIsModalOpen(true)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }))
      setUploadingImage(false)
    }
    reader.onerror = () => {
      alert('Failed to read image file')
      setUploadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  const toggleActive = async (proj) => {
    try {
      const newStatus = !proj.is_active
      const { error } = await supabase
        .from('client_projects')
        .update({ is_active: newStatus })
        .eq('id', proj.id)

      if (error) throw error
      setProjects(projects.map((p) => (p.id === proj.id ? { ...p, is_active: newStatus } : p)))
    } catch (err) {
      console.error('Error toggling status:', err)
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client project? This action cannot be undone.')) return
    try {
      const { error } = await supabase.from('client_projects').delete().eq('id', id)
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
    setMessage(null)

    // Process technologies string to array
    const techArray = formData.technologies
      ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: formData.title.trim(),
      client_name: formData.client_name.trim() || null,
      category: formData.category.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      live_url: formData.live_url.trim() || null,
      technologies: techArray,
      sort_order: parseInt(formData.sort_order, 10) || 0,
      is_active: formData.is_active,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('client_projects')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        setProjects(projects.map((p) => (p.id === editingId ? { ...p, ...payload } : p)))
      } else {
        const { data, error } = await supabase
          .from('client_projects')
          .insert([payload])
          .select()
          .single()

        if (error) throw error
        if (data) setProjects([...projects, data])
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error saving client project:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to save project' })
    } finally {
      setSaving(false)
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (filterStatus === 'active') return p.is_active
    if (filterStatus === 'inactive') return !p.is_active
    return true
  })

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <FolderGit2 className="text-cyan-400" size={24} />
            Client Projects Manager
          </h2>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-0.5">
            Manage live client deliverables, web applications, store launches, and shipped customer portals.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 text-xs cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Client Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/5">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search projects by title, client, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/5 rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'active', 'inactive'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer capitalize ${
                filterStatus === st
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                  : 'bg-white/5 text-[var(--text-muted)] hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              {st} ({st === 'all' ? projects.length : projects.filter(p => st === 'active' ? p.is_active : !p.is_active).length})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
          <FolderGit2 size={36} className="mx-auto text-white/20 mb-3" />
          <p className="text-sm font-bold text-[var(--text-secondary)]">No client projects found</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {searchQuery ? 'Try refining your search terms.' : 'Click "Add Client Project" to publish your first deliverable.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const techList = Array.isArray(proj.technologies) 
              ? proj.technologies 
              : []

            return (
              <div
                key={proj.id}
                className={`rounded-2xl border bg-black/25 flex flex-col overflow-hidden transition-all duration-300 ${
                  proj.is_active ? 'border-white/10 hover:border-cyan-500/30' : 'border-white/5 opacity-60'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-video bg-black/40 overflow-hidden border-b border-white/5">
                  {proj.image ? (
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs">
                      No Image Uploaded
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md border ${
                      proj.is_active 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {proj.is_active ? 'Live' : 'Hidden'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-cyan-300 border border-white/10 backdrop-blur-md">
                      {proj.category}
                    </span>
                  </div>

                  {proj.live_url && (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-cyan-400 hover:text-black text-white border border-white/10 backdrop-blur-md transition-colors"
                      title="Open Live Website"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {proj.client_name && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                        Client: <span className="text-white">{proj.client_name}</span>
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>

                    {/* Tech Badges */}
                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {techList.map((t, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-[var(--text-secondary)] border border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      Order: #{proj.sort_order ?? 0}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleActive(proj)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          proj.is_active 
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                        }`}
                        title={proj.is_active ? 'Hide from public site' : 'Show on public site'}
                      >
                        {proj.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6">
            <div className="min-h-full flex items-center justify-center py-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-xl rounded-3xl glass-card border border-white/10 shadow-2xl bg-[#0a0b10] p-6 sm:p-8 flex flex-col max-h-[88vh] overflow-hidden"
              >
                {/* Fixed Modal Header */}
                <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/10 shrink-0">
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-cyan-400" />
                    {editingId ? 'Edit Client Project' : 'Add New Client Project'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {message && (
                  <div className={`p-3.5 my-2 rounded-xl text-xs font-semibold shrink-0 ${
                    message.type === 'error' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Scrollable Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
                  {/* Title & Client Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="space-y-1">
                      <label className="font-bold text-[var(--text-secondary)] block">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. FitFlow Gym SaaS"
                        className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[var(--text-secondary)] block">Client / Company Name</label>
                      <input
                        type="text"
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        placeholder="e.g. FitFlow Athletics Ltd"
                        className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Category & Live URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="font-bold text-[var(--text-secondary)] block">Category *</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. SaaS Platform, E-Commerce"
                        className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[var(--text-secondary)] block">Live Website URL</label>
                      <input
                        type="url"
                        value={formData.live_url}
                        onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                        placeholder="https://client-site.com"
                        className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="font-bold text-[var(--text-secondary)] block">Description *</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief overview of the project, features delivered, and business impact..."
                      className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Technologies */}
                  <div className="space-y-1">
                    <label className="font-bold text-[var(--text-secondary)] block">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="e.g. React, Next.js, Supabase, TailwindCSS, Stripe"
                      className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Image Section */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                    <label className="font-bold text-[var(--text-secondary)] block">Cover Image *</label>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          required
                          value={formData.image?.startsWith('data:') ? 'Local Image Attached (base64)' : formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="Paste image URL (https://...)"
                          className="w-full pl-9 pr-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 text-xs"
                        />
                      </div>

                      <label
                        htmlFor="client-proj-uploader"
                        className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                      >
                        {uploadingImage ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                        Upload File
                      </label>
                      <input
                        type="file"
                        id="client-proj-uploader"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {formData.image && (
                      <div className="relative aspect-video max-h-40 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Sort Order & Active */}
                  <div className="grid grid-cols-2 gap-3.5 items-center">
                    <div className="space-y-1">
                      <label className="font-bold text-[var(--text-secondary)] block">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="is_active_check"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 bg-black/30 border-white/10 cursor-pointer"
                      />
                      <label htmlFor="is_active_check" className="font-bold text-white text-xs cursor-pointer select-none">
                        Active (Visible to public)
                      </label>
                    </div>
                  </div>

                  {/* Sticky Footer Form Buttons */}
                  <div className="sticky bottom-0 bg-[#0a0b10] pt-4 pb-1 border-t border-white/10 flex items-center justify-end gap-2.5 z-10">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-bold text-white cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving || uploadingImage}
                      className="flex items-center gap-2 px-5 py-2.5 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                    >
                      {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      {editingId ? 'Save Changes' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
  Upload, 
  Image as ImageIcon,
  FolderGit2,
  Sparkles,
  Link as LinkIcon,
  Layers
} from 'lucide-react'
import ClientProjectsManager from './ClientProjectsManager'

const resolveImage = (image) => {
  if (!image) return ''
  if (image.startsWith('http') || image.startsWith('data:')) return image
  return `${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`.replace(/\/+/g, '/')
}

export default function PortfolioManager() {
  const [activeSubTab, setActiveSubTab] = useState('featured') // 'featured' | 'client_projects'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [projects, setProjects] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
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
      sort_order: projects.length + 1,
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
      sort_order: proj.sort_order ?? 0,
      is_active: proj.is_active ?? true,
    })
    setIsModalOpen(true)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }))
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
      title: formData.title.trim(),
      type: formData.type,
      category: formData.category.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      link: formData.link ? formData.link.trim() : null,
      case_study_slug: formData.case_study_slug ? formData.case_study_slug.trim() : null,
      sort_order: parseInt(formData.sort_order, 10) || 0,
      is_active: formData.is_active,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
        setProjects(projects.map((p) => (p.id === editingId ? { ...p, ...payload } : p)))
      } else {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .insert([payload])
          .select()
          .single()
        if (error) throw error
        if (data) setProjects([...projects, data])
      }

      setIsModalOpen(false)
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
        <Loader2 className="animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <ImageIcon className="text-cyan-400" size={24} />
            Portfolio Management
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Manage showcase case studies and live shipped client applications
          </p>
        </div>

        {/* Sub-Section Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('featured')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'featured'
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            Featured Work ({projects.length})
          </button>

          <button
            onClick={() => setActiveSubTab('client_projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'client_projects'
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <FolderGit2 size={14} />
            Client Projects
          </button>
        </div>
      </div>

      {/* Sub-Section 1: Featured Work / Case Studies */}
      {activeSubTab === 'featured' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              Projects displayed under the main <strong>"Featured Work"</strong> homepage section.
            </span>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Plus size={15} /> Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
              <ImageIcon size={32} className="mx-auto text-white/20 mb-2" />
              <p className="text-sm font-bold text-[var(--text-secondary)]">No portfolio projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => {
                const resolvedImg = resolveImage(proj.image)
                return (
                  <div
                    key={proj.id}
                    className={`p-5 rounded-2xl glass-card border transition-all flex flex-col justify-between ${
                      proj.is_active ? 'border-white/10 hover:border-cyan-500/40' : 'border-red-500/20 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Project Image Box */}
                      <div className="rounded-xl overflow-hidden aspect-video mb-3 bg-black/60 relative border border-white/5 flex items-center justify-center">
                        {resolvedImg ? (
                          <img
                            src={resolvedImg}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.classList.add('bg-white/5')
                            }}
                          />
                        ) : (
                          <div className="text-center p-3">
                            <ImageIcon size={20} className="mx-auto text-white/20 mb-1" />
                            <span className="text-[10px] text-[var(--text-muted)]">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-bold text-cyan-300 border border-white/10">
                            {proj.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm text-white">{proj.title}</h3>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">#{proj.sort_order}</span>
                      </div>
                      <div className="text-[11px] text-cyan-400 mb-2 font-medium">{proj.category}</div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4">{proj.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                      <button
                        onClick={() => toggleActive(proj)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Section 2: Client Projects Manager */}
      {activeSubTab === 'client_projects' && (
        <ClientProjectsManager />
      )}

      {/* Modal for Featured Projects */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg my-8 rounded-3xl glass-card border border-white/10 shadow-2xl p-6 sm:p-8 bg-[var(--bg-primary)] max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400" />
                  {editingId ? 'Edit Featured Project' : 'Add New Featured Project'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white cursor-pointer"
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
                    placeholder="e.g. FoodieFrenzy SaaS"
                    className="w-full px-3.5 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                    >
                      <option value="Websites" className="bg-slate-900">Websites</option>
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
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Cover Image URL + Local File Uploader */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <label className="font-bold text-[var(--text-secondary)] block">Cover Image *</label>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Image URL or upload local file"
                        className="w-full pl-9 pr-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 text-xs"
                      />
                    </div>

                    <label
                      htmlFor="portfolio-img-upload"
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                    >
                      {uploadingImage ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      Upload File
                    </label>
                    <input
                      type="file"
                      id="portfolio-img-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {formData.image && (
                    <div className="relative aspect-video max-h-36 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                      <img src={resolveImage(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-[var(--text-secondary)] block mb-1">Description *</label>
                  <textarea
                    rows="2"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short summary of results and deliverables"
                    className="w-full px-3.5 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Case Study Slug (Optional)</label>
                    <input
                      type="text"
                      value={formData.case_study_slug}
                      onChange={(e) => setFormData({ ...formData, case_study_slug: e.target.value })}
                      placeholder="e.g. foodiefrenzy-saas"
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">External Link (Optional)</label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="port_active_check"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 bg-black/30 border-white/10 cursor-pointer"
                    />
                    <label htmlFor="port_active_check" className="font-bold text-white text-xs cursor-pointer select-none">
                      Active (Visible)
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
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

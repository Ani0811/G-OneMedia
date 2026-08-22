import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Save, 
  Loader2, 
  ExternalLink,
  Eye, 
  EyeOff,
  Sparkles,
  Link as LinkIcon,
  Globe
} from 'lucide-react'

// Normalize helper to guarantee an array of proper objects
const normalizeSkills = (raw) => {
  if (!raw) return [{ label: '', desc: '' }]
  let list = raw
  if (typeof raw === 'string') {
    try { list = JSON.parse(raw) } catch { list = [] }
  }
  if (!Array.isArray(list) || list.length === 0) {
    return [{ label: '', desc: '' }]
  }
  return list.map((item) => {
    if (typeof item === 'string') return { label: item, desc: '' }
    if (typeof item === 'object' && item !== null) {
      return { label: item.label || '', desc: item.desc || '' }
    }
    return { label: '', desc: '' }
  })
}

const normalizeSocials = (raw) => {
  if (!raw) return [{ name: 'LinkedIn', url: '' }, { name: 'GitHub', url: '' }]
  let list = raw
  if (typeof raw === 'string') {
    try { list = JSON.parse(raw) } catch { list = [] }
  }
  if (!Array.isArray(list) || list.length === 0) {
    return [{ name: 'LinkedIn', url: '' }, { name: 'GitHub', url: '' }]
  }
  return list.map((item) => ({
    name: item?.name || 'Link',
    url: item?.url || ''
  }))
}

const normalizeStats = (raw) => {
  if (!raw) return [{ value: '', label: '' }]
  let list = raw
  if (typeof raw === 'string') {
    try { list = JSON.parse(raw) } catch { list = [] }
  }
  if (!Array.isArray(list) || list.length === 0) {
    return [{ value: '', label: '' }]
  }
  return list.map((item) => ({
    value: item?.value || '',
    label: item?.label || ''
  }))
}

const initialForm = {
  slug: '',
  name: '',
  role: '',
  tagline: '',
  description: '',
  image: '',
  bg_image: '',
  accent_color: 'cyan',
  email: '',
  skills: [{ label: '', desc: '' }],
  socials: [{ name: 'LinkedIn', url: '' }, { name: 'GitHub', url: '' }],
  stats: [{ value: '', label: '' }],
  sort_order: 1,
  is_active: true
}

export default function TeamManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [members, setMembers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      if (data) setMembers(data)
    } catch (err) {
      console.error('Error fetching team members:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingMember(null)
    setFormData({
      ...initialForm,
      sort_order: members.length + 1,
      skills: [{ label: '', desc: '' }],
      socials: [{ name: 'LinkedIn', url: '' }, { name: 'GitHub', url: '' }],
      stats: [{ value: '', label: '' }],
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (m) => {
    setEditingMember(m)
    setFormData({
      slug: m.slug || '',
      name: m.name || '',
      role: m.role || '',
      tagline: m.tagline || '',
      description: m.description || '',
      image: m.image || '',
      bg_image: m.bg_image || '',
      accent_color: m.accent_color || 'cyan',
      email: m.email || '',
      skills: normalizeSkills(m.skills),
      socials: normalizeSocials(m.socials),
      stats: normalizeStats(m.stats),
      sort_order: m.sort_order !== undefined ? m.sort_order : 1,
      is_active: m.is_active !== undefined ? m.is_active : true
    })
    setIsModalOpen(true)
  }

  const handleToggleActive = async (m) => {
    try {
      const updated = !m.is_active
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: updated })
        .eq('id', m.id)

      if (error) throw error
      setMembers(members.map((item) => (item.id === m.id ? { ...item, is_active: updated } : item)))
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id)
      if (error) throw error
      setMembers(members.filter((m) => m.id !== id))
    } catch (err) {
      alert('Failed to delete member: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const cleanedSkills = (formData.skills || []).filter((s) => s.label && s.label.trim())
      const cleanedSocials = (formData.socials || []).filter((s) => s.name && s.name.trim() && s.url && s.url.trim())
      const cleanedStats = (formData.stats || []).filter((s) => s.value && s.value.trim() && s.label && s.label.trim())

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        role: formData.role.trim(),
        tagline: formData.tagline?.trim() || '',
        description: formData.description?.trim() || '',
        image: formData.image?.trim() || '',
        bg_image: formData.bg_image?.trim() || '',
        accent_color: formData.accent_color || 'cyan',
        email: formData.email?.trim() || '',
        skills: cleanedSkills,
        socials: cleanedSocials,
        stats: cleanedStats,
        sort_order: parseInt(formData.sort_order, 10) || 1,
        is_active: Boolean(formData.is_active)
      }

      if (editingMember) {
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editingMember.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([payload])
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchMembers()
    } catch (err) {
      console.error('Error saving team member:', err)
      alert('Failed to save team member: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // Skills handlers
  const updateSkill = (idx, field, val) => {
    const list = [...(formData.skills || [])]
    if (!list[idx]) list[idx] = { label: '', desc: '' }
    list[idx] = { ...list[idx], [field]: val }
    setFormData({ ...formData, skills: list })
  }
  const addSkill = () => {
    const list = [...(formData.skills || [])]
    setFormData({ ...formData, skills: [...list, { label: '', desc: '' }] })
  }
  const removeSkill = (idx) => {
    const list = (formData.skills || []).filter((_, i) => i !== idx)
    setFormData({ ...formData, skills: list.length > 0 ? list : [{ label: '', desc: '' }] })
  }

  // Socials handlers
  const updateSocial = (idx, field, val) => {
    const list = [...(formData.socials || [])]
    if (!list[idx]) list[idx] = { name: '', url: '' }
    list[idx] = { ...list[idx], [field]: val }
    setFormData({ ...formData, socials: list })
  }
  const addSocial = () => {
    const list = [...(formData.socials || [])]
    setFormData({ ...formData, socials: [...list, { name: '', url: '' }] })
  }
  const removeSocial = (idx) => {
    const list = (formData.socials || []).filter((_, i) => i !== idx)
    setFormData({ ...formData, socials: list.length > 0 ? list : [{ name: '', url: '' }] })
  }

  // Stats handlers
  const updateStat = (idx, field, val) => {
    const list = [...(formData.stats || [])]
    if (!list[idx]) list[idx] = { value: '', label: '' }
    list[idx] = { ...list[idx], [field]: val }
    setFormData({ ...formData, stats: list })
  }
  const addStat = () => {
    const list = [...(formData.stats || [])]
    setFormData({ ...formData, stats: [...list, { value: '', label: '' }] })
  }
  const removeStat = (idx) => {
    const list = (formData.stats || []).filter((_, i) => i !== idx)
    setFormData({ ...formData, stats: list.length > 0 ? list : [{ value: '', label: '' }] })
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
          <h2 className="text-xl sm:text-2xl font-black">Founders & Team Roster</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Manage founders, leadership, and team profiles displayed across the site
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-blue)] text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 w-fit"
        >
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => {
          const imgSrc = m.image?.startsWith('http')
            ? m.image
            : `${import.meta.env.BASE_URL || '/'}${m.image}`.replace(/\/+/g, '/')

          const skillsArray = normalizeSkills(m.skills).filter(s => s.label)

          return (
            <div
              key={m.id}
              className={`rounded-3xl glass-card border flex flex-col justify-between overflow-hidden transition-all ${
                m.is_active ? 'border-[var(--border-subtle)]' : 'border-red-500/30 opacity-60'
              }`}
            >
              {/* Card Banner / Image */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                {m.bg_image ? (
                  <img src={m.bg_image} alt="" className="w-full h-full object-cover opacity-40" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent" />
                )}

                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-black/60 shadow-xl shrink-0">
                    <img
                      src={imgSrc}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{m.name}</h3>
                    <p className="text-xs text-cyan-300 font-semibold">{m.role}</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    m.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {m.is_active ? 'Active' : 'Hidden'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/50 text-white border border-white/10">
                    #{m.sort_order}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed mb-4">
                    {m.tagline || m.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skillsArray.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-[var(--text-secondary)] font-medium">
                        {s.label}
                      </span>
                    ))}
                    {skillsArray.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-[var(--text-muted)]">
                        +{skillsArray.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                  <a
                    href={`${import.meta.env.BASE_URL}about/${m.slug}`.replace(/\/+/g, '/')}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline font-semibold"
                  >
                    <ExternalLink size={12} /> View Profile
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(m)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        m.is_active ? 'bg-white/5 text-[var(--text-secondary)] hover:text-white' : 'bg-amber-500/20 text-amber-300'
                      }`}
                      title={m.is_active ? 'Hide profile' : 'Show profile'}
                    >
                      {m.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      title="Delete"
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

      {/* Add / Edit Team Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-2xl sm:rounded-3xl glass-card border border-white/10 shadow-2xl bg-[var(--bg-primary)] max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Fixed Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[var(--bg-primary)] shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                    {editingMember ? `Edit ${editingMember.name}` : 'Add New Founder / Team Member'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                    Profile renders on the About section and personal bio page (/about/{formData.slug || 'slug'})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form wrapping body and fixed footer */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs">
                  {/* Core Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anirudha Basu Thakur"
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">URL Slug (e.g. anirudha) *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. anirudha"
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Role / Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Co-Founder & Lead Engineer"
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. anirudha@g-onemedia.com"
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Accent Theme</label>
                      <select
                        value={formData.accent_color}
                        onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      >
                        <option value="cyan" className="bg-slate-900">Cyan Glow</option>
                        <option value="fuchsia" className="bg-slate-900">Fuchsia / Magenta</option>
                        <option value="violet" className="bg-slate-900">Purple / Violet</option>
                        <option value="emerald" className="bg-slate-900">Emerald Green</option>
                        <option value="amber" className="bg-slate-900">Amber / Gold</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Avatar Image URL or Filename</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="e.g. Anirudha.jpeg or https://..."
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Cover / Background Banner URL</label>
                      <input
                        type="text"
                        value={formData.bg_image}
                        onChange={(e) => setFormData({ ...formData, bg_image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Tagline / Subheading</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Short punchy line summarizing expertise"
                      className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Full Biography / Narrative</label>
                    <textarea
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter the founder/member full bio here..."
                      className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Skills & Focus Areas */}
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400 text-xs">Key Expertise & Skills</span>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 flex items-center gap-1 font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        <Plus size={14} /> Add Skill
                      </button>
                    </div>
                    <div className="space-y-2.5 pt-1">
                      {(formData.skills || []).map((s, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start bg-black/20 p-2.5 rounded-xl border border-white/5">
                          <input
                            type="text"
                            placeholder="Skill title (e.g. Full-Stack Development)"
                            value={s.label || ''}
                            onChange={(e) => updateSkill(idx, 'label', e.target.value)}
                            className="w-full sm:w-1/3 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[var(--text-primary)] outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="Description of expertise"
                            value={s.desc || ''}
                            onChange={(e) => updateSkill(idx, 'desc', e.target.value)}
                            className="w-full sm:flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[var(--text-primary)] outline-none focus:border-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeSkill(idx)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer self-end sm:self-center"
                            title="Remove Skill"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-400 text-xs">Social & Portfolio Links</span>
                      <button
                        type="button"
                        onClick={addSocial}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 flex items-center gap-1 font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        <Plus size={14} /> Add Social Link
                      </button>
                    </div>
                    <div className="space-y-2.5 pt-1">
                      {(formData.socials || []).map((soc, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-black/20 p-2.5 rounded-xl border border-white/5">
                          <input
                            type="text"
                            placeholder="Platform (e.g. LinkedIn, GitHub, YouTube)"
                            value={soc.name || ''}
                            onChange={(e) => updateSocial(idx, 'name', e.target.value)}
                            className="w-full sm:w-1/3 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[var(--text-primary)] outline-none focus:border-purple-400"
                          />
                          <input
                            type="url"
                            placeholder="URL (https://...)"
                            value={soc.url || ''}
                            onChange={(e) => updateSocial(idx, 'url', e.target.value)}
                            className="w-full sm:flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[var(--text-primary)] outline-none focus:border-purple-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeSocial(idx)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer self-end sm:self-center"
                            title="Remove Link"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats / Numbers */}
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-xs">Profile Highlights & Stats</span>
                      <button
                        type="button"
                        onClick={addStat}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center gap-1 font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        <Plus size={14} /> Add Stat
                      </button>
                    </div>
                    <div className="space-y-2.5 pt-1">
                      {(formData.stats || []).map((st, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-black/20 p-2.5 rounded-xl border border-white/5">
                          <input
                            type="text"
                            placeholder="Value (e.g. 20+)"
                            value={st.value || ''}
                            onChange={(e) => updateStat(idx, 'value', e.target.value)}
                            className="w-full sm:w-1/3 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[var(--text-primary)] outline-none focus:border-amber-400"
                          />
                          <input
                            type="text"
                            placeholder="Metric label (e.g. Projects Shipped)"
                            value={st.label || ''}
                            onChange={(e) => updateStat(idx, 'label', e.target.value)}
                            className="w-full sm:flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[var(--text-primary)] outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeStat(idx)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer self-end sm:self-center"
                            title="Remove Stat"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sort Order and Active */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Display Order</label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-2 sm:pt-6">
                      <input
                        type="checkbox"
                        id="is_active_check"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded text-cyan-400 bg-black/40 border-white/10 cursor-pointer"
                      />
                      <label htmlFor="is_active_check" className="font-bold text-[var(--text-primary)] cursor-pointer">
                        Profile Active & Visible on Website
                      </label>
                    </div>
                  </div>
                </div>

                {/* Fixed Modal Footer */}
                <div className="p-4 sm:p-5 bg-[var(--bg-primary)] border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
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
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-blue)] text-black font-bold hover:bg-cyan-400 disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save Member
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

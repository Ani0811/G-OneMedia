import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { 
  Loader2, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  Type, 
  Link as LinkIcon 
} from 'lucide-react'

export default function HeroManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroData, setHeroData] = useState({
    id: null,
    headline: '',
    subheadline: '',
    cta_text: '',
    tagline: '',
    image_url: '',
    extra_fields: []
  })
  const [message, setMessage] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchHeroData()
  }, [])

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, which is fine, we will create one later
        } else {
          console.error('Error fetching hero data:', error)
        }
      } else if (data) {
        setHeroData({
          id: data.id,
          headline: data.headline || '',
          subheadline: data.subheadline || '',
          cta_text: data.cta_text || '',
          tagline: data.tagline || '',
          image_url: data.image_url || '',
          extra_fields: Array.isArray(data.extra_fields) ? data.extra_fields : []
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle local image upload as base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setHeroData(prev => ({
        ...prev,
        image_url: reader.result
      }))
      setUploading(false)
    }
    reader.onerror = () => {
      alert('Failed to read image file')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleAddField = () => {
    setHeroData(prev => ({
      ...prev,
      extra_fields: [...prev.extra_fields, { label: '', value: '' }]
    }))
  }

  const handleFieldChange = (index, key, val) => {
    const updated = [...heroData.extra_fields]
    updated[index] = { ...updated[index], [key]: val }
    setHeroData(prev => ({ ...prev, extra_fields: updated }))
  }

  const handleRemoveField = (index) => {
    const updated = heroData.extra_fields.filter((_, i) => i !== index)
    setHeroData(prev => ({ ...prev, extra_fields: updated }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    // Filter out empty custom fields
    const cleanExtraFields = heroData.extra_fields.filter(
      field => field.label.trim() !== '' || field.value.trim() !== ''
    )

    const payload = {
      headline: heroData.headline.trim(),
      subheadline: heroData.subheadline.trim(),
      cta_text: heroData.cta_text.trim(),
      tagline: heroData.tagline.trim() || null,
      image_url: heroData.image_url.trim() || null,
      extra_fields: cleanExtraFields
    }

    try {
      if (heroData.id) {
        // Update
        const { error } = await supabase
          .from('hero_content')
          .update(payload)
          .eq('id', heroData.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Hero content updated successfully!' })
      } else {
        // Insert
        const { data, error } = await supabase
          .from('hero_content')
          .insert([payload])
          .select()
          .single()

        if (error) throw error
        if (data) {
          setHeroData({
            id: data.id,
            headline: data.headline || '',
            subheadline: data.subheadline || '',
            cta_text: data.cta_text || '',
            tagline: data.tagline || '',
            image_url: data.image_url || '',
            extra_fields: Array.isArray(data.extra_fields) ? data.extra_fields : []
          })
        }
        setMessage({ type: 'success', text: 'Hero content created successfully!' })
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: err.message || 'An error occurred' })
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
          <Sparkles className="text-cyan-400" size={24} />
          Manage Hero Section
        </h2>
        <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-0.5">
          Update your homepage headline, subheadline, branding tagline, main cover image, and custom details.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          message.type === 'error' 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
            : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tagline */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block">
              Branding Tagline
            </label>
            <input
              type="text"
              value={heroData.tagline}
              onChange={(e) => setHeroData({ ...heroData, tagline: e.target.value })}
              className="w-full px-4 py-3 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none text-xs"
              placeholder="e.g. DIGITAL ECOSYSTEMS ENGINEERED FOR GROWTH"
            />
          </div>

          {/* CTA Button Text */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block">
              CTA Button Text
            </label>
            <input
              type="text"
              required
              value={heroData.cta_text}
              onChange={(e) => setHeroData({ ...heroData, cta_text: e.target.value })}
              className="w-full px-4 py-3 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none text-xs"
              placeholder="e.g. Get Started"
            />
          </div>
        </div>

        {/* Copy Fields */}
        <div className="space-y-4">
          {/* Headline */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block">
              Main Headline
            </label>
            <input
              type="text"
              required
              value={heroData.headline}
              onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
              className="w-full px-4 py-3 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none text-xs font-bold"
              placeholder="e.g. We Help Businesses Grow with High-Converting Websites"
            />
          </div>

          {/* Subheadline */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block">
              Subheadline / Description
            </label>
            <textarea
              required
              rows="4"
              value={heroData.subheadline}
              onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
              className="w-full px-4 py-3 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none text-xs leading-relaxed resize-none"
              placeholder="G-One Media bridges the gap between..."
            />
          </div>
        </div>

        {/* Image Editing Section */}
        <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <ImageIcon size={14} /> Hero Visual Image
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Image Preview */}
            <div className="md:col-span-4 aspect-4/3 rounded-xl border border-white/10 overflow-hidden bg-white/5 relative flex items-center justify-center">
              {heroData.image_url ? (
                <img 
                  src={heroData.image_url} 
                  alt="Hero Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon size={28} className="mx-auto text-white/20 mb-2" />
                  <span className="text-[10px] text-[var(--text-muted)] block font-medium">No Image Uploaded</span>
                </div>
              )}
            </div>

            {/* Upload Inputs */}
            <div className="md:col-span-8 space-y-4">
              {/* Image URL Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                  <LinkIcon size={12} /> Image URL
                </label>
                <input
                  type="text"
                  value={heroData.image_url}
                  onChange={(e) => setHeroData({ ...heroData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none text-[11px]"
                  placeholder="Paste external image URL or upload below"
                />
              </div>

              {/* Local File Upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Upload size={12} /> Upload Local Image File
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="hero-image-uploader"
                  />
                  <label
                    htmlFor="hero-image-uploader"
                    className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[11px] font-bold text-white flex items-center gap-2 cursor-pointer transition-all"
                  >
                    {uploading ? (
                      <Loader2 className="animate-spin" size={13} />
                    ) : (
                      <Upload size={13} />
                    )}
                    Choose Image File
                  </label>
                  <span className="text-[10px] text-[var(--text-muted)]">Supports JPG, PNG, WEBP (stored securely as base64)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Extra Custom Fields Section */}
        <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Type size={14} /> Dynamic Extra Fields
            </h3>
            <button
              type="button"
              onClick={handleAddField}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-300 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus size={12} /> Add Field
            </button>
          </div>

          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
            Add custom key-value details (like "Branded Strategy: 100% Custom", "Audit Speed: 24h", "Tech Stack: React/Node") to display as custom feature highlights in the hero section.
          </p>

          {heroData.extra_fields.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-white/5 text-center text-[10px] text-[var(--text-muted)]">
              No extra fields added yet. Click "+ Add Field" to create custom highlights.
            </div>
          ) : (
            <div className="space-y-2.5">
              {heroData.extra_fields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="grid grid-cols-2 gap-2.5 flex-1">
                    <input
                      type="text"
                      required
                      value={field.label}
                      onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                      placeholder="Field Label (e.g. Tech Stack)"
                      className="px-3 py-2 bg-black/30 border border-white/5 rounded-lg outline-none text-[11px] focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      required
                      value={field.value}
                      onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                      placeholder="Value (e.g. React & Supabase)"
                      className="px-3 py-2 bg-black/30 border border-white/5 rounded-lg outline-none text-[11px] focus:border-cyan-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors shrink-0"
                    title="Remove field"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-blue)] text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs"
        >
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </form>
    </div>
  )
}

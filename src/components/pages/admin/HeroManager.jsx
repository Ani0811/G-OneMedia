import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { Loader2, Save } from 'lucide-react'

export default function HeroManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroData, setHeroData] = useState({
    id: null,
    headline: '',
    subheadline: '',
    cta_text: ''
  })
  const [message, setMessage] = useState(null)

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
          // No rows returned, which is fine, we can insert later
        } else {
          console.error('Error fetching hero data:', error)
        }
      } else if (data) {
        setHeroData(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (heroData.id) {
        // Update
        const { error } = await supabase
          .from('hero_content')
          .update({
            headline: heroData.headline,
            subheadline: heroData.subheadline,
            cta_text: heroData.cta_text
          })
          .eq('id', heroData.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Hero content updated successfully!' })
      } else {
        // Insert
        const { data, error } = await supabase
          .from('hero_content')
          .insert([{
            headline: heroData.headline,
            subheadline: heroData.subheadline,
            cta_text: heroData.cta_text
          }])
          .select()
          .single()

        if (error) throw error
        if (data) setHeroData(data)
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
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--accent-blue)]" /></div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Manage Hero Section</h2>
      <p className="text-[var(--text-muted)] text-sm">Update the main headline and call-to-action on the homepage.</p>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--text-secondary)]">Headline</label>
          <input
            type="text"
            required
            value={heroData.headline}
            onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none"
            placeholder="e.g. We Build Digital Experiences That Scale"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--text-secondary)]">Subheadline</label>
          <textarea
            required
            rows="3"
            value={heroData.subheadline}
            onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none resize-none"
            placeholder="e.g. Accelerate your business growth..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--text-secondary)]">CTA Button Text</label>
          <input
            type="text"
            required
            value={heroData.cta_text}
            onChange={(e) => setHeroData({ ...heroData, cta_text: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-[var(--border-subtle)] rounded-xl focus:border-[var(--accent-blue)] outline-none"
            placeholder="e.g. Get Started"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-blue)] text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </form>
    </div>
  )
}

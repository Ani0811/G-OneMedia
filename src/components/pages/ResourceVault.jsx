import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { PlayCircle, FileText, Lock, CheckCircle2, ArrowRight } from 'lucide-react'

const RESOURCES = [
  {
    id: 1,
    title: "10x E-com Growth Playbook",
    type: "PDF Guide",
    icon: <FileText className="text-secondary" />,
    desc: "The exact email and SMS flow structure we use to add $50k/mo to Shopify stores."
  },
  {
    id: 2,
    title: "High-Converting Landing Page Teardown",
    type: "Video Mini-Course",
    icon: <PlayCircle className="text-secondary" />,
    desc: "A 12-minute workshop analyzing the anatomy of a landing page that converts cold traffic at 5%."
  },
  {
    id: 3,
    title: "Ad Creative Swipe File",
    type: "Figma/Canva Assets",
    icon: <FileText className="text-secondary" />,
    desc: "Plug-and-play ad templates designed to stop the scroll on TikTok and Meta."
  }
]

export default function ResourceVault() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [email, setEmail] = useState('')

  const handleUnlock = (e) => {
    e.preventDefault()
    if(email.includes('@')) {
      // In production, save this to Supabase leads table here
      setIsUnlocked(true)
    }
  }

  return (
    <div className="min-h-[80vh] pt-32 pb-24 bg-bg-primary">
      <Helmet>
        <title>G-One Media Vault | Free Growth Resources</title>
      </Helmet>

      <div className="container-custom max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-4 block">Free Resource Hub</span>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            The Agency <span className="text-primary">Growth Vault</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Get instant access to our internal templates, structural frameworks, and video teardowns that have scaled 7-figure brands.
          </p>
        </div>

        {!isUnlocked ? (
          <div className="bg-bg-glass backdrop-blur-xl border border-secondary/20 p-8 md:p-12 rounded-4xl shadow-2xl shadow-secondary/10 relative overflow-hidden text-center max-w-2xl mx-auto">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-secondary/10 rounded-full blur-3xl z-0" />
            
            <Lock className="w-16 h-16 text-secondary mx-auto mb-6 relative z-10" />
            <h3 className="text-2xl font-bold mb-4 relative z-10">Private Access Requires Email</h3>
            <p className="text-text-secondary mb-8 relative z-10">
              Drop your info below to instantly unlock all course materials, playbooks, and templates. We won't spam you.
            </p>

            <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-4 relative z-10 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-bg-empty border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-secondary transition-colors"
              />
              <button 
                type="submit"
                className="bg-secondary text-bg-primary font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Unlock Vault <ArrowRight size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map(res => (
              <div key={res.id} className="bg-bg-glass border border-border-subtle rounded-2xl p-6 relative group hover:border-primary transition-colors">
                <div className="mb-4">
                  {res.icon}
                </div>
                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">
                  {res.type}
                </div>
                <h4 className="text-xl font-bold mb-3">{res.title}</h4>
                <p className="text-sm text-text-secondary mb-6">{res.desc}</p>
                <button className="flex items-center gap-2 text-sm font-bold text-secondary group-hover:text-primary transition-colors">
                  <CheckCircle2 size={16} /> Access Material
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
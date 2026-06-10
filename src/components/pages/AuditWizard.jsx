import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, Globe, TrendingUp, Mail } from 'lucide-react'

export default function AuditWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    url: '',
    goal: '',
    email: ''
  })

  const [isSuccess, setIsSuccess] = useState(false)

  const handleNext = () => setStep(s => s + 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated DB submission
    setTimeout(() => {
      setIsSuccess(true)
    }, 1000)
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}}>
            <Globe className="w-12 h-12 text-primary mb-6" />
            <h2 className="text-3xl font-bold mb-2">What is your website URL?</h2>
            <p className="text-text-secondary mb-6">Our experts need to see what we're working with.</p>
            <input 
              type="url" 
              placeholder="https://yourbrand.com"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full bg-bg-empty border border-border-subtle rounded-xl px-5 py-4 text-lg text-text-primary focus:outline-none focus:border-primary mb-6"
            />
            <button 
              onClick={handleNext}
              disabled={!formData.url}
              className="bg-primary text-white w-full font-bold px-6 py-4 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2"
            >
              Analyze URL <ArrowRight size={20} />
            </button>
          </motion.div>
        )
      case 2:
        return (
          <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}}>
            <TrendingUp className="w-12 h-12 text-secondary mb-6" />
            <h2 className="text-3xl font-bold mb-2">What is the primary bottleneck?</h2>
            <p className="text-text-secondary mb-6">Select the area that needs the most help right now.</p>
            <div className="grid gap-3 mb-6">
              {['Traffic Quality (Ads/SEO)', 'Conversion Rate (CRO)', 'Average Order Value', 'Customer Retention'].map(g => (
                <button
                  key={g}
                  onClick={() => {
                    setFormData({...formData, goal: g})
                    handleNext()
                  }}
                  className={`p-4 rounded-xl border text-left font-semibold transition-colors ${formData.goal === g ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border-subtle text-text-secondary hover:border-text-primary'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}}>
            <Mail className="w-12 h-12 text-primary mb-6" />
            <h2 className="text-3xl font-bold mb-2">Where should we send the audit?</h2>
            <p className="text-text-secondary mb-6">We'll record a personalized Loom video tearing down your site.</p>
            <input 
              type="email" 
              placeholder="founder@yourbrand.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-bg-empty border border-border-subtle rounded-xl px-5 py-4 text-lg text-text-primary focus:outline-none focus:border-primary mb-6"
            />
            <button 
              onClick={handleSubmit}
              disabled={!formData.email}
              className="bg-primary text-white w-full font-bold px-6 py-4 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2"
            >
              Generate Free Audit <ArrowRight size={20} />
            </button>
          </motion.div>
        )
      default: return null
    }
  }

  return (
    <div className="min-h-[85vh] pt-32 pb-24 bg-bg-primary flex items-center justify-center">
      <Helmet>
        <title>Get a Free Growth Audit | G-One Media</title>
        <meta name="description" content="Request a free website and conversion rate optimization audit. Our experts will analyze your site and record a personalized Loom teardown." />
        <meta name="keywords" content="G-One Media, free audit, website analysis, conversion rate optimization, CRO audit, digital marketing audit" />
        <link rel="canonical" href="https://ani0811.github.io/G-OneMedia/audit" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ani0811.github.io/G-OneMedia/audit" />
        <meta property="og:title" content="Get a Free Growth Audit | G-One Media" />
        <meta property="og:description" content="Request a free website and conversion rate optimization audit. Our experts will analyze your site and record a personalized Loom teardown." />
        <meta property="og:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ani0811.github.io/G-OneMedia/audit" />
        <meta property="twitter:title" content="Get a Free Growth Audit | G-One Media" />
        <meta property="twitter:description" content="Request a free website and conversion rate optimization audit. Our experts will analyze your site and record a personalized Loom teardown." />
        <meta property="twitter:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />
      </Helmet>

      <div className="container-custom max-w-2xl">
        <div className="bg-bg-glass backdrop-blur-xl border border-border-subtle p-8 md:p-12 rounded-4xl shadow-2xl relative overflow-hidden">
          {/* Progress Bar */}
          {!isSuccess && (
            <div className="absolute top-0 left-0 w-full h-1 bg-border-subtle">
              <div className="h-full bg-primary transition-all duration-300" style={{width: `${(step/3)*100}%`}} />
            </div>
          )}

          {isSuccess ? (
            <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="text-center py-12">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Request Received!</h2>
              <p className="text-text-secondary text-lg">
                Our stratagists are analyzing <span className="text-white font-bold">{formData.url}</span>. 
                We will email your free Loom teardown to <span className="text-white font-bold">{formData.email}</span> within 24 hours.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
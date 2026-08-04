import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Video, Bot, TrendingUp, ChevronRight, ChevronLeft, Calculator, Send, Check, Sparkles, Download, Calendar } from 'lucide-react'
import { jsPDF } from 'jspdf'

const serviceOptions = [
  { id: 'website', label: 'Website / Web App', icon: Code, originalBasePrice: 11999, basePrice: 5999, description: 'React, Next.js, full-stack solutions' },
]

const featureAddons = {
  website: [
    { id: 'cms', label: 'CMS Integration', originalPrice: 5999, price: 2999 },
    { id: 'ecommerce', label: 'E-Commerce / Payments', originalPrice: 11999, price: 5999 },
    { id: 'animations', label: 'Advanced Animations', originalPrice: 3999, price: 1999 },
    { id: 'dashboard', label: 'Custom Dashboard', originalPrice: 15999, price: 7999 },
    { id: 'seo', label: 'SEO Optimization', originalPrice: 3999, price: 1999 },
    { id: 'auth', label: 'User Authentication', originalPrice: 5999, price: 2999 },
  ]
}

const urgencyOptions = [
  { id: 'relaxed', label: 'Flexible (4-6 weeks)', multiplier: 1.0, tag: 'Standard' },
  { id: 'normal', label: 'Normal (2-4 weeks)', multiplier: 1.15, tag: '15% premium' },
  { id: 'rush', label: 'Rush (1-2 weeks)', multiplier: 1.35, tag: '35% premium' },
]

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
}

export default function BudgetCalculator() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState({})
  const [urgency, setUrgency] = useState('relaxed')
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currency, setCurrency] = useState('INR')
  const [generatingPDF, setGeneratingPDF] = useState(false)

  const exchangeRates = {
    INR: 1,
    USD: 1 / 83,
    EUR: 1 / 90
  }

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€'
  }

  const totalSteps = 4

  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleFeature = (serviceId, featureId) => {
    setSelectedFeatures(prev => {
      const current = prev[serviceId] || []
      return {
        ...prev,
        [serviceId]: current.includes(featureId)
          ? current.filter(f => f !== featureId)
          : [...current, featureId]
      }
    })
  }

  const calculateOriginalTotal = () => {
    let total = 0
    selectedServices.forEach(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId)
      if (service) total += (service.originalBasePrice || service.basePrice)
      const features = selectedFeatures[serviceId] || []
      features.forEach(fId => {
        const addon = (featureAddons[serviceId] || []).find(f => f.id === fId)
        if (addon) total += (addon.originalPrice || addon.price)
      })
    })
    const mult = urgencyOptions.find(u => u.id === urgency)?.multiplier || 1
    return Math.round(total * mult)
  }

  const calculateTotal = () => {
    let total = 0
    selectedServices.forEach(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId)
      if (service) total += service.basePrice
      const features = selectedFeatures[serviceId] || []
      features.forEach(fId => {
        const addon = (featureAddons[serviceId] || []).find(f => f.id === fId)
        if (addon) total += addon.price
      })
    })
    const mult = urgencyOptions.find(u => u.id === urgency)?.multiplier || 1
    return Math.round(total * mult)
  }

  const getProjectedROI = () => {
    let roiText = 'High Impact Growth';
    if (selectedServices.includes('website')) {
      roiText = '2-3x Conversion Rate';
    }
    return roiText;
  }

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Top color bar
      pdf.setFillColor(0, 240, 255);
      pdf.rect(0, 0, pageWidth, 4, 'F');
      
      // Title / Brand
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(9, 9, 11);
      pdf.text('G-ONE MEDIA', 20, 22);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Next-Gen Digital Systems & Content Engineering', 20, 27);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(217, 70, 239);
      pdf.text('PROJECT PROPOSAL & ESTIMATE', pageWidth - 20, 22, { align: 'right' });
      
      const proposalNum = Math.floor(100000 + Math.random() * 900000);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Proposal ID: G1-${proposalNum}`, pageWidth - 20, 27, { align: 'right' });
      
      pdf.setDrawColor(226, 232, 240);
      pdf.line(20, 33, pageWidth - 20, 33);
      
      // Meta details (Client / Agency)
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Prepared For:', 20, 42);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      pdf.text(formData.name || 'Valued Client', 20, 47);
      pdf.text(formData.email || 'Client Email', 20, 52);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('Prepared By:', pageWidth - 20, 42, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      pdf.text('G-One Media Team', pageWidth - 20, 47, { align: 'right' });
      pdf.text('gmedia774@gmail.com', pageWidth - 20, 52, { align: 'right' });
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('Date Issued:', 20, 62);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 43, 62);
      
      pdf.setDrawColor(226, 232, 240);
      pdf.line(20, 68, pageWidth - 20, 68);
      
      // Section title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Proposed Scope & Investment Breakdown', 20, 76);
      
      // Table Header
      let currentY = 82;
      pdf.setFillColor(248, 250, 252);
      pdf.rect(20, currentY, pageWidth - 40, 8, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text('SERVICE / FEATURES DELIVERED', 24, currentY + 5.5);
      pdf.text('INVESTMENT', pageWidth - 24, currentY + 5.5, { align: 'right' });
      
      currentY += 8;
      
      // List services
      selectedServices.forEach(serviceId => {
        const service = serviceOptions.find(s => s.id === serviceId);
        if (!service) return;
        
        pdf.setDrawColor(241, 245, 249);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.5);
        pdf.setTextColor(15, 23, 42);
        pdf.text(service.label, 24, currentY + 6);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(71, 85, 105);
        pdf.text(formatCurrency(service.basePrice), pageWidth - 24, currentY + 6, { align: 'right' });
        
        currentY += 8;
        
        const addons = selectedFeatures[serviceId] || [];
        addons.forEach(fId => {
          const addon = (featureAddons[serviceId] || []).find(f => f.id === fId);
          if (!addon) return;
          
          pdf.setFontSize(8.5);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`• ${addon.label}`, 29, currentY + 5);
          pdf.text(formatCurrency(addon.price), pageWidth - 24, currentY + 5, { align: 'right' });
          currentY += 7;
        });
      });
      
      pdf.setDrawColor(203, 213, 225);
      pdf.line(20, currentY + 2, pageWidth - 20, currentY + 2);
      currentY += 8;
      
      // Calculate Subtotal & Total
      const subtotal = selectedServices.reduce((sum, serviceId) => {
        const s = serviceOptions.find(opt => opt.id === serviceId);
        let sSum = s ? s.basePrice : 0;
        const addons = selectedFeatures[serviceId] || [];
        addons.forEach(fId => {
          const addon = (featureAddons[serviceId] || []).find(f => f.id === fId);
          if (addon) sSum += addon.price;
        });
        return sum + sSum;
      }, 0);
      
      const totalVal = calculateTotal();
      const multiplier = urgencyOptions.find(u => u.id === urgency)?.multiplier || 1;
      const urgencyLabel = urgencyOptions.find(u => u.id === urgency)?.label || 'Standard';
      
      // Subtotal
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Subtotal', 110, currentY);
      pdf.text(formatCurrency(subtotal), pageWidth - 24, currentY, { align: 'right' });
      currentY += 5.5;
      
      if (multiplier !== 1) {
        pdf.text(`Timeline Premium (${urgencyLabel})`, 110, currentY);
        pdf.text(`x${multiplier}`, pageWidth - 24, currentY, { align: 'right' });
        currentY += 5.5;
      }
      
      pdf.setDrawColor(148, 163, 184);
      pdf.line(110, currentY, pageWidth - 20, currentY);
      currentY += 5;
      
      // Total
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Total Estimated Investment', 110, currentY);
      pdf.setTextColor(6, 182, 212); // cyan
      pdf.text(formatCurrency(totalVal), pageWidth - 24, currentY, { align: 'right' });
      
      currentY += 14;
      
      // Box for ROI and Notes
      let boxHeight = 22;
      if (formData.notes) boxHeight += 12;
      
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(20, currentY, pageWidth - 40, boxHeight, 'FD');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Projected Business ROI:', 24, currentY + 6.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(217, 70, 239); // fuchsia
      pdf.text(getProjectedROI(), 24, currentY + 11.5);
      
      if (formData.notes) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(71, 85, 105);
        pdf.text('Client Notes / Special Instructions:', 24, currentY + 19.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        const splitNotes = pdf.splitTextToSize(formData.notes, pageWidth - 48);
        pdf.text(splitNotes, 24, currentY + 24.5);
      }
      
      currentY += boxHeight + 14;
      
      // Next steps / booking instructions
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Next Steps:', 20, currentY);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text('1. Book a Discovery Call with us to finalize implementation details and milestones.', 20, currentY + 5.5);
      pdf.text('2. Link to Book: https://calendly.com/gmedia774/30min', 20, currentY + 10.5);
      pdf.text('3. Once details are aligned, we will send over a formal service agreement to initiate kickoff.', 20, currentY + 15.5);
      
      // Footer page watermark / link
      pdf.setDrawColor(241, 245, 249);
      pdf.line(20, pageHeight - 18, pageWidth - 20, pageHeight - 18);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184);
      pdf.text('G-One Media Agency • https://ani0811.github.io/G-OneMedia', 20, pageHeight - 13);
      pdf.text('Book Call: https://calendly.com/gmedia774/30min', pageWidth - 20, pageHeight - 13, { align: 'right' });
      
      pdf.save(`G-OneMedia_Proposal_${formData.name.replace(/\s+/g, '_') || 'Client'}.pdf`);
    } catch (e) {
      console.error('PDF Generation Failed', e);
      alert('PDF Generation Failed: ' + (e.message || e));
    } finally {
      setGeneratingPDF(false);
    }
  }


  const formatCurrency = (num, curr = currency) => {
    let value = Math.round(num * exchangeRates[curr])
    if (value > 9) {
      value = Math.round((value - 9) / 10) * 10 + 9
    } else {
      value = 9
    }
    const symbol = currencySymbols[curr]
    return `${symbol}${value.toLocaleString(curr === 'INR' ? 'en-IN' : 'en-US')}`
  }

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, totalSteps - 1)) }
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)) }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return
    setSubmitting(true)
    try {
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:3001'
        : (import.meta.env.VITE_API_BACKEND_URL || '')

      const serviceNames = selectedServices.map(id => serviceOptions.find(s => s.id === id)?.label).join(', ')
      const featureNames = selectedServices.map(id => {
        const feats = (selectedFeatures[id] || []).map(fId =>
          (featureAddons[id] || []).find(f => f.id === fId)?.label
        ).filter(Boolean)
        return feats.length ? `${serviceOptions.find(s => s.id === id)?.label}: ${feats.join(', ')}` : null
      }).filter(Boolean).join(' | ')

      const urgencyLabel = urgencyOptions.find(u => u.id === urgency)?.label
      const total = calculateTotal()

      const message = [
        `📊 Budget Estimate Request`,
        `Services: ${serviceNames}`,
        featureNames ? `Add-ons: ${featureNames}` : '',
        `Timeline: ${urgencyLabel}`,
        `Estimated Budget: ${formatCurrency(total, currency)}`,
        formData.notes ? `Notes: ${formData.notes}` : '',
      ].filter(Boolean).join('\n')

      await fetch(`${API_BASE.replace(/\/$/, '')}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, message }),
      })
    } catch (err) {
      console.warn('[BudgetCalculator] Backend submission failed, falling back to client-side success screen:', err);
    } finally {
      setSubmitted(true)
      setSubmitting(false)
    }
  }

  const total = calculateTotal()
  const originalTotal = calculateOriginalTotal()
  const canProceedStep0 = selectedServices.length > 0
  const canProceedStep2 = true // urgency always has a default
  const canSubmit = formData.name.trim() && formData.email.trim()

  return (
    <section id="estimate" className="py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black mb-6 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Project <span className="gradient-text">Estimator</span>
          </motion.h2>
          <p className="max-w-xl mx-auto text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            Configure your ideal project and get an instant budget estimate.
          </p>

          {/* Currency Toggle */}
          <div className="flex justify-center items-center gap-2 mb-2">
            {['INR', 'USD', 'EUR'].map(curr => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  currency === curr
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-10">
            {['Services', 'Features', 'Timeline', 'Submit'].map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                    i <= step ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : ''
                  }`} 
                  style={i <= step ? {} : { backgroundColor: 'var(--border-subtle)' }}
                />
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  i <= step ? 'text-cyan-400' : 'text-[var(--text-muted)]'
                }`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Floating Total Badge & ROI */}
          {selectedServices.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 py-3 px-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <Calculator size={16} className="text-cyan-400" />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Estimated Total:</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-rose-400/90 dark:text-rose-400/90 line-through decoration-rose-500 decoration-2 opacity-95 tracking-tight">
                    {formatCurrency(originalTotal)}
                  </span>
                  <motion.span
                    key={`${total}-${currency}`}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                  >
                    {formatCurrency(total)}
                  </motion.span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 text-white uppercase tracking-wider shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                    NEW OFFER
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 py-3 px-6 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 backdrop-blur-md"
              >
                <TrendingUp size={16} className="text-fuchsia-400" />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Projected ROI:</span>
                <span className="text-sm font-bold text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.3)]">
                  {getProjectedROI()}
                </span>
              </motion.div>
            </div>
          )}

          {/* Step Content */}
          <div className="glass-card p-8 lg:p-10 min-h-[340px] relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    What do you need?
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Select all services that apply.</p>
                  <div className="flex justify-center max-w-md mx-auto w-full">
                    {serviceOptions.map(service => {
                      const isSelected = selectedServices.includes(service.id)
                      return (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`group relative flex items-start gap-4 p-5 rounded-xl border transition-all duration-300 text-left cursor-pointer w-full ${
                            isSelected
                              ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                              : 'border-[var(--border-subtle)] hover:border-[var(--text-muted)]/30 hover:bg-[var(--text-primary)]/[0.02]'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'bg-cyan-500/20' : 'bg-white/5'
                          }`}>
                            <service.icon size={20} className={isSelected ? 'text-cyan-400' : 'text-[var(--text-muted)]'} />
                          </div>
                          <div>
                            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{service.label}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{service.description}</div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs font-bold text-cyan-400">from {formatCurrency(service.basePrice)}</span>
                              {service.originalBasePrice && (
                                <span className="text-xs font-extrabold text-slate-400 dark:text-zinc-400 line-through decoration-rose-500 decoration-2 opacity-90 tracking-tight">
                                  {formatCurrency(service.originalBasePrice)}
                                </span>
                              )}
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 text-white uppercase tracking-wider shadow-[0_0_8px_rgba(244,63,94,0.4)]">NEW OFFER</span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                              <Check size={12} className="text-black" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Customize with add-ons
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Optional features to enhance your project.</p>
                  <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                    {selectedServices.map(serviceId => {
                      const service = serviceOptions.find(s => s.id === serviceId)
                      const addons = featureAddons[serviceId] || []
                      return (
                        <div key={serviceId}>
                          <div className="flex items-center gap-2 mb-3">
                            <service.icon size={14} className="text-cyan-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">{service.label}</span>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {addons.map(addon => {
                              const isSelected = (selectedFeatures[serviceId] || []).includes(addon.id)
                              return (
                                <button
                                  key={addon.id}
                                  onClick={() => toggleFeature(serviceId, addon.id)}
                                  className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                                      : 'border-[var(--border-subtle)] hover:border-[var(--text-muted)]/30 text-[var(--text-secondary)]'
                                  }`}
                                >
                                  <span className="font-medium">{addon.label}</span>
                                  <div className="flex items-center gap-1.5">
                                    {addon.originalPrice && (
                                      <span className="text-xs font-extrabold text-slate-400 dark:text-zinc-400 line-through decoration-rose-500 decoration-2 opacity-90">
                                        +{formatCurrency(addon.originalPrice)}
                                      </span>
                                    )}
                                    <span className={`text-xs font-bold ${isSelected ? 'text-cyan-400' : 'text-[var(--text-muted)]'}`}>
                                      +{formatCurrency(addon.price)}
                                    </span>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    How soon do you need this?
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Faster timelines incur a premium.</p>
                  <div className="space-y-3">
                    {urgencyOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setUrgency(opt.id)}
                        className={`w-full flex items-center justify-between px-6 py-5 rounded-xl border transition-all cursor-pointer ${
                          urgency === opt.id
                            ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                            : 'border-[var(--border-subtle)] hover:border-[var(--text-muted)]/30'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{opt.label}</div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          urgency === opt.id ? 'bg-cyan-400/20 text-cyan-400' : 'bg-white/5 text-[var(--text-muted)]'
                        }`}>
                          {opt.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && !submitted && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Get your estimate
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>We'll reach out within 24 hours with a detailed proposal.</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--text-primary)]/[0.02] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--text-primary)]/[0.02] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
                    />
                    <textarea
                      placeholder="Additional notes (optional)"
                      value={formData.notes}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-5 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--text-primary)]/[0.02] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && submitted && (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-4"
                >
                  <div id="proposal-content" className="w-full text-center flex flex-col items-center p-8 bg-black/40 rounded-2xl border border-white/5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
                      <Sparkles size={28} className="text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Estimate Sent!</h3>
                    <p className="text-sm max-w-md mb-8" style={{ color: 'var(--text-secondary)' }}>
                      Thank you, {formData.name}! We've received your project estimate of <strong className="text-cyan-400">{formatCurrency(total)}</strong> and will reach out within 24 hours.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 w-full max-w-md text-left text-sm mb-4 border border-white/10 rounded-xl p-6 bg-white/5">
                      <div className="text-[var(--text-muted)]">Timeline</div>
                      <div className="font-bold text-right text-[var(--text-primary)]">{urgencyOptions.find(u => u.id === urgency)?.label}</div>
                      <div className="col-span-2 h-px bg-white/10"></div>
                      <div className="text-[var(--text-muted)]">Services</div>
                      <div className="font-bold text-right text-[var(--text-primary)]">{selectedServices.length} selected</div>
                      <div className="col-span-2 h-px bg-white/10"></div>
                      <div className="text-[var(--text-muted)]">Projected ROI</div>
                      <div className="font-bold text-right text-fuchsia-400">{getProjectedROI()}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mb-12">
                    <button
                      onClick={generatePDF}
                      disabled={generatingPDF}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-[var(--text-primary)] text-sm font-bold transition-all cursor-pointer"
                    >
                      {generatingPDF ? 'Generating...' : <><Download size={18} /> Download Proposal</>}
                    </button>
                    <a
                      href="https://calendly.com/gmedia774/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] cursor-pointer"
                    >
                      <Calendar size={18} /> Book Discovery Call Now
                    </a>
                  </div>

                  <div className="w-full max-w-2xl bg-white/5 rounded-2xl border border-white/10 p-2 overflow-hidden shadow-2xl">
                    <div className="p-6 text-center">
                      <h4 className="font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Want to skip the wait?</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Book a call directly on our calendar below to discuss your project.</p>
                    </div>
                    <iframe 
                      src="https://calendly.com/gmedia774/30min?hide_event_type_details=1&hide_gdpr_banner=1" 
                      width="100%" 
                      height="650" 
                      frameBorder="0"
                      className="rounded-xl bg-white w-full border-none"
                      title="Book a Discovery Call"
                    ></iframe>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {!submitted && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goBack}
                disabled={step === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                  step === 0
                    ? 'opacity-40 cursor-not-allowed border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-secondary)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 border-[var(--border-subtle)] hover:border-[var(--text-muted)]'
                }`}
              >
                <ChevronLeft size={16} /> Back
              </button>

              {step < totalSteps - 1 ? (
                <button
                  onClick={goNext}
                  disabled={step === 0 && !canProceedStep0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    step === 0 && !canProceedStep0
                      ? 'opacity-40 cursor-not-allowed border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      : 'bg-cyan-400 text-black hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:-translate-y-0.5'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    !canSubmit || submitting
                      ? 'opacity-40 cursor-not-allowed border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      : 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:-translate-y-0.5'
                  }`}
                >
                  {submitting ? 'Sending...' : <><Send size={14} /> Submit Estimate</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

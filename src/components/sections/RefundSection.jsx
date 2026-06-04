import { RefreshCcw, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react'

export default function RefundSection() {
  return (
    <section id="refund" className="relative py-24 md:py-32 overflow-hidden border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)' }}>
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-400/10 border border-fuchsia-400/20 text-fuchsia-400 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} className="text-fuchsia-400" /> 100% Risk-Free Guarantee
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Our Commitment: <br />
              <span className="gradient-text">Complete Peace of Mind</span>
            </h2>
            
            <p className="text-base md:text-lg leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              We believe in the quality of our work. If you're not completely satisfied with our services within 14 days of purchase, you can request an instant refund. No complex forms, no awkward calls, no questions asked.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0 border border-cyan-400/20">
                  <RefreshCcw size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Instant Processing</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Automated refund execution straight back to your original payment method.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-400/10 flex items-center justify-center shrink-0 border border-fuchsia-400/20">
                  <HeartHandshake size={18} className="text-fuchsia-400" />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Zero Objections</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>We value feedback, but we won't put you through a negotiation to get your money back.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Detail Side */}
          <div className="lg:col-span-5">
            <div 
              className="glass-card p-8 md:p-10 border shadow-2xl relative flex flex-col items-center text-center"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div className="w-16 h-16 rounded-full bg-fuchsia-400/10 flex items-center justify-center border border-fuchsia-400/20 mb-6">
                <ShieldCheck size={32} className="text-fuchsia-400" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                How to Request a Refund
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                To ensure a secure process, all refund requests are handled directly through your payment receipt.
              </p>
              
              <div className="w-full bg-black/20 rounded-xl p-4 text-left border border-white/10 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Open your Payment Success email.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-fuchsia-400/20 text-fuchsia-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Click the <strong>"Request Refund"</strong> button to be redirected to our secure refund portal.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

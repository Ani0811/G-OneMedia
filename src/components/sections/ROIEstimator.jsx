import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'

const CURRENCIES = {
  USD: {
    label: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    aovDefault: 150,
    aovMin: 10,
    aovMax: 1000,
    aovStep: 10,
    locale: 'en-US',
    code: 'USD',
  },
  EUR: {
    label: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    aovDefault: 130,
    aovMin: 10,
    aovMax: 900,
    aovStep: 10,
    locale: 'de-DE',
    code: 'EUR',
  },
  INR: {
    label: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    aovDefault: 12500,
    aovMin: 500,
    aovMax: 80000,
    aovStep: 500,
    locale: 'en-IN',
    code: 'INR',
  },
}

export default function ROICalculator() {
  const [currencyKey, setCurrencyKey] = useState('USD')
  const [traffic, setTraffic] = useState(10000)
  const [aov, setAov] = useState(CURRENCIES.USD.aovDefault)
  const [convRate, setConvRate] = useState(1.5)

  const currency = CURRENCIES[currencyKey]

  // Reset AOV to currency-appropriate default when switching
  useEffect(() => {
    setAov(CURRENCIES[currencyKey].aovDefault)
  }, [currencyKey])

  const currentRevenue = useMemo(() => {
    const orders = traffic * (convRate / 100)
    return orders * aov
  }, [traffic, aov, convRate])

  const projectedRevenue = useMemo(() => {
    const newTraffic = traffic * 1.2
    const newConvRate = convRate + 0.8
    const orders = newTraffic * (newConvRate / 100)
    return orders * aov
  }, [traffic, aov, convRate])

  const formatCurrency = (val) =>
    new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(val)

  const lift = projectedRevenue - currentRevenue
  const liftPercent = currentRevenue > 0 ? ((lift / currentRevenue) * 100).toFixed(0) : 0

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'rgba(0,240,255,0.03)' }}>
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Introduction ── */}
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="text-secondary font-bold tracking-wider uppercase text-sm block"
                style={{ color: 'var(--accent-blue)' }}>
                Interactive Growth Estimator
              </span>

              {/* Currency switcher */}
              <div className="flex bg-bg-empty border rounded-lg overflow-hidden text-xs"
                style={{ borderColor: 'var(--border-subtle)' }}>
                {Object.entries(CURRENCIES).map(([key, c]) => (
                  <button
                    key={key}
                    onClick={() => setCurrencyKey(key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-bold transition-all duration-200"
                    style={currencyKey === key
                      ? { background: 'var(--accent-blue)', color: '#000' }
                      : { color: 'var(--text-secondary)' }
                    }
                  >
                    <span>{c.flag}</span>
                    <span>{c.symbol} {c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading" style={{ color: 'var(--text-primary)' }}>
              Stop Guessing Your Growth. <br />
              <span className="gradient-text">Calculate Your ROI.</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              Adjust the sliders based on your current metrics. We'll show you exactly how much undocumented revenue you are leaving on the table right now by having an unoptimized funnel.
            </p>
            <div className="flex flex-col gap-4 text-sm border-l-2 pl-4" style={{ color: 'var(--text-secondary)', borderColor: 'var(--accent-blue)' }}>
              <p>⚡ We generally boost traffic by 20% within 90 days via tailored SEO/Ads.</p>
              <p>🎯 We generally increase average conversion rates by at least +0.8%.</p>
            </div>
          </div>

          {/* ── Right: Calculator ── */}
          <motion.div
            key={currencyKey}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8 rounded-3xl shadow-2xl backdrop-blur-xl border"
            style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="space-y-8 mb-8">

              {/* Traffic Slider */}
              <div>
                <div className="flex justify-between font-semibold mb-2">
                  <span style={{ color: 'var(--text-primary)' }}>Monthly Traffic</span>
                  <span style={{ color: 'var(--accent-blue)' }}>{traffic.toLocaleString()} visitors</span>
                </div>
                <input
                  type="range" min="1000" max="100000" step="1000"
                  value={traffic} onChange={(e) => setTraffic(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer accent-cyan-400"
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>1K</span><span>100K</span>
                </div>
              </div>

              {/* AOV Slider — range & step adapt per currency */}
              <div>
                <div className="flex justify-between font-semibold mb-2">
                  <span style={{ color: 'var(--text-primary)' }}>
                    Average Order Value <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>({currency.symbol})</span>
                  </span>
                  <span style={{ color: 'var(--accent-blue)' }}>{formatCurrency(aov)}</span>
                </div>
                <input
                  type="range"
                  min={currency.aovMin}
                  max={currency.aovMax}
                  step={currency.aovStep}
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer"
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>{formatCurrency(currency.aovMin)}</span>
                  <span>{formatCurrency(currency.aovMax)}</span>
                </div>
              </div>

              {/* Conversion Rate Slider */}
              <div>
                <div className="flex justify-between font-semibold mb-2">
                  <span style={{ color: 'var(--text-primary)' }}>Current Conversion Rate</span>
                  <span style={{ color: 'var(--accent-blue)' }}>{convRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range" min="0.1" max="10" step="0.1"
                  value={convRate} onChange={(e) => setConvRate(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer"
                  style={{ accentColor: 'var(--accent-blue)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>0.1%</span><span>10%</span>
                </div>
              </div>
            </div>

            {/* Results Board */}
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex justify-between items-end mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                    Current Monthly Revenue
                  </p>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(currentRevenue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                    Projected w/ G-One Media
                  </p>
                  <motion.p
                    key={`${projectedRevenue}-${currencyKey}`}
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-black text-green-400"
                  >
                    {formatCurrency(projectedRevenue)}
                  </motion.p>
                </div>
              </div>

              <div className="w-full flex justify-between items-center p-4 rounded-xl border"
                style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
                <span className="font-bold text-sm">Missing Revenue per month:</span>
                <div className="text-right">
                  <span className="font-black text-lg">+{formatCurrency(lift)}</span>
                  <span className="text-xs ml-2 font-bold opacity-70">(+{liftPercent}%)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
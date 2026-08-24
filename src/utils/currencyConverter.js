/**
 * Currency Converter Utility
 * Automatically converts INR pricing to USD and EUR.
 * Supports:
 * - Single amounts (e.g., '12999', '₹12,999', '₹5,999')
 * - Ranges (e.g., '₹8,499 - ₹16,999')
 * - Suffixes (e.g., '/ mo', '/ project', '+')
 * - Special text (e.g., 'Free', 'Custom', 'Contact Us')
 */

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Converts a raw numeric INR value to a psychological/market USD price
 * Conversion rate baseline: ~80 INR per 1 USD
 */
export function convertInrNumericToUsd(num) {
  if (!num || isNaN(num) || num <= 0) return 0
  const raw = num / 80
  if (raw < 50) return Math.round(raw)
  if (raw < 500) {
    const rounded = Math.round(raw / 10) * 10 - 1
    return rounded > 0 ? rounded : Math.round(raw)
  }
  const rounded = Math.round(raw / 50) * 50 - 1
  return rounded > 0 ? rounded : Math.round(raw)
}

/**
 * Converts a raw numeric INR value to a psychological/market EUR price
 * Conversion rate baseline: EUR is approx USD * 0.92 (~88 INR per 1 EUR)
 */
export function convertInrNumericToEur(num) {
  if (!num || isNaN(num) || num <= 0) return 0
  const usd = convertInrNumericToUsd(num)
  const rawEur = usd * 0.92
  if (rawEur < 50) return Math.round(rawEur)
  if (rawEur < 500) {
    const rounded = Math.round(rawEur / 10) * 10 - 1
    return rounded > 0 ? rounded : Math.round(rawEur)
  }
  const rounded = Math.round(rawEur / 50) * 50 - 1
  return rounded > 0 ? rounded : Math.round(rawEur)
}

/**
 * Converts any INR string into target currency (USD or EUR)
 * Preserves suffixes, ranges, and handles "Free" / "Custom"
 */
export function convertInrStringToCurrency(inrStr, targetCurrency = 'USD') {
  if (!inrStr || typeof inrStr !== 'string') return ''
  const trimmed = inrStr.trim()
  if (!trimmed) return ''

  if (trimmed.toLowerCase() === 'free') return 'Free'
  if (trimmed.toLowerCase() === 'custom' || trimmed.toLowerCase() === 'contact us') return trimmed

  const symbol = targetCurrency === 'USD' ? '$' : '€'
  const converter = targetCurrency === 'USD' ? convertInrNumericToUsd : convertInrNumericToEur

  // Match numbers (including commas) optionally prefixed by rupee symbol
  const converted = trimmed.replace(/(?:₹\s*)?(\d+(?:,\d+)*(?:\.\d+)?)/g, (match, p1) => {
    const numeric = parseFloat(p1.replace(/,/g, ''))
    if (isNaN(numeric) || numeric === 0) return match
    const resultVal = converter(numeric)
    return `${symbol}${formatNumber(resultVal)}`
  }).replace(/₹/g, '').trim()

  return converted
}

export function convertInrToUsd(inrStr) {
  return convertInrStringToCurrency(inrStr, 'USD')
}

export function convertInrToEur(inrStr) {
  return convertInrStringToCurrency(inrStr, 'EUR')
}

/**
 * Auto-formats an INR input string nicely (adds ₹ if needed when formatting)
 */
export function formatInr(val) {
  if (!val || typeof val !== 'string') return ''
  const trimmed = val.trim()
  if (!trimmed || trimmed.startsWith('₹') || trimmed.toLowerCase() === 'free') return trimmed
  return `₹${trimmed}`
}

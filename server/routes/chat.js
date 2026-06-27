import express from 'express'
import { supabase, transporter, razorpay } from '../config/clients.js'
import { chatLimiter } from '../middleware/limiters.js'
import { CHAT_SYSTEM_PROMPT, PRICING_MATRIX, CHAT_TOOLS } from '../../config/chatConfig.js'
import { getChatBookingTemplate, getChatRefundRequestTemplate } from '../../templates/emailTemplates.js'

const router = express.Router()
const chatSessions = new Map()

// ─── FUNCTION EXECUTOR ────────────────────────────────────────────────────────
async function executeChatFunction(name, args, sessionId) {
  const agencyEmail = process.env.AGENCY_EMAIL || 'gmedia774@gmail.com'
  let result = { success: false, message: 'Unknown error.' }
  let frontendAction = null

  try {
    if (name === 'contact_founders') {
      const { name: clientName, email, message } = args
      await transporter.sendMail({
        from: `"G-ONE AI" <${process.env.SMTP_USER}>`,
        to: agencyEmail,
        replyTo: email,
        subject: `💬 Contact Message from ${clientName} — via AI Chat`,
        html: getChatBookingTemplate({ name: clientName, email, details: message, type: 'enquiry' }),
      })
      supabase.from('chat_contacts').insert([{ name: clientName, email, message, session_id: sessionId }])
        .then(({ error: e }) => { if (e) console.warn('[Supabase] chat_contacts error:', e) })
      result = { success: true, message: `Message sent from ${clientName} (${email}).` }

    } else if (name === 'book_service') {
      const { name: clientName, email, service_name, budget, details } = args
      await transporter.sendMail({
        from: `"G-ONE AI" <${process.env.SMTP_USER}>`,
        to: agencyEmail,
        replyTo: email,
        subject: `🗓️ New Booking: ${service_name} from ${clientName} — via AI Chat`,
        html: getChatBookingTemplate({ name: clientName, email, service: service_name, budget, details, type: 'booking' }),
      })
      supabase.from('chat_leads').insert([{ name: clientName, email, service: service_name, budget: budget || null, details, type: 'booking', session_id: sessionId }])
        .then(({ error: e }) => { if (e) console.warn('[Supabase] chat_leads error:', e) })
      result = { success: true, message: `Booking for "${service_name}" confirmed for ${clientName} (${email}).` }

    } else if (name === 'estimate_project') {
      const { service_category, specific_service } = args
      const categoryMatrix = PRICING_MATRIX[service_category] || {}
      let estimate = categoryMatrix.default || 'Please contact us for a custom quote.'
      if (specific_service) {
        const key = Object.keys(categoryMatrix).find(k =>
          k.toLowerCase().includes(specific_service.toLowerCase()) ||
          specific_service.toLowerCase().includes(k.toLowerCase())
        )
        if (key) estimate = categoryMatrix[key]
      }
      result = { success: true, estimate, service_category, specific_service: specific_service || 'General' }

    } else if (name === 'create_payment') {
      const { name: clientName, email, amount_inr, service_description } = args
      if (!razorpay) {
        result = { success: false, message: 'Payment system not configured. Please contact us directly.' }
      } else {
        const order = await razorpay.orders.create({
          amount: Math.round(amount_inr) * 100,
          currency: 'INR',
          receipt: `chat_${Date.now()}`,
          notes: { client_name: clientName, client_email: email, service: service_description },
        })
        frontendAction = { type: 'OPEN_CHECKOUT', order, amount_inr, service_description, client_name: clientName, client_email: email }
        result = { success: true, message: `Payment order created for Rs.${amount_inr} for "${service_description}".`, order_id: order.id }
      }

    } else if (name === 'request_refund') {
      const { name: clientName, email, payment_id, reason } = args
      await transporter.sendMail({
        from: `"G-ONE AI" <${process.env.SMTP_USER}>`,
        to: agencyEmail,
        replyTo: email,
        subject: `⚠️ Refund Request: ${payment_id} from ${clientName || email} — MANUAL REVIEW REQUIRED`,
        html: getChatRefundRequestTemplate({ name: clientName, email, payment_id, reason }),
      })
      supabase.from('chat_refund_requests').insert([{ name: clientName || null, email, payment_id, reason: reason || null, status: 'pending', session_id: sessionId }])
        .then(({ error: e }) => { if (e) console.warn('[Supabase] chat_refund_requests error:', e) })
      result = { success: true, message: `Refund request for ${payment_id} submitted. Team will review and contact ${email} within 1-2 business days.` }
    }
  } catch (err) {
    console.error(`[executeChatFunction] Error in ${name}:`, err)
    result = { success: false, message: `Action failed: ${err.message}` }
  }

  return { result, frontendAction }
}

router.post('/chat', chatLimiter, async (req, res) => {
  const { message, sessionId } = req.body
  if (!message) return res.status(400).json({ error: 'Message is required.' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'AI service not configured.' })

  const sid = sessionId || `session_${Date.now()}`
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  if (!chatSessions.has(sid)) {
    chatSessions.set(sid, [
      { role: 'user', parts: [{ text: CHAT_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: "Hi! I'm G-ONE, the G-One Media AI assistant. I can answer questions, estimate project costs, book services, and even handle payments — all right here! How can I help you today? 🚀" }] }
    ])
  }

  const history = chatSessions.get(sid)
  history.push({ role: 'user', parts: [{ text: message }] })

  try {
    // 1. RAG: Embed + retrieve context (non-fatal)
    let contextText = ''
    try {
      const embedRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'models/gemini-embedding-2', content: { parts: [{ text: message }] } }) }
      )
      if (embedRes.ok) {
        const { embedding } = await embedRes.json()
        if (embedding?.values) {
          const { data: docs, error } = await supabase.rpc('match_documents', { query_embedding: embedding.values, match_threshold: 0.70, match_count: 3 })
          if (!error && docs?.length > 0) contextText = docs.map(d => d.content).join('\n\n')
        }
      }
    } catch (ragErr) {
      console.warn('[RAG] Non-fatal error:', ragErr.message)
    }

    // 2. Build payload with optional RAG context injected into last message
    const payloadHistory = JSON.parse(JSON.stringify(history))
    if (contextText) {
      const last = payloadHistory[payloadHistory.length - 1]
      last.parts[0].text = `[Knowledge Base Context]\n${contextText}\n\n[User Message]\n${last.parts[0].text}`
    }

    // 3. First Gemini call — may return text or a function call
    let firstResp
    let retries = 3, delay = 1000
    while (retries > 0) {
      firstResp = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: payloadHistory, tools: CHAT_TOOLS, generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } })
      })
      if (firstResp.status === 429 && retries > 1) {
        console.warn(`[Gemini] 429 hit. Retrying in ${delay}ms...`)
        await new Promise(r => setTimeout(r, delay))
        delay *= 2; retries--
      } else break
    }

    if (!firstResp.ok) throw new Error(`Gemini API error: ${firstResp.status}`)
    const firstData = await firstResp.json()
    const firstContent = firstData.candidates?.[0]?.content
    const functionCallPart = firstContent?.parts?.find(p => p.functionCall)

    let reply = ''
    let frontendAction = null

    if (functionCallPart) {
      // 4a. Gemini wants to call a function
      const { name: fnName, args: fnArgs } = functionCallPart.functionCall
      console.log(`[G-ONE] Function call: ${fnName}`, fnArgs)

      history.push({ role: 'model', parts: [{ functionCall: { name: fnName, args: fnArgs } }] })

      const { result: fnResult, frontendAction: fnAction } = await executeChatFunction(fnName, fnArgs, sid)
      frontendAction = fnAction

      history.push({ role: 'user', parts: [{ functionResponse: { name: fnName, response: fnResult } }] })

      // 4b. Second Gemini call to generate the final user-facing reply
      const secondResp = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: history, tools: CHAT_TOOLS, generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } })
      })
      if (!secondResp.ok) throw new Error(`Gemini API error (turn 2): ${secondResp.status}`)
      const secondData = await secondResp.json()
      reply = secondData.candidates?.[0]?.content?.parts?.find(p => p.text)?.text?.trim()
        || 'Done! Is there anything else I can help you with?'
      history.push({ role: 'model', parts: [{ text: reply }] })

    } else {
      // 4c. Plain text reply
      reply = firstContent?.parts?.find(p => p.text)?.text?.trim()
        || "I'm having a moment! Could you rephrase that?"
      history.push({ role: 'model', parts: [{ text: reply }] })
    }

    // 5. Trim history to prevent token overflow
    if (history.length > 30) {
      chatSessions.set(sid, [history[0], history[1], ...history.slice(-24)])
    }

    const responsePayload = { reply, sessionId: sid }
    if (frontendAction) responsePayload.action = frontendAction
    res.json(responsePayload)

  } catch (error) {
    console.error('[Chat API]', error)
    if (error.message?.includes('429')) {
      res.json({ reply: "I'm receiving too many requests. Please wait 30-40 seconds and try again! ⏳", sessionId: sid })
    } else {
      res.status(500).json({ error: 'Failed to get AI response.' })
    }
  }
})

export default router

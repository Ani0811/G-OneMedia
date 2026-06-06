/* global process, Buffer */
import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { createClient } from '@supabase/supabase-js'
import { getContactEmailTemplate, getPaymentSuccessTemplate, getRefundInitiatedTemplate, getRefundSuccessTemplate, getChatBookingTemplate, getChatRefundRequestTemplate, getDiscoveryEmailTemplate, getClientConfirmationEmailTemplate, getClientDiscoveryEmailTemplate } from './templates/emailTemplates.js';
import { CHAT_SYSTEM_PROMPT, PRICING_MATRIX, CHAT_TOOLS } from './config/chatConfig.js';

dotenv.config()

// Supabase admin client (server-side — uses service key or anon key)
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder'
)

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://localhost:4173,https://ani0811.github.io'

// Secure HTTP security headers using Helmet
app.use(helmet())

// Configure CORS to restrict unauthorized origins
const allowedOrigins = FRONTEND_ORIGIN.split(',')
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    // Allow localhost/127.0.0.1 for development
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
      return callback(null, true)
    }
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())

// Rate Limiting configurations for API security
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per 15 minutes
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 30, // Limit each IP to 30 requests per minute
  message: { error: 'Too many messages. Please slow down and try again in a minute.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
})

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message, details, service, budget } = req.body

  const content = message || details

  if (!name || !email || !content) {
    return res.status(400).json({ error: 'Name, email, and message or description are required.' })
  }

  // Determine if this is a Discovery Call Booking request
  const isDiscoveryCall = !!service

  try {
    // 1. Save to Supabase leads table (fast write)
    const { error: dbError } = await supabase.from('leads').insert([{
      name,
      email,
      service: service || null,
      budget: budget || null,
      description: content
    }])

    if (dbError) {
      console.error('[Contact API] Supabase leads insert failed:', dbError.message)
      // Do not block the response, log it and proceed
    }

    // 2. Send emails in the background (fire-and-forget, non-blocking)
    // Send to agency
    transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.AGENCY_EMAIL || 'gmedia774@gmail.com', // sends to agency
      replyTo: email,
      subject: isDiscoveryCall
        ? `✦ Discovery Call Request [${service}] from ${name} — G-One Media`
        : `✦ New Message from ${name} — G-One Media`,
      html: getContactEmailTemplate({ name, email, service, budget, content, isDiscoveryCall }),
    }).catch(err => {
      console.error('[Contact API] Nodemailer error sending to agency:', err)
    })

    // Send confirmation to client
    transporter.sendMail({
      from: `"G-One Media" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We've received your inquiry — G-One Media`,
      html: getClientConfirmationEmailTemplate({ name, service, budget, content }),
    }).catch(err => {
      console.error('[Contact API] Nodemailer error sending client confirmation:', err)
    })

    // 3. Return response immediately
    res.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    res.status(500).json({ error: 'Failed to process contact request. Please try again.' })
  }
})

// Dedicated Discovery Call booking form endpoint (saves to DB + sends email notification)
app.post('/api/discovery', contactLimiter, async (req, res) => {
  const { name, email, company, website, service, budget, details, referral } = req.body

  if (!name || !email || !service) {
    return res.status(400).json({ error: 'Name, email, and service needed are required.' })
  }

  try {
    // 1. Insert into Supabase discovery_calls table
    const { error: dbError } = await supabase.from('discovery_calls').insert([{
      name,
      email,
      company: company || null,
      website: website || null,
      service,
      budget: budget || null,
      details: details || null,
      referral: referral || null
    }])

    if (dbError) {
      console.error('[Discovery] Supabase DB error:', dbError.message)
      // We will not block the user response if database fails, but log it.
    }

    // 2. Dispatch email notification to founders (background)
    transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.AGENCY_EMAIL || 'gmedia774@gmail.com',
      replyTo: email,
      subject: `✦ Discovery Booking Request from ${name} [${service}]`,
      html: getDiscoveryEmailTemplate({ name, email, company, website, service, budget, details, referral })
    }).catch(err => {
      console.error('[Discovery] Nodemailer error sending to agency:', err)
    })

    // Send confirmation email to client (background)
    transporter.sendMail({
      from: `"G-One Media" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Discovery Call Request Received — G-One Media`,
      html: getClientDiscoveryEmailTemplate({ name, service, budget, details }),
    }).catch(err => {
      console.error('[Discovery] Nodemailer error sending client confirmation:', err)
    })

    // 3. Return response immediately
    res.json({ success: true })
  } catch (err) {
    console.error('[Discovery] API error:', err)
    res.status(500).json({ error: 'Failed to submit discovery call. Please try again later.' })
  }
})

app.get('/', (req, res) => res.send('G-One Media API'))

// Razorpay Initialization
const VITE_RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID
const VITE_RAZORPAY_KEY_SECRET = process.env.VITE_RAZORPAY_KEY_SECRET

let razorpay;
if (VITE_RAZORPAY_KEY_ID && VITE_RAZORPAY_KEY_SECRET) {
  console.log('Razorpay Key ID loaded:', `${VITE_RAZORPAY_KEY_ID.substring(0, 9)}... (length: ${VITE_RAZORPAY_KEY_ID.trim().length})`)
  console.log('Razorpay Key Secret loaded: (length:', VITE_RAZORPAY_KEY_SECRET.trim().length, ')')
  razorpay = new Razorpay({
    key_id: VITE_RAZORPAY_KEY_ID.trim(),
    key_secret: VITE_RAZORPAY_KEY_SECRET.trim(),
  })
} else {
  console.warn("⚠️ RAZORPAY KEYS MISSING: Please add VITE_RAZORPAY_KEY_ID and VITE_RAZORPAY_KEY_SECRET to your environment variables.")
}

app.post('/api/create-order', async (req, res) => {
  try {
    console.log('--- Razorpay Order Creation Start ---')
    console.log('Request body:', req.body)
    if (!razorpay) {
      console.error('Razorpay client not initialized. Keys are missing in process.env.')
      return res.status(500).json({ error: 'Razorpay keys not configured on the server.' })
    }
    const { amount, receipt } = req.body
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`
    }
    console.log('Creating order with options:', options)
    const order = await razorpay.orders.create(options)
    console.log('Razorpay Order Response:', order)
    res.json(order)
  } catch (error) {
    console.error('Razorpay Create Order Error details:', error)
    res.status(500).json({ error: error.message || 'Failed to create order' })
  } finally {
    console.log('--- Razorpay Order Creation End ---')
  }
})

app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', VITE_RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex')

  if (expectedSignature === razorpay_signature) {
    try {
      let userEmail = null
      let userAmount = 0

      if (razorpay) {
        const payment = await razorpay.payments.fetch(razorpay_payment_id)
        userEmail = payment.email
        userAmount = payment.amount / 100

        // Log payment to Supabase (fire-and-forget)
        supabase.from('payments').insert([{
          razorpay_order_id,
          razorpay_payment_id,
          amount: userAmount,
          email: userEmail || null,
          status: 'captured',
        }]).then(({ error }) => {
          if (error) console.warn('⚠️ Supabase payment log failed:', error)
          else console.log('✅ Payment logged to Supabase:', razorpay_payment_id)
        })

        if (userEmail) {
          // Send receipt email (fire-and-forget — don't block the response)
          transporter.sendMail({
            from: `"G-One Media" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: 'Payment Received — G-One Media',
            html: getPaymentSuccessTemplate({ userAmount, razorpay_payment_id })
          }).catch(err => console.warn('Payment email failed:', err))
        }
      }
      res.json({ success: true, message: 'Payment verified successfully' })
    } catch (error) {
      console.error('Error in post-verification:', error)
      res.json({ success: true, message: 'Payment verified successfully, but post-processing failed.' })
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' })
  }
})

app.post('/api/refund', async (req, res) => {
  const { payment_id, email } = req.body

  if (!payment_id || !email) {
    return res.status(400).json({ error: 'Payment ID and Email are required.' })
  }

  if (!razorpay) {
    return res.status(500).json({ error: 'Razorpay keys not configured on the server.' })
  }

  try {
    const payment = await razorpay.payments.fetch(payment_id)
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' })
    }

    if (payment.email !== email) {
      return res.status(403).json({ error: 'Email does not match the payment record.' })
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ error: 'This payment has already been refunded.' })
    }

    const refund = await razorpay.payments.refund(payment_id)

    // In Test Mode (or if Razorpay processed it instantly in Live Mode), status is 'processed'
    if (refund.status === 'processed') {
      await transporter.sendMail({
        from: `"G-One Media" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Refund Successful — G-One Media',
        html: getRefundSuccessTemplate({ amount: payment.amount / 100, payment_id, refund_id: refund.id })
      })
    } else {
      await transporter.sendMail({
        from: `"G-One Media" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Refund Initiated — G-One Media',
        html: getRefundInitiatedTemplate({ amount: payment.amount / 100, payment_id })
      })
    }

    res.json({ success: true, refund })
  } catch (error) {
    console.error('Refund Error:', error)
    res.status(500).json({ error: error.message || 'Failed to process refund' })
  }
})

app.post('/api/razorpay-webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  // Verify webhook signature if a secret is configured in the environment
  if (webhookSecret && signature) {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (expectedSignature !== signature) {
      console.warn('⚠️ Webhook signature verification failed')
      return res.status(400).json({ error: 'Invalid webhook signature' })
    }
  }

  const { event, payload } = req.body

  if (event === 'refund.processed') {
    try {
      const refundEntity = payload.refund.entity
      const paymentId = refundEntity.payment_id
      const amount = refundEntity.amount / 100

      if (razorpay) {
        // Fetch payment details to obtain the consumer's email address
        const payment = await razorpay.payments.fetch(paymentId)
        const email = payment.email

        if (email) {
          await transporter.sendMail({
            from: `"G-One Media" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Refund Successful — G-One Media',
            html: getRefundSuccessTemplate({ amount, payment_id: paymentId, refund_id: refundEntity.id })
          })
          console.log(`✉️ Async refund successful email sent to ${email} for payment ${paymentId}`)
        }
      }
    } catch (error) {
      console.error('Error handling refund.processed webhook:', error)
    }
  }
  res.json({ status: 'ok' })
})
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

app.post('/api/chat', chatLimiter, async (req, res) => {
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

// Text-to-Speech Endpoint (ElevenLabs)
app.post('/api/tts', async (req, res) => {
  const defaultVoice = process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID || 'Xb7hH8MSUJpSbSDYk0k2'; // Default to Alice voice (free-tier friendly)
  const { text, voiceId = defaultVoice } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ElevenLabs API key not configured' });

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', // Turbo model for lowest latency
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      let details = ''
      try {
        const errJson = await response.json()
        details = JSON.stringify(errJson)
      } catch {
        try {
          details = await response.text()
        } catch {
          details = 'Unknown response'
        }
      }
      throw new Error(`ElevenLabs API returned status ${response.status}: ${details}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length
    })
    res.send(buffer)
  } catch (error) {
    console.error('TTS error:', error)
    res.status(500).json({ error: error.message || 'Failed to generate audio' })
  }
})

app.listen(PORT, () => console.log(`✅ G-One Media API running on http://localhost:${PORT}`))

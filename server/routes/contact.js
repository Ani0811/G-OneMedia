import express from 'express'
import { supabase, transporter } from '../config/clients.js'
import { contactLimiter } from '../middleware/limiters.js'
import { getContactEmailTemplate, getDiscoveryEmailTemplate, getClientConfirmationEmailTemplate, getClientDiscoveryEmailTemplate } from '../../templates/emailTemplates.js'

const router = express.Router()

router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, message, details, service, budget } = req.body
  const content = message || details

  if (!name || !email || !content) {
    return res.status(400).json({ error: 'Name, email, and message or description are required.' })
  }

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
    }

    // 2. Send emails in the background (fire-and-forget, non-blocking)
    transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.AGENCY_EMAIL || 'gmedia774@gmail.com',
      replyTo: email,
      subject: isDiscoveryCall
        ? `✦ Discovery Call Request [${service}] from ${name} — G-One Media`
        : `✦ New Message from ${name} — G-One Media`,
      html: getContactEmailTemplate({ name, email, service, budget, content, isDiscoveryCall }),
    }).catch(err => {
      console.error('[Contact API] Nodemailer error sending to agency:', err)
    })

    transporter.sendMail({
      from: `"G-One Media" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We've received your inquiry — G-One Media`,
      html: getClientConfirmationEmailTemplate({ name, service, budget, content }),
    }).catch(err => {
      console.error('[Contact API] Nodemailer error sending client confirmation:', err)
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    res.status(500).json({ error: 'Failed to process contact request. Please try again.' })
  }
})

router.post('/discovery', contactLimiter, async (req, res) => {
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

    transporter.sendMail({
      from: `"G-One Media" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Discovery Call Request Received — G-One Media`,
      html: getClientDiscoveryEmailTemplate({ name, service, budget, details }),
    }).catch(err => {
      console.error('[Discovery] Nodemailer error sending client confirmation:', err)
    })

    res.json({ success: true })
  } catch (err) {
    console.error('[Discovery] API error:', err)
    res.status(500).json({ error: 'Failed to submit discovery call. Please try again later.' })
  }
})

export default router

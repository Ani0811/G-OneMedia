import express from 'express'
import crypto from 'crypto'
import { supabase, transporter, razorpay } from '../config/clients.js'
import { contactLimiter } from '../middleware/limiters.js'
import { getPaymentSuccessTemplate, getRefundSuccessTemplate, getRefundInitiatedTemplate } from '../../templates/emailTemplates.js'

const router = express.Router()

router.post('/create-order', async (req, res) => {
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

router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.VITE_RAZORPAY_KEY_SECRET)
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

router.post('/refund', contactLimiter, async (req, res) => {
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

export default router

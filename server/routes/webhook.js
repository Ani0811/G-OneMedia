import express from 'express'
import crypto from 'crypto'
import { razorpay, transporter } from '../config/clients.js'
import { getRefundSuccessTemplate } from '../../templates/emailTemplates.js'

const router = express.Router()

router.post('/razorpay-webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.VITE_RAZORPAY_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('❌ Razorpay webhook secret is not configured on the server.')
    return res.status(500).json({ error: 'Webhook configuration error' })
  }

  if (!signature) {
    return res.status(400).json({ error: 'Missing webhook signature' })
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex')

  if (expectedSignature !== signature) {
    console.warn('⚠️ Webhook signature verification failed')
    return res.status(400).json({ error: 'Invalid webhook signature' })
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

export default router

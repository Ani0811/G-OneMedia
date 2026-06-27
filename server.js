/* global process */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'

import contactRoutes from './server/routes/contact.js'
import paymentRoutes from './server/routes/payment.js'
import chatRoutes from './server/routes/chat.js'
import webhookRoutes from './server/routes/webhook.js'
import ttsRoutes from './server/routes/tts.js'

dotenv.config()

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

// API Routes
app.use('/api', contactRoutes)
app.use('/api', paymentRoutes)
app.use('/api', chatRoutes)
app.use('/api', webhookRoutes)
app.use('/api', ttsRoutes)

// Root endpoint
app.get('/', (req, res) => res.send('G-One Media API'))

app.listen(PORT, '0.0.0.0', () => console.log(`✅ G-One Media API running on http://localhost:${PORT}`))

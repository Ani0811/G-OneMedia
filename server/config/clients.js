import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Supabase Client
export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder'
)

// Initialize Nodemailer Transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  }
})

// Initialize Razorpay
const VITE_RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID
const VITE_RAZORPAY_KEY_SECRET = process.env.VITE_RAZORPAY_KEY_SECRET

export let razorpay = null
if (VITE_RAZORPAY_KEY_ID && VITE_RAZORPAY_KEY_SECRET) {
  console.log('Razorpay Key ID loaded:', `${VITE_RAZORPAY_KEY_ID.substring(0, 9)}...`)
  razorpay = new Razorpay({
    key_id: VITE_RAZORPAY_KEY_ID.trim(),
    key_secret: VITE_RAZORPAY_KEY_SECRET.trim(),
  })
} else {
  console.warn("⚠️ RAZORPAY KEYS MISSING: Please add VITE_RAZORPAY_KEY_ID and VITE_RAZORPAY_KEY_SECRET to your environment variables.")
}

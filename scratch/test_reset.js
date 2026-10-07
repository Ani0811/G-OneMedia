import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testReset() {
  console.log("Testing resetPasswordForEmail for vasudevsharma3223@gmail.com ...")
  const { data, error } = await supabase.auth.resetPasswordForEmail('vasudevsharma3223@gmail.com', {
    redirectTo: 'https://g-one-media.vercel.app/admin/reset-password'
  })

  console.log("Data:", data)
  console.log("Error:", error)
}

testReset().catch(console.error)

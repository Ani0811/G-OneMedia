import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import readline from 'readline'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_PROJECT_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ Error: VITE_SUPABASE_URL is missing in .env')
  process.exit(1)
}

function promptQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close()
    resolve(ans.trim())
  }))
}

async function main() {
  console.log('\n🔒 ──────────────────────────────────────────────')
  console.log('   G-One Media — Secure Admin User Creation CLI   ')
  console.log('──────────────────────────────────────────────────\n')

  let email = process.argv[2]
  let password = process.argv[3]

  if (!email) {
    email = await promptQuestion('Enter Admin Email: ')
  }
  if (!password) {
    password = await promptQuestion('Enter Admin Password (min 6 chars): ')
  }

  if (!email || !password || password.length < 6) {
    console.error('❌ Error: Valid email and password (minimum 6 characters) are required.')
    process.exit(1)
  }

  try {
    if (supabaseServiceKey) {
      // Direct Admin creation via Service Role (bypasses email confirmation)
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })

      console.log(`⏳ Creating confirmed admin account for: ${email}...`)
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (error) throw error

      console.log('✅ Admin user created successfully!')
      console.log(`   User ID: ${data.user.id}`)
      console.log(`   Email: ${data.user.email}`)
      console.log(`   Email Confirmed: Yes`)
      console.log('\n🚀 You can now sign in immediately at /admin\n')
    } else {
      // Standard sign up via Anon key
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      console.log(`⏳ Registering admin account for: ${email}...`)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      console.log('✅ Admin account registered successfully!')
      console.log(`   User ID: ${data.user?.id || 'Created'}`)
      console.log(`   Email: ${email}`)
      if (data.session) {
        console.log('   Status: Confirmed and ready to log in.')
      } else {
        console.log('   Note: If your Supabase project requires email verification, confirm the email or check your Supabase Auth dashboard.')
      }
      console.log('\n🚀 You can now sign in at /admin\n')
    }
  } catch (err) {
    console.error(`\n❌ Failed to create admin user: ${err.message}\n`)
    process.exit(1)
  }
}

main()

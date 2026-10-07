import bcrypt from 'bcryptjs'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const db = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function testPasswordUpdate() {
  await db.connect()
  const testEmail = 'test_reset_verify_9981@gmail.com'
  const tempPass = 'TempPass123!'
  const newPass = 'UpdatedPass456!'

  // 1. Clean up any previous test user
  await db.query("DELETE FROM auth.users WHERE email = $1", [testEmail])

  // 2. Sign up test user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: tempPass
  })
  if (signUpError) {
    console.error("SignUp error:", signUpError)
    await db.end()
    return
  }
  console.log("Created test user:", testEmail)

  // 3. Update password via bcrypt directly in postgres
  const hashed = bcrypt.hashSync(newPass, 10)
  await db.query("UPDATE auth.users SET encrypted_password = $1, email_confirmed_at = NOW(), confirmed_at = NOW() WHERE email = $2", [hashed, testEmail])
  console.log("Updated password in auth.users via bcrypt")

  // 4. Test sign in with new password
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: newPass
  })

  if (signInError) {
    console.error("Sign in failed:", signInError)
  } else {
    console.log("SUCCESS! User signed in with updated password. Session token received:", !!signInData.session)
  }

  // 5. Clean up test user
  await db.query("DELETE FROM auth.users WHERE email = $1", [testEmail])
  console.log("Cleaned up test user.")

  await db.end()
}

testPasswordUpdate().catch(console.error)

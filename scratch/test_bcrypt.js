import bcrypt from 'bcryptjs'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const client = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })

async function testBcrypt() {
  await client.connect()
  const { rows } = await client.query("SELECT id, email, encrypted_password FROM auth.users WHERE email = 'anirudha.basuthakur@gmail.com'")
  if (rows.length > 0) {
    console.log("Found user:", rows[0].email)
    console.log("Hash:", rows[0].encrypted_password)
    console.log("Is valid bcrypt format:", rows[0].encrypted_password.startsWith('$2a$') || rows[0].encrypted_password.startsWith('$2b$') || rows[0].encrypted_password.startsWith('$2y$'))
  }
  await client.end()
}

testBcrypt().catch(console.error)

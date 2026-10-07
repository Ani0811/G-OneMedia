import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const client = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })

async function inspect() {
  await client.connect()
  const { rows } = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'users'
  `)
  console.log('auth.users columns:', rows.map(r => r.column_name))

  const { rows: userRows } = await client.query(`
    SELECT id, email, encrypted_password, email_change, confirmation_token, recovery_token, email_change_token_new, email_change_token_current
    FROM auth.users
  `)
  console.log('users data:', userRows.map(u => ({
    id: u.id,
    email: u.email,
    has_encrypted_password: !!u.encrypted_password,
    recovery_token: u.recovery_token,
    encrypted_password_prefix: u.encrypted_password ? u.encrypted_password.substring(0, 7) : null
  })))

  await client.end()
}

inspect().catch(console.error)

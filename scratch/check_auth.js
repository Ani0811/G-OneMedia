import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const connectionString = process.env.SUPABASE_CONNECTION_URL

if (!connectionString) {
  console.error("SUPABASE_CONNECTION_URL missing")
  process.exit(1)
}

const client = new Client({ connectionString })

async function check() {
  await client.connect()
  console.log("Connected to Supabase PostgreSQL.")

  console.log("\n=== ADMIN USERS (public.admin_users) ===")
  const { rows: adminUsers } = await client.query("SELECT * FROM public.admin_users")
  console.table(adminUsers)

  console.log("\n=== AUTH USERS (auth.users) ===")
  const { rows: authUsers } = await client.query("SELECT id, email, confirmed_at, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at FROM auth.users")
  console.table(authUsers)

  console.log("\n=== RECENT AUDIT LOG ENTRIES (auth.audit_log_entries) ===")
  try {
    const { rows: auditLogs } = await client.query("SELECT * FROM auth.audit_log_entries ORDER BY created_at DESC LIMIT 10")
    console.table(auditLogs)
  } catch (e) {
    console.log("Could not query audit_log_entries:", e.message)
  }

  await client.end()
}

check().catch(err => {
  console.error(err)
  process.exit(1)
})

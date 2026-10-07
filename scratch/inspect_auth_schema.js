import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const client = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })

async function inspect() {
  await client.connect()

  const { rows: tables } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'auth'
  `)
  console.log("Auth tables:", tables.map(t => t.table_name))

  for (const t of ['audit_log_entries', 'flow_state', 'mfa_factors', 'one_time_tokens']) {
    try {
      const { rows } = await client.query(`SELECT * FROM auth.${t} ORDER BY created_at DESC LIMIT 5`)
      console.log(`\n--- auth.${t} ---`)
      console.table(rows)
    } catch (e) {
      console.log(`auth.${t}: ${e.message}`)
    }
  }

  await client.end()
}

inspect().catch(console.error)

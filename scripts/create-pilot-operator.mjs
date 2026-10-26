import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createDatabase, createPilotOperator } from '../server/database.mjs'

const email = process.env.PILOT_ADMIN_EMAIL
const password = process.env.PILOT_ADMIN_PASSWORD
if (!email || !password) {
  console.error('Set PILOT_ADMIN_EMAIL and PILOT_ADMIN_PASSWORD temporarily in the environment or local .env file.')
  process.exitCode = 1
} else {
  const dbPath = resolve(process.env.PILOT_DB_PATH ?? './var/airport-pilot.sqlite')
  mkdirSync(dirname(dbPath), { recursive: true })
  const db = createDatabase(dbPath)
  try {
    const user = createPilotOperator(db, email, password)
    console.log(`Created pilot operator ${user.email}. Remove PILOT_ADMIN_PASSWORD from the environment or .env file now.`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  } finally {
    db.close()
  }
}

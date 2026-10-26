import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { createAdminServer } from './app.mjs'
import { createDatabase } from './database.mjs'

const production = process.env.NODE_ENV === 'production'
const vitePort = Number(process.env.VITE_PORT ?? 3000)
if (!Number.isInteger(vitePort) || vitePort < 1 || vitePort > 65535) {
  throw new Error('VITE_PORT must be a valid TCP port number.')
}
const defaultOrigins = production
  ? ''
  : `http://127.0.0.1:${vitePort},http://localhost:${vitePort}`
const appOrigins = String(process.env.PILOT_APP_ORIGINS ?? process.env.PILOT_APP_ORIGIN ?? defaultOrigins)
  .split(',').map((origin) => origin.trim()).filter(Boolean)

if (!appOrigins.length) throw new Error('Set PILOT_APP_ORIGIN to the exact HTTPS origin used to access the pilot.')
if (production && (appOrigins.length !== 1 || !appOrigins[0].startsWith('https://'))) {
  throw new Error('Production requires one exact HTTPS PILOT_APP_ORIGIN. Terminate TLS at the approved host or reverse proxy.')
}

const dbPath = resolve(process.env.PILOT_DB_PATH ?? './var/airport-pilot.sqlite')
mkdirSync(resolve(dbPath, '..'), { recursive: true })
const db = createDatabase(dbPath)
db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now())

const staticDir = production ? resolve('./dist') : null
const port = Number(process.env.PILOT_API_PORT ?? (production ? process.env.PORT : 3001) ?? 3001)
const host = process.env.PILOT_HOST ?? '127.0.0.1'
const server = createAdminServer({
  db,
  appOrigins: new Set(appOrigins),
  secureCookies: production,
  staticDir,
})

server.listen(port, host, () => {
  console.log(`Airport pilot server listening on ${host}:${port}`)
  if (!production) console.log(`SQLite pilot data: ${dbPath}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => {
    db.close()
    process.exit(0)
  }))
}

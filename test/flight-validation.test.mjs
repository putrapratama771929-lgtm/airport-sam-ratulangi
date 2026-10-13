import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const vite = await createServer({
  configFile: false,
  root,
  resolve: { alias: { '@': path.join(root, 'src') } },
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
  appType: 'custom',
})
const { validateFlightChanges } = await vite.ssrLoadModule('/src/state/flight-validation.ts')

after(() => vite.close())

const departure = {
  id: 'D1',
  no: 'GA 601',
  airline: 'Garuda Indonesia',
  city: 'Jakarta (CGK)',
  wing: 'D',
  gate: 'D1',
  sched: '10:00',
  est: '10:00',
  status: 'SCHEDULED',
  kind: 'departure',
}

test('rejects a gate outside the flight wing', () => {
  assert.equal(validateFlightChanges(departure, { gate: 'I1' }), 'Gate I1 does not belong to the domestic wing.')
})

test('rejects malformed estimated times', () => {
  assert.equal(validateFlightChanges(departure, { est: '29:00' }), 'Enter a valid estimated time.')
})

test('rejects an arrival-only status on a departure', () => {
  assert.equal(validateFlightChanges(departure, { status: 'LANDED' }), 'LANDED is not valid for a departure.')
})

test('allows valid normalized changes', () => {
  assert.equal(validateFlightChanges(departure, { gate: 'D8', est: '10:30', status: 'CHECK-IN' }), null)
})

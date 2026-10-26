import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const vitePort = Number(process.env.VITE_PORT ?? 3000)
if (!Number.isInteger(vitePort) || vitePort < 1 || vitePort > 65535) {
  throw new Error('VITE_PORT must be a valid TCP port number.')
}
const children = []
let stopping = false

function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) if (child.exitCode === null) child.kill('SIGTERM')
  process.exitCode = code
  const timer = setTimeout(() => process.exit(code), 1500)
  timer.unref()
}

function start(label, args) {
  const child = spawn(process.execPath, args, { stdio: 'inherit', env: process.env, windowsHide: true })
  children.push(child)
  child.on('error', () => {
    console.error(`${label} process could not start.`)
    stop(1)
  })
  child.on('exit', (code, signal) => {
    if (!stopping && (code !== 0 || signal)) stop(code ?? 1)
  })
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
start('Pilot API', ['server/index.mjs'])
start('Vite', [viteBin, '--host', '127.0.0.1', '--port', String(vitePort), '--strictPort'])

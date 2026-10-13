import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { LockKeyhole, Plane } from 'lucide-react'
import { useAuth } from '@/state/use-auth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = login(email, password)
    if (message) return setError(message)
    const destination = (location.state as { from?: string } | null)?.from ?? '/admin'
    navigate(destination, { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a121c] px-4 py-12 text-white">
      <section className="w-full max-w-md border border-white/10 bg-[#0e1a26] p-7 shadow-2xl sm:p-9">
        <Link to="/" className="flex items-center gap-3 text-[#fce1b6]">
          <span className="flex h-10 w-10 items-center justify-center border border-[#af915f]/60"><Plane className="h-4 w-4" /></span>
          <span className="font-display tracking-[0.15em] uppercase">MDC Operations</span>
        </Link>
        <div className="mt-10">
          <span className="flex h-10 w-10 items-center justify-center border border-[#af915f]/40 text-[#af915f]"><LockKeyhole className="h-4 w-4" /></span>
          <p className="font-mono2 mt-5 text-[10px] tracking-[0.3em] text-[#af915f] uppercase">Administrator access</p>
          <h1 className="font-display mt-2 text-4xl tracking-wide">Sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">Use an authorised operations account to access the airport dashboard.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="font-mono2 text-[11px] tracking-[0.18em] text-slate-300 uppercase">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full border border-white/15 bg-[#0a121c] px-3 text-sm outline-none focus:border-[#af915f]" />
          </div>
          <div>
            <label htmlFor="password" className="font-mono2 text-[11px] tracking-[0.18em] text-slate-300 uppercase">Password</label>
            <input id="password" type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11 w-full border border-white/15 bg-[#0a121c] px-3 text-sm outline-none focus:border-[#af915f]" />
          </div>
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <button type="submit" className="font-mono2 flex h-11 w-full items-center justify-center bg-[#af915f] text-[11px] font-bold tracking-[0.2em] text-[#0a121c] uppercase hover:bg-[#c8ab74]">Enter dashboard</button>
        </form>
        <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-slate-500">Prototype login only. This browser session is not production authentication.</p>
      </section>
    </main>
  )
}

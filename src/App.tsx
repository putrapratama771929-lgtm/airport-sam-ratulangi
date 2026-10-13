import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import { RequireAdmin } from './components/RequireAdmin'
import { FlightsProvider } from './state/flights'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a121c] text-[#fce1b6]">
      <div className="font-mono2 flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#af915f]" /> Loading workspace
      </div>
    </div>
  )
}

export default function App() {
  return (
    <FlightsProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        visibleToasts={2}
        toastOptions={{
          style: {
            background: '#0e1a26',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#e2e8f0',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.03em',
          },
        }}
      />
    </FlightsProvider>
  )
}

import { cn } from '@/lib/utils'
import type { FlightStatus } from '@/data/airport'

const COLORS: Record<FlightStatus, string> = {
  SCHEDULED: 'text-slate-300 border-white/20',
  'CHECK-IN': 'text-sky-300 border-sky-400/40',
  BOARDING: 'text-[#fce1b6] border-[#af915f]/60',
  'FINAL CALL': 'text-amber-300 border-amber-400/50',
  DEPARTED: 'text-emerald-300/70 border-emerald-400/25',
  LANDED: 'text-emerald-300/70 border-emerald-400/25',
  DELAYED: 'text-amber-300 border-amber-400/60',
  CANCELLED: 'text-red-300 border-red-400/60',
}

const PULSE: FlightStatus[] = ['BOARDING', 'FINAL CALL', 'DELAYED']
const BLINK: FlightStatus[] = ['BOARDING', 'FINAL CALL']

export function StatusPill({ status, className }: { status: FlightStatus; className?: string }) {
  return (
    <span
      className={cn(
        'font-mono2 inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.12em] whitespace-nowrap uppercase',
        COLORS[status],
        BLINK.includes(status) && 'blink',
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {PULSE.includes(status) && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {status}
    </span>
  )
}

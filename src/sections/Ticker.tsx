import { useFlights } from '@/state/use-flights'

export function Ticker() {
  const { notifs } = useFlights()
  const items = notifs.slice(0, 8)
  if (!items.length) return null
  const text = items.map((n) => `${n.time} — ${n.msg}`).join('  ✦  ')

  return (
    <div className="ticker-paused relative overflow-hidden border-y border-[#af915f]/25 bg-[#0a121c] py-2">
      <div className="ticker-track flex w-max">
        {[0, 1].map((i) => (
          <span key={i} className="font-mono2 pr-10 text-xs tracking-wider whitespace-nowrap text-[#fce1b6]/70">
            {text} ✦
          </span>
        ))}
      </div>
    </div>
  )
}

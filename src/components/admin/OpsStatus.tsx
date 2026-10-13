import type { FlightStatus } from '@/data/airport'
import { STATUS_COLOR } from '@/lib/ops-stats'
import { toneStyle } from './tone'

export function OpsStatus({ status }: { status: FlightStatus }) {
  return (
    <span className="ops-pill" style={toneStyle(STATUS_COLOR[status])}>
      {status}
    </span>
  )
}

import type { FlightStatus } from '@/data/airport'
import { STATUS_COLOR } from '@/lib/ops-stats'
import { toneStyle } from './tone'
import { useAdminLanguage } from '@/state/use-admin-language'

export function OpsStatus({ status }: { status: FlightStatus }) {
  const { t } = useAdminLanguage()
  return (
    <span className="ops-pill" style={toneStyle(STATUS_COLOR[status])}>
      {t.status[status]}
    </span>
  )
}

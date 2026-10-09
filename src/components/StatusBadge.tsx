import type { ReportStatus } from '../types/report'
import { STATUS_LABELS } from '../types/report'

const STYLES: Record<ReportStatus, string> = {
  pending:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  in_progress:
    'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  completed:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
}

export default function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

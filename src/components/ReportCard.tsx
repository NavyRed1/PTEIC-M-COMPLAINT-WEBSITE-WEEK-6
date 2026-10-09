import { MapPin, Calendar, Tag } from 'lucide-react'
import type { Report } from '../types/report'
import { CATEGORY_LABELS } from '../types/report'
import StatusBadge from './StatusBadge'

export default function ReportCard({ report }: { report: Report }) {
  const date = new Date(report.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="card-surface overflow-hidden flex flex-col hover:shadow-glow transition-shadow">
      {report.photo_url ? (
        <img
          src={report.photo_url}
          alt={report.title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-40 w-full flex items-center justify-center bg-ethereal-100 dark:bg-ethereal-800 text-ethereal-400 text-sm">
          No photo
        </div>
      )}

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg leading-snug">{report.title}</h3>
          <StatusBadge status={report.status} />
        </div>

        <p className="text-sm text-ethereal-600 dark:text-ethereal-300 line-clamp-2">
          {report.description}
        </p>

        <div className="mt-auto pt-2 flex flex-col gap-1.5 text-xs text-ethereal-500 dark:text-ethereal-400">
          <span className="inline-flex items-center gap-1.5">
            <Tag size={13} /> {CATEGORY_LABELS[report.category]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} /> {report.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} /> {date}
          </span>
        </div>
      </div>
    </article>
  )
}

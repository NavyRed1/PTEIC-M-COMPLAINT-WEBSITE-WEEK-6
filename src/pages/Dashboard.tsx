import { useMemo, useState } from 'react'
import { FileText, Loader2, Map as MapIcon, PlusCircle } from 'lucide-react'
import type { ReportCategory, ReportStatus, SortOption } from '../types/report'
import { STATUS_LABELS } from '../types/report'
import { useReports } from '../hooks/useReports'
import ReportCard from '../components/ReportCard'
import ReportForm from '../components/ReportForm'
import FilterPanel from '../components/FilterPanel'
import SearchBar from '../components/SearchBar'
import CampusMap from '../components/CampusMap'
import Tabs, { type TabItem } from '../components/Tabs'

type MainTab = 'reports' | 'new' | 'map'
type ScopeTab = 'all' | 'mine'
type StatusTab = ReportStatus | 'all'

const STATUS_ORDER: Record<ReportStatus, number> = { pending: 0, in_progress: 1, completed: 2 }

export default function Dashboard({ userId }: { userId: string | undefined }) {
  const { reports, loading, error, createReport } = useReports(userId)

  // Nested tab state: main tab -> scope tab -> status tab
  const [mainTab, setMainTab] = useState<MainTab>('reports')
  const [scopeTab, setScopeTab] = useState<ScopeTab>('all')
  const [statusTab, setStatusTab] = useState<StatusTab>('all')

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const scoped = useMemo(
    () => (scopeTab === 'mine' ? reports.filter((r) => r.user_id === userId) : reports),
    [reports, scopeTab, userId],
  )

  // Apply search + category first so the status tab counts reflect them.
  const base = useMemo(() => {
    const q = search.trim().toLowerCase()
    return scoped.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [scoped, search, categoryFilter])

  const visible = useMemo(() => {
    const list = statusTab === 'all' ? base : base.filter((r) => r.status === statusTab)
    return [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    })
  }, [base, statusTab, sortBy])

  const mainTabs: TabItem<MainTab>[] = [
    { id: 'reports', label: 'Reports', icon: <FileText size={15} />, count: reports.length },
    { id: 'new', label: 'New Report', icon: <PlusCircle size={15} /> },
    { id: 'map', label: 'Campus Map', icon: <MapIcon size={15} /> },
  ]

  const scopeTabs: TabItem<ScopeTab>[] = [
    { id: 'all', label: 'All Reports', count: reports.length },
    { id: 'mine', label: 'My Reports', count: reports.filter((r) => r.user_id === userId).length },
  ]

  const statusTabs: TabItem<StatusTab>[] = [
    { id: 'all', label: 'All', count: base.length },
    ...(Object.keys(STATUS_LABELS) as ReportStatus[]).map((s) => ({
      id: s as StatusTab,
      label: STATUS_LABELS[s],
      count: base.filter((r) => r.status === s).length,
    })),
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">Facility Reports</h1>
        <p className="text-sm text-ethereal-500 dark:text-ethereal-400">
          Browse, search, and track campus facility issues.
        </p>
      </div>

      <Tabs tabs={mainTabs} active={mainTab} onChange={setMainTab} label="Main sections" />

      {mainTab === 'reports' && (
        <section className="flex flex-col gap-5">
          <Tabs tabs={scopeTabs} active={scopeTab} onChange={setScopeTab} variant="secondary" label="Report scope" />

          <div className="card-surface p-4 flex flex-col gap-4">
            <SearchBar value={search} onChange={setSearch} />
            <FilterPanel
              categoryFilter={categoryFilter}
              sortBy={sortBy}
              onCategoryChange={setCategoryFilter}
              onSortChange={setSortBy}
            />
            <Tabs tabs={statusTabs} active={statusTab} onChange={setStatusTab} variant="pill" label="Filter by status" />
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-ethereal-500">
              <Loader2 className="animate-spin" size={18} /> Loading reports...
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="text-center py-16 text-ethereal-500 dark:text-ethereal-400">
              {scopeTab === 'mine' && reports.every((r) => r.user_id !== userId)
                ? "You haven't submitted any reports yet."
                : 'No reports match your filters.'}
            </div>
          )}

          {!loading && visible.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visible.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </section>
      )}

      {mainTab === 'new' && (
        <ReportForm
          onSubmit={async (input) => {
            await createReport(input)
          }}
          onDone={() => {
            setScopeTab('mine')
            setStatusTab('all')
            setMainTab('reports')
          }}
        />
      )}

      {mainTab === 'map' && <CampusMap />}
    </div>
  )
}

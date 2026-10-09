import type { ReportCategory, SortOption } from '../types/report'
import { CATEGORY_LABELS } from '../types/report'

interface Props {
  categoryFilter: ReportCategory | 'all'
  sortBy: SortOption
  onCategoryChange: (v: ReportCategory | 'all') => void
  onSortChange: (v: SortOption) => void
}

export default function FilterPanel({ categoryFilter, sortBy, onCategoryChange, onSortChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="label-text" htmlFor="category-filter">
          Category
        </label>
        <select
          id="category-filter"
          className="input-field"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as ReportCategory | 'all')}
        >
          <option value="all">All categories</option>
          {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-text" htmlFor="sort-by">
          Sort by
        </label>
        <select
          id="sort-by"
          className="input-field"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  )
}

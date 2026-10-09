import type { ReactNode } from 'react'

export interface TabItem<T extends string> {
  id: T
  label: string
  icon?: ReactNode
  count?: number
}

interface Props<T extends string> {
  tabs: TabItem<T>[]
  active: T
  onChange: (id: T) => void
  /** primary = top-level underline tabs, secondary = segmented control, pill = small chips */
  variant?: 'primary' | 'secondary' | 'pill'
  label: string
}

const WRAP: Record<string, string> = {
  primary: 'flex gap-1 border-b border-ethereal-200 dark:border-ethereal-800 overflow-x-auto',
  secondary: 'inline-flex gap-1 p-1 rounded-xl bg-ethereal-100/80 dark:bg-ethereal-800/60 overflow-x-auto max-w-full',
  pill: 'flex flex-wrap gap-2',
}

function btnClass(variant: string, isActive: boolean) {
  const base = 'inline-flex items-center gap-2 whitespace-nowrap text-sm transition-all'
  if (variant === 'primary') {
    return `${base} px-4 py-3 -mb-px border-b-2 font-semibold ${
      isActive
        ? 'border-ethereal-600 text-ethereal-800 dark:text-white dark:border-ethereal-300'
        : 'border-transparent text-ethereal-500 hover:text-ethereal-700 dark:hover:text-ethereal-200'
    }`
  }
  if (variant === 'secondary') {
    return `${base} px-3.5 py-2 rounded-lg font-medium ${
      isActive
        ? 'bg-white dark:bg-ethereal-700 shadow-soft text-ethereal-900 dark:text-white'
        : 'text-ethereal-500 hover:text-ethereal-800 dark:hover:text-ethereal-200'
    }`
  }
  return `${base} px-3 py-1.5 rounded-full text-xs font-medium border ${
    isActive
      ? 'bg-ethereal-700 text-white border-ethereal-700'
      : 'border-ethereal-300 dark:border-ethereal-700 text-ethereal-600 dark:text-ethereal-300 hover:bg-ethereal-100 dark:hover:bg-ethereal-800'
  }`
}

export default function Tabs<T extends string>({ tabs, active, onChange, variant = 'primary', label }: Props<T>) {
  return (
    <div role="tablist" aria-label={label} className={WRAP[variant]}>
      {tabs.map((t) => {
        const isActive = t.id === active
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={btnClass(variant, isActive)}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span
                className={`rounded-full px-1.5 min-w-[1.25rem] text-center text-[10px] font-semibold ${
                  isActive && variant === 'pill'
                    ? 'bg-white/20'
                    : 'bg-ethereal-200/70 dark:bg-ethereal-700/70 text-ethereal-700 dark:text-ethereal-100'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export type ReportCategory =
  | 'broken_furniture'
  | 'broken_lighting'
  | 'cleanliness'
  | 'damaged_facilities'
  | 'plumbing'
  | 'other'

export type ReportStatus = 'pending' | 'in_progress' | 'completed'

export interface Report {
  id: string
  user_id: string
  title: string
  description: string
  category: ReportCategory
  location: string
  photo_url: string | null
  status: ReportStatus
  created_at: string
  updated_at: string
}

export interface NewReportInput {
  title: string
  description: string
  category: ReportCategory
  location: string
  photo?: File | null
}

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  broken_furniture: 'Broken Furniture',
  broken_lighting: 'Broken Lighting',
  cleanliness: 'Cleanliness',
  damaged_facilities: 'Damaged Facilities',
  plumbing: 'Plumbing',
  other: 'Other',
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export type SortOption = 'newest' | 'oldest' | 'status'

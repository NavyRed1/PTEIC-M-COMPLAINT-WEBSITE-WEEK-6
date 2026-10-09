import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

function isValidUrl(value: string | undefined): boolean {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

// True only when real values are present (not empty, not the .env.example placeholders).
export const isSupabaseConfigured =
  isValidUrl(supabaseUrl) &&
  !!supabaseAnonKey &&
  !supabaseUrl!.includes('your-project-ref') &&
  supabaseAnonKey !== 'your-anon-public-key'

// Never throws at import time: falls back to harmless placeholders so the app can
// render a setup screen instead of a blank page.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'http://localhost:54321',
  isSupabaseConfigured ? supabaseAnonKey! : 'placeholder-key',
)

export const REPORTS_TABLE = 'reports'
export const PHOTOS_BUCKET = 'report-photos'

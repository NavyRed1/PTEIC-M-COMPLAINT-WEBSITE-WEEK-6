import { useCallback, useEffect, useState } from 'react'
import { supabase, REPORTS_TABLE, PHOTOS_BUCKET } from '../lib/supabaseClient'
import type { NewReportInput, Report } from '../types/report'

export function useReports(userId: string | undefined) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from(REPORTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setReports(data as Report[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const uploadPhoto = async (file: File, uid: string): Promise<string | null> => {
    const ext = file.name.split('.').pop()
    const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadError) {
      throw new Error(uploadError.message)
    }
    const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const createReport = async (input: NewReportInput) => {
    if (!userId) throw new Error('You must be signed in to submit a report.')

    let photo_url: string | null = null
    if (input.photo) {
      photo_url = await uploadPhoto(input.photo, userId)
    }

    const { data, error: insertError } = await supabase
      .from(REPORTS_TABLE)
      .insert({
        user_id: userId,
        title: input.title,
        description: input.description,
        category: input.category,
        location: input.location,
        photo_url,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) throw new Error(insertError.message)

    setReports((prev) => [data as Report, ...prev])
    return data as Report
  }

  return { reports, loading, error, refetch: fetchReports, createReport }
}

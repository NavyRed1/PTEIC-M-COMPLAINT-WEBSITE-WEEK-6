import { useState, type FormEvent } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import type { NewReportInput, ReportCategory } from '../types/report'
import { CATEGORY_LABELS } from '../types/report'

interface Props {
  onSubmit: (input: NewReportInput) => Promise<void>
  onDone?: () => void
}

const MAX_PHOTO_MB = 5

export default function ReportForm({ onSubmit, onDone }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ReportCategory>('other')
  const [location, setLocation] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Title is required.'
    else if (title.length > 120) next.title = 'Title must be under 120 characters.'
    if (!description.trim()) next.description = 'Description is required.'
    if (!location.trim()) next.location = 'Location / building is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handlePhotoChange = (file: File | null) => {
    setSubmitError(null)
    if (!file) {
      setPhoto(null)
      setPhotoPreview(null)
      return
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: `Photo must be under ${MAX_PHOTO_MB}MB.` }))
      return
    }
    setErrors((prev) => ({ ...prev, photo: '' }))
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), category, location: location.trim(), photo })
      setTitle('')
      setDescription('')
      setCategory('other')
      setLocation('')
      handlePhotoChange(null)
      onDone?.()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface p-5 flex flex-col gap-4" noValidate>
      <h2 className="text-xl">Report a Facility Problem</h2>

      <div>
        <label className="label-text" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Broken chair in Room 301"
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
      </div>

      <div>
        <label className="label-text" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="input-field min-h-[90px] resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem in detail..."
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value as ReportCategory)}
          >
            {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text" htmlFor="location">
            Location / Building
          </label>
          <input
            id="location"
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Gedung Teknik Informatika, Lt. 2"
            aria-invalid={!!errors.location}
          />
          {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location}</p>}
        </div>
      </div>

      <div>
        <label className="label-text" htmlFor="photo">
          Photo (optional)
        </label>
        {photoPreview ? (
          <div className="relative w-fit">
            <img src={photoPreview} alt="Preview" className="h-32 rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => handlePhotoChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-ethereal-900 text-white p-1 shadow-soft"
              aria-label="Remove photo"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="photo"
            className="btn-secondary cursor-pointer w-fit"
          >
            <Upload size={15} /> Upload photo
          </label>
        )}
        <input
          id="photo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
        />
        {errors.photo && <p className="mt-1 text-xs text-rose-500">{errors.photo}</p>}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-lg px-3 py-2">
          {submitError}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  )
}

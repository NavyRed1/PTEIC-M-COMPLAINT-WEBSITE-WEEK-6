import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AuthScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error: authError } =
      mode === 'signin' ? await signInWithEmail(email, password) : await signUpWithEmail(email, password)
    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else if (mode === 'signup') {
      setInfo('Account created. Check your email to confirm, then sign in.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="card-surface p-6 w-full max-w-sm flex flex-col gap-4">
        <div>
          <h1 className="text-2xl">ITS Campus Reporting</h1>
          <p className="text-xs text-ethereal-500 dark:text-ethereal-400 mt-1">
            {mode === 'signin' ? 'Sign in to report and track facility problems.' : 'Create an account to get started.'}
          </p>
        </div>

        <div>
          <label className="label-text" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@student.its.ac.id"
          />
        </div>

        <div>
          <label className="label-text" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {info && (
          <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-3 py-2">
            {info}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading && <Loader2 size={16} className="animate-spin" />}
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setInfo(null)
          }}
          className="text-xs text-ethereal-500 hover:text-ethereal-700 dark:hover:text-ethereal-300 text-center"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}

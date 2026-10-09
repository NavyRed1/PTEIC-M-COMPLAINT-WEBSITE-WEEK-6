import { Loader2, LogOut } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import AuthScreen from './components/AuthScreen'
import ThemeToggle from './components/ThemeToggle'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ethereal-500">
        <Loader2 className="animate-spin" size={22} />
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/60 dark:bg-ethereal-950/60 border-b border-ethereal-200/60 dark:border-ethereal-800/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-lg font-display">ITS Campus Reporting</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ethereal-500 dark:text-ethereal-400 hidden sm:inline">
              {user.email}
            </span>
            <ThemeToggle />
            <button onClick={signOut} className="btn-secondary !px-2.5 !py-2.5 rounded-full" aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <Dashboard userId={user.id} />
    </div>
  )
}

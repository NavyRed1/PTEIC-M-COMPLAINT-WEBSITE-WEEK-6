import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ConfigMissing from './components/ConfigMissing'
import ErrorBoundary from './components/ErrorBoundary'
import { isSupabaseConfigured } from './lib/supabaseClient'
import { applyStoredTheme } from './hooks/useTheme'
import './index.css'

applyStoredTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>{isSupabaseConfigured ? <App /> : <ConfigMissing />}</ErrorBoundary>
  </React.StrictMode>,
)

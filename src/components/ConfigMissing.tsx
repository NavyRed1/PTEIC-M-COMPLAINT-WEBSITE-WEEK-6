import { AlertTriangle } from 'lucide-react'

export default function ConfigMissing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-surface p-6 max-w-lg w-full flex flex-col gap-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={20} />
          <h1 className="text-2xl">Supabase isn't configured</h1>
        </div>
        <p className="text-sm text-ethereal-600 dark:text-ethereal-300">
          The app needs your Supabase project keys to run. Do this once:
        </p>
        <ol className="text-sm list-decimal pl-5 flex flex-col gap-2 text-ethereal-700 dark:text-ethereal-200">
          <li>
            Copy <code className="font-semibold">.env.example</code> to <code className="font-semibold">.env</code> in the project root.
          </li>
          <li>
            Set <code className="font-semibold">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-semibold">VITE_SUPABASE_ANON_KEY</code> from Supabase → Project Settings → API.
          </li>
          <li>Stop the dev server and run <code className="font-semibold">npm run dev</code> again (Vite only reads .env at startup).</li>
          <li>On Vercel, add the same two variables in Project Settings → Environment Variables, then redeploy.</li>
        </ol>
      </div>
    </div>
  )
}

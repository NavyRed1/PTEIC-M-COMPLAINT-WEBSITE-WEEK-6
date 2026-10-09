# ITS Campus Problem Reporting App

A mobile-friendly facility reporting app for Institut Teknologi Sepuluh Nopember (ITS). Students can submit facility problem reports with photos, track status, and browse/search/filter existing reports.

## Tech Stack

- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (ethereal theme, DM Serif Display + JetBrains Mono)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel

## Features

- Email/password authentication (Supabase Auth)
- Submit reports: title, description, category, location, optional photo upload
- Status tracking: Pending / In Progress / Completed
- Dashboard with responsive report cards
- Filter by status and category, sort by newest/oldest/status
- Live search across title, description, location
- Light/dark mode toggle, persisted in `localStorage`
- Embedded Google Maps campus map for location reference
- Row Level Security: students manage their own reports; only staff can change status

## 1. Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for deployment)

## 2. Set up Supabase

1. Create a new Supabase project.
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`. This creates:
   - the `reports` table with RLS policies
   - a `staff` table (add rows here to grant status-change permission to campus staff)
   - the `report-photos` storage bucket with upload/read policies
3. To make a user a staff member (able to change report status), run:
   ```sql
   insert into public.staff (user_id) values ('<their-auth-user-uuid>');
   ```
4. Copy your Project URL and anon public key from **Project Settings → API**.

## 3. Local setup

```bash
git clone https://github.com/YOUR-USERNAME/its-campus-reporting-app.git
cd its-campus-reporting-app
npm install
cp .env.example .env
# edit .env with your Supabase URL and anon key
npm run dev
```

The app runs at `http://localhost:5173`.

## 4. Environment variables

See `.env.example`. Never commit your real `.env` file — it's already excluded via `.gitignore`.

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public API key |

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Import Project" from your GitHub repo.
3. Framework preset: **Vite**.
4. Add the two environment variables above in Vercel's Project Settings → Environment Variables.
5. Deploy.

## 6. Project structure

```
src/
  components/   # Reusable UI: ReportCard, ReportForm, FilterPanel, SearchBar, StatusBadge, ThemeToggle, AuthScreen, CampusMap
  hooks/        # useAuth, useReports, useTheme
  lib/          # Supabase client
  pages/        # Dashboard
  types/        # Shared TypeScript types
supabase/
  schema.sql    # Database schema, RLS policies, storage bucket setup
```

## 7. Notes

- Photo uploads are capped at 5MB client-side; adjust `MAX_PHOTO_MB` in `ReportForm.tsx` if needed.
- Status changes (Pending → In Progress → Completed) are enforced server-side to staff-only via RLS; no staff UI is included in this MVP — manage status directly in the Supabase Table Editor, or build an admin view later.
- Run `git add -A && git commit -m "Initial commit" && git push` after setup to publish to GitHub.

# Supabase Setup (Free Tier)

This app can run local-only without Supabase.
If you want cross-browser/device sync, configure Supabase.

## 1) Create a Supabase project

- Create a project in Supabase.
- In Project Settings -> API, copy:
  - `Project URL`
  - `anon public key`

## 2) Create environment file

Create `.env.local` in the project root:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Restart dev server after changes.

## 3) Create sync table + policies

Run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  store jsonb not null default '{"days": {}}'::jsonb,
  reminders jsonb not null default '{"enabled": false, "dailyCheckTime": "20:30"}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_app_state enable row level security;

create policy if not exists "Users can read own state"
on public.user_app_state
for select
using (auth.uid() = user_id);

create policy if not exists "Users can insert own state"
on public.user_app_state
for insert
with check (auth.uid() = user_id);

create policy if not exists "Users can update own state"
on public.user_app_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 4) Enable Email/Password auth

In Supabase Authentication -> Providers:
- Enable Email provider
- Use email/password sign-in (no paid provider required)

## 5) Use in app

- Open app
- Click `Cloud setup` / `Cloud sign in`
- Create account or sign in
- Data will sync to your account and be available in any browser/device signed into that account.

## Notes

- Local backup export/import still works without Supabase.
- Free tier is enough for personal use/testing.

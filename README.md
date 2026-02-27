# Workout Pyramid

A focused workout commitment tracker with week/month planning, review, reminders, backup, and optional cloud sync.

## Core Features

- Week + month planning views
- Daily commitment flow and status tracking
- Streak + weekly goal tracking
- Weekly review modal with next-week plan template
- Local browser reminders (planned-time + end-of-day check)
- Backup export/import (JSON)
- Optional Supabase cloud sync (free-tier friendly)
- Playwright interactive smoke tests (desktop + mobile)

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
npm run test:e2e
```

## Cloud Sync (Optional)

Cloud sync is disabled by default.

1. Configure env vars in `.env.local`:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

2. Follow table/policy setup in `SUPABASE_SETUP.md`.

3. Restart dev server and use `Cloud setup` / `Cloud sign in` in the app.

## Reminder Behavior

Reminders use browser notifications and require permission.
Notifications are scheduled while the app is open in a browser session.

## Test Artifacts

Playwright/browser artifacts are ignored by git:
- `.playwright-browsers`
- `playwright-report`
- `test-results`

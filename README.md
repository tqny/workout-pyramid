# Workout Pyramid

## Problem
People who want to train consistently often fail at one step in the loop: planning, committing, or honestly logging outcomes. Most trackers capture history but do not force a simple daily commitment loop.

## Constraints
- Single-developer scope with rapid iteration.
- Free-tier infrastructure only.
- Must work well on desktop and iPhone Safari.
- Must support optional cloud sync while remaining usable offline/local-only.
- Fast QA cycle required for frequent UI changes.

## Solution Overview
Workout Pyramid is a focused web app that drives a weekly commitment loop:
- plan a day/time,
- mark completed or skipped,
- review the week,
- iterate next week from a template.

It uses local storage by default and optional Supabase auth + cloud sync for cross-device continuity.

## Architecture and Tradeoffs
- Stack: React 19 + Vite + Supabase + Playwright.
- Key components:
  - local-first workout store + reminder settings
  - Supabase-backed per-user cloud state (`user_app_state`)
  - install-to-home-screen UX for iPhone and browser install flows
  - admin metrics API route (server-side secrets only)

Tradeoffs:
- Local-first keeps UX resilient but requires explicit sync state management.
- Browser notifications are platform-limited; iOS Reminder app is suggested as fallback behavior prompt.
- Admin metrics are aggregate operational signals, not full analytics telemetry.

## Implementation Notes
1. Foundation: weekly/monthly planner, commitment modal, day editor, streak tracking.
2. Productization: cloud sync auth, install flow, onboarding, auth recovery.
3. Operations: admin metrics panel + evidence governance docs and CI checks.

## Results and Evidence
- Live app deployed on Vercel with multi-user auth and cross-device sync.
- E2E smoke suite (desktop + mobile) maintained and passing.
- Admin metrics panel provides active/signed-in/auth-risk snapshots.

Evidence artifacts:
- Standard: `docs/EVIDENCE_STANDARD.md`
- Changelog: `CHANGELOG.md`
- ADRs: `docs/adr/`
- Demo logs: `docs/demos/`
- Weekly metrics snapshots: `docs/metrics/`

## Live Demo / Repo Links
- Live: https://workout-pyramid.vercel.app
- Repository: https://github.com/tqny/workout-pyramid
- Supabase setup guide: `SUPABASE_SETUP.md`

## Local Development
```bash
npm install
npm run dev
```

## Quality Checks
```bash
./scripts/check-evidence.sh
npm run lint
npm run test:e2e
npm run build
```

## Cloud Sync (Optional)
Set in `.env.local`:
```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
Then follow `SUPABASE_SETUP.md`.

## Admin Metrics (Optional)
Set server env vars in Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_METRICS_KEY`

Open with `?admin=1`:
- `https://workout-pyramid.vercel.app/?admin=1`

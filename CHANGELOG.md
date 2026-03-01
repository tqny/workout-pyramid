# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- Evidence-first governance artifacts (`docs/*`, `.github/*`, `scripts/check-evidence.sh`).
- Retroactive ADR/demo/metrics backfill set for historical project decisions and shipped features.
- Coach Energy copy set for day states and nudges (`Locked in`, `Got it done`, `Benched yourself`, `Don't flake`).
- Shared UI authority and app UX rubric governance docs for PR scoring and evidence (`docs/design/UI_AUTHORITY.md`, `docs/design/APP_UX_RUBRIC.md`).

### Changed
- README and contribution workflow updated to enforce auditable delivery standards.
- Refined warm-light visual system: softer typography weights, warmer calendar/card surfaces, and status colors tuned to muted warm green/yellow/red.
- Header metrics now support editable weekly goals via the progress card, with balanced top-bar layout and unified neutral styling for install/admin action pills.
- Entry flow now opens with a dedicated auth gate for signed-out users (sign in/create account/guest), while signed-in users proceed directly into the app.
- Welcome modal removed; guest or signed-in entry now lands directly in the main app flow.
- Week/month card polish: centered status headlines, compact mobile labels, emoji quick actions, aligned streak/progress typography, and rose-gold + lighter-gold status gradients propagated across planned/skipped surfaces.
- iOS/mobile text-color hardening prevents blue auto-link/button text drift and keeps action/status copy in ink tones.
- Commitment modal action buttons now share the same status gradients used by main day cards (green complete / rose rest day), including the enabled `Commit time` action.
- Month-view date numerals are pinned to top-left to prevent overlap with centered status copy.
- Week navigation controls are width-capped to align with the lower 4-day row on desktop.
- Quick-action notice for `Marked today as done` (with `Undo`) is removed from the action bar surface.
- UI interaction quality sprint:
  - modal dialogs now use focus trapping, `Escape` handling, and focus restore for keyboard accessibility;
  - action bar now has clearer primary/secondary hierarchy;
  - quick status actions support undo;
  - cloud sync blocks overwriting newer remote data and offers pull-latest recovery;
  - mobile week cards use adaptive sizing to reduce crowding.

## [0.6.0] - 2026-02-26
Recorded retrospectively on 2026-02-27.

### Added
- Admin metrics panel with key-gated access (`?admin=1`) and secure Vercel API route.
- Auth recovery flow (`Forgot password`, resend verification, in-app reset completion).
- First-run onboarding modal with cloud and install guidance.
- Admin metrics trend deltas and JSON export.

### Fixed
- Metrics API Vercel compatibility and backend user aggregation reliability.
- Cloud auth redirect behavior for email verification links.

Relevant commits: `c447778`, `e488d0b`, `7223c0e`, `e33e5b9`, `16c3c0f`, `458a698`

## [0.5.0] - 2026-02-26
Recorded retrospectively on 2026-02-27.

### Added
- Install-to-home-screen experience (PWA manifest, icons, install guidance modal).

### Changed
- Product action bar visual polish for cloud/install states.

Relevant commits: `b198018`, `8c50370`

## [0.4.0] - 2026-02-25
Recorded retrospectively on 2026-02-27.

### Added
- Weekly review flow with next-week template planning.
- Product actions bar and cloud sync modal UX.
- Backup/export utilities and reminder settings architecture.
- Playwright smoke suite with desktop/mobile coverage.

Relevant commits: `472c571`

## [0.1.0] - 2026-02-25
Recorded retrospectively on 2026-02-27.

### Added
- Initial Workout Pyramid app baseline and deployment setup.

Relevant commits: `472c571`

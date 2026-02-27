# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- Evidence-first governance artifacts (`docs/*`, `.github/*`, `scripts/check-evidence.sh`).
- Retroactive ADR/demo/metrics backfill set for historical project decisions and shipped features.
- Matrix x Tetris-inspired visual theme tokens and shared tone/status palette.
- Gym-bro humor microcopy for empty/future-day nudges in week/month surfaces.

### Changed
- README and contribution workflow updated to enforce auditable delivery standards.
- Core dashboard surfaces (header, action bar, week/month cards, inspector) now use a darker neon-accent style system for stronger visual identity and state contrast.

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

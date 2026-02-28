# ADR 0006: Modal Accessibility Baseline and Cloud Sync Conflict Guard

- Status: Accepted
- Date: 2026-02-28
- Owner: Tony + Codex

## Context

The app has multiple modal-driven workflows (commitment, cloud auth, day editor, weekly review, onboarding). Prior behavior did not enforce robust keyboard focus control, which risked accessibility gaps and usability friction.

Cloud sync behavior also favored simple upsert flow and could overwrite newer remote updates from another device without an explicit warning, reducing data trust.

## Decision

Adopt two UX governance-aligned behavior decisions:

1. Modal accessibility baseline in shared shell
- `role="dialog"` + `aria-modal="true"`
- focus trap within modal while open
- restore focus to previous control on close
- keyboard `Escape` close support (except locked modal states)

2. Cloud sync conflict guard before write
- On sync attempts, compare remote payload/update timestamp against locally known state.
- If remote is newer and both local+remote changed since last upload, block overwrite.
- Surface a conflict message and provide "pull latest" recovery action.

## Options Considered

1. Keep current modal and sync behavior and rely on user caution
2. Add only visual warning text without behavioral enforcement
3. Implement shared accessibility + sync guard in core logic

## Consequences

### Positive

- Better keyboard and assistive-technology usability across all modal flows.
- Higher data trust: prevents accidental overwrite across devices.
- Reusable enforcement via shared shell/hook logic instead of one-off fixes.

### Negative

- Slightly more complexity in modal shell and cloud sync hook.
- Additional read-before-write step adds a small sync latency/call cost.

## Validation Plan

- Keyboard test each modal: tab order, trap, `Escape`, focus return.
- Simulate cloud updates from two sessions and verify conflict is blocked.
- Verify lint, e2e, build, and evidence checks remain green.

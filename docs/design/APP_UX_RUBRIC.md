# App UX Rubric

## Scope
This rubric evaluates workflow quality and user outcomes for app behavior, not just visual polish.

Scoring model:
- 0-2 per category
- 8 categories
- Max score: 16

Thresholds:
- `Ship`: `>= 13/16`
- `Needs follow-up`: `<= 12/16`
- Hard stop: any `0` in categories 1, 4, 7, or 8

## 1) Task completion clarity/speed
- 0: Users cannot reliably complete core task without guessing.
- 1: Task is possible but has friction or ambiguity.
- 2: Core task is obvious and completed quickly.
- Quick test: ask a new user to complete one primary flow with no guidance.
- Common failures: unclear CTA labels, hidden next step, excessive modal hopping.

## 2) Navigation/findability
- 0: Users cannot find key actions or views.
- 1: Most key actions findable, but path is inconsistent.
- 2: Navigation model is predictable and key actions are obvious.
- Quick test: switch between week/month/admin/auth tasks in under 10 seconds each.
- Common failures: overloaded action bars, inconsistent button grouping, unclear mode state.

## 3) Empty/loading/error states
- 0: Missing states or misleading messages.
- 1: States exist but lack actionable guidance.
- 2: Every async/empty/error state is explicit and actionable.
- Quick test: simulate no data, network delay, and failed request.
- Common failures: blank regions, spinner without context, generic error copy.

## 4) Data trust + recoverability
- 0: User cannot trust what is saved or cannot recover from mistakes.
- 1: Trust mostly intact but weak recovery paths.
- 2: Save state is clear, conflicts are handled, and recovery path exists.
- Quick test: edit, sync, refresh, and verify expected persistence.
- Common failures: silent write failures, overwrite without warning, no rollback path.

## 5) Feedback + system status
- 0: No meaningful feedback after actions.
- 1: Partial feedback but timing/state is unclear.
- 2: Action outcomes and current status are consistently visible.
- Quick test: perform success + failure actions and verify visible result each time.
- Common failures: buttons change state without explanation, stale status badges.

## 6) Mobile ergonomics
- 0: Controls overlap or are hard to tap.
- 1: Mobile usable with friction.
- 2: Comfortable thumb interactions and readable layouts.
- Quick test: run flows on iPhone viewport including modal workflows.
- Common failures: cramped card text, tiny hit areas, bottom-row overlap.

## 7) Accessibility/keyboard/screen reader basics
- 0: Keyboard traps, missing focus, or inaccessible controls.
- 1: Basic keyboard access works but has gaps.
- 2: Keyboard/focus/semantic structure works across flows.
- Quick test: tab through core flow, verify focus rings and control labels.
- Common failures: clickable non-buttons, hidden focus, unlabeled fields.

## 8) Responsiveness/perceived performance
- 0: Slow/janky interactions affect task completion.
- 1: Acceptable but noticeable lag or reflow.
- 2: Interactions feel immediate with stable layout.
- Quick test: run key flow on desktop + mobile network throttling.
- Common failures: layout jumping, blocking spinners, long input-to-feedback delay.

## Evidence Required Per UX-Impacting PR
- Before/after note:
  - What user behavior was problematic before
  - What changed now
- Test scenario steps:
  - 3-6 bullet steps reproducing and validating UX result
- Screenshot or GIF when UI changed
- Risk + rollback note:
  - Main risk
  - How to revert safely
- Metrics hypothesis:
  - measurable expected effect (e.g., fewer retries, faster completion, less abandonment)

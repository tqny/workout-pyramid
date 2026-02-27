# GitHub Evidence Standard

This standard exists to make work auditable, credible, and easy to evaluate by hiring managers, recruiters, and collaborators.

## 1) Repository Baseline (Required)

The repository must include:

- `README.md` with a clear case-study narrative
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `docs/adr/` for architecture decisions
- `docs/postmortems/` for incidents and misses
- `docs/metrics/` for outcomes and weekly signals
- `docs/demos/` for screenshots, demo notes, and release artifacts
- `CHANGELOG.md` tracking user-visible changes

## 2) README Case Study Structure (Required)

Each project README should contain these sections:

1. Problem
2. Constraints
3. Solution Overview
4. Architecture and Tradeoffs
5. Implementation Notes
6. Results and Evidence
7. Live Demo / Repo Links
8. Next Iteration

Use `docs/templates/PROJECT_CASE_STUDY_TEMPLATE.md`.

## 3) Issue and PR Discipline (Required)

- Every non-trivial change starts with an issue.
- Every PR links to an issue and states user impact.
- Every PR includes test evidence and risk notes.
- Keep PRs narrow enough to review in under 20 minutes.

## 4) Decision Logging (Required)

Create an ADR when a decision affects architecture, data model, deployment, security, cost, or product behavior.

Format:

- Context
- Decision
- Options considered
- Consequences

Use `docs/adr/0000-template.md`.

## 5) Release and Changelog Discipline (Required)

- Tag meaningful milestones (`v0.1.0`, `v0.2.0`, etc.) when practical.
- Update `CHANGELOG.md` for every user-visible change.
- Attach release notes with what changed, why, and evidence links.

## 6) Outcome Tracking (Required)

Update weekly metrics using `docs/metrics/WEEKLY_METRICS_TEMPLATE.md`.

Track at minimum:

- Traffic/usage signal
- Engagement depth
- Conversion/CTA signal
- Reliability/performance signal
- Learning and next actions

## 7) Postmortem Discipline (Required for Misses)

When something breaks or misses target, add a short postmortem:

- What happened
- Impact
- Root cause
- Corrective action
- Prevention

Use `docs/postmortems/TEMPLATE.md`.

## 8) Definition of Done (Evidence)

A change is done only when:

- Code is merged and CI passes
- Tests/lint/build evidence is recorded in PR
- Changelog is updated
- ADR updated if decision-level change occurred
- Metrics impact hypothesis is stated

## 9) Forward Operating Rules (Required)

- Every non-trivial change must have linked issue + PR + test/build evidence + changelog update.
- ADR required for architecture, data model, deployment, security, cost, or product behavior decisions.
- Retroactive evidence entries must disclose that they were reconstructed.

## 10) Presentation Quality Rules

To maximize credibility:

- Prefer concrete numbers over claims
- Show before/after screenshots where possible
- Link directly to issues, PRs, releases, and demos
- Name tradeoffs explicitly instead of hiding them

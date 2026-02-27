# Contributing

This repository uses an evidence-first workflow.

Before opening a pull request:

1. Read `docs/EVIDENCE_STANDARD.md`.
2. Open or link a GitHub issue for non-trivial work.
3. Use `.github/PULL_REQUEST_TEMPLATE.md` completely.
4. Add ADR/postmortem/metrics updates when applicable.
5. Update `CHANGELOG.md` for user-visible changes.
6. Run `./scripts/check-evidence.sh`.

## Forward Operating Rules

- Every non-trivial change must have a linked issue + PR + test/build evidence + changelog update.
- ADR is required for decision-level changes (architecture, data model, deployment, security, cost, or product behavior).
- Do not rewrite git history for evidence backfills; add auditable artifacts linked to existing commits.

## Definition of Done

A change is complete only when:

- Behavior is implemented and validated.
- Evidence artifacts are updated.
- Risks and rollback are documented.
- Changelog is current.

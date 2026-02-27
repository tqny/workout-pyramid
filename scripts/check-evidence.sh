#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "README.md"
  "CONTRIBUTING.md"
  "CHANGELOG.md"
  "docs/EVIDENCE_STANDARD.md"
  "docs/adr/0000-template.md"
  "docs/postmortems/TEMPLATE.md"
  "docs/metrics/WEEKLY_METRICS_TEMPLATE.md"
  "docs/demos/DEMO_LOG_TEMPLATE.md"
  "docs/templates/PROJECT_CASE_STUDY_TEMPLATE.md"
  "docs/templates/EXECUTION_RHYTHM_CHECKLIST.md"
  ".github/PULL_REQUEST_TEMPLATE.md"
  ".github/ISSUE_TEMPLATE/bug_report.md"
  ".github/ISSUE_TEMPLATE/feature_request.md"
  ".github/ISSUE_TEMPLATE/config.yml"
  ".github/workflows/evidence-check.yml"
  ".github/workflows/ci.yml"
  "scripts/check-evidence.sh"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "Missing required evidence file: $file"
    exit 1
  fi
done

if ! grep -q "\[Unreleased\]" CHANGELOG.md; then
  echo "CHANGELOG.md must contain an [Unreleased] section"
  exit 1
fi

if ! grep -Rqs -- "Recorded retrospectively on 2026-02-27" docs/adr docs/demos docs/metrics CHANGELOG.md; then
  echo "Retroactive records note not found in backfill artifacts"
  exit 1
fi

echo "Evidence check passed."

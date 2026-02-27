# ADR 0003: Add Auth Recovery and First-Run Onboarding

- Status: Accepted
- Date: 2026-02-26
- Owner: Tony Mikityuk
- Recorded retrospectively on 2026-02-27.

## Context

As external users began signing up, failure points appeared around verification, password recovery, and first-time activation.

## Decision

Add explicit cloud auth recovery actions (`Forgot password`, `Resend verification`, in-app reset password mode) and add a first-run onboarding modal with setup guidance.

## Options Considered

1. Keep minimal auth modal and support users manually
2. Build full auth settings page
3. Add focused recovery controls in existing cloud modal + lightweight onboarding (selected)

## Consequences

- Reduces support friction for account access failures.
- Increases modal complexity and state transitions.
- Improves first-session activation clarity.

## Validation Plan

- Confirm reset and verification actions trigger expected notices.
- Confirm onboarding appears once and does not block normal usage after dismissal.
- Validate lint/build/E2E remain green.

## Evidence

- Auth recovery + onboarding release: `16c3c0f`

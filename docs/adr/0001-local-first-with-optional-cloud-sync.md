# ADR 0001: Local-First Store with Optional Supabase Cloud Sync

- Status: Accepted
- Date: 2026-02-25
- Owner: Tony Mikityuk
- Recorded retrospectively on 2026-02-27.

## Context

The app needed to remain usable immediately in-browser without infrastructure setup, while still supporting cross-device continuity for signed-in users.

## Decision

Use localStorage as the default source of truth for day entries and reminder settings, with optional Supabase sync (`user_app_state`) when configured.

## Options Considered

1. Cloud-only data model (Supabase required)
2. Local-only data model (no cross-device capability)
3. Local-first with optional cloud sync (selected)

## Consequences

- Improves onboarding speed and resilience when cloud setup is unavailable.
- Adds complexity around reconciliation, sync state, and auth flows.
- Requires explicit handling for stale/duplicate uploads.

## Validation Plan

- Verify app behavior without Supabase env vars.
- Verify sign-in, sync, and data continuity across devices when Supabase is configured.
- Confirm cloud sync reliability with E2E and manual multi-device testing.

## Evidence

- Baseline implementation: `472c571`
- Redirect reliability update: `458a698`
- Auth recovery hardening: `16c3c0f`

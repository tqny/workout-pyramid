# ADR 0004: Admin Metrics via Server Route with Secret-Key Gate

- Status: Accepted
- Date: 2026-02-26
- Owner: Tony Mikityuk
- Recorded retrospectively on 2026-02-27.

## Context

Operational visibility was needed for active users/sign-ins/auth risk, but exposing service-role credentials or admin data in the client was unacceptable.

## Decision

Implement a server-side API route (`/api/admin-metrics`) using Supabase service-role credentials, gated by a separate `ADMIN_METRICS_KEY` header, and expose the UI only when `?admin=1` (or localhost).

## Options Considered

1. Client-side metrics queries with anon key
2. External analytics-only solution
3. Server-side metrics endpoint with explicit admin key gate (selected)

## Consequences

- Keeps privileged credentials off client runtime.
- Adds deployment/env complexity and operational key management.
- Requires careful route hardening and runtime compatibility fixes.

## Validation Plan

- Verify `/api/admin-metrics` returns `Unauthorized` without header.
- Verify valid admin key returns JSON metrics payload.
- Verify modal fetch, delta computation, and JSON export in production.

## Evidence

- Initial admin metrics: `c447778`
- Runtime compatibility fix: `e488d0b`
- Backend query reliability fix: `7223c0e`
- Delta/export enhancement: `e33e5b9`

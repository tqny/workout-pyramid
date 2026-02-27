# Postmortem: Admin Metrics Fetch Failure in Production

- Date: 2026-02-26
- Severity: SEV-3 (non-core admin feature degraded)
- Owner: Tony Mikityuk
- Recorded retrospectively on 2026-02-27.

## Summary

The admin metrics modal showed a generic fetch error after deployment.

## Impact

Only admin observability workflow was affected. Core user workout functionality remained available.

## Timeline

- 21:30 - Admin endpoint returned unauthorized correctly without header, but modal fetch failed.
- 21:45 - Runtime compatibility issue identified and fixed (`e488d0b`).
- 22:10 - Backend query path against auth schema proved brittle in production.
- 22:25 - Switched to `auth.admin.listUsers` aggregation (`7223c0e`).
- 22:40 - Admin metrics confirmed working in production.

## Root Cause

1) API route module format mismatch for Vercel runtime during first implementation.
2) Initial backend query strategy relied on auth schema querying path that was unreliable in deployed runtime.

## Corrective Actions

- [x] Migrate function module syntax to ESM (`e488d0b`).
- [x] Replace auth table query with `supabase.auth.admin.listUsers` (`7223c0e`).
- [x] Validate with direct endpoint checks and modal flow.

## Prevention

- Add a lightweight production smoke check for privileged API routes after deploy.
- Prefer official admin SDK methods over schema-level introspection for auth metrics.

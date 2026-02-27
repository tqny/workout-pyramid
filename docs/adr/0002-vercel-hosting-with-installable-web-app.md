# ADR 0002: Deploy on Vercel and Ship Installable Web App UX

- Status: Accepted
- Date: 2026-02-26
- Owner: Tony Mikityuk
- Recorded retrospectively on 2026-02-27.

## Context

The app needed a free, public URL for real user testing and iPhone usage without requiring a local dev server.

## Decision

Deploy via Vercel connected to GitHub `main`, and implement installability via web manifest, iOS metadata, icons, and install guidance UX.

## Options Considered

1. Keep local-network-only usage
2. Native iOS app first
3. Vercel-hosted web app with install guidance (selected)

## Consequences

- Fastest path to multi-user validation and sharing.
- Requires careful env var management in Vercel for Supabase.
- iOS install behavior still constrained by Safari/PWA limitations.

## Validation Plan

- Verify public URL deployment from `main` branch.
- Verify sign-in and cloud sync on Mac + iPhone.
- Verify install guidance and home-screen behavior.

## Evidence

- Install/app-like flow: `b198018`
- UI polish updates: `8c50370`

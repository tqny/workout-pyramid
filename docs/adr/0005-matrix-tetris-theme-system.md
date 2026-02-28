# ADR 0005: Matrix x Tetris Theme System for Core UX

- Status: Accepted
- Date: 2026-02-27
- Owner: Tony + Codex

## Context

The app had grown functionally, but visual styling was still a mix of one-off light-theme values spread across components. This slowed iteration, made status colors inconsistent, and limited brand personality.

The product direction is "serious about training, playful tone." We needed a visual system that:

- Feels distinct and memorable
- Preserves fast state recognition (planned/completed/skipped)
- Supports future iteration without touching every component repeatedly

## Decision

Adopt a Matrix x Tetris-inspired theme foundation for core surfaces:

- Dark, high-contrast page and panel surfaces
- Neon-accent tone palette (cyan, green, yellow, red)
- Shared tone helper for notices/actions (`toneStyle`)
- Shared status-surface helper for workout states (`statusSurface`)

Apply this system first to the most visible and highest-traffic surfaces:

- Header and action bar
- Week and month day cards
- Month inspector
- Shared UI primitives (`Button`, `Pill`, `ModalShell`, `BrandMark`)

## Options Considered

1. Keep existing light palette and only tweak one or two colors
2. Full component-library migration first (e.g., shadcn setup before visual pass)
3. Token-driven in-place redesign of current component system

## Consequences

### Positive

- Faster future theme iteration via centralized tokens/helpers
- Stronger visual identity aligned with motivational tone
- Improved consistency for state colors and action tones

### Negative

- Some secondary modals still have legacy light-style internals and will need follow-up normalization
- More custom UI ownership remains in-repo (higher maintenance than adopting a fully opinionated UI kit)

## Validation Plan

- Verify week/month status readability on desktop and iPhone widths
- Confirm no regression in lint/e2e/build pipelines
- Collect qualitative user feedback on readability, motivation tone, and perceived polish

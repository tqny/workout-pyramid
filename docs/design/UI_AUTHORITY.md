# UI Authority

## Purpose
Define a single baseline for visual quality, component behavior, and accessibility so UI decisions stay consistent across feature work.

## Audience
- Designers and engineers shipping UI changes
- Reviewers scoring UI quality in PRs
- Future contributors extending the component system

## Reference Hierarchy
Use these in order, from highest authority to lowest:

1. `shadcn/ui` patterns (open-code baseline, composition and styling conventions)
2. Radix primitives for behavior and accessibility semantics
3. WCAG 2.2 AA requirements for contrast, focus, target size, and keyboard support
4. Existing local component system in this repo (when compatible with 1-3)

If local patterns conflict with higher levels, update local patterns.

## Visual Direction Rules
- Keep one clear visual language per screen (avoid mixed style families).
- Use a token-led palette: background, surface, border, text, accent, semantic status colors.
- Status colors must remain semantically stable:
  - green = success/completed
  - yellow = planned/warning
  - red = error/skipped/risk
- Prefer subtle gradients and depth over flat noise-heavy styling.
- Motion should support comprehension, not decoration.

## Layout, Component, and Readability Standards
- Primary task actions must be visible without hunting on desktop and mobile.
- Maintain predictable spacing rhythm and alignment across cards, buttons, and form fields.
- Typography rules:
  - headings: strong but not noisy
  - supporting text: high readability, lower contrast than headings
  - avoid extreme font-weight jumps in adjacent UI atoms
- Component states required: default, hover, focus-visible, disabled, loading (when async).
- Keep tap targets touch-safe on mobile (minimum practical 40px height, prefer 44px).

## Accessibility Baseline
- Keyboard navigation works end-to-end for interactive controls.
- `:focus-visible` is obvious on all actionable elements.
- Semantic controls are preferred over clickable `div`s.
- Color alone cannot carry meaning; include text or icon support.
- Meet WCAG 2.2 AA contrast targets for normal text and controls.
- Respect reduced motion preferences for non-essential animation.

## UI Scoring Rubric (0-2 per category, max 16)

| Category | 0 | 1 | 2 |
|---|---|---|---|
| Visual consistency | Mixed styles or conflicting tokens | Mostly consistent with minor drift | Clear, unified style language |
| Hierarchy/readability | Hard to scan; noisy type scale | Readable but uneven emphasis | Clear hierarchy and easy scan |
| Spacing/layout | Crowded/misaligned | Mostly clean, small collisions | Balanced spacing and alignment |
| Component states | Missing key states | States present but inconsistent | Complete and consistent states |
| Interaction polish | Abrupt/confusing transitions | Functional but rough edges | Crisp, intentional feedback/motion |
| Accessibility baseline | Keyboard/focus/contrast failures | Partial compliance, minor gaps | WCAG-aligned baseline met |
| Mobile fit | Cramped controls/content overlap | Usable with some friction | Comfortable thumb-friendly layout |
| Performance feel | Janky or delayed UI feedback | Acceptable, minor lag | Snappy perceived response |

## Ship Thresholds
- `Ship`: UI Quality Score `>= 13/16`
- `Needs follow-up`: `<= 12/16`
- Auto-block until fixed:
  - Any category scored `0` in Accessibility baseline, Hierarchy/readability, or Component states

## Evidence Required for UI-Impacting Changes
- Desktop screenshot (before/after or after with explicit delta note)
- Mobile screenshot (same screen/state)
- Short expected impact note:
  - what user friction is reduced
  - what behavior is now clearer/faster
- Link evidence in PR body

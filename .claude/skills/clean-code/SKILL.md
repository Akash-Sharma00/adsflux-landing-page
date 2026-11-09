---
name: clean-code
description: Clean code and readability standards for adsflux's React + TypeScript code — naming, component size, props, state, effects, types, comments and error handling. Use when writing, reviewing or refactoring any .ts/.tsx file in this repo, or when asked to make code cleaner, more readable or more maintainable.
---

# adsflux Clean Code & Readability

Code is read far more than it is written. Optimise for the next person skimming the file.

## Naming

- Names say **what**, not how: `visiblePlans`, not `filteredArr`. No abbreviations except
  universally known ones (`id`, `url`, `props`).
- Booleans read as yes/no questions: `isOpen`, `hasError`, `canSubmit`, `shouldAnimate`.
- Event handler props are `onX` (`onSelect`); the functions passed to them are `handleX` (`handleSelect`).
- Functions start with a verb: `getPlanPrice`, `formatDate`, `buildNavItems`.
- Collections are plural (`plans`); one item is singular (`plan`). Maps say what they key by: `planById`.
- Avoid noise words: `data`, `info`, `item`, `manager`, `helper`, `utils` as a file name.

## Components

- One exported component per file; small private sub-components in the same file are fine.
- Target **≤ 150 lines** per component file. Past that, extract sub-components or a hook.
- A component either **decides** (state, data, logic) or **displays** (props in, JSX out). Push logic
  into a custom hook (`usePricing`) and keep the JSX declarative.
- Props:
  - Define `type <Name>Props` right above the component. Use `type`, not `interface`, for consistency.
  - Destructure in the signature with defaults: `({ size = 'md', ...props })`.
  - ≤ ~6 props; more suggests the component does too much or needs composition (`children`, slots).
  - Prefer a union (`variant: 'primary' | 'secondary'`) over multiple booleans (`isPrimary`, `isSecondary`).
- No inline styles (`style={{…}}`) except for truly dynamic values (e.g. a computed CSS variable).
- Render lists with a stable `key` from data — never the array index for reorderable lists.
- Early-return for empty/loading/error states instead of nesting ternaries in JSX.
  Max one ternary per JSX expression; never nest them.

## State & effects

- Derive, don't store: if a value can be computed from props/state, compute it during render.
- Keep state as local as possible; lift only when a sibling needs it.
- `useEffect` is for synchronising with something **outside** React (DOM APIs, subscriptions, timers).
  Not for transforming data, not for responding to user events (do that in the handler).
- Every effect that subscribes must clean up.
- Don't add `useMemo`/`useCallback` by default; add them when profiling shows a need or a stable
  reference is required by a dependency.
- Render must be pure: no `Date.now()`, `Math.random()`, or mutations during render (lint enforces this).

## TypeScript

- `strict` + `noUncheckedIndexedAccess` are on. `any` is a lint error — use `unknown` and narrow.
- Let inference work for locals; annotate function **parameters** and exported **return types** of
  non-trivial functions.
- Model states with discriminated unions instead of optional-everything:
  ```ts
  type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string }
  ```
- Use `as const` for config objects and derive types from them (`keyof typeof breakpoints`).
- No non-null assertions (`!`) — check and throw a descriptive error, or handle the null case.
- Type-only imports use `import type` (enforced by `verbatimModuleSyntax`).

## Functions

- Do one thing. If you need "and" to describe it, split it.
- ≤ 3 positional parameters; beyond that pass an options object.
- Prefer pure functions in `lib/` — same input, same output, no side effects — they're trivially testable.
- Guard clauses over deep nesting. Max ~3 levels of indentation inside a function.
- No magic numbers/strings: name them (`const MAX_VISIBLE_LOGOS = 8`).

## Comments

- Code explains **what**; comments explain **why** (a constraint, a browser bug, a business rule).
- Short JSDoc (`/** … */`) on exported primitives, hooks and lib functions that aren't self-evident.
- No commented-out code, no `TODO` without context (`// TODO(owner): remove once X ships`).

## Errors

- Fail loudly at boundaries with a descriptive message (`throw new Error('Root element #root not found')`).
- Never swallow errors with an empty `catch`. Handle, rethrow, or report.
- User-facing failures render a meaningful UI state, not a blank screen.

## Formatting

- 2-space indent, single quotes, no semicolons, trailing commas in multi-line literals —
  match the existing files.
- One blank line between logical blocks; group imports (external → `@/` → relative → styles).

## Review checklist

- [ ] Could a newcomer understand this file in under a minute?
- [ ] Names are specific; no `data`, `temp`, `foo2`
- [ ] No duplicated logic that already exists in `lib/`, `hooks/` or `components/ui`
- [ ] No dead code, unused exports, or stray `console.log`
- [ ] `npm run check` passes with zero warnings

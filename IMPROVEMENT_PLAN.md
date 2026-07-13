# React Open Source DataGrid — Improvement Plan

_Last updated: 2026-07-13_

This document captures a review of the library (`react-open-source-datagrid`) and
the demo/docs website (`react-open-source-datagrid-view`), plus a prioritized plan
to improve code quality, maintainability, testing, and developer experience.

The product is **feature-rich with strong performance and accessibility
foundations**. The recommendations below are about structural cleanup, test
coverage, and packaging hygiene — not about adding features.

---

## Summary of Findings

| Area | Status | Key metric | Impact |
| --- | --- | --- | --- |
| Test coverage | 🔴 Critical | 0 unit tests; ~4 Playwright E2E specs | Core logic (filter/sort/group/aggregate/reducer) is untested |
| Packaging hygiene | 🔴 Critical | 55 `.d.ts` files committed under `src/` | Source pollution, confusing source-of-truth, larger repo/package |
| Component size | 🟠 High | `DataGrid.tsx` 960 lines, `types.ts` 595, `gridReducer.ts` 605 | Hard to read, review, and modify safely |
| TypeScript safety | 🟠 High | 40+ `any` escapes / eslint suppressions | Weak IDE support, potential runtime errors |
| Inline styles | 🟡 Medium | 100+ inline `style={{…}}` objects | Re-render churn, hard to theme/maintain |
| Row memoization | 🟡 Medium | Rows rendered without `React.memo` | Unnecessary re-renders on large grids |
| Documentation | 🟡 Medium | 111 markdown files in `docs/` | Redundant, overwhelming, no clear entry point |
| Demo site hygiene | 🟢 Low | 20+ `console.log`, one blanket `eslint-disable` | Noise, masked lint issues |

Status legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## 1. Testing (Critical)

**Problem:** There are no unit tests. Only a handful of Playwright E2E specs exist
(`tests/playwright/`), which cover UI smoke checks. All core business logic runs
untested.

**Untested high-risk modules:**
- `src/components/DataGrid/filterUtils.ts` — text/number/date/set/multi filters
- `src/components/DataGrid/groupingUtils.ts` — grouping & group sorting
- `src/components/DataGrid/aggregationUtils.ts` — sum/avg/min/max/count
- `src/components/DataGrid/treeDataUtils.ts` — tree flatten/build, expand state
- `src/components/DataGrid/pivotEngine.ts` — pivot calculations
- `src/components/DataGrid/gridReducer.ts` — 30+ action types, no coverage
- `src/components/DataGrid/layoutPersistence.ts` — storage round-trips

**Actions:**
1. Add **Vitest** + `@testing-library/react` (aligns with the existing Vite setup).
2. Write unit tests for every util module above; target **≥80% coverage** on utils
   and the reducer first (pure functions, highest ROI).
3. Add reducer tests: dispatch each action, assert the resulting state slice.
4. Add hook tests for `useDensityMode`, `useContextMenu`, `useFocusTrap`,
   `useScreenReaderAnnouncements`.
5. Wire coverage into CI and add a coverage badge to the README.

**Acceptance:** `npm run test` runs Vitest; utils + reducer ≥80% covered; CI fails
on regressions.

---

## 2. Packaging Hygiene — Remove committed `.d.ts` from `src/` (Critical)

**Problem:** 55 `.d.ts` files are committed alongside `.tsx`/`.ts` sources under
`src/components/DataGrid/` (e.g. `DataGrid.d.ts`, `filterUtils.d.ts`,
`gridApi.d.ts`). Declarations should be generated into `dist/` at build time, not
stored in source. There is also an odd `ARCHITECTURE.md.ts` /
`ARCHITECTURE.md.d.ts` pair (docs saved as a `.ts` file).

`.gitignore` currently ignores `src/**/*.js` and `src/**/*.jsx` but **not**
`src/**/*.d.ts`, so the generated declarations are being tracked.

**Actions:**
1. Delete all `src/**/*.d.ts` files (they are build artifacts).
2. Add `src/**/*.d.ts` to `.gitignore`.
3. Confirm `tsc -p tsconfig.build.json` emits declarations only to `dist/lib`.
4. Remove `ARCHITECTURE.md.ts` / `ARCHITECTURE.md.d.ts`; move the content into a
   real `ARCHITECTURE.md` or a top-of-file comment.
5. Verify `npm pack` output contains only `dist/` + `README.md` (already scoped by
   the `files` field) and no stray sources.

**Acceptance:** No `.d.ts` under `src/` in git; a clean build regenerates them in
`dist/`; published tarball is unchanged or smaller.

---

## 3. Decompose Oversized Modules (High)

**Problem:** Several files are too large to review and modify safely.
- `DataGrid.tsx` — **960 lines**, ~31 imports, 10+ `useEffect` hooks, orchestrates
  persistence, API init, announcements, context menus, tooltips, and every feature.
- `gridReducer.ts` — **605 lines**, one switch with 30+ cases.
- `types.ts` — **595 lines**, many `any` suppressions.
- `GridBody.tsx` — receives ~46 props (heavy prop drilling).

**Actions:**
1. Extract cohesive hooks out of `DataGrid.tsx`:
   `useGridPersistence`, `useGridApiBinding`, `useGridAnnouncements`,
   `useGridContextMenu`. Keep `DataGrid.tsx` as a thin orchestrator.
2. Split `gridReducer.ts` by domain (sorting, filtering, columns, selection,
   grouping) and compose with a root reducer.
3. Break `types.ts` into `types/columns.ts`, `types/filters.ts`,
   `types/api.ts`, re-exported from a barrel `types/index.ts`.
4. Reduce `GridBody` prop surface by passing grouped context objects (or a small
   context provider) instead of 46 individual props.

**Acceptance:** No single module >400 lines; `DataGrid.tsx` primarily wires hooks
and children; no behavior change (validated by the new tests + E2E).

---

## 4. Tighten TypeScript (High)

**Problem:** 40+ type escapes reduce safety and IDE help:
- `as any` casts in `src/editors/DateEditor.tsx`, `ColumnFilters.tsx`, and others.
- 12+ `@typescript-eslint/no-explicit-any` suppressions in `types.ts`.
- `eslint-disable-next-line react-hooks/exhaustive-deps` in `DataGrid.tsx` and
  `src/editors/RichSelectEditor.tsx`.
- Loose `{ [field: string]: any }` dictionaries in reducer/grouping/market data.

**Actions:**
1. Introduce generics for row data (`DataGrid<TRow>`), replacing `any` row maps
   with `TRow` where feasible.
2. Type filter configs and editor params precisely; remove `as any` at call sites.
3. Replace index-signature `any` with `unknown` + narrowing, or concrete unions.
4. Resolve `exhaustive-deps` suppressions by stabilizing callbacks/deps rather than
   disabling the rule.

**Acceptance:** `any` usage and eslint suppressions reduced to near-zero;
`npm run lint` clean without file-level disables.

---

## 5. Styling & Render Performance (Medium)

**Problem:** 100+ inline `style={{…}}` objects are created on every render (e.g.
`DataGrid.tsx` toolbar, `ColumnFilters.tsx`, `FacetedSearch.tsx`). Row components
are not memoized, so unrelated updates re-render the full list. Magic numbers
(`overscan=3`, `delay=1000`, `zIndex` values) are scattered inline.

**Actions:**
1. Move static inline styles into CSS (scoped under `.data-grid`) or hoist constant
   style objects outside components so references are stable.
2. Wrap row/cell components in `React.memo` with correct comparison; memoize the
   callbacks passed to them.
3. Centralize magic numbers into a `constants.ts` (overscan, debounce, z-index
   scale).

**Acceptance:** Measurable drop in re-renders on a 50k-row grid (React Profiler);
no new inline style objects created per render in hot paths.

---

## 6. Accessibility Polish (Medium)

**Problem:** Foundations are solid (`FocusTrap`, `ScreenReaderAnnouncer`, keyboard
nav), and the README claims WCAG 2.1 AA. A few ARIA gaps remain and A11y tests are
shallow.

**Actions:**
1. Add `aria-selected` to selectable rows and `aria-sort` semantics tied to the
   sorted column header (`aria-describedby` where helpful).
2. Ensure grouped/merged cells expose correct `aria-colspan`/`aria-rowspan`.
3. Expand Playwright A11y specs: keyboard navigation edge cases and live-region
   announcement assertions; consider `@axe-core/playwright` for automated audits.
4. Verify high-contrast / forced-colors mode isn't broken by hardcoded fallbacks.

**Acceptance:** Automated axe checks pass on key demos; keyboard and screen-reader
flows covered by tests.

---

## 7. Documentation Consolidation (Medium)

**Problem:** `docs/` contains **111 markdown files**. Most features have 3–5
variants (`*_FEATURE.md`, `*_IMPLEMENTATION_SUMMARY.md`, `*_QUICK_REF.md`,
`*_INDEX.md`, `*_COMPLETE.md`), plus stale changelogs
(`BUGFIX_v1.7.2.md`, `CHANGELOG_v1.7.0.md`). There is no clear entry point.

**Actions:**
1. Consolidate to **one guide per feature** with an embedded "Quick reference"
   section; delete the redundant variants.
2. Create a single `docs/README.md` index that links each feature guide.
3. Move historical changelogs into a single `CHANGELOG.md` (Keep a Changelog
   format).
4. Target ~20–25 curated docs instead of 111.

**Acceptance:** One canonical doc per feature; `docs/README.md` is the entry point;
no duplicated or version-stamped one-off files.

---

## 8. Demo Website Cleanup (Low)

**Problem:** `react-open-source-datagrid-view/src/components` has 20+ `console.log`
calls (e.g. `AdvancedEditorsDemo.tsx`, `VirtualScrollDemo.tsx`, `DemoGridPage.tsx`,
`ContextMenuDemo.tsx`) and a blanket `/* eslint-disable */` at the top of
`DemoGridPage.tsx`.

**Actions:**
1. Remove stray `console.log`/`console.error` from demo components (keep only
   intentional, user-facing logging behind a dev flag).
2. Replace the file-wide `eslint-disable` in `DemoGridPage.tsx` with targeted,
   justified disables (or fix the underlying issues).
3. Add graceful error boundaries around demos so a broken example doesn't blank the
   page.

**Acceptance:** No stray console output in demos; no blanket eslint disables; demos
fail gracefully.

---

## Suggested Sequencing

**Phase 1 — Foundations (highest ROI, low risk)**
- [x] Remove `.d.ts` from `src/` and update `.gitignore` (§2)
- [x] Stand up Vitest + first util/reducer tests (§1)
- [x] Demo site cleanup: blanket `eslint-disable` removed from `DemoGridPage.tsx` (§8)

**Phase 2 — Safety & Structure**
- [x] Reach ≥80% coverage on utils + reducer (§1) — _107 tests; all modules ≥85% (aggregation/tree/grouping ~99–100%, gridReducer 91%, filterUtils 86%, gridDataUtils added)_
- [x] Decompose `DataGrid.tsx`, `gridReducer.ts`, `types.ts` (§3) — _DataGrid split into `useGridPersistence`, `useGridApiBinding`, `useServerSideCallbacks`, `useGridAnnouncements` hooks + `gridDataUtils`; `gridReducer` composed from 6 domain slices; `types.ts` split into `types.model`/`persistence`/`features`/`state`/`props` behind a barrel re-export_
- [ ] Remove `any` escapes / eslint suppressions (§4) — _deferred; ~100 warnings, 0 errors_

**Phase 3 — Polish**
- [x] Style hoisting + row memoization (§5) — _`GridBody` memoizes column/offset maps and `getPinnedCellStyle`_
- [x] ARIA gaps + expanded A11y tests (§6) — _accessible names added to empty column headers and drag handle_
- [ ] Documentation consolidation (§7)

Each phase should keep `npm run build` and the E2E suite green, so refactors are
verifiably behavior-preserving.

---

## Notes / Verified Metrics

- `src/components/DataGrid/DataGrid.tsx`: **960** lines
- `src/components/DataGrid/gridReducer.ts`: **605** lines
- `src/components/DataGrid/types.ts`: **595** lines
- Committed `src/**/*.d.ts` files: **55**
- `docs/**/*.md` files: **111**

These figures were measured on 2026-07-13 and are intended as a baseline to track
progress against.

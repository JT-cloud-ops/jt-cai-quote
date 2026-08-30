# Quotation Factory Implementation Plan

> **For agentic workers:** Steps use checkbox syntax and were executed inline with TDD checkpoints.

**Goal:** Extract reusable quotation defaults from `App.tsx` without changing form behavior.

**Architecture:** `src/domain/quotationFactory.ts` owns item, booklet part, booklet job, and quotation construction. `App.tsx` consumes `createEmptyQuotation`; tests assert the public factory contract.

**Tech Stack:** React, TypeScript, Vitest, ESLint, Vite.

---

### Task 1: Factory contract

**Files:** `src/domain/quotationFactory.test.ts`, `src/domain/quotationFactory.ts`

- [x] Write tests for item defaults, booklet defaults, three quotation types, and saved localStorage defaults.
- [x] Run `npm.cmd test -- --run src/domain/quotationFactory.test.ts` and observe the expected missing-module failure.
- [x] Implement the smallest factory matching the existing `App.tsx` defaults.
- [x] Re-run the focused tests; result: 6 passed.

### Task 2: App integration

**Files:** `src/App.tsx`

- [x] Replace local helper functions with `createEmptyQuotation`.
- [x] Preserve quotation type switching and localStorage fallback behavior.
- [x] Run full test suite; result: 32 passed.

### Task 3: Verification and documentation

- [x] Run lint, build, and print-layout checks.
- [x] Update the four project documents and record the backup tag.
- [x] Commit the scoped implementation after final diff review: `995e9f1`.

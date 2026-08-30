# Print Color Selectors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace free-text print color inputs with front/back color selectors and prompt users to choose no-printing or continue selecting when a named item has no color selected.

**Architecture:** Keep the existing `printColor` and `specialColor` data fields. Add a shared `PrintColorFields` form component for selector UI and prompt behavior, and a shared formatter for preview/print output.

**Tech Stack:** React, TypeScript, CSS, Node verification script.

---

### Task 1: Add Failing Regression Checks

**Files:**
- Modify: `scripts/verify-print-layout.mjs`

- [ ] **Step 1: Add checks**

Require the new shared print-color component, prompt choices, and preview formatter usage.

- [ ] **Step 2: Run test**

Run: `npm run test:print-layout`

Expected: FAIL until implementation exists.

### Task 2: Implement Shared UI And Formatting

**Files:**
- Create: `src/components/forms/PrintColorFields.tsx`
- Create: `src/shared/utils/printColor.ts`
- Modify: `src/components/forms/SingleSheetForm.tsx`
- Modify: `src/components/forms/BookletForm.tsx`
- Modify: `src/components/QuotationForm.tsx`
- Modify: `src/components/QuotationPreview.tsx`
- Modify: `src/styles/Form.css`

- [ ] **Step 1: Add formatter**

`formatPrintColor(front, back)` returns `不印刷`, `正X色`, `反Y色`, or `正X色 / 反Y色`.

- [ ] **Step 2: Add selector component**

Render `正` and `反` selects with blank, `1色` through `6色`. When the item name has content and both colors are blank, show a small prompt with `不印刷` and `繼續選印色`.

- [ ] **Step 3: Wire parent updates**

Add direct field update callbacks so the prompt can set `printColor` to `不印刷`.

- [ ] **Step 4: Update preview**

Use `formatPrintColor(printColor, specialColor)` for single items and booklet/department parts.

### Task 3: Verify

- [ ] Run: `npm run test:print-layout`
- [ ] Run: `npm run build`

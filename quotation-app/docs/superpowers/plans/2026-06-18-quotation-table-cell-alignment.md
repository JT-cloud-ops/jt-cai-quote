# Quotation Table Cell Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make quotation preview table content centered and automatically wrapped, while keeping booklet and department part-name rows right-aligned in the first column.

**Architecture:** Keep the existing `QuotationPreview.tsx` rendering structure and add explicit cell classes for alignment behavior. `Preview.css` owns the presentation rules, and `scripts/verify-print-layout.mjs` guards against reverting wrapped centered cells or the part-name right-alignment exception.

**Tech Stack:** Vite, React, TypeScript, CSS, Node verification script.

---

### Task 1: Add Failing Layout Checks

**Files:**
- Modify: `scripts/verify-print-layout.mjs`

- [ ] **Step 1: Write the failing test**

Add checks that require:

```js
{
  name: 'quotation body cells use centered wrapping class',
  pass: preview.includes('quote-cell-center-wrap'),
},
{
  name: 'booklet and department part-name cells keep a right-aligned exception',
  pass: preview.includes('quote-part-name-cell'),
},
{
  name: 'centered wrapping cells allow automatic wrapping',
  pass: /\.quotation-table-main td\.quote-cell-center-wrap\s*{[^}]*white-space:\s*pre-wrap[^}]*overflow-wrap:\s*anywhere/s.test(previewCss),
},
{
  name: 'part-name cells are explicitly right aligned',
  pass: /\.quotation-table-main td\.quote-part-name-cell\s*{[^}]*text-align:\s*right/s.test(previewCss),
},
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:print-layout`

Expected: FAIL with the new alignment checks listed.

### Task 2: Implement Alignment Classes

**Files:**
- Modify: `src/components/QuotationPreview.tsx`
- Modify: `src/styles/Preview.css`

- [ ] **Step 1: Apply class names in the preview table**

Use `quote-cell-center-wrap` on normal body data cells for job name, sheet size, print color, paper name, details, quantity, unit price, and amount. Use `quote-part-name-cell` only on booklet/department part rows' first-column part name.

- [ ] **Step 2: Add CSS rules**

Add:

```css
.quotation-table-main td.quote-cell-center-wrap {
  text-align: center;
  vertical-align: middle;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.4;
}

.quotation-table-main td.quote-part-name-cell {
  text-align: right;
  vertical-align: middle;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}
```

Remove or narrow old `nowrap` rules that affect quote table body cells.

- [ ] **Step 3: Run targeted verification**

Run: `npm run test:print-layout`

Expected: PASS.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: TypeScript and Vite build complete with exit code 0.

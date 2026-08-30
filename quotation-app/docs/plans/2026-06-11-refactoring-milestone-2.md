# Milestone 2: 報價單邏輯重構與抽離

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 `QuotationPreview.tsx` 中的計算邏輯、日期處理與版面縮放參數抽離至獨立模組，提升代碼可維護性並確保驗證腳本同步。

**Architecture:** 遵循 Domain-Driven Design (DDD) 原則，將核心計算邏輯移至 `domain/`，通用工具函數移至 `shared/utils/`，使 React 組件專注於渲染。

**Tech Stack:** React (TypeScript), Node.js (scripts)

---

### Task 1: 建立日期工具函數

**Files:**
- Create: `src/shared/utils/dateUtils.ts`
- Modify: `src/components/QuotationPreview.tsx`

- [ ] **Step 1: 建立 `dateUtils.ts` 並實作民國日期轉換**

```typescript
/**
 * 取得當前或指定日期的民國日期資訊
 */
export const getMinguoDateInfo = (date: Date = new Date()) => {
  const year = date.getFullYear() - 1911;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  
  return { year, month, day, dateStr };
};
```

- [ ] **Step 2: 在 `QuotationPreview.tsx` 中使用 `getMinguoDateInfo`**

```tsx
// 修改前
const today = new Date();
const year = today.getFullYear() - 1911; // 民國年
const month = today.getMonth() + 1;
const day = today.getDate();
const dateStr = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

// 修改後
import { getMinguoDateInfo } from '../shared/utils/dateUtils';
// ...
const { year, month, day, dateStr } = getMinguoDateInfo();
```

---

### Task 2: 抽離版面計算與縮放邏輯

**Files:**
- Modify: `src/domain/quotationCalculations.ts`

- [ ] **Step 1: 新增 `LayoutScales` 介面與 `getLayoutScales` 函數**

```typescript
export interface LayoutScales {
  layoutScale: number;
  lineScale: number;
  rowScale: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const getLayoutScales = (densityScore: number): LayoutScales => {
  return {
    layoutScale: clamp(1.3 - densityScore * 0.08, 0.82, 1.26),
    lineScale: clamp(1.13 - densityScore * 0.035, 0.86, 1.12),
    rowScale: clamp(1.12 - densityScore * 0.06, 0.64, 1.1),
  };
};
```

- [ ] **Step 2: 新增 `calculateEmptyRowCount` 函數**

```typescript
export const calculateEmptyRowCount = (data: QuotationData, densityScore: number): number => {
  const getCurrentRowCount = () => {
    if (data.quotationType === 'single') return data.items.length;
    return data.bookletJobs.reduce((count, job) => {
      const hasHQ = data.quotationType === 'dept' && job.hqQuantity;
      return count + 1 + job.parts.length + (hasHQ ? 1 : 0);
    }, 0);
  };
  const currentRowCount = getCurrentRowCount() + (data.remarks ? 1 : 0);
  return clamp(Math.round(2 - currentRowCount * 0.25), 0, 2);
};
```

---

### Task 3: 重構 QuotationPreview 組件

**Files:**
- Modify: `src/components/QuotationPreview.tsx`

- [ ] **Step 1: 清理並整合計算邏輯**

```tsx
// 移除組件內的 clamp 與手動計算
// 使用抽離的計算邏輯
const { totalSubtotal, totalTax, grandTotal } = calculateTotals(data);
const densityScore = calculateDensityScore(data);
const { layoutScale, lineScale, rowScale } = getLayoutScales(densityScore);
const emptyRowCount = calculateEmptyRowCount(data, densityScore);
```

---

### Task 4: 更新自動化驗證腳本

**Files:**
- Modify: `scripts/verify-print-layout.mjs`

- [ ] **Step 1: 修改驗證規則，從組件檢查移至領域邏輯檢查**

```javascript
// 修改前
{
  name: 'long quotations can scale below 90%',
  pass: /const layoutScale = clamp\([^,]+,\s*0\.8[0-9]\s*,\s*1\.26\)/.test(preview),
},

// 修改後 (同時讀取領域邏輯檔案進行檢查)
const domainLogic = readFileSync(new URL('../src/domain/quotationCalculations.ts', import.meta.url), 'utf8');
// ...
{
  name: 'long quotations can scale below 90%',
  pass: /layoutScale: clamp\([^,]+,\s*0\.8[0-9]\s*,\s*1\.26\)/.test(domainLogic),
},
```

- [ ] **Step 2: 執行驗證命令確保通過**

Run: `npm run test:print-layout`
Expected: `Print layout checks passed: 5/5`

---

### Task 5: 最終檢查與建置

- [ ] **Step 1: 執行完整建置確保型別安全**

Run: `npm run build`
Expected: 建置成功且無 Error

- [ ] **Step 2: Commit 變更**

```bash
git add .
git commit -m "refactor: complete milestone 2 - extract logic from QuotationPreview"
```

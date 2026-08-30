# 乙方資料 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在估價單系統加入可保存、選取、匯入／匯出並列印的乙方資料。

**Architecture:** 以共用 `Party` 型別承載 `QuotationData.partyB`，由 `App` 建立初始資料與正規化舊資料；`QuotationForm` 管理欄位與 `partyBDatabase`；`QuotationPreview` 負責列印呈現。資料庫與歷史紀錄維持現有 localStorage／JSON 流程。

**Tech Stack:** React、TypeScript、Vite、Vitest（若現有設定可用）、localStorage、CSS。

---

### Task 1: 建立資料模型與相容正規化

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/App.tsx`
- Create: `src/domain/partyB.ts`
- Test: `src/domain/partyB.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { createEmptyPartyB, normalizePartyB } from './partyB';

describe('party B data', () => {
  it('fills missing legacy fields with empty strings', () => {
    expect(normalizePartyB({ name: '宏遠' })).toEqual({
      name: '宏遠', representative: '', address: '', taxId: '',
      phone: '', fax: '', contactPerson: '', mobile: '',
    });
  });

  it('creates an empty party B record', () => {
    expect(createEmptyPartyB().taxId).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/domain/partyB.test.ts`  
Expected: FAIL because `partyB.ts` and its exports do not exist.

- [ ] **Step 3: Write minimal implementation**

新增 `Party` 型別與 `partyB` 欄位；`partyB.ts` export `createEmptyPartyB()` 與 `normalizePartyB(input: Partial<Party> | null | undefined): Party`，逐欄以 `String(input?.field ?? '')` 補值。`App` 的初始資料使用 `createEmptyPartyB()`，URL／JSON 匯入後將 `data.partyB = normalizePartyB(data.partyB)`。

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/domain/partyB.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/App.tsx src/domain/partyB.ts src/domain/partyB.test.ts
git commit -m "feat: add party B data model"
```

### Task 2: 加入乙方表單與資料庫選取

**Files:**
- Modify: `src/components/QuotationForm.tsx`
- Modify: `src/styles/Form.css`（僅在既有表單樣式模式不足時）

- [ ] **Step 1: Write the failing test**

以 `partyB.ts` 純函式測試保存／搜尋契約：同公司名稱的新資料取代舊資料；空公司名稱不寫入資料庫。

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/domain/partyB.test.ts`  
Expected: FAIL on the new database helper behavior.

- [ ] **Step 3: Write minimal implementation**

在 `QuotationForm` 建立 `partyBRecords` state，掛載時從 `localStorage.getItem('partyBDatabase')` 解析；於表單新增乙方區塊與八個 controlled inputs。公司名稱輸入時顯示篩選下拉，選取後以 `{ ...data, partyB: record }` 更新。儲存報價時以 `partyB.name` 去重、前插並寫回 `partyBDatabase`；解析失敗時使用空陣列。

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/domain/partyB.test.ts`  
Expected: PASS，且 `npm run build` 可編譯表單型別。

- [ ] **Step 5: Commit**

```bash
git add src/components/QuotationForm.tsx src/styles/Form.css src/domain/partyB.ts src/domain/partyB.test.ts
git commit -m "feat: add party B form and database"
```

### Task 3: 將乙方資料接到預覽／列印

**Files:**
- Modify: `src/components/QuotationPreview.tsx`
- Modify: `src/styles/Preview.css`（只有版面需要時）

- [ ] **Step 1: Write the failing test**

新增預覽純函式測試或元件測試，驗證輸入 `{ name: '宏遠', representative: '王小明', taxId: '123' }` 時輸出文字包含公司名稱、法代與統編，缺值不輸出 `undefined`。

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/QuotationPreview.test.tsx`  
Expected: FAIL because預覽乙方仍為空白欄位。

- [ ] **Step 3: Write minimal implementation**

將合約區第二個 `contract-party` 改為使用 `data.partyB`，依序顯示公司名稱、法代、地址、統一編號、電話／傳真、聯絡人／手機；使用 `|| ''` 保證空值安全，保留既有 class 與列印版面。

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/QuotationPreview.test.tsx`; then `npm run build`.  
Expected: tests PASS and build exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/QuotationPreview.tsx src/styles/Preview.css src/components/QuotationPreview.test.tsx
git commit -m "feat: render party B in quotation preview"
```

### Task 4: 整合驗證與文件更新

**Files:**
- Modify: `docs/2026-08-18_乙方資料_PLAN.md`
- Modify: `docs/2026-08-18_乙方資料_CHECK.md`

- [ ] **Step 1: Run full verification**

Run: `npm test -- --run`; `npm run lint`; `npm run build`; `node scripts/verify-print-layout.mjs`.  
Expected: all commands succeed with no test failure; print script reports valid layout.

- [ ] **Step 2: Update CHECK with evidence**

記錄上述命令、實際結果、舊 JSON 相容結果與列印檢查；將規格符合項目勾選，風險若無新增則註明已驗證。

- [ ] **Step 3: Update PLAN status**

將四個 Task 勾選完成，補充實際測試檔案與後續工作（若無則寫「無」）。

- [ ] **Step 4: Commit**

```bash
git add docs/2026-08-18_乙方資料_PLAN.md docs/2026-08-18_乙方資料_CHECK.md
git commit -m "docs: record party B verification"
```


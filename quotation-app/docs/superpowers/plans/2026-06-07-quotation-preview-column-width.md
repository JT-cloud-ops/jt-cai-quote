# 報價單預覽欄寬調整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 讓單張類、冊子類、百貨類報價單預覽都使用一致的 8 欄欄寬比例，並加寬「其他明細」欄位。

**Architecture:** 保留現有 `QuotationPreview.tsx` 的三種報價類型渲染邏輯，只把欄寬來源從表頭 inline style 移到共用 `<colgroup>` 與 `Preview.css`。CSS 負責欄寬比例、自然換行與數字欄位不換行，避免更動資料模型與金額計算。

**Tech Stack:** Vite、React、TypeScript、CSS、瀏覽器列印預覽。

---

## 檔案結構

- Modify: `src/components/QuotationPreview.tsx`
  - 在主要報價表格加入 8 欄共用 `<colgroup>`。
  - 移除 `<th>` 上原本的 inline `width` 設定。
  - 保留現有單張類、冊子類、百貨類資料列邏輯。
- Modify: `src/styles/Preview.css`
  - 新增 8 個欄位 class 的寬度。
  - 將一般表格文字從 `word-break: break-all` 改為較自然的換行。
  - 讓數量、單價、金額欄位保持不換行與原有對齊。

## Task 1: 把欄寬來源移到共用 colgroup

**Files:**
- Modify: `src/components/QuotationPreview.tsx`

- [ ] **Step 1: 檢查目前表格表頭**

Run:

```powershell
Get-Content -Encoding UTF8 -LiteralPath 'C:\Users\HK-003\Documents\Obsidian Vault\估價單系統\quotation-app\src\components\QuotationPreview.tsx' | Select-Object -Skip 210 -First 40
```

Expected: 看到 `.quotation-table-main` 表格，且 `<th>` 目前使用 `style={{ width: '...' }}` 設定欄寬。

- [ ] **Step 2: 修改表格結構**

在 `src/components/QuotationPreview.tsx` 找到：

```tsx
      <table className="quotation-table-main">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>印件名稱</th>
            <th style={{ width: '10%' }}>開數</th>
            <th style={{ width: '10%' }}>印色</th>
            <th style={{ width: '15%' }}>用紙</th>
            <th style={{ width: '20%' }}>其他明細</th>
            <th style={{ width: '10%' }}>數量</th>
            <th style={{ width: '10%' }}>單價</th>
            <th style={{ width: '10%' }}>金額</th>
          </tr>
        </thead>
```

改成：

```tsx
      <table className="quotation-table-main">
        <colgroup>
          <col className="quote-col-job" />
          <col className="quote-col-size" />
          <col className="quote-col-color" />
          <col className="quote-col-paper" />
          <col className="quote-col-details" />
          <col className="quote-col-quantity" />
          <col className="quote-col-unit-price" />
          <col className="quote-col-amount" />
        </colgroup>
        <thead>
          <tr>
            <th>印件名稱</th>
            <th>開數</th>
            <th>印色</th>
            <th>用紙</th>
            <th>其他明細</th>
            <th>數量</th>
            <th>單價</th>
            <th>金額</th>
          </tr>
        </thead>
```

- [ ] **Step 3: 確認沒有殘留表頭 inline width**

Run:

```powershell
Select-String -Path 'C:\Users\HK-003\Documents\Obsidian Vault\估價單系統\quotation-app\src\components\QuotationPreview.tsx' -Pattern "width: '"
```

Expected: 不應再找到表頭欄寬設定。若仍找到其他 unrelated width，確認不是報價表格 `<th>` 的欄寬。

## Task 2: 新增欄寬比例與換行規則

**Files:**
- Modify: `src/styles/Preview.css`

- [ ] **Step 1: 檢查目前表格 CSS**

Run:

```powershell
Get-Content -Encoding UTF8 -LiteralPath 'C:\Users\HK-003\Documents\Obsidian Vault\估價單系統\quotation-app\src\styles\Preview.css' | Select-Object -Skip 55 -First 55
```

Expected: 看到 `.quotation-table-main`、`.quotation-table-main th, .quotation-table-main td`、`.text-center`、`.text-right`、`.multi-line`。

- [ ] **Step 2: 加入 8 欄欄寬 class**

在 `.quotation-table-main` 規則後方加入：

```css
.quote-col-job {
  width: 15%;
}

.quote-col-size {
  width: 8%;
}

.quote-col-color {
  width: 8%;
}

.quote-col-paper {
  width: 16%;
}

.quote-col-details {
  width: 25%;
}

.quote-col-quantity {
  width: 9%;
}

.quote-col-unit-price {
  width: 9%;
}

.quote-col-amount {
  width: 10%;
}
```

- [ ] **Step 3: 改善表格文字換行**

將目前這段：

```css
.quotation-table-main th, 
.quotation-table-main td {
  border: 1px solid #000;
  padding: 4pt 2pt;
  font-size: 9pt;
  word-break: break-all;
}
```

改成：

```css
.quotation-table-main th, 
.quotation-table-main td {
  border: 1px solid #000;
  padding: 4pt 2pt;
  font-size: 9pt;
  word-break: normal;
  overflow-wrap: anywhere;
}
```

- [ ] **Step 4: 保持數字欄位不換行**

將目前這段：

```css
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
  padding-right: 4pt !important;
}
```

改成：

```css
.text-center {
  text-align: center;
}

.quotation-table-main td.text-center {
  white-space: nowrap;
}

.text-right {
  text-align: right;
  padding-right: 4pt !important;
}

.quotation-table-main td.text-right {
  white-space: nowrap;
}
```

- [ ] **Step 5: 確認明細欄仍可多行**

確認 `.multi-line` 維持：

```css
.multi-line {
  white-space: pre-wrap;
  vertical-align: top;
}
```

Expected: `white-space: pre-wrap` 會覆蓋數字欄位的 nowrap，不影響「其他明細」多行顯示。

## Task 3: 驗證與人工檢查

**Files:**
- Verify: `src/components/QuotationPreview.tsx`
- Verify: `src/styles/Preview.css`

- [ ] **Step 1: 執行 build**

Run:

```powershell
npm run build
```

Working directory:

```text
C:\Users\HK-003\Documents\Obsidian Vault\估價單系統\quotation-app
```

Expected: `tsc -b && vite build` 成功完成。

- [ ] **Step 2: 如果 build 因本機環境失敗，改跑 TypeScript**

Run:

```powershell
npx tsc -b
```

Working directory:

```text
C:\Users\HK-003\Documents\Obsidian Vault\估價單系統\quotation-app
```

Expected: TypeScript 編譯成功。若仍失敗，記錄實際錯誤訊息，不要宣稱驗證通過。

- [ ] **Step 3: 人工檢查預覽畫面**

啟動開發伺服器：

```powershell
npm run dev
```

Working directory:

```text
C:\Users\HK-003\Documents\Obsidian Vault\估價單系統\quotation-app
```

人工檢查項目：

- 單張類：輸入長一點的「其他明細」，確認明細欄比原本寬，且文字可換行。
- 冊子類：新增多個部件，確認數量、單價、金額的 `rowSpan` 仍對齊。
- 百貨類：填入「總公司量」，確認該列仍在表格內正常顯示。
- 合計、營業稅、總計三列仍正確跨欄。
- 備註列仍正確跨欄。
- 瀏覽器列印預覽 A4 沒有超出頁面寬度。

- [ ] **Step 4: 檢查 scope 沒有擴大**

Run:

```powershell
git diff -- src/components/QuotationPreview.tsx src/styles/Preview.css
```

Expected: diff 只包含 `<colgroup>`、表頭 inline width 移除、欄寬 CSS、換行 CSS。不得包含金額計算、資料型別、公司資料、匯出或分享流程修改。



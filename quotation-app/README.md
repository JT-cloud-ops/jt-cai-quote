# 估價單系統前端

本專案使用 React、TypeScript、Vite 與 ESLint。

## 開發

```bash
npm install
npm run dev
```

## 完整驗證

```bash
npm run verify
```

此指令會依序執行 TypeScript 型別檢查、Vitest 測試、ESLint、正式建置與列印版面檢查；列印檢查完成條件為 16/16。

## 其他命令

- `npm run build`：建立 production bundle。
- `npm run test:print-layout`：只執行列印版面契約檢查。
- `npm run lint`：檢查程式碼風格與未使用程式。

## LIFF

LIFF ID 由 `src/shared/utils/liff.ts` 集中管理，型別宣告位於 `src/types/liff.d.ts`。更換 LIFF 應用後請執行 `npm run verify`。

## 專案文件

規格與驗證紀錄位於上層 `docs/`：[[2026-08-28_報價明細表格_SPEC]]、[[2026-08-28_報價明細表格_SDD]]、[[2026-08-28_報價明細表格_PLAN]]、[[2026-08-28_報價明細表格_CHECK]]。

最新版本就緒稽核：[[2026-08-30_版本就緒稽核_SPEC]]、[[2026-08-30_版本就緒稽核_SDD]]、[[2026-08-30_版本就緒稽核_PLAN]]、[[2026-08-30_版本就緒稽核_CHECK]]。

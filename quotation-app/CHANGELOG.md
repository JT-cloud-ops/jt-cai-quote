# 變更紀錄

## 2026-08-30

- 完成報價預覽元件化：表格、單張列、冊子列、基本資料、交易條件與頁尾區塊均已分離。
- 補強 single、booklet、dept、備註、空白列、彙總與高密度版面測試。
- 建立 LIFF 型別宣告與共用工具，支援 SSR／測試環境。
- 移除非必要成功訊息與預覽 legacy helper。
- 新增 `npm run verify`，統一執行型別、測試、Lint、Build 與列印版面檢查。

## 驗證基準

- 14 個測試檔、57 項測試通過。
- Print layout checks：16/16。
- 交接說明：[[README]]。

---
project: "乙方資料"
date: 2026-08-18
status: approved
---

# Party B data design

採用集中式 `partyB: Party` 資料模型，表單、localStorage 資料庫、歷史紀錄、JSON 匯入／匯出與列印預覽共用同一份資料。缺少新欄位的舊資料會在載入時補上空白值；乙方資料庫以公司名稱去重並更新。

詳細需求與驗收條件見 [[2026-08-18_乙方資料_SPEC]]，架構見 [[2026-08-18_乙方資料_SDD]]。

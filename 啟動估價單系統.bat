@echo off
title 估價單系統啟動器
echo ==========================================
echo   正在啟動估價單系統，請稍候...
echo   (如果是第一次啟動，可能需要幾秒鐘)
echo ==========================================
cd quotation-app
:: 使用 Vite 的 --host 參數允許同區域網路存取
npm.cmd run dev -- --open --host
if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 啟動失敗。請檢查是否已安裝 Node.js。
    echo 如果問題持續，請嘗試手動在瀏覽器輸入 http://localhost:5173
)
pause

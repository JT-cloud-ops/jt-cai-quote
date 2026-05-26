import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/jt-cai-quote/', // 設定為 GitHub 倉庫名稱，確保 GitHub Pages 資源路徑正確
  server: {
    host: '0.0.0.0', // 監聽所有網路介面
    port: 5173,
    hmr: {
      host: '192.168.1.82', // 強制指定 HMR 連線到您的 IP
    },
    watch: {
      usePolling: true,
    },
  },
})

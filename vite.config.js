import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'your-repo-name' with your exact GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/opportunity-tracker/',
  server: {
    port: 5173,
    open: true
  }
})

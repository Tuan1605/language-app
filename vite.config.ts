import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitLab Pages serves this project under /<project>/, so assets must be
  // resolved relative to that base path. Change if the project path changes.
  base: '/',
})

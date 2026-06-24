/// <reference types="vite-plugin-pwa/client" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

const updateSW = registerSW({
  onNeedRefresh() {
    // Show an update banner if needed. For now, just reload to update.
    updateSW(true)
  },
  onOfflineReady() {
    console.log("App is ready to work offline.")
  },
})

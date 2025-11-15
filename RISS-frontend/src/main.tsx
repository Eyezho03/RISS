import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Initialize MSW in development (non-blocking)
async function enableMocking(): Promise<void> {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  try {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
  } catch (error) {
    console.warn('MSW initialization failed, continuing without mocks:', error)
  }
}

// Render app immediately, MSW will initialize in background
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Initialize MSW in background (non-blocking)
enableMocking().catch((error) => {
  console.warn('MSW failed to initialize:', error)
})


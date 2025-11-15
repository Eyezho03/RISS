import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW Browser Worker
 * Sets up mock service worker for development
 */
export const worker = setupWorker(...handlers)


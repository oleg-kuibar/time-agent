export const TIME_REGEX = /time:\s*(\d+(?:\.\d+)?h)?(?:\s*(\d+)m)?/i

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
}

export const CRON = {
  WEEKLY_REPORT: '0 17 * * 5' // Every Friday at 5 PM
}

export const DB_ERROR_CODES = {
  NOT_FOUND: 'PGRST116'
}

export const REPORT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const 
import { logger } from '../lib/logger'

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  const errorDetails = {
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context
  }

  logger.error('Error occurred:', errorDetails)
}

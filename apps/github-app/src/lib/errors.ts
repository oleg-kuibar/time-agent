export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'DATABASE_ERROR'
  | 'GITHUB_API_ERROR'
  | 'GITHUB_AUTH_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'

interface ErrorOptions {
  message: string
  code: ErrorCode
  cause?: unknown
  statusCode?: number
  details?: Record<string, unknown>
}

export class AppError extends Error {
  readonly code: ErrorCode
  readonly statusCode: number
  readonly details?: Record<string, unknown>
  readonly cause?: unknown

  constructor({ message, code, cause, statusCode = 500, details }: ErrorOptions) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.cause = cause
    this.details = details

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details
      }
    }
  }
}

export const createAppError = (options: ErrorOptions): AppError => {
  // Map error codes to status codes
  const statusCodes: Record<ErrorCode, number> = {
    VALIDATION_ERROR: 400,
    DATABASE_ERROR: 500,
    GITHUB_API_ERROR: 502,
    GITHUB_AUTH_ERROR: 401,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_ERROR: 500
  }

  return new AppError({
    ...options,
    statusCode: options.statusCode || statusCodes[options.code]
  })
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
} 
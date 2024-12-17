import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '@lib/logger'
import { isAppError, createAppError } from '@lib/errors'

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log all errors
  logger.error('Error occurred:', {
    error: error.message,
    path: req.path,
    method: req.method,
    query: req.query as Record<string, unknown>,
    body: req.body as Record<string, unknown>
  })

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.errors
      }
    })
  }

  // Handle our custom AppError
  if (isAppError(error)) {
    return res.status(error.statusCode).json(error.toJSON())
  }

  // Handle unknown errors
  const appError = createAppError({
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    cause: error
  })

  res.status(appError.statusCode).json(appError.toJSON())
}

// Catch async errors
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | undefined>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

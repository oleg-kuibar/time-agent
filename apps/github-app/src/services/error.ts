import { logger } from './logger';

export async function reportError(error: Error | unknown, context?: Record<string, unknown>): Promise<void> {
  logger.error('Error:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    context,
    awsRequestId: process.env.AWS_REQUEST_ID,
    functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION
  });
} 
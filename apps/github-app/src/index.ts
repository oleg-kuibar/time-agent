import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { logger } from '@lib/logger'
import { startCronJobs } from '@services/cron'
import { initializeDatabase } from '@lib/database'
import reportsRouter from '@domains/reports/router'
import { config } from '@/config'
import { isProd } from './config'
import { RATE_LIMIT } from './constants'
import { webhookMiddleware } from './services/github'

async function bootstrap() {
  try {
    // Initialize AWS and database connection
    await initializeDatabase()

    const app = express()

    // Security middleware
    app.use(helmet())
    app.use(express.json())
    app.use(
      rateLimit({
        windowMs: RATE_LIMIT.WINDOW_MS,
        max: RATE_LIMIT.MAX_REQUESTS
      })
    )

    // Routes
    app.use('/api/webhook', (req, res, next) => {
      webhookMiddleware(req, res, next).catch(next)
    })
    app.use('/api/reports', reportsRouter)

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.json({ status: 'ok' })
    })

    // Error handling middleware
    app.use(
      (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        logger.error('Unhandled error:', err)
        res.status(500).json({ error: 'Internal server error' })
      }
    )

    app.listen(config.PORT, () => {
      logger.info(`🚀 Server is running on port ${config.PORT}`)

      // Start cron jobs in production
      if (isProd) {
        startCronJobs()
        logger.info('Started cron jobs')
      }
    })
  } catch (error) {
    logger.error('Failed to start application:', error)
    process.exit(1)
  }
}

bootstrap().catch(error => {
  logger.error('Failed to bootstrap application:', error)
  process.exit(1)
})

import { Router, type Request, type Response, type RequestHandler } from 'express'
import { z } from 'zod'
import { ReportService } from '../services/reports'
import { logger } from '../lib/logger'
import { dayjs } from '@/lib/dayjs'

const router = Router()

// Schema for report generation request
const generateReportSchema = z
  .object({
    organizationId: z.string().uuid(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  })
  .refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before or equal to end date'
  })

// Schema for query parameters
const getReportQuerySchema = z
  .object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  })
  .refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before or equal to end date'
  })

// Generate report endpoint
router.post('/generate', (async (req: Request, res: Response) => {
  try {
    const { organizationId, startDate, endDate } = generateReportSchema.parse(req.body)

    const report = await ReportService.generateWeeklyReport(
      organizationId,
      dayjs(startDate).toDate(),
      dayjs(endDate).toDate()
    )

    res.json({
      success: true,
      data: report
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      })
      return
    }

    logger.error('Error generating report:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate report'
    })
  }
}) as RequestHandler)

// Get report endpoint
router.get('/:organizationId', (async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.params

    // Validate organizationId
    if (!z.string().uuid().safeParse(organizationId).success) {
      res.status(400).json({
        success: false,
        error: 'Invalid organization ID'
      })
      return
    }

    // Validate query parameters
    const queryResult = getReportQuerySchema.safeParse(req.query)
    if (!queryResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: queryResult.error.errors
      })
      return
    }

    const { startDate, endDate } = queryResult.data
    const report = await ReportService.generateWeeklyReport(
      organizationId,
      dayjs(startDate).toDate(),
      dayjs(endDate).toDate()
    )

    res.json({
      success: true,
      data: report
    })
  } catch (error) {
    logger.error('Error fetching report:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report'
    })
  }
}) as RequestHandler)

export default router

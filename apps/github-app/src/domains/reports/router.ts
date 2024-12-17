import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { ReportsService } from './service'
import { dateHelpers } from '@lib/dayjs'
import { generateReportSchema, getReportQuerySchema } from '@schemas/reports'
import { asyncHandler } from '@/middleware/error'

const router = Router()

// Generate report endpoint
router.post(
  '/generate',
  asyncHandler(async (req: Request, res: Response) => {
    const { organizationId, startDate, endDate } = generateReportSchema.parse(req.body)

    const report = await ReportsService.getWeeklyReport(
      organizationId,
      dateHelpers.toDate(startDate),
      dateHelpers.toDate(endDate)
    )

    return res.json({
      success: true,
      data: report
    })
  })
)

// Get report endpoint
router.get(
  '/:organizationId',
  asyncHandler(async (req: Request, res: Response) => {
    const { organizationId } = req.params

    // Validate organizationId
    if (!z.string().uuid().safeParse(organizationId).success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid organization ID'
      })
    }

    // Validate query parameters
    const queryResult = getReportQuerySchema.safeParse(req.query)
    if (!queryResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: queryResult.error.errors
      })
    }

    const { startDate, endDate } = queryResult.data
    const report = await ReportsService.getWeeklyReport(
      organizationId,
      dateHelpers.toDate(startDate),
      dateHelpers.toDate(endDate)
    )

    return res.json({
      success: true,
      data: report
    })
  })
)

export default router

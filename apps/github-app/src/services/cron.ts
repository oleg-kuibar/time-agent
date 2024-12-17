import { CronJob } from 'cron'
import { dateHelpers } from '@lib/dayjs'
import prisma from '@lib/prisma'
import { ReportService } from './reports'
import { RetentionService } from './retention'
import { logger } from '@lib/logger'

// Generate reports every Saturday at 1 AM UTC
const scheduleWeeklyReports = new CronJob(process.env.CRON_SCHEDULE, async () => {
  try {
    logger.info('Starting weekly report generation')

    // Get all organizations
    const organizations = await prisma.organization.findMany({
      orderBy: { name: 'asc' }
    })

    if (!organizations.length) {
      logger.info('No organizations found')
      return
    }

    // Calculate date range in UTC
    const today = new Date()
    const startDate = dateHelpers.subtractDays(today, 7).toDate()
    const endDate = dateHelpers.subtractDays(today, 1).toDate()

    // Generate reports for each organization
    for (const org of organizations) {
      try {
        await ReportService.generateWeeklyReport(org.id, startDate, endDate)
        logger.info('Generated weekly report', {
          organizationId: org.id,
          startDate: dateHelpers.formatISO(startDate),
          endDate: dateHelpers.formatISO(endDate)
        })
      } catch (error) {
        logger.error('Error generating report for organization', {
          error,
          organizationId: org.id
        })
      }
    }

    logger.info('Completed weekly report generation')
  } catch (error) {
    logger.error('Error in weekly report cron job', error)
  }
})

// Run data cleanup every day at 2 AM UTC
const scheduleDataCleanup = new CronJob(process.env.CLEANUP_CRON_SCHEDULE, async () => {
  try {
    logger.info('Starting data cleanup')
    await RetentionService.runCleanup()
    logger.info('Completed data cleanup')
  } catch (error) {
    logger.error('Error in data cleanup cron job', error)
  }
})

export const startCronJobs = () => {
  scheduleWeeklyReports.start()
  scheduleDataCleanup.start()
  logger.info('Started cron jobs', {
    reportSchedule: process.env.CRON_SCHEDULE,
    cleanupSchedule: process.env.CLEANUP_CRON_SCHEDULE
  })
}

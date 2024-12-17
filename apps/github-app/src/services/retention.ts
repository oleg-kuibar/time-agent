import { dateHelpers } from '@lib/dayjs'
import prisma from '@lib/prisma'
import { logger } from '@lib/logger'

export const RetentionService = {
  /**
   * Clean up old pull request data
   */
  async cleanupPullRequests(): Promise<void> {
    try {
      const retentionDate = dateHelpers
        .subtractDays(new Date(), Number(process.env.DATA_RETENTION_DAYS) || 90)
        .toDate()

      const { count } = await prisma.pullRequest.deleteMany({
        where: {
          createdAt: {
            lt: retentionDate
          }
        }
      })

      logger.info(`Cleaned up ${count} old pull requests`, {
        retentionDate: dateHelpers.formatISO(retentionDate)
      })
    } catch (error) {
      logger.error('Error cleaning up pull requests:', error)
      throw error
    }
  },

  /**
   * Clean up old weekly reports
   */
  async cleanupReports(): Promise<void> {
    try {
      const retentionDate = dateHelpers
        .subtractDays(new Date(), Number(process.env.REPORT_RETENTION_DAYS) || 365)
        .toDate()

      const { count } = await prisma.weeklyReport.deleteMany({
        where: {
          createdAt: {
            lt: retentionDate
          }
        }
      })

      logger.info(`Cleaned up ${count} old weekly reports`, {
        retentionDate: dateHelpers.formatISO(retentionDate)
      })
    } catch (error) {
      logger.error('Error cleaning up weekly reports:', error)
      throw error
    }
  },

  /**
   * Clean up orphaned data
   */
  async cleanupOrphanedData(): Promise<void> {
    try {
      // Clean up pull requests without valid organizations
      const { count: prCount } = await prisma.pullRequest.deleteMany({
        where: {
          NOT: {
            id: {
              in: await prisma.organization.findMany().then(orgs => orgs.map(org => org.id))
            }
          }
        }
      })

      // Clean up reports without organizations
      const { count: reportCount } = await prisma.weeklyReport.deleteMany({
        where: {
          organizationId: {
            notIn: await prisma.organization.findMany().then(orgs => orgs.map(org => org.id))
          }
        }
      })

      logger.info('Cleaned up orphaned data:', {
        pullRequests: prCount,
        reports: reportCount
      })
    } catch (error) {
      logger.error('Error cleaning up orphaned data:', error)
      throw error
    }
  },

  /**
   * Run all cleanup tasks
   */
  async runCleanup(): Promise<void> {
    try {
      await this.cleanupPullRequests()
      await this.cleanupReports()
      await this.cleanupOrphanedData()
      logger.info('Completed data cleanup')
    } catch (error) {
      logger.error('Error running cleanup:', error)
      throw error
    }
  }
}

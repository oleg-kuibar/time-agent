import prisma from '@lib/prisma'
import { logger } from '@lib/logger'
import type { WeeklyReport, Prisma } from '@prisma/client/wasm'

export const ReportsService = {
  async getWeeklyReport(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<WeeklyReport | null> {
    try {
      const report = await prisma.weeklyReport.findUnique({
        where: {
          organizationId_startDate_endDate: {
            organizationId,
            startDate,
            endDate
          }
        }
      })
      return report
    } catch (error) {
      logger.error('Error getting weekly report:', error)
      throw error
    }
  },

  async createWeeklyReport(data: {
    organizationId: string
    startDate: Date
    endDate: Date
    reportData?: Prisma.InputJsonValue
  }): Promise<WeeklyReport> {
    try {
      const report = await prisma.weeklyReport.create({ data })
      return report
    } catch (error) {
      logger.error('Error creating weekly report:', error)
      throw error
    }
  },

  async updateWeeklyReport(
    id: string,
    data: {
      status?: 'pending' | 'processing' | 'completed' | 'failed'
      reportData?: Prisma.InputJsonValue
    }
  ): Promise<WeeklyReport> {
    try {
      const report = await prisma.weeklyReport.update({
        where: { id },
        data
      })
      return report
    } catch (error) {
      logger.error('Error updating weekly report:', error)
      throw error
    }
  }
}

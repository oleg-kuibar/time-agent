import { ReportsService } from './service'
import prisma from '@lib/prisma'
import { logger } from '@lib/logger'
import type { WeeklyReport } from '@prisma/client/wasm'

jest.mock('@lib/prisma')
jest.mock('@lib/logger')

describe('ReportsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getWeeklyReport', () => {
    const mockOrganizationId = 'test-org-id'
    const mockStartDate = '2024-02-01'
    const mockEndDate = '2024-02-07'

    it('should get a report when it exists', async () => {
      const mockReport: WeeklyReport = {
        id: 'test-report-id',
        organizationId: mockOrganizationId,
        startDate: new Date(mockStartDate),
        endDate: new Date(mockEndDate),
        status: 'pending',
        reportData: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const findUniqueSpy = jest.spyOn(prisma.weeklyReport, 'findUnique')
      findUniqueSpy.mockResolvedValueOnce(mockReport)

      const result = await ReportsService.getWeeklyReport(
        mockOrganizationId,
        new Date(mockStartDate),
        new Date(mockEndDate)
      )

      expect(findUniqueSpy).toHaveBeenCalled()
      expect(result).toEqual(mockReport)
    })

    it('should handle errors gracefully', async () => {
      const mockError = new Error('Database error')
      jest.spyOn(prisma.weeklyReport, 'findUnique').mockRejectedValueOnce(mockError)
      jest.spyOn(logger, 'error')

      await expect(
        ReportsService.getWeeklyReport(
          mockOrganizationId,
          new Date(mockStartDate),
          new Date(mockEndDate)
        )
      ).rejects.toThrow(mockError)

      expect(logger.error).toHaveBeenCalledWith('Error getting weekly report:', mockError)
    })
  })
})

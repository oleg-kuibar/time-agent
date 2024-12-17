import { dateHelpers } from '@lib/dayjs'
import prisma from '@lib/prisma'
import { logger } from '@lib/logger'
import type { PullRequest, WeeklyReport, Prisma } from '@prisma/client/wasm'

interface PullRequestData {
  title: string
  number: number
  url: string
  author: string
  mergedAt: string
  repository: string
  timeSpent?: number
}

interface ReportSummary {
  count: number
  timeSpent: number
  pullRequests: PullRequestData[]
}

interface ReportData extends Record<string, unknown> {
  totalPRs: number
  totalTimeSpent: number
  pullRequests: PullRequestData[]
  byRepository: Record<string, ReportSummary>
  byAuthor: Record<string, ReportSummary>
}

const getMergedPullRequests = async (
  organizationId: string,
  startDate: Date,
  endDate: Date
): Promise<PullRequest[]> => {
  return await prisma.pullRequest.findMany({
    where: {
      organizationId,
      state: 'closed',
      mergedAt: {
        not: null,
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      mergedAt: 'desc'
    }
  })
}

const processReportData = async (prs: PullRequest[]): Promise<ReportData> => {
  const reportData: ReportData = {
    totalPRs: 0,
    totalTimeSpent: 0,
    pullRequests: [],
    byRepository: {},
    byAuthor: {}
  }

  for (const pr of prs) {
    const timeSpent = await extractTimeSpent(pr)
    const prData: PullRequestData = {
      title: pr.title,
      number: pr.number,
      url: `https://github.com/${pr.repoName}/pull/${pr.number}`,
      author: pr.author,
      mergedAt: dateHelpers.formatISO(pr.mergedAt as Date),
      repository: pr.repoName,
      timeSpent
    }

    // Update total counts
    reportData.totalPRs++
    reportData.totalTimeSpent += timeSpent || 0
    reportData.pullRequests.push(prData)

    // Update by repository
    if (!reportData.byRepository[pr.repoName]) {
      reportData.byRepository[pr.repoName] = {
        count: 0,
        timeSpent: 0,
        pullRequests: []
      }
    }
    reportData.byRepository[pr.repoName].count++
    reportData.byRepository[pr.repoName].timeSpent += timeSpent || 0
    reportData.byRepository[pr.repoName].pullRequests.push(prData)

    // Update by author
    if (!reportData.byAuthor[pr.author]) {
      reportData.byAuthor[pr.author] = {
        count: 0,
        timeSpent: 0,
        pullRequests: []
      }
    }
    reportData.byAuthor[pr.author].count++
    reportData.byAuthor[pr.author].timeSpent += timeSpent || 0
    reportData.byAuthor[pr.author].pullRequests.push(prData)
  }

  return reportData
}

const extractTimeSpent = async (_pr: PullRequest): Promise<number> => {
  return await Promise.resolve(30) // Default to 30 minutes per PR
}

export const ReportService = {
  async generateWeeklyReport(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<WeeklyReport> {
    try {
      // Ensure dates are properly formatted in UTC
      const start = dateHelpers.startOfDay(startDate)
      const end = dateHelpers.endOfDay(endDate)

      // Check if report already exists
      const existingReport = await prisma.weeklyReport.findUnique({
        where: {
          organizationId_startDate_endDate: {
            organizationId,
            startDate: start.toDate(),
            endDate: end.toDate()
          }
        },
        include: {
          organization: true
        }
      })

      if (existingReport?.status === 'completed') {
        logger.info('Report already exists', {
          organizationId,
          startDate: start.toISOString(),
          endDate: end.toISOString()
        })
        return existingReport
      }

      // Create or update report with pending status
      const report =
        existingReport ||
        (await prisma.weeklyReport.create({
          data: {
            organizationId,
            startDate: start.toDate(),
            endDate: end.toDate(),
            status: 'pending'
          },
          include: {
            organization: true
          }
        }))

      // Get all PRs merged in the date range
      const prs = await getMergedPullRequests(organizationId, start.toDate(), end.toDate())

      // Process PRs and generate report data
      const reportData = await processReportData(prs)

      // Update report with completed status and data
      const updatedReport = await prisma.weeklyReport.update({
        where: { id: report.id },
        data: {
          status: 'completed',
          reportData: reportData as Prisma.InputJsonValue
        },
        include: {
          organization: true
        }
      })

      logger.info('Weekly report generated successfully', {
        organizationId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPRs: reportData.totalPRs
      })

      return updatedReport
    } catch (error) {
      logger.error('Error generating weekly report', {
        error,
        organizationId,
        startDate,
        endDate
      })
      throw error
    }
  }
}

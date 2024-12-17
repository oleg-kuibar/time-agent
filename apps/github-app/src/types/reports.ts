export interface PullRequestData {
  title: string
  number: number
  url: string
  author: string
  mergedAt: string
  repository: string
  body?: string
  timeSpent?: number
}

export interface ReportSummary {
  count: number
  timeSpent: number
  pullRequests: PullRequestData[]
}

export interface ReportData {
  totalPRs: number
  totalTimeSpent: number
  pullRequests: PullRequestData[]
  byRepository: Record<string, ReportSummary>
  byAuthor: Record<string, ReportSummary>
} 
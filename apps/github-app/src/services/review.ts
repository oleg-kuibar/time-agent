import type { ReviewData } from '../types'
import type { Octokit } from '@octokit/rest'
import { logger } from '@lib/logger'

interface ReviewTimeParams {
  reviewId: number
  submittedAt: string
}

export function calculateReviewTime(_params: ReviewTimeParams): number {
  // Simple calculation: assume review started 15 minutes ago
  return 15
}

export async function getReviewComments(
  octokit: Octokit,
  repoFullName: string,
  prNumber: number,
  reviewId: number
): Promise<number> {
  const [owner, repo] = repoFullName.split('/')

  const response = await octokit.pulls.listCommentsForReview({
    owner,
    repo,
    pull_number: prNumber,
    review_id: reviewId
  })

  return response.data.length
}

export function storeReviewData(data: ReviewData): void {
  // Use logger instead of console.log
  logger.info('Review data:', data)
}

import type { ReviewData } from '../types';

interface ReviewTimeParams {
  reviewId: number;
  submittedAt: string;
}

export async function calculateReviewTime({ submittedAt }: ReviewTimeParams): Promise<number> {
  // Simple calculation: assume review started 15 minutes ago
  return 15;
}

export async function getReviewComments(
  octokit: any,
  repoFullName: string,
  prNumber: number,
  reviewId: number
): Promise<number> {
  const [owner, repo] = repoFullName.split('/');
  
  const { data: comments } = await octokit.pulls.listCommentsForReview({
    owner,
    repo,
    pull_number: prNumber,
    review_id: reviewId
  });

  return comments.length;
}

export async function storeReviewData(data: ReviewData): Promise<void> {
  // For now, just log the data
  console.log('Review data:', data);
} 
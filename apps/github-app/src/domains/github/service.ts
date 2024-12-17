import { App } from '@octokit/app'
import type { Octokit } from '@octokit/rest'
import { logger } from '@lib/logger'
import { createAppError } from '@lib/errors'
import { config } from '@/config'

// Initialize GitHub App
const app = new App({
  appId: config.GITHUB_APP_ID,
  privateKey: config.GITHUB_PRIVATE_KEY,
  webhooks: {
    secret: config.GITHUB_WEBHOOK_SECRET
  }
})

export class GitHubService {
  private static instance: GitHubService

  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService()
    }
    return GitHubService.instance
  }

  async getInstallationOctokit(installationId: number): Promise<Octokit> {
    try {
      const octokit = await app.getInstallationOctokit(installationId)
      return octokit as unknown as Octokit
    } catch (error) {
      logger.error('Failed to get installation Octokit', { error, installationId })
      throw createAppError({
        message: 'Failed to authenticate with GitHub installation',
        code: 'GITHUB_AUTH_ERROR',
        cause: error
      })
    }
  }

  async getPullRequest(installationId: number, owner: string, repo: string, pullNumber: number) {
    try {
      const octokit = await this.getInstallationOctokit(installationId)
      const { data: pr } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
      })
      return pr
    } catch (error) {
      logger.error('Failed to get pull request', { error, owner, repo, pullNumber })
      throw createAppError({
        message: 'Failed to fetch pull request from GitHub',
        code: 'GITHUB_API_ERROR',
        cause: error
      })
    }
  }

  async getPullRequestComments(
    installationId: number,
    owner: string,
    repo: string,
    pullNumber: number
  ) {
    try {
      const octokit = await this.getInstallationOctokit(installationId)
      const { data: comments } = await octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: pullNumber
      })
      return comments
    } catch (error) {
      logger.error('Failed to get pull request comments', { error, owner, repo, pullNumber })
      throw createAppError({
        message: 'Failed to fetch pull request comments from GitHub',
        code: 'GITHUB_API_ERROR',
        cause: error
      })
    }
  }
}

export const githubService = GitHubService.getInstance()

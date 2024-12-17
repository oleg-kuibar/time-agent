import { App, createNodeMiddleware } from '@octokit/app'
import { logger } from '@lib/logger'
import { config } from '@/config'
import prisma from '@/lib/prisma'

if (!config.GITHUB_APP_ID || !config.GITHUB_PRIVATE_KEY || !config.GITHUB_WEBHOOK_SECRET) {
  throw new Error('Missing required GitHub App configuration')
}

// Initialize GitHub App
const app = new App({
  appId: config.GITHUB_APP_ID,
  privateKey: config.GITHUB_PRIVATE_KEY,
  webhooks: {
    secret: config.GITHUB_WEBHOOK_SECRET
  },
  oauth: {
    clientId: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET
  }
})

// Handle installation events
app.webhooks.on('installation.created', async ({ payload }) => {
  try {
    await prisma.organization.create({
      data: {
        githubId: BigInt(payload.installation.account.id),
        name: payload.installation.account.login,
        installationId: BigInt(payload.installation.id)
      }
    })
    logger.info(`Installation created for organization: ${payload.installation.account.login}`)
  } catch (error) {
    logger.error('Error handling installation.created', error)
    throw error
  }
})

// Handle pull request events
app.webhooks.on(['pull_request.closed'], async ({ payload }) => {
  try {
    if (!payload.pull_request.merged) return // Only process merged PRs

    const org = await prisma.organization.findUnique({
      where: { githubId: BigInt(payload.repository.owner.id) }
    })

    if (!org) {
      logger.warn(`Organization not found: ${payload.repository.owner.login}`)
      return
    }

    await prisma.pullRequest.create({
      data: {
        githubId: BigInt(payload.pull_request.id),
        organizationId: org.id,
        repoName: payload.repository.name,
        number: payload.pull_request.number,
        title: payload.pull_request.title,
        author: payload.pull_request.user.login,
        state: payload.pull_request.state,
        mergedAt: payload.pull_request.merged_at
      }
    })

    logger.info(
      `Processed merged PR #${payload.pull_request.number} in ${payload.repository.full_name}`
    )
  } catch (error) {
    logger.error('Error handling pull_request.closed', error)
    throw error
  }
})

// Create middleware for webhook handling
export const webhookMiddleware = createNodeMiddleware(app)

// Function to get an authenticated Octokit instance for an installation
export async function getInstallationOctokit(installationId: number) {
  return app.getInstallationOctokit(installationId)
}

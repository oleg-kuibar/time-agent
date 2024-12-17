import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Webhooks, createNodeMiddleware } from '@octokit/webhooks'
import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET
const GITHUB_APP_ID = process.env.GITHUB_APP_ID
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

if (
  !GITHUB_WEBHOOK_SECRET ||
  !GITHUB_APP_ID ||
  !GITHUB_PRIVATE_KEY ||
  !GITHUB_CLIENT_ID ||
  !GITHUB_CLIENT_SECRET
) {
  throw new Error('Required GitHub environment variables are not set')
}

const webhooks = new Webhooks({
  secret: GITHUB_WEBHOOK_SECRET
})

// Initialize Octokit with App authentication
const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_PRIVATE_KEY,
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET
  }
})

// Handle installation events
webhooks.on('installation.created', async ({ payload }) => {
  console.log('New installation:', payload.installation.id)
  // Add your installation handling logic here
})

// Main Lambda handler
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Verify GitHub webhook signature
    const signature = event.headers['x-hub-signature-256'] || ''
    const body = event.body || ''

    const isValid = await webhooks.verify(body, signature)
    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid signature' })
      }
    }

    // Process the webhook event
    await webhooks.verifyAndReceive({
      id: event.headers['x-github-delivery'] || '',
      name: event.headers['x-github-event'] as any,
      payload: JSON.parse(body),
      signature: signature
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed successfully' })
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing webhook' })
    }
  }
}

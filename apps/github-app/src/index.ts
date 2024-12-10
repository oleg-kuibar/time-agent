import { Octokit } from "@octokit/rest";
import { App } from "@octokit/app";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import { Webhooks } from "@octokit/webhooks";
import type { WebhookPayload, ReviewData } from "./types";
import { calculateReviewTime, getReviewComments, storeReviewData } from './services/review';
import { reportError } from './services/error';
import { HarvestClient } from './services/harvest';
import { sendSlackNotification } from './services/slack';
import { logger } from './services/logger';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'GITHUB_APP_ID',
  'GITHUB_APP_PRIVATE_KEY',
  'GITHUB_WEBHOOK_SECRET',
  'DATABASE_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Initialize GitHub App
const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET!
  }
});

const server = express();

// Security middleware
server.use(helmet());
server.use(express.json({ limit: '1mb' }));
server.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Webhook handler
const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
  transform: (event) => {
    if (!event.payload.installation?.id) {
      throw new Error('Missing installation ID');
    }
    return event;
  }
});

// Handle pull request review events
webhooks.on(['pull_request_review.submitted', 'pull_request.closed'], async ({ payload, octokit }) => {
  try {
    const { review, pull_request, repository } = payload as WebhookPayload;
    
    // Only process merged PRs
    if (payload.action === 'closed' && !pull_request.merged) {
      return;
    }

    // Calculate review time
    const timeSpent = await calculateReviewTime({
      reviewId: review.id,
      submittedAt: review.submitted_at,
      installationId: payload.installation.id
    });

    const reviewData = {
      repo: repository.full_name,
      pr: pull_request.number,
      reviewer: review.user.login,
      timeSpent,
      startedAt: review.submitted_at,
      completedAt: new Date().toISOString(),
      comments: await getReviewComments(octokit, repository.full_name, pull_request.number, review.id)
    };

    // Store review data
    await storeReviewData(reviewData);

    // Create Harvest time entry
    const harvest = new HarvestClient();
    await harvest.createTimeEntry(reviewData);

    // Send Slack notification
    await sendSlackNotification({
      ...reviewData,
      url: pull_request.html_url
    });

  } catch (error) {
    console.error('Error processing review:', error);
    await reportError(error);
  }
});

// Webhook endpoint with signature verification
server.post('/webhooks/github', 
  express.json({ verify: webhooks.verify }),
  async (req, res) => {
    try {
      await webhooks.verifyAndReceive({
        id: req.headers['x-github-delivery'] as string,
        name: req.headers['x-github-event'] as string,
        payload: req.body,
        signature: req.headers['x-hub-signature-256'] as string
      });
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send('Invalid webhook payload');
    }
  }
);

// Health check endpoint
server.get('/healthz', (_, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  logger.info(`GitHub App is running on port ${port}`, { port });
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection', { error });
  reportError(error);
});

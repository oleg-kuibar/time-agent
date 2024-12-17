# Technical Architecture

## Application Structure

```
git-time-harvest/
├── src/
│   ├── lambda/           # AWS Lambda functions
│   ├── services/         # Core services (GitHub, cron, etc.)
│   ├── domains/          # Domain-specific logic and routes
│   ├── lib/             # Shared utilities and configurations
│   ├── config/          # Configuration management
│   ├── types/           # TypeScript type definitions
│   ├── middleware/      # Express middleware
│   ├── schemas/         # Data validation schemas
│   ├── constants/       # Shared constants
│   └── routes/          # API routes
```

## Core Components

### 1. Express Server
- Security middleware (helmet)
- Rate limiting
- JSON body parsing
- Error handling
- Health check endpoint

### 2. GitHub Integration
- Webhook handling (`/api/webhook`)
- PR event processing
- Installation management
- OAuth authentication

### 3. Database
- PostgreSQL with Prisma ORM
- Organization data
- Pull request tracking
- Time entries

### 4. Background Jobs
- Cron-based scheduling
- Weekly report generation
- Data cleanup tasks
- Only runs in production

## API Endpoints

1. **Webhook Endpoint**
   ```
   POST /api/webhook
   ```
   Handles GitHub webhook events:
   - Installation events
   - Pull request events
   - Review events

2. **Reports API**
   ```
   GET /api/reports
   ```
   Access to weekly PR review reports

3. **Health Check**
   ```
   GET /health
   ```
   Simple health check endpoint

## Security Features

1. **Rate Limiting**
   - Window: Configurable via `RATE_LIMIT.WINDOW_MS`
   - Max requests: Set by `RATE_LIMIT.MAX_REQUESTS`

2. **HTTP Security**
   - Helmet middleware
   - CORS configuration
   - JSON parsing limits

3. **Authentication**
   - GitHub App authentication
   - OAuth for user access
   - JWT for API access

## Environment Configuration

Required environment variables:
```env
# App Configuration
NODE_ENV=development
PORT=3000

# GitHub Configuration
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# AWS Configuration
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_RDS_SECRET_NAME=

# Database
DATABASE_URL=

# Integrations
HARVEST_ACCOUNT_ID=
HARVEST_ACCESS_TOKEN=
HARVEST_PROJECT_ID=
HARVEST_TASK_ID=
SLACK_WEBHOOK_URL=
```

## Development Setup

1. **Local Development**
   ```bash
   pnpm install
   pnpm --filter @git-time-harvest/github-app dev
   ```

2. **Testing**
   ```bash
   pnpm --filter @git-time-harvest/github-app test
   ```

3. **Database**
   ```bash
   pnpm --filter @git-time-harvest/github-app prisma:generate
   pnpm --filter @git-time-harvest/github-app prisma:migrate
   ```

## Production Deployment

1. **AWS Lambda**
   - Function: `github-app-webhook-handler`
   - Memory: 128 MB
   - Timeout: 30 seconds
   - Environment: Production variables

2. **API Gateway**
   - REST API
   - Webhook endpoint
   - Lambda integration

3. **Database**
   - RDS PostgreSQL
   - Secrets in AWS Secrets Manager
   - Automated backups

4. **Monitoring**
   - CloudWatch logs
   - Error tracking
   - Performance metrics 
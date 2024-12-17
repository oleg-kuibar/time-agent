# Getting Started

This guide will help you set up Git Time Harvest for your organization.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher installed
- pnpm 9.14 or higher installed
- PostgreSQL 14 or higher installed
- A GitHub account with organization admin access
- An AWS account (for production deployment)
- A Harvest account for time tracking
- Basic knowledge of TypeScript and Express.js

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/oleg-kuibar/git-time-harvest.git
cd git-time-harvest

# Install dependencies
pnpm install
```

### 2. Set Up GitHub App

1. Go to GitHub Developer Settings
2. Create a new GitHub App:
   - Name: "Git Time Harvest"
   - Homepage URL: Your app's URL
   - Webhook URL: Your webhook endpoint
   - Permissions:
     - Repository: Read & Write
     - Organization: Read
   - Subscribe to events:
     - Pull request
     - Pull request review
     - Pull request review comment

3. After creation, note down:
   - App ID
   - Client ID
   - Client Secret
   - Generate and download private key

### 3. Configure Environment

```bash
# Copy environment file
cp apps/github-app/.env.example apps/github-app/.env

# Edit .env file with your credentials
```

Required environment variables:
```env
# GitHub App
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
your_private_key_here
-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_RDS_SECRET_NAME=your_secret_name

# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/git_time_harvest

# Harvest
HARVEST_ACCOUNT_ID=your_harvest_account_id
HARVEST_ACCESS_TOKEN=your_harvest_token
HARVEST_PROJECT_ID=your_project_id
HARVEST_TASK_ID=your_task_id
```

### 4. Set Up Database

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE git_time_harvest;
   ```

2. Run migrations:
   ```bash
   cd apps/github-app
   pnpm prisma:migrate
   pnpm prisma:generate
   ```

### 5. Start Development Server

```bash
# Start GitHub App
pnpm --filter @git-time-harvest/github-app dev
```

## Project Structure

```
git-time-harvest/
├── apps/
│   ├── github-app/          # Main application
│   │   ├── src/
│   │   │   ├── config/     # Configuration
│   │   │   ├── domains/    # Business logic
│   │   │   ├── lib/       # Shared utilities
│   │   │   └── services/  # External services
│   │   └── prisma/        # Database schema
│   └── website/           # Documentation site
└── docs/                 # Project documentation
```

## Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and test:
   ```bash
   pnpm test
   pnpm lint
   ```

3. Commit changes using conventional commits:
   ```bash
   git commit -m 'feat: add new feature'
   ```

4. Push and create PR:
   ```bash
   git push origin feature/your-feature
   ```

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter @git-time-harvest/github-app test

# Run tests in watch mode
pnpm --filter @git-time-harvest/github-app test:watch
```

## Common Tasks

### Adding a New API Endpoint

1. Create route file in `src/routes`
2. Add validation schema in `src/schemas`
3. Implement service logic in `src/services`
4. Add tests in `__tests__` directory
5. Register route in `src/index.ts`

### Database Changes

1. Modify schema in `prisma/schema.prisma`
2. Create migration:
   ```bash
   pnpm prisma:migrate dev --name your_change
   ```
3. Update types and regenerate client:
   ```bash
   pnpm prisma:generate
   ```

## Next Steps

1. [Configure AWS and GitHub App](./aws-github-setup.md)
2. [Review technical architecture](./technical-architecture.md)
3. [Set up production deployment](./aws-github-setup.md#production-deployment)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is running

2. **GitHub App Issues**
   - Validate webhook URL
   - Check app permissions
   - Verify private key format

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript version
   - Verify path aliases

### Getting Help

- Search [GitHub Issues](https://github.com/oleg-kuibar/git-time-harvest/issues)
- Review error logs in `logs/` directory
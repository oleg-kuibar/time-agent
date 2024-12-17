# GitHub App for Weekly PR Reports

A GitHub App that generates weekly pull request reports for organizations.

## Features

- 🤖 GitHub App integration
- 📊 Weekly PR reports generation
- 🗄️ AWS RDS PostgreSQL database
- 📝 Detailed PR statistics
- 🔄 Automated report scheduling
- 📨 Slack notifications
- ⏱️ Harvest time tracking integration

## Tech Stack

- Node.js & TypeScript
- Express.js
- Prisma ORM
- AWS SDK
- Jest for testing
- ESLint & Prettier

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- AWS account with:
  - RDS access
  - Secrets Manager access
  - IAM user with appropriate permissions
- GitHub account with admin access to target organization
- Slack workspace (optional)
- Harvest account (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/oleg-kuibar/weekly-pr-reports.git
   cd weekly-pr-reports
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   # GitHub Configuration
   GITHUB_APP_ID=your_app_id
   GITHUB_PRIVATE_KEY=your_private_key
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret

   # AWS Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_RDS_SECRET_NAME=your_secret_name
   DATABASE_URL=postgresql://user:password@host:5432/database

   # App Configuration
   PORT=3000
   NODE_ENV=development
   ```

5. Run database migrations:
   ```bash
   pnpm prisma:migrate
   ```

## Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run linter
pnpm lint

# Build for production
pnpm build
```

## Project Structure

```
src/
├── config/         # Configuration files
├── constants/      # Constants and enums
├── domains/        # Domain-specific logic
├── lib/           # Shared libraries
├── middleware/    # Express middleware
├── routes/        # API routes
├── schemas/       # Validation schemas
├── services/      # Business logic
├── test/          # Test utilities
└── types/         # TypeScript types
```

## API Endpoints

### Reports

- `GET /api/reports/:organizationId` - Get reports for an organization
- `POST /api/reports/generate` - Generate a new report
- `GET /api/reports/:id` - Get a specific report

### GitHub Webhooks

- `POST /api/webhook` - GitHub webhook endpoint

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Set up AWS infrastructure:
   - Create RDS instance
   - Configure security groups
   - Set up Secrets Manager

3. Deploy using your preferred method:
   - AWS ECS/EKS
   - AWS EC2
   - Other cloud platforms

## GitHub App Setup

1. Create a new GitHub App:
   - Go to GitHub Developer Settings
   - Create New GitHub App
   - Configure permissions:
     - Repository: Read & Write
     - Organization: Read
   - Set webhook URL
   - Generate private key

2. Install the app:
   - Install in your organization
   - Select repositories
   - Configure settings

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
  </rewritten_file>
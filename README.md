# Weekly PR Reports

[![Website](https://github.com/oleg-kuibar/weekly-pr-reports/actions/workflows/website.yml/badge.svg)](https://github.com/oleg-kuibar/weekly-pr-reports/actions/workflows/website.yml)
[![App](https://github.com/oleg-kuibar/weekly-pr-reports/actions/workflows/github-app.yml/badge.svg)](https://github.com/oleg-kuibar/weekly-pr-reports/actions/workflows/github-app.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Automated time tracking for GitHub pull request reviews. Seamlessly integrates with Harvest and provides weekly reports.

## Features

- 📊 Weekly PR review time reports
- ⚡ Automatic time tracking
- 🔄 Harvest integration
- 💬 Slack notifications
- 📱 Mobile-friendly dashboard

## Project Structure

```
weekly-pr-reports/
├── apps/
│   ├── github-app/     # GitHub App backend (Express + Lambda)
│   └── website/        # Documentation website
├── docs/              # Project documentation
└── packages/          # Shared packages (future)
```

## Quick Start

1. **Prerequisites**
   - Node.js 18+
   - pnpm 9.14+
   - PostgreSQL 14+
   - GitHub account
   - AWS account (for production)
   - Harvest account (for time tracking)

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/oleg-kuibar/weekly-pr-reports.git
   cd weekly-pr-reports

   # Install dependencies
   pnpm install

   # Set up environment variables
   cp apps/github-app/.env.example apps/github-app/.env

   # Generate Prisma client
   pnpm --filter @weekly-pr-reports/github-app prisma:generate
   ```

3. **Configuration**
   - Set up GitHub App (see [AWS and GitHub App Setup](./docs/aws-github-setup.md))
   - Configure environment variables
   - Set up AWS resources for production

4. **Development**
   ```bash
   # Start GitHub App in development mode
   pnpm --filter @weekly-pr-reports/github-app dev

   # Run database migrations
   pnpm --filter @weekly-pr-reports/github-app prisma:migrate
   ```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Technical Architecture](./docs/technical-architecture.md)
- [AWS and GitHub App Setup](./docs/aws-github-setup.md)
- [Configuration](./docs/configuration.md)
- [API Reference](./docs/api-reference.md)
- [Contributing](./docs/contributing.md)

## Production Setup

1. **GitHub App**
   - Create GitHub App in your organization
   - Configure webhook and permissions
   - Generate private key and secrets
   - Install in repositories

2. **AWS Infrastructure**
   - Set up Lambda function
   - Configure API Gateway
   - Create RDS database
   - Set up CloudWatch monitoring

3. **Integrations**
   - Configure Harvest time tracking
   - Set up Slack notifications
   - Configure AWS Secrets Manager

See [Technical Architecture](./docs/technical-architecture.md) for detailed setup instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

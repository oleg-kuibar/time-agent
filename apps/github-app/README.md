# Git Time Harvest - GitHub App

The GitHub App component of Git Time Harvest that handles webhook events and time tracking.

## Features

- 🔄 GitHub webhook processing
- ⏱️ Automatic time tracking with Harvest
- 📊 Weekly report generation
- 🔔 Slack notifications
- 🗄️ PostgreSQL data storage

## Development

1. **Setup**
   ```bash
   # Install dependencies
   pnpm install

   # Set up environment
   cp .env.example .env

   # Generate Prisma client
   pnpm prisma:generate
   ```

2. **Configuration**
   Update `.env` with your credentials:
   ```env
   GITHUB_APP_ID=your_app_id
   GITHUB_PRIVATE_KEY=your_private_key
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   ```

3. **Database**
   ```bash
   # Run migrations
   pnpm prisma:migrate

   # Start Prisma Studio
   pnpm prisma:studio
   ```

4. **Development Server**
   ```bash
   pnpm dev
   ```

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Production

1. **Build**
   ```bash
   pnpm build
   ```

2. **Deploy**
   - Configure AWS Lambda
   - Set up API Gateway
   - Update environment variables

## Architecture

- Express.js server
- AWS Lambda integration
- PostgreSQL database
- Prisma ORM
- TypeScript

## API Endpoints

- `POST /api/webhook` - GitHub webhook handler
- `GET /api/reports` - Weekly reports
- `GET /health` - Health check

## Environment Variables

See [.env.example](.env.example) for all required variables.

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

## License

MIT - see [LICENSE](../../LICENSE)
  </rewritten_file>
# Configuration Guide

This guide covers the configuration steps needed to set up Weekly PR Reports.

## Environment Variables

### GitHub App Configuration

```env
# Required GitHub App credentials
GITHUB_APP_ID=your_app_id
GITHUB_PRIVATE_KEY=your_private_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### AWS Configuration

```env
# AWS credentials and settings
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_RDS_SECRET_NAME=your_secret_name
DATABASE_URL=postgresql://user:password@host:5432/database
```

### App Configuration

```env
# Application settings
PORT=3000
NODE_ENV=development|production|test
```

## GitHub App Setup

1. Create a new GitHub App:
   - Go to GitHub Developer Settings > GitHub Apps
   - Click "New GitHub App"
   - Fill in the basic information:
     - Name: "Weekly PR Reports"
     - Homepage URL: Your app's URL
     - Webhook URL: `https://your-domain.com/api/webhook`

2. Configure permissions:
   - Repository permissions:
     - Pull requests: Read & Write
     - Contents: Read
     - Issues: Read
     - Metadata: Read
   - Organization permissions:
     - Members: Read

3. Subscribe to events:
   - Pull request
   - Pull request review
   - Pull request review comment

4. Generate and download the private key

5. Install the app in your organization:
   - Select repositories
   - Grant necessary permissions

## AWS Setup

### RDS Database

1. Create a PostgreSQL instance:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier weekly-pr-reports \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password your_password \
     --allocated-storage 20
   ```

2. Configure security groups:
   - Allow inbound traffic on port 5432
   - Restrict to your application's IP

3. Create database and user:
   ```sql
   CREATE DATABASE weekly_pr_reports;
   CREATE USER app_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE weekly_pr_reports TO app_user;
   ```

### Secrets Manager

1. Create a new secret:
   ```bash
   aws secretsmanager create-secret \
     --name weekly-pr-reports/database \
     --secret-string '{"username":"app_user","password":"your_password"}'
   ```

2. Configure IAM permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "secretsmanager:GetSecretValue"
         ],
         "Resource": "arn:aws:secretsmanager:*:*:secret:weekly-pr-reports/*"
       }
     ]
   }
   ```

## Integrations

### Harvest Integration

1. Create a Harvest account
2. Create a new OAuth2 application
3. Configure environment variables:
   ```env
   HARVEST_ACCOUNT_ID=your_account_id
   HARVEST_ACCESS_TOKEN=your_access_token
   ```

### Slack Integration

1. Create a Slack app
2. Add webhook URL
3. Configure environment variable:
   ```env
   SLACK_WEBHOOK_URL=your_webhook_url
   ```

## Development Configuration

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment:
   ```bash
   cp .env.example .env
   ```

3. Configure database:
   ```bash
   pnpm prisma:migrate
   pnpm prisma:generate
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```

## Production Configuration

1. Set secure environment variables
2. Configure SSL/TLS
3. Set up monitoring and logging
4. Configure backup strategy
5. Set up CI/CD pipeline

## Testing Configuration

1. Create test database
2. Configure test environment:
   ```bash
   cp .env.example .env.test
   ```

3. Run tests:
   ```bash
   pnpm test
   ```

## Troubleshooting

### Common Issues

1. Database Connection:
   - Check DATABASE_URL format
   - Verify security group rules
   - Test connection with psql

2. GitHub App:
   - Verify webhook URL
   - Check permissions
   - Validate private key format

3. AWS Access:
   - Verify IAM permissions
   - Check region configuration
   - Validate credentials

### Getting Help

- Check GitHub Issues
- Review error logs
- Contact support
# AWS Lambda and GitHub App Setup

## GitHub App Configuration

1. **Create GitHub App**
   - Go to GitHub.com > Settings > Developer Settings > GitHub Apps
   - Click "New GitHub App"
   - Fill in basic information:
     ```
     Name: Weekly PR Reports
     Homepage URL: Your website URL
     Webhook URL: Your API Gateway URL (from AWS setup)
     Webhook Secret: Generate with `openssl rand -hex 20`
     ```

2. **Set Permissions**
   - Repository permissions:
     - Pull requests: Read & Write
     - Contents: Read
     - Issues: Read
     - Metadata: Read
   - Organization permissions:
     - Members: Read
   - Subscribe to events:
     - Pull request
     - Pull request review
     - Installation

3. **Generate Private Key**
   - After creating the app, scroll to "Private keys"
   - Click "Generate a private key"
   - Save the downloaded .pem file securely

4. **Get App Credentials**
   ```env
   GITHUB_APP_ID=<from app settings>
   GITHUB_PRIVATE_KEY=<from downloaded .pem file>
   GITHUB_WEBHOOK_SECRET=<generated secret>
   GITHUB_CLIENT_ID=<from app settings>
   GITHUB_CLIENT_SECRET=<from app settings>
   ```

## AWS Setup

1. **Create IAM Role**
   - Name: `github-app-webhook-lambda-role`
   - Trusted entity: Lambda
   - Attach policies:
     - `AWSLambdaBasicExecutionRole`
     - `CloudWatchFullAccess`

2. **Create Lambda Function**
   - Name: `github-app-webhook-handler`
   - Runtime: Node.js 18.x
   - Architecture: x86_64
   - Existing role: `github-app-webhook-lambda-role`
   - Memory: 128 MB
   - Timeout: 30 seconds

3. **Configure API Gateway**
   - Create REST API
   - Create resource `/webhook`
   - Add POST method
   - Integration type: Lambda Function
   - Deploy API to stage (e.g., 'prod')

4. **Environment Variables**
   Set these in Lambda configuration:
   ```env
   GITHUB_APP_ID=<your-app-id>
   GITHUB_PRIVATE_KEY=<your-private-key>
   GITHUB_WEBHOOK_SECRET=<your-webhook-secret>
   GITHUB_CLIENT_ID=<your-client-id>
   GITHUB_CLIENT_SECRET=<your-client-secret>
   ```

## Testing

1. **Test Lambda Function**
   ```bash
   # Set AWS credentials
   export AWS_ACCESS_KEY_ID=your-access-key
   export AWS_SECRET_ACCESS_KEY=your-secret-key
   export AWS_REGION=us-east-1

   # Watch logs
   aws logs tail /aws/lambda/github-app-webhook-handler --follow
   ```

2. **Test GitHub Webhook**
   - Go to GitHub App settings
   - Scroll to Recent Deliveries
   - Click "Redeliver" on any delivery
   - Check "Response" tab for status
   - Check CloudWatch logs for details

3. **Trigger Test Event**
   - Create a test PR in your repository
   - Add a review comment
   - Check logs for webhook processing

## Troubleshooting

1. **Common Issues**
   - Invalid webhook signature
     - Check `GITHUB_WEBHOOK_SECRET` matches in both places
     - Ensure secret is properly formatted
   - Lambda timeout
     - Increase timeout in Lambda configuration
     - Check for long-running operations
   - Permission issues
     - Verify IAM role permissions
     - Check GitHub App permissions

2. **Logging**
   - CloudWatch Log Group: `/aws/lambda/github-app-webhook-handler`
   - View logs in AWS Console or using AWS CLI
   - Check for error messages and stack traces

3. **Monitoring**
   - Set up CloudWatch Alarms for:
     - Error rates
     - Latency
     - Invocation count
     - Memory usage

## Security Best Practices

1. **Secrets Management**
   - Use AWS Secrets Manager for sensitive values
   - Rotate GitHub webhook secret periodically
   - Keep private key secure

2. **Access Control**
   - Limit IAM role permissions
   - Use least privilege principle
   - Regular security audits

3. **Monitoring**
   - Enable CloudWatch logging
   - Set up alerts for suspicious activity
   - Regular review of access logs 
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_APP_ID: string
      GITHUB_APP_PRIVATE_KEY: string
      GITHUB_WEBHOOK_SECRET: string
      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
      AWS_REGION: string
      AWS_ACCESS_KEY_ID: string
      AWS_SECRET_ACCESS_KEY: string
      AWS_RDS_SECRET_NAME: string
      DATABASE_URL: string
      HARVEST_ACCOUNT_ID: string
      HARVEST_ACCESS_TOKEN: string
      HARVEST_PROJECT_ID: string
      HARVEST_TASK_ID: string
      SLACK_WEBHOOK_URL: string
      NODE_ENV: 'development' | 'production' | 'test'
      PORT?: string
      CRON_SCHEDULE: string
      CLEANUP_CRON_SCHEDULE: string
      DATA_RETENTION_DAYS?: string
      REPORT_RETENTION_DAYS?: string
    }
  }
}

export {}

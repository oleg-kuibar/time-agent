declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_APP_ID: string;
      GITHUB_APP_PRIVATE_KEY: string;
      GITHUB_WEBHOOK_SECRET: string;
      DATABASE_URL: string;
      HARVEST_ACCOUNT_ID: string;
      HARVEST_ACCESS_TOKEN: string;
      HARVEST_PROJECT_ID: string;
      HARVEST_TASK_ID: string;
      SLACK_WEBHOOK_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
    }
  }
}

export {}; 
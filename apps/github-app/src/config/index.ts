import { z } from 'zod'

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  // GitHub
  GITHUB_APP_ID: z.string(),
  GITHUB_PRIVATE_KEY: z.string(),
  GITHUB_WEBHOOK_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  // AWS
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_RDS_SECRET_NAME: z.string(),
  DATABASE_URL: z.string(),

  // Harvest
  HARVEST_ACCOUNT_ID: z.string(),
  HARVEST_ACCESS_TOKEN: z.string(),
  HARVEST_PROJECT_ID: z.string(),
  HARVEST_TASK_ID: z.string(),

  // Slack
  SLACK_WEBHOOK_URL: z.string()
})

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      JSON.stringify(parsed.error.format(), null, 2)
    )
    process.exit(1)
  }
  return parsed.data
}

export const config = parseEnv()

export const isDev = config.NODE_ENV === 'development'
export const isProd = config.NODE_ENV === 'production'
export const isTest = config.NODE_ENV === 'test'

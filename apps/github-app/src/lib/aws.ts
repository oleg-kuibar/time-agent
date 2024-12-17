import { RDS } from '@aws-sdk/client-rds'
import { SecretsManager } from '@aws-sdk/client-secrets-manager'
import { awsConfig } from '@config/aws'

export const rds = new RDS(awsConfig)
export const secretsManager = new SecretsManager(awsConfig)

interface DatabaseSecret {
  username: string
  password: string
  engine: string
  host: string
  port: number
  dbname?: string
}

export async function getDatabaseSecret(): Promise<DatabaseSecret> {
  const { GetSecretValueCommand } = await import('@aws-sdk/client-secrets-manager')
  const command = new GetSecretValueCommand({
    SecretId: process.env.AWS_RDS_SECRET_NAME
  })

  const response = await secretsManager.send(command)
  return JSON.parse(response.SecretString || '{}') as DatabaseSecret
}

import type { RDSClientConfig } from '@aws-sdk/client-rds'
import type { SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager'
import { config } from '@/config'

export const awsConfig: RDSClientConfig & SecretsManagerClientConfig = {
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  }
}

export const rdsSecretName = config.AWS_RDS_SECRET_NAME

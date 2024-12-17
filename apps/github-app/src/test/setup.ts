import { config } from 'dotenv'
import { resolve } from 'path'

// Load test environment variables
config({ path: resolve(__dirname, '../../.env.test') })

// Set default environment variables for tests
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  PORT: '3000'
}

// Mock AWS SDK clients
jest.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManager: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({
      SecretString: JSON.stringify({
        username: 'test',
        password: 'test',
        host: 'localhost',
        port: 5432,
        dbname: 'test'
      })
    })
  })),
  GetSecretValueCommand: jest.fn()
}))

jest.mock('@aws-sdk/client-rds', () => ({
  RDS: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({
      DBInstances: [
        {
          Endpoint: {
            Address: 'localhost',
            Port: 5432
          }
        }
      ]
    })
  })),
  DescribeDBInstancesCommand: jest.fn()
}))

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    organization: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    repository: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    pullRequest: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn()
    },
    weeklyReport: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn()
    }
  }

  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  }
})

// Mock logger
jest.mock('@lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}))

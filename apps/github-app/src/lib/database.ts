import { getDatabaseSecret } from './aws'
import { logger } from './logger'

interface DatabaseSecret {
  username: string
  password: string
  host: string
  port: string | number
  dbname: string
}

export async function getDatabaseUrl() {
  try {
    const secret = await getDatabaseSecret()
    const dbSecret = secret as DatabaseSecret

    return `postgresql://${dbSecret.username}:${dbSecret.password}@${dbSecret.host}:${dbSecret.port}/${dbSecret.dbname}`
  } catch (error) {
    logger.error('Failed to get database credentials:', error)
    throw error
  }
}

export async function initializeDatabase() {
  try {
    const url = await getDatabaseUrl()
    ;(process.env as { DATABASE_URL?: string }).DATABASE_URL = url
    logger.info('Database configuration initialized')
  } catch (error) {
    logger.error('Failed to initialize database:', error)
    throw error
  }
}

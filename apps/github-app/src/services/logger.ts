import winston from 'winston';

// Configure log format for AWS CloudWatch compatibility
const awsLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      // AWS CloudWatch specific fields
      awsRegion: process.env.AWS_REGION,
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      requestId: process.env.AWS_REQUEST_ID,
      ...meta
    });
  })
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: awsLogFormat,
  defaultMeta: {
    service: 'weekly-pr-reports',
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add file transport only in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error' 
  }));
  logger.add(new winston.transports.File({ 
    filename: 'logs/combined.log' 
  }));
}

export { logger }; 
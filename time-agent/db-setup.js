// Load environment variables from .env.local
import { config } from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
config({ path: path.join(__dirname, '.env.local') });

// Set NODE_ENV if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

console.log('Environment variables loaded from .env.local');
console.log('Running database push command...');

try {
  // Run the database push command with the loaded environment variables
  execSync('pnpm drizzle-kit push', { 
    stdio: 'inherit',
    env: process.env
  });
  console.log('Database push completed successfully!');
} catch (error) {
  console.error('Error running database push:', error.message);
  process.exit(1);
} 
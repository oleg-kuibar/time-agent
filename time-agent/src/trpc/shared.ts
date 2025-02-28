/**
 * Utility function to get the base URL for API requests
 */
export function getUrl() {
  // In browser, use relative URL
  if (typeof window !== 'undefined') return '';
  
  // In server, use absolute URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/trpc`;
  }
  
  // Fallback to localhost
  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;
} 
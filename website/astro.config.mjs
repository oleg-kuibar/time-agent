import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import million from 'million/compiler';
import MillionLint from '@million/lint';

export default defineConfig({
  integrations: [react(), tailwind(), MillionLint.astro()],
  site: process.env.SITE_URL || 'https://your-domain.com',
  base: '/weekly-pr-reports',
  server: {
    port: parseInt(process.env.PORT || '3333'),
    host: process.env.HOST === 'true'
  },
  vite: {
    plugins: [million.vite({ mode: 'react', server: true, auto: true })],
    envPrefix: 'PUBLIC_'
  }
}); 
import process from 'node:process'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import MillionLint from '@million/lint'
import { defineConfig } from 'astro/config'
import million from 'million/compiler'

export default defineConfig({
  integrations: [react(), tailwind(), MillionLint.astro()],
  site: process.env.SITE_URL || 'https://your-domain.com',
  base: '/weekly-pr-reports',
  server: {
    port: Number.parseInt(process.env.PORT || '3333'),
    host: process.env.HOST === 'true',
  },
  vite: {
    plugins: [million.vite({ mode: 'react', server: true, auto: true })],
    envPrefix: 'PUBLIC_',
  },
})

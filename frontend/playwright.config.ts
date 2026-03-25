import { defineConfig } from '@playwright/test'

export default defineConfig({
  // E2E test files location
  testDir: './src/tests/e2e',

  // Run tests sequentially so login state is predictable
  workers: 1,

  // Retry once on CI to handle flakiness
  retries: 1,

  // HTML report saved to playwright-report/
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // Base URL — must match your running Vite dev server
    baseURL: 'http://localhost:5173',

    // Keep browser open briefly on failure for debugging
    trace: 'on-first-retry',

    // Headless by default; set to false to watch tests run
    headless: true,
  },
})

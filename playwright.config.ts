import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config
 * Docs → https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail on test.only in CI */
  forbidOnly: !!process.env.CI,

  /* Retries only on CI */
  retries: process.env.CI ? 2 : 0,

  /* Serial execution on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporters */
  reporter: [
    ['html'],
    ['allure-playwright']
  ],             // ← ⬅️  aquí faltaba la coma

  /* Shared settings */
  use: {
    // baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },

  /* Browser projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]

  /* Dev-server example
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
  */
});

import { defineConfig, devices } from '@playwright/test';
import { ENV, RUNNER } from './configs/environments';

export default defineConfig({
  testDir: './tests',
  fullyParallel: RUNNER.fullyParallel,
  forbidOnly: !!process.env.CI,
  retries: RUNNER.retries,
  workers: process.env.CI ? 1 : RUNNER.workers,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: ENV.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'reports/test-results',
});

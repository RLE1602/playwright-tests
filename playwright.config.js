// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/Regression/CoreScenarios',
  timeout: 300_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : 4,

  // Output folder for screenshots/videos/traces
  outputDir: process.env.PREVIEW_DIR || 'previews/default',

  use: {
    baseURL: 'https://stage-shop.phenomenex.com',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    slowMo: process.env.CI ? 0 : 200,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on',
    actionTimeout: process.env.CI ? 120_000 : 30_000,
    navigationTimeout: process.env.CI ? 180_000 : 60_000,
  },

  reporter: [
    ['html', { outputFolder: 'regression-report', open: 'never' }],
    ['list'],
    ['json', {
      outputFile: 'test-results.json',
      outputFolder: process.env.PREVIEW_DIR || 'previews/default'
    }]
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add other browsers if needed
  ],
});

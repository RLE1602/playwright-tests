// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: 'tests/Regression/CoreScenarios',
  timeout: 300_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : 4,

  /* Use PREVIEW_DIR for outputs, fallback to 'test-results' */
  outputDir: process.env.PREVIEW_DIR || 'test-results',

  reporter: [
    ['html', { outputFolder: 'regression-report', open: 'never' }],
    ['list'],
    ['json', {
      outputFile: 'test-results.json',
      outputFolder: process.env.PREVIEW_DIR || 'test-results'
    }]
  ],

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

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add other browsers if needed
  ],
});

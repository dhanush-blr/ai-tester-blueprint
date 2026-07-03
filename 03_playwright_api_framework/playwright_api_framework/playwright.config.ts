import { defineConfig } from '@playwright/test';
import { validateEnvironment } from './src/core/env.config';

validateEnvironment();

const environment = process.env.ENVIRONMENT ?? 'dev';

const baseURLs: Record<string, string> = {
  dev: process.env.BASE_URL_DEV ?? '',
  qa: process.env.BASE_URL_QA ?? '',
  staging: process.env.BASE_URL_STAGING ?? '',
};

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  use: {
    baseURL: baseURLs[environment],
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/*.spec.ts',
    },
  ],
});

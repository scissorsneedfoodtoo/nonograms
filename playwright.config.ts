import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config. The suite builds the app and serves the production bundle via
 * `vite preview`, then runs against it so tests exercise the real build.
 *
 * Two projects:
 *  - `mobile`  : iPhone-SE-sized viewport with touch; runs mobile.spec.ts only.
 *  - `desktop` : Desktop Chrome; runs everything except mobile.spec.ts.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
    },
    {
      name: 'mobile',
      testMatch: /mobile\.spec\.ts/,
      // iPhone SE dimensions — the narrowest screen we support (375px).
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    }
  ],
  webServer: {
    command: 'pnpm build && pnpm exec vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});

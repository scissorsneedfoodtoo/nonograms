import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config. The suite builds the app and serves the production bundle via
 * `vite preview`, then runs against it so tests exercise the real build.
 *
 * Every spec (except mobile.spec.ts) runs on three desktop engines — Chromium,
 * Firefox, and WebKit (Safari) — so behavior stays consistent across browsers.
 * mobile.spec.ts runs on a mobile viewport in both Chromium and WebKit.
 *
 * Projects:
 *  - `desktop-chromium` / `desktop-firefox` / `desktop-webkit`
 *      1280x800 desktop viewport; run everything except mobile.spec.ts.
 *  - `mobile-chrome` / `mobile-safari`
 *      iPhone-SE-sized viewport with touch; run mobile.spec.ts only.
 */

// iPhone SE dimensions — the narrowest screen we support (375px).
const mobileViewport = {
  viewport: { width: 375, height: 667 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop-chromium',
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'desktop-firefox',
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'desktop-webkit',
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile-chrome',
      testMatch: /mobile\.spec\.ts/,
      use: { browserName: 'chromium', ...mobileViewport },
    },
    {
      name: 'mobile-safari',
      testMatch: /mobile\.spec\.ts/,
      // WebKit supports isMobile/hasTouch, so it mirrors mobile-chrome exactly
      // apart from the rendering engine.
      use: { browserName: 'webkit', ...mobileViewport },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm exec vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

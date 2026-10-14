import { defineConfig, devices } from '@playwright/test'

// Local-only e2e suite, run against the OpenNext preview (the Workers runtime),
// not `next dev`. The preview builds first, hence the long server timeout.
const PORT = 8787
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: `${BASE_URL}/fr`,
    reuseExistingServer: true,
    timeout: 10 * 60 * 1000,
  },
})

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    globalSetup: require.resolve('./tests/global-setup.js'),
    testDir: './tests/e2e',
    fullyParallel: true,
    timeout: 120 * 1000,
    globalTimeout: 600 * 1000,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off'
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        stdout: 'ignore',
        stderr: 'pipe'
    }
});

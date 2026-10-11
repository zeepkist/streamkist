import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	testMatch: '**/*.pw.ts',
	workers: 1,
	forbidOnly: Boolean(process.env.CI),
	timeout: 45000,
	use: {
		baseURL: 'http://127.0.0.1:4173',
		channel: process.env.PLAYWRIGHT_CHANNEL,
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		viewport: { width: 1440, height: 1000 },
	},
	webServer: {
		command: 'bun run preview',
		url: 'http://127.0.0.1:4173',
		env: { PORT: '4173' },
		reuseExistingServer: !process.env.CI,
	},
})

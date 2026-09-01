import { defineConfig, devices } from "@playwright/test";

/**
 * Konfigurasi Playwright E2E Test Suite TruBrush
 */
export default defineConfig({
	testDir: "./tests",
	/* Jalankan sekuensial agar session login antar role tidak bentrok */
	fullyParallel: false,
	/* Jangan izinkan test.only di server CI */
	forbidOnly: !!process.env.CI,
	/* Retry hanya di CI untuk mitigasi network lag */
	retries: process.env.CI ? 2 : 0,
	/* 1 worker agar stabil dan deterministik */
	workers: 1,
	/* Reporter HTML interaktif */
	reporter: [["html", { open: "never" }], ["list"]],
	/* Shared settings */
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
		actionTimeout: 10000,
		navigationTimeout: 15000,
	},

	/* Konfigurasi Browser */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	/* Menjalankan Next.js dev server otomatis jika belum berjalan */
	webServer: {
		command: "bun run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});

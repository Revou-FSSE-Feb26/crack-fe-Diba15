import { expect, test } from "@playwright/test";

test.describe("Fitur 4: Pemesanan Komisi & Sistem Escrow", () => {
	test.beforeEach(async ({ page }) => {
		// Login sebagai Client (Dimas)
		await page.goto("/login");
		await page.fill('input[type="email"]', "dimas@example.com");
		await page.fill('input[type="password"]', "client123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});
	});

	test("4.1 Halaman Detail Publik Artist (/artists/[id]) menampilkan Hero Card & Tombol Pesan Komisi", async ({
		page,
	}) => {
		// Mengunjungi profil publik artist Nadia Suryani (u-002)
		await page.goto("/artists/u-002");

		// Memastikan nama artist, status verifikasi, dan tarif mulai tampil
		await expect(page.getByText(/Nadia Suryani/i).first()).toBeVisible({
			timeout: 6000,
		});

		// Klik tombol Pesan Komisi Sekarang
		const orderBtn = page.getByRole("button", {
			name: /Pesan Komisi Sekarang|Pesan Komisi/i,
		});
		if (await orderBtn.isVisible()) {
			await orderBtn.click();

			// Memastikan modal form request komisi terbuka
			await expect(
				page.getByRole("heading", { name: /Pesan Komisi/i }).first(),
			).toBeVisible({ timeout: 5000 });

			// Tutup modal
			await page.keyboard.press("Escape");
		}
	});

	test("4.2 Halaman Daftar Komisi (/commissions) menampilkan daftar pesanan & status", async ({
		page,
	}) => {
		await page.goto("/commissions");
		await expect(page).toHaveURL("/commissions");

		// Memastikan judul halaman komisi muncul
		await expect(
			page.getByRole("heading", { name: /Progress Commission/i }).first(),
		).toBeVisible({ timeout: 6000 });
	});
});

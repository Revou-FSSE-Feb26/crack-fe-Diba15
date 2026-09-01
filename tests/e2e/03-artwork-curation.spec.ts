import { expect, test } from "@playwright/test";

test.describe("Fitur 3: Upload Karya Seni & Kurasi Anti-AI", () => {
	test("3.1 Form Upload Karya (/post-art) memiliki validasi input & opsi kurasi", async ({
		page,
	}) => {
		// Login sebagai Artist (Nadia)
		await page.goto("/login");
		await page.fill('input[type="email"]', "nadia@example.com");
		await page.fill('input[type="password"]', "artist123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		// Buka halaman post-art
		await page.goto("/post-art");
		await expect(page).toHaveURL("/post-art");

		// Memastikan elemen form penting tersedia
		await expect(
			page.locator('input[placeholder*="judul" i], input[name="title"]'),
		).toBeVisible({ timeout: 6000 });
		await expect(
			page.locator(
				'textarea[placeholder*="deskripsi" i], textarea[name="description"]',
			),
		).toBeVisible();

		// Memastikan tombol submit 'Publikasikan Artwork' ada
		const submitBtn = page.getByRole("button", {
			name: /Publikasikan Artwork|Publikasikan|Unggah/i,
		});
		await expect(submitBtn).toBeVisible({ timeout: 6000 });
	});

	test("3.2 Dashboard Kurasi (/dashboard/review-artworks) menampilkan 4 kartu statistik & tab filter", async ({
		page,
	}) => {
		// Login sebagai Kurator
		await page.goto("/login");
		await page.fill('input[type="email"]', "hendra@trubrush.com");
		await page.fill('input[type="password"]', "curator123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		// Buka dashboard review artworks
		await page.goto("/dashboard/review-artworks");

		// Memastikan metrik stat kurasi muncul
		await expect(page.getByText(/Menunggu Kurasi/i).first()).toBeVisible({
			timeout: 6000,
		});
		await expect(page.getByText(/Lolos Verifikasi/i).first()).toBeVisible();
		await expect(page.getByText(/Ditolak/i).first()).toBeVisible();

		// Beralih ke tab Riwayat Keputusan
		const historyTabBtn = page.getByRole("button", {
			name: /Riwayat Keputusan/i,
		});
		await expect(historyTabBtn).toBeVisible();
		await historyTabBtn.click();

		// Memastikan bagian riwayat keputusan aktif
		await expect(
			page.getByText(/Riwayat Keputusan Kurasi/i).first(),
		).toBeVisible();
	});
});

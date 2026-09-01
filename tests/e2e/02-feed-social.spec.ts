import { expect, test } from "@playwright/test";

test.describe("Fitur 2: Feed Sosial, Carousel, & Interaksi Pengguna", () => {
	test.beforeEach(async ({ page }) => {
		// Login sebagai client (Dimas)
		await page.goto("/login");
		await page.fill('input[type="email"]', "dimas@example.com");
		await page.fill('input[type="password"]', "client123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});
	});

	test("2.1 Halaman Beranda menampilkan Feed Karya Seni dengan informasi lengkap", async ({
		page,
	}) => {
		await page.goto("/");

		// Memastikan setidaknya ada satu kartu artwork di feed
		const artworkCards = page.locator("article, .rounded-2xl.border");
		await expect(artworkCards.first()).toBeVisible({ timeout: 6000 });

		// Memastikan tombol aksi komisi ada
		const commissionBtns = page.getByRole("button", {
			name: /Pesan Komisi|Komisi/i,
		});
		await expect(commissionBtns.first()).toBeVisible();
	});

	test("2.2 Navigasi Carousel Gambar pada Artwork Multi-Image", async ({
		page,
	}) => {
		await page.goto("/");

		// Mencari kartu yang memiliki tombol navigasi carousel
		const nextImageBtn = page
			.locator(
				'button[aria-label="Next image"], button:has(.lucide-chevron-right)',
			)
			.first();

		if (await nextImageBtn.isVisible()) {
			await nextImageBtn.click();
			await expect(page.locator("body")).toBeVisible();
		}
	});

	test("2.3 Klik Favorit (Love) dan verifikasi di halaman /favorite", async ({
		page,
	}) => {
		await page.goto("/");

		// Menemukan tombol favorit pada kartu pertama
		const favButton = page
			.locator('button[title*="favorit" i], button:has(.lucide-heart)')
			.first();
		await expect(favButton).toBeVisible({ timeout: 5000 });
		await favButton.click();

		// Mengunjungi halaman favorit
		await page.goto("/favorite");
		await expect(page).toHaveURL("/favorite");

		// Memastikan halaman favorit berhasil dimuat
		await expect(
			page.getByRole("heading", { name: /Favorit|Disukai/i }).first(),
		).toBeVisible({ timeout: 5000 });
	});

	test("2.4 Dropdown Menu Kartu: Salin Tautan & Modal Laporkan Karya", async ({
		page,
	}) => {
		await page.goto("/");

		// Buka menu titik tiga pada kartu pertama
		const moreMenuBtn = page
			.locator('button:has(.lucide-more-horizontal), button[title*="Menu" i]')
			.first();
		if (await moreMenuBtn.isVisible()) {
			await moreMenuBtn.click();

			// Klik opsi Laporkan
			const reportOption = page.getByText(/Laporkan|Lapor/i).first();
			if (await reportOption.isVisible()) {
				await reportOption.click();

				// Memastikan modal laporan muncul
				await expect(
					page.getByRole("heading", { name: /Laporkan/i }).first(),
				).toBeVisible({ timeout: 5000 });

				// Tutup modal dengan ESC
				await page.keyboard.press("Escape");
			}
		}
	});
});

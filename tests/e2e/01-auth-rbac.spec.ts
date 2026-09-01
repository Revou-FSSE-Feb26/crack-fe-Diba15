import { expect, test } from "@playwright/test";

test.describe("Fitur 1: Autentikasi & Role-Based Access Control (RBAC)", () => {
	test("1.1 Validasi form login menampilkan error saat kredensial salah", async ({
		page,
	}) => {
		await page.goto("/login");

		// Mengisi email & password salah
		await page.fill('input[type="email"]', "wrong@example.com");
		await page.fill('input[type="password"]', "wrongpassword");
		await page.click('button[type="submit"]');

		// Memastikan pesan error atau toast muncul
		const errorFeedback = page.locator(
			".toast, .alert, .text-danger, .text-error",
		);
		await expect(errorFeedback.first()).toBeVisible({ timeout: 6000 });
	});

	test("1.2 Login berhasil sebagai Artist dan menampilkan sesi profil", async ({
		page,
	}) => {
		await page.goto("/login");

		// Login dengan akun artist (Nadia)
		await page.fill('input[type="email"]', "nadia@example.com");
		await page.fill('input[type="password"]', "artist123");
		await page.click('button[type="submit"]');

		// Memastikan berpindah dari login
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		// Memastikan profil pengguna aktif
		await page.goto("/profile");
		await expect(page.getByText("Nadia Suryani").first()).toBeVisible({
			timeout: 8000,
		});
	});

	test("1.3 Role Guard: Akun Client dilarang mengakses Dashboard Kurasi Artwork (Redirect / AccessDenied)", async ({
		page,
	}) => {
		// Login sebagai Client (Dimas Prasetyo)
		await page.goto("/login");
		await page.fill('input[type="email"]', "dimas@example.com");
		await page.fill('input[type="password"]', "client123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		// Akses paksa halaman kurator
		await page.goto("/dashboard/review-artworks");

		// Middleware otomatis redirect ke / atau komponen menampilkan AccessDenied
		const currentUrl = page.url();
		if (currentUrl.includes("/dashboard")) {
			await expect(
				page
					.getByText(
						/Akses Dibatasi|Akses Ditolak|hanya dapat diakses oleh akun Kurator/i,
					)
					.first(),
			).toBeVisible({ timeout: 8000 });
		} else {
			// Berhasil diproteksi dan diarahkan keluar dari dashboard
			expect(currentUrl).not.toContain("/dashboard/review-artworks");
		}
	});

	test("1.4 Role Guard: Akun Kurator diizinkan mengakses Dashboard Kurasi Artwork", async ({
		page,
	}) => {
		// Login sebagai Kurator (Hendra Kurniawan)
		await page.goto("/login");
		await page.fill('input[type="email"]', "hendra@trubrush.com");
		await page.fill('input[type="password"]', "curator123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		// Buka halaman kurasi
		await page.goto("/dashboard/review-artworks");

		// Memastikan header halaman kurasi tampil
		await expect(
			page.getByRole("heading", { name: /Kurasi Karya|Review/i }).first(),
		).toBeVisible({ timeout: 8000 });
	});
});

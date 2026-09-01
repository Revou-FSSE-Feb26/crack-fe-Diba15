import { expect, test } from "@playwright/test";

test.describe("Fitur 5: Konsistensi UI/UX & Standar Responsif", () => {
	test("5.1 Uji Responsif Mobile (375px): Bebas dari kebocoran horizontal scroll", async ({
		page,
	}) => {
		// Set ukuran layar ke mobile standar (iPhone SE: 375x667)
		await page.setViewportSize({ width: 375, height: 667 });

		const pagesToTest = ["/", "/help", "/about"];

		for (const path of pagesToTest) {
			await page.goto(path);
			await page.waitForLoadState("domcontentloaded");

			// Memeriksa apakah ada elemen yang lebarnya melebihi lebar layar (overflow-x leak)
			const isOverflowing = await page.evaluate(() => {
				return (
					document.documentElement.scrollWidth >
					document.documentElement.clientWidth + 5
				);
			});

			expect(
				isOverflowing,
				`Terjadi horizontal scroll bocor pada halaman ${path} di viewport mobile 375px`,
			).toBe(false);
		}
	});

	test("5.2 Konsistensi Modal: Menekan tombol ESC berhasil menutup modal", async ({
		page,
	}) => {
		// Login sebagai artist (Nadia)
		await page.goto("/login");
		await page.fill('input[type="email"]', "nadia@example.com");
		await page.fill('input[type="password"]', "artist123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		await page.goto("/profile");

		// Buka modal Edit Profil
		const editBtn = page.getByRole("button", { name: /Edit Profil/i });
		await expect(editBtn).toBeVisible({ timeout: 8000 });
		await editBtn.click();

		// Pastikan modal muncul
		const modalHeading = page.getByRole("heading", {
			name: /Edit Profil/i,
		});
		await expect(modalHeading).toBeVisible({ timeout: 5000 });

		// Tekan tombol ESC
		await page.keyboard.press("Escape");

		// Pastikan modal tertutup
		await expect(modalHeading).toBeHidden({ timeout: 5000 });
	});
});

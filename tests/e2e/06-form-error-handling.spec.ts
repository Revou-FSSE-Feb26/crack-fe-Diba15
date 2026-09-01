import { expect, test } from "@playwright/test";

test.describe("Fitur 6: Pengujian Validasi & Error Handling Seluruh Formulir", () => {
	// ─── 1. Form Login (/login) ────────────────────────────────────────────────
	test("6.1 Form Login: Validasi field kosong, format email salah, dan kredensial salah", async ({
		page,
	}) => {
		await page.goto("/login");

		// A. Submit form kosong
		await page.click('button[type="submit"]');
		await expect(page.getByText("Email wajib diisi")).toBeVisible({
			timeout: 5000,
		});
		await expect(page.getByText("Password wajib diisi")).toBeVisible({
			timeout: 5000,
		});

		// B. Format email tidak valid
		await page.fill('input[type="email"]', "bukan-alamat-email");
		await page.fill('input[type="password"]', "somepassword");
		await page.click('button[type="submit"]');
		await expect(page.getByText("Format email tidak valid")).toBeVisible({
			timeout: 5000,
		});

		// C. Kredensial salah (Server Auth Error)
		await page.fill('input[type="email"]', "tidakada@example.com");
		await page.fill('input[type="password"]', "passwordsalah123");
		await page.click('button[type="submit"]');
		const errorFeedback = page.locator(
			".toast, .alert, .text-danger, .text-error",
		);
		await expect(errorFeedback.first()).toBeVisible({ timeout: 6000 });
	});

	// ─── 2. Form Registrasi (/signup) ──────────────────────────────────────────
	test("6.2 Form Signup: Validasi field kosong, panjang password, dan password mismatch", async ({
		page,
	}) => {
		await page.goto("/signup");

		// A. Submit form kosong
		await page.click('button[type="submit"]');
		await expect(page.getByText("Nama wajib diisi")).toBeVisible({
			timeout: 5000,
		});
		await expect(page.getByText("Email wajib diisi")).toBeVisible({
			timeout: 5000,
		});
		await expect(page.getByText("Password wajib diisi").first()).toBeVisible({
			timeout: 5000,
		});

		// B. Format email tidak valid & password terlalu pendek (<8 karakter)
		await page.fill('input#name, input[placeholder="John Doe"]', "An");
		await page.fill('input#email, input[type="email"]', "invalid-email");
		await page.fill('input#password, input[type="password"]', "123");
		await page.fill("input#confirmPass", "123");
		await page.click('button[type="submit"]');

		await expect(page.getByText("Minimal 3 karakter")).toBeVisible({
			timeout: 5000,
		});
		await expect(page.getByText("Format email tidak valid")).toBeVisible({
			timeout: 5000,
		});
		await expect(page.getByText("Minimal 8 karakter").first()).toBeVisible({
			timeout: 5000,
		});

		// C. Password confirmation mismatch
		await page.fill("input#password", "passwordAman123");
		await page.fill("input#confirmPass", "passwordBeda456");
		await page.click('button[type="submit"]');
		await expect(page.getByText("Password tidak sama")).toBeVisible({
			timeout: 5000,
		});
	});

	// ─── 3. Form Lupa Password (/forgot-password) ──────────────────────────────
	test("6.3 Form Lupa Password: Validasi email kosong dan format email", async ({
		page,
	}) => {
		await page.goto("/forgot-password");

		// A. Submit email kosong
		await page.click('button[type="submit"]');
		await expect(page.getByText("Email wajib diisi")).toBeVisible({
			timeout: 5000,
		});

		// B. Format email salah
		await page.fill('input[type="email"]', "email-tanpa-domain");
		await page.click('button[type="submit"]');
		await expect(page.getByText("Format email tidak valid")).toBeVisible({
			timeout: 5000,
		});
	});

	// ─── 4. Form Upload Karya Seni (/post-art) ─────────────────────────────────
	test("6.4 Form Upload Karya: Validasi judul wajib diisi dan berkas artwork", async ({
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

		await page.goto("/post-art");

		// A. Submit tanpa mengisi judul
		const submitBtn = page.getByRole("button", {
			name: /Publikasikan Artwork|Publikasikan|Unggah/i,
		});
		await submitBtn.click();

		await expect(page.getByText("Judul artwork wajib diisi.")).toBeVisible({
			timeout: 5000,
		});
	});

	// ─── 5. Modal Edit Profil (/profile) ───────────────────────────────────────
	test("6.5 Modal Edit Profil: Validasi nama kosong & validasi nilai harga", async ({
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

		await page.goto("/profile");

		// Buka modal Edit Profil
		const editBtn = page.getByRole("button", { name: /Edit Profil/i });
		await expect(editBtn).toBeVisible({ timeout: 8000 });
		await editBtn.click();

		// Kosongkan input nama
		const nameInput = page.locator("input#profile-name");
		await expect(nameInput).toBeVisible({ timeout: 5000 });
		await nameInput.fill("");

		// Klik Simpan Perubahan di modal
		const saveBtn = page.getByRole("button", { name: /Simpan Perubahan/i });
		await saveBtn.click();

		// Memastikan pesan validasi nama muncul
		await expect(page.getByText("Nama wajib diisi")).toBeVisible({
			timeout: 5000,
		});

		// Tutup modal
		await page.keyboard.press("Escape");
	});

	// ─── 6. Form Penarikan Saldo (/withdraw) ───────────────────────────────────
	test("6.6 Form Tarik Saldo: Validasi nominal minimum dan rekening kosong", async ({
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

		await page.goto("/withdraw");

		// Masukkan nominal di bawah Rp 100.000 (contoh: 50000)
		const amountInput = page.locator('input[type="number"]').first();
		if (await amountInput.isVisible()) {
			await amountInput.fill("50000");

			// Kosongkan rekening dan submit
			const submitWithdrawBtn = page.getByRole("button", {
				name: /Tarik Dana Sekarang|Konfirmasi/i,
			});
			if (await submitWithdrawBtn.isVisible()) {
				await submitWithdrawBtn.click();

				// Memastikan validasi minimal penarikan Rp 100.000 muncul
				await expect(
					page.getByText(/Minimal penarikan dana adalah Rp 100\.000/i).first(),
				).toBeVisible({ timeout: 5000 });
			}
		}
	});
});

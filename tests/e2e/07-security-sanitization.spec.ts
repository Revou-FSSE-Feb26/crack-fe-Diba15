import { expect, test } from "@playwright/test";
import {
	getSafeRedirectUrl,
	isValidExternalUrl,
	isValidTagName,
	sanitizeCsvCell,
} from "../../src/utils/validation/securityValidation";

test.describe("Fitur 7: Pengujian Keamanan & Sanitasi Otomatis (Security & Anti-XSS)", () => {
	// ─── 7.1 Zero-Alert XSS Defense across Inputs & URL Reflections ──────────
	test("7.1 Zero-Alert XSS Defense: Injeksi payload script & HTML tidak memicu dialog alert", async ({
		page,
	}) => {
		let dialogTriggered = false;
		page.on("dialog", (dialog) => {
			dialogTriggered = true;
			dialog.dismiss();
		});

		// A. Uji pantulan query di halaman search (/search)
		const xssQuery = '<script>alert("XSS")</script>';
		await page.goto(`/search/${encodeURIComponent(xssQuery)}`);

		// Pastikan tidak ada alert yang meletup
		expect(dialogTriggered).toBe(false);

		// Pastikan teks ditampilkan sebagai escaped text di DOM, bukan elemen executable
		const renderedText = page.locator('text=<script>alert("XSS")</script>');
		await expect(renderedText.first()).toBeVisible({ timeout: 5000 });

		// B. Uji payload img onerror pada halaman search
		const imgPayload = '<img src=x onerror="alert(1)">';
		await page.goto(`/search/${encodeURIComponent(imgPayload)}`);
		expect(dialogTriggered).toBe(false);

		// C. Uji payload svg onload
		const svgPayload = '"><svg onload=alert(1)>';
		await page.goto(`/search/${encodeURIComponent(svgPayload)}`);
		expect(dialogTriggered).toBe(false);
	});

	// ─── 7.2 Open Redirect & DOM URL Navigation Defense ─────────────────────
	test("7.2 Open Redirect Defense: Parameter redirect jahat dinetralisir ke rute lokal aman", async ({
		page,
	}) => {
		let dialogTriggered = false;
		page.on("dialog", (dialog) => {
			dialogTriggered = true;
			dialog.dismiss();
		});

		// Login dengan akun client (Dimas) agar form topup aktif
		await page.goto("/login");
		await page.fill('input[type="email"]', "dimas@example.com");
		await page.fill('input[type="password"]', "client123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		// A. Uji redirect ke domain phishing eksternal
		await page.goto("/topup?redirect=https://evil-phishing.com");
		const backLink1 = page.getByRole("link", {
			name: /Kembali ke halaman sebelumnya/i,
		});
		await expect(backLink1).toBeVisible({ timeout: 8000 });
		await expect(backLink1).toHaveAttribute("href", "/profile");
		await backLink1.click();
		await expect(page).toHaveURL(/\/profile/);
		expect(page.url()).not.toContain("evil-phishing.com");

		// B. Uji protocol-relative redirect (//evil.com)
		await page.goto("/topup?redirect=//evil.com");
		const backLink2 = page.getByRole("link", {
			name: /Kembali ke halaman sebelumnya/i,
		});
		await expect(backLink2).toBeVisible({ timeout: 5000 });
		await expect(backLink2).toHaveAttribute("href", "/profile");

		// C. Uji pseudo-protocol javascript:alert(1)
		await page.goto("/topup?redirect=javascript:alert(document.cookie)");
		const backLink3 = page.getByRole("link", {
			name: /Kembali ke halaman sebelumnya/i,
		});
		await expect(backLink3).toBeVisible({ timeout: 5000 });
		await expect(backLink3).toHaveAttribute("href", "/profile");
		await backLink3.click();
		expect(dialogTriggered).toBe(false);

		// D. Uji internal route yang valid (/commissions) harus tetap diizinkan
		await page.goto("/topup?redirect=/commissions");
		const backLinkValid = page.getByRole("link", {
			name: /Kembali ke halaman sebelumnya/i,
		});
		await expect(backLinkValid).toBeVisible({ timeout: 5000 });
		await expect(backLinkValid).toHaveAttribute("href", "/commissions");
	});

	// ─── 7.3 URL Scheme & Social Link Format Validation (Profile Form) ────────
	test("7.3 Validasi URL Profil: Menolak skema berbahaya (javascript:) dan URL invalid", async ({
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

		// A. Isi website dengan skema berbahaya javascript:alert(1)
		const websiteInput = page.locator("input#profile-website");
		await expect(websiteInput).toBeVisible({ timeout: 5000 });
		await websiteInput.fill("javascript:alert(1)");

		// B. Isi Instagram dengan format berbahaya
		const igInput = page.locator("input#profile-instagram");
		await igInput.fill("javascript:alert(1)");

		// C. Isi Twitter dengan format berbahaya
		const twitterInput = page.locator("input#profile-twitter");
		await twitterInput.fill("javascript:alert(1)");

		// D. Isi Pixiv dengan format berbahaya
		const pixivInput = page.locator("input#profile-pixiv");
		await pixivInput.fill("javascript:alert(1)");

		// Klik simpan perubahan
		const saveBtn = page.getByRole("button", { name: /Simpan Perubahan/i });
		await saveBtn.click();

		// Verifikasi pesan error validasi muncul dan submit dicegah
		await expect(page.getByText(/Format URL website tidak valid/i)).toBeVisible(
			{ timeout: 5000 },
		);
		await expect(
			page.getByText(
				/URL Instagram tidak valid|Format username Instagram tidak valid/i,
			),
		).toBeVisible({ timeout: 5000 });
	});

	// ─── 7.4 Tag Name Sanitization (Post Art) ────────────────────────────────
	test("7.4 Sanitasi Tag: Menolak tag berisi karakter HTML di formulir Post Art", async ({
		page,
	}) => {
		await page.context().clearCookies();

		// Login sebagai Artist (Nadia)
		await page.goto("/login");
		await page.fill('input[type="email"]', "nadia@example.com");
		await page.fill('input[type="password"]', "artist123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		await page.goto("/post-art");

		// Coba ketik tag dengan script injection
		const tagInput = page.locator("input#tagsInput");
		await expect(tagInput).toBeVisible({ timeout: 8000 });
		await tagInput.fill("<script>");

		const addTagBtn = page.getByRole("button", { name: /Tambah Tag/i });
		await addTagBtn.click();

		// Memastikan toast error penolakan tag muncul
		const toast = page.locator(".toast, .alert");
		await expect(toast.first()).toContainText(/tidak valid/i, {
			timeout: 5000,
		});
	});

	// ─── 7.5 Master Tag Sanitization (Admin Dashboard) ────────────────────────
	test("7.5 Sanitasi Master Tag: Menolak tag master berisi karakter HTML & simbol liar di Dashboard", async ({
		page,
	}) => {
		await page.context().clearCookies();

		// Login sebagai Admin
		await page.goto("/login");
		await page.fill('input[type="email"]', "admin@trubrush.com");
		await page.fill('input[type="password"]', "admin123");
		await page.click('button[type="submit"]');
		await page.waitForURL((url) => !url.pathname.includes("/login"), {
			timeout: 10000,
		});

		await page.goto("/dashboard/manage-tags");
		const addMasterTagBtn = page.getByRole("button", {
			name: /Tambah Master Tag/i,
		});
		await expect(addMasterTagBtn).toBeVisible({ timeout: 8000 });
		await addMasterTagBtn.click();

		const tagNameInput = page.locator("input#tag-name-input");
		await expect(tagNameInput).toBeVisible({ timeout: 5000 });
		await tagNameInput.fill("<svg onload=alert(1)>");

		// Submit modal tag
		await page.locator('form button[type="submit"]').click();

		// Memastikan error validasi muncul
		await expect(
			page.getByText(
				/Nama tag hanya boleh berisi huruf, angka, dan tanda hubung/i,
			),
		).toBeVisible({ timeout: 5000 });
	});

	// ─── 7.6 CSV Formula Injection Defense ────────────────────────────────────
	test("7.6 Proteksi CSV Formula Injection: Menetralisir formula trigger spreadsheet", async () => {
		// Uji fungsi sanitizeCsvCell secara langsung
		expect(sanitizeCsvCell("=1+1")).toBe("'=1+1");
		expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
		expect(sanitizeCsvCell("-5+5")).toBe("'-5+5");
		expect(sanitizeCsvCell("+cmd|' /C calc'!A0")).toBe("'+cmd|' /C calc'!A0");
		expect(sanitizeCsvCell("\talert")).toBe("'\talert");
		expect(sanitizeCsvCell("\ralert")).toBe("'\ralert");

		// Teks normal tidak boleh diubah
		expect(sanitizeCsvCell("Normal Title")).toBe("Normal Title");
		expect(sanitizeCsvCell("Illustrator ID: 123")).toBe("Illustrator ID: 123");

		// Uji getSafeRedirectUrl
		expect(getSafeRedirectUrl("https://evil.com")).toBe("/profile");
		expect(getSafeRedirectUrl("//evil.com")).toBe("/profile");
		expect(getSafeRedirectUrl("/\\evil.com")).toBe("/profile");
		expect(getSafeRedirectUrl("javascript:alert(1)")).toBe("/profile");
		expect(getSafeRedirectUrl("/commissions/123")).toBe("/commissions/123");

		// Uji isValidExternalUrl
		expect(isValidExternalUrl("javascript:alert(1)")).toBe(false);
		expect(isValidExternalUrl("https://artstation.com/nadia")).toBe(true);
		expect(isValidExternalUrl("nadia.carrd.co")).toBe(true);

		// Uji isValidTagName
		expect(isValidTagName("<script>")).toBe(false);
		expect(isValidTagName("cyberpunk_2077")).toBe(true);
		expect(isValidTagName("anime-style")).toBe(true);
	});
});

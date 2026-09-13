/**
 * Sanitizes and validates a redirect path.
 * Ensures the redirect target is a safe relative internal route on the same origin.
 *
 * Rejects:
 * - Null, undefined, or empty strings (falls back to `fallback`)
 * - Protocol-relative URLs (e.g. `//evil.com`)
 * - Absolute URLs with protocols (e.g. `https://evil.com`, `javascript:alert(1)`, `data:...`)
 * - Backslashes (e.g. `/\evil.com`) which some browsers normalize to forward slashes
 */
export function getSafeRedirectUrl(
	target: string | null | undefined,
	fallback = "/profile",
): string {
	if (!target || typeof target !== "string") {
		return fallback;
	}

	const trimmed = target.trim();

	// Must start with '/' and must NOT start with '//' or contain backslashes
	if (
		trimmed.startsWith("/") &&
		!trimmed.startsWith("//") &&
		!trimmed.includes("\\") &&
		!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
	) {
		return trimmed;
	}

	return fallback;
}

/**
 * Validates whether an external URL is valid and uses a safe protocol (http or https).
 */
export function isValidExternalUrl(url: string | null | undefined): boolean {
	if (!url || typeof url !== "string") return false;
	const trimmed = url.trim();
	if (!trimmed) return false;

	try {
		const parsed = new URL(
			trimmed.startsWith("http") ? trimmed : `https://${trimmed}`,
		);
		return (
			(parsed.protocol === "http:" || parsed.protocol === "https:") &&
			Boolean(parsed.hostname?.includes("."))
		);
	} catch {
		return false;
	}
}

/**
 * Validates that a tag name only contains alphanumeric characters, underscores, or hyphens.
 * Prevents HTML/script/control characters from being stored in tag metadata.
 */
export function isValidTagName(tag: string | null | undefined): boolean {
	if (!tag || typeof tag !== "string") return false;
	const trimmed = tag.trim();
	if (!trimmed) return false;
	return /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

/**
 * Sanitizes a cell value for CSV export to prevent Formula Injection (CSV Injection).
 * If a cell begins with '=', '+', '-', '@', tab, or carriage return, it prepends a single quote.
 */
export function sanitizeCsvCell(value: string): string {
	if (!value) return value;
	if (/^[=+\-@\t\r]/.test(value)) {
		return `'${value}`;
	}
	return value;
}

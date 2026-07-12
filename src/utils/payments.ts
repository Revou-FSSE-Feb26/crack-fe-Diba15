/**
 * Formats Credit Card Number: inserts spaces every 4 digits, limits to 16 digits.
 */
export function formatCardNumber(value: string): string {
	const digits = value.replace(/\D/g, "").slice(0, 16);
	return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * Formats Credit Card Expiry Date: MM/YY, limits to 4 digits total.
 */
export function formatExpiry(value: string): string {
	const digits = value.replace(/\D/g, "").slice(0, 4);
	if (digits.length >= 2) {
		return `${digits.slice(0, 2)}/${digits.slice(2)}`;
	}
	return digits;
}

/**
 * Formats Credit Card CVV: limits to 3 digits.
 */
export function formatCvv(value: string): string {
	return value.replace(/\D/g, "").slice(0, 3);
}

/**
 * Returns the last four digits of a credit card number.
 */
export function getLastFourDigits(cardNumber: string): string {
	const clean = cardNumber.replace(/\s+/g, "");
	return clean.slice(-4);
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function formatPrice(price: number | null): string {
	if (!price) return "—";
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(price);
}

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function randomKey(): string {
	const key =
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);
	return key;
}

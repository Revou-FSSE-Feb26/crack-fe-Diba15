export function getInitials(name: string): string {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function formatPrice(price: number | null): string {
	if (price === null || price === undefined) return "—";
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(price);
}

export function formatDate(date: string | Date) {
	return new Date(date).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatShortDate(value: string | Date): string {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(value));
}

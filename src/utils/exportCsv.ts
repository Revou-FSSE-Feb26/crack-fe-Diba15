/**
 * Universal CSV export utility with UTF-8 BOM support (\uFEFF)
 * for seamless compatibility with Microsoft Excel, Google Sheets, and LibreOffice.
 */
export function exportToCsv(
	filename: string,
	headers: string[],
	rows: (string | number | boolean | null | undefined)[][],
): void {
	if (typeof window === "undefined" || rows.length === 0) return;

	const formattedRows = rows.map((row) =>
		row.map((cell) => {
			if (cell === null || cell === undefined) return '""';
			const stringVal = String(cell);
			// Escape quotes if cell contains comma, quote, or newline
			if (
				stringVal.includes(",") ||
				stringVal.includes('"') ||
				stringVal.includes("\n")
			) {
				return `"${stringVal.replace(/"/g, '""')}"`;
			}
			return `"${stringVal}"`;
		}),
	);

	const csvContent =
		"\uFEFF" +
		[
			headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
			...formattedRows.map((r) => r.join(",")),
		].join("\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");

	const safeFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;

	link.setAttribute("href", url);
	link.setAttribute("download", safeFilename);
	link.style.visibility = "hidden";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

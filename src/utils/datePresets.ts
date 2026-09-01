export type DatePreset = "all" | "today" | "7d" | "30d" | "this_month";

export interface DatePresetRange {
	startDate?: string;
	endDate?: string;
}

export const DATE_PRESETS: { id: DatePreset; label: string }[] = [
	{ id: "all", label: "Semua Waktu" },
	{ id: "today", label: "Hari Ini" },
	{ id: "7d", label: "7 Hari Terakhir" },
	{ id: "30d", label: "30 Hari Terakhir" },
	{ id: "this_month", label: "Bulan Ini" },
];

/**
 * Calculates start and end ISO timestamps for standard date filter presets.
 */
export function getDatePresetRange(preset: DatePreset): DatePresetRange {
	const now = new Date();

	switch (preset) {
		case "today": {
			const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			};
		}
		case "7d": {
			const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			};
		}
		case "30d": {
			const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			};
		}
		case "this_month": {
			const start = new Date(now.getFullYear(), now.getMonth(), 1);
			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			};
		}
		default:
			return {
				startDate: undefined,
				endDate: undefined,
			};
	}
}

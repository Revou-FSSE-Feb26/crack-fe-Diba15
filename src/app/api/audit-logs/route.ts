import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");
		const search = searchParams.get("search");
		const startDate =
			searchParams.get("startDate") || searchParams.get("start_date");
		const endDate = searchParams.get("endDate") || searchParams.get("end_date");
		const page = searchParams.get("page");
		const limit = searchParams.get("limit");

		const res = await axiosServer.get("/audit-logs", {
			params: {
				category: category || undefined,
				search: search || undefined,
				startDate: startDate || undefined,
				endDate: endDate || undefined,
				page: page || undefined,
				limit: limit || undefined,
			},
		});
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/audit-logs");
	}
}

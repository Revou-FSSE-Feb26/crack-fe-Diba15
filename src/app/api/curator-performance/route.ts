import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const search = searchParams.get("search") || undefined;
		const startDate = searchParams.get("startDate") || undefined;
		const endDate = searchParams.get("endDate") || undefined;

		const res = await axiosServer.get("/curator-performance", {
			params: { search, startDate, endDate },
		});
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/curator-performance");
	}
}

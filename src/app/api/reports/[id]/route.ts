import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const res = await axiosServer.get(`/reports/${id}`);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/reports/[id]");
	}
}

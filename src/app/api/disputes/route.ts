import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const res = await axiosServer.get("/disputes", {
			params: { status: status || undefined },
		});
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/disputes");
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const mappedBody = {
			commissionId: body.commissionId || body.commission_id,
			reason: body.reason,
		};
		const res = await axiosServer.post("/disputes", mappedBody);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/disputes");
	}
}

import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const res = await axiosServer.post(`/commissions/${id}/revisions`, body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/commissions/[id]/revisions");
	}
}

import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const formData = await request.formData();
		const res = await axiosServer.post(
			`/upload/commissions/${id}/wip`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/upload/commissions/[id]/wip");
	}
}

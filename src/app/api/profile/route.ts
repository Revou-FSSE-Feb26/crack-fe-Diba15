import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function PATCH(request: Request) {
	try {
		const body = await request.json();

		const mappedBody: Record<string, unknown> = Object.fromEntries(
			Object.entries(body).map(([key, value]) => [
				key.replace(/_/g, ""),
				value,
			]),
		);

		const res = await axiosServer.patch("/profile", mappedBody);

		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "PATCH /api/profile");
	}
}

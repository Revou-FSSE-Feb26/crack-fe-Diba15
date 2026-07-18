import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function PATCH(request: Request) {
	try {
		const body = await request.json();

		// Petakan properti dari frontend (snake_case) ke backend (camelCase)
		const mappedBody: Record<string, unknown> = {};
		if (body.bio !== undefined) mappedBody.bio = body.bio;
		if (body.avatar_url !== undefined) mappedBody.avatarUrl = body.avatar_url;
		if (body.is_open_for_commission !== undefined) {
			mappedBody.isOpenForCommission = body.is_open_for_commission;
		}
		if (body.base_price_idr !== undefined) {
			mappedBody.basePriceIdr = body.base_price_idr;
		}

		const res = await axiosServer.patch("/profile", mappedBody);

		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "PATCH /api/profile");
	}
}

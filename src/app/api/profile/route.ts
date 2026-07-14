import axios from "axios";
import { NextResponse } from "next/server";
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
		if (axios.isAxiosError(error)) {
			const status = error.response?.status || 500;
			const data = error.response?.data || { message: "Internal Server Error" };
			return NextResponse.json(data, { status });
		}
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

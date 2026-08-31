import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const as = searchParams.get("as");
		const res = await axiosServer.get("/commissions", {
			params: { as: as || undefined },
		});
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/commissions");
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const mappedBody = {
			artistsId: body.artistsId || body.artist_id || body.artists_id,
			commissionTitle: body.commissionTitle || body.commission_title,
			description: body.description,
			price: body.price,
			paymentMethod: body.paymentMethod || body.payment_method,
		};
		const res = await axiosServer.post("/commissions", mappedBody);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/commissions");
	}
}

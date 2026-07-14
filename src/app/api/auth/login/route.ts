import axios from "axios";
import { NextResponse } from "next/server";
import { axiosServer } from "@/lib/axiosServer";

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		// Kirim request login ke backend NestJS
		// Cookie refresh_token otomatis ditangkap dan disimpan ke Next.js oleh interceptor axiosServer
		const res = await axiosServer.post("/auth/login", { email, password });

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

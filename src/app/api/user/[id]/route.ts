import axios from "axios";
import { NextResponse } from "next/server";
import { axiosServer } from "@/lib/axiosServer";

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.get(`/user/${id}`);
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

export async function PATCH(request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		const body = await request.json();
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.patch(`/user/${id}`, body);
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

export async function DELETE(_request: Request, { params }: RouteParams) {
	try {
		const { id } = await params;
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.delete(`/user/${id}`);
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

"use client";

import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/form/Input";
import { axiosClient } from "@/lib/axiosClient";
import { useToastStore } from "@/store/ToastStore";

interface ForgotPasswordForm {
	email: string;
}

export default function ForgotPasswordPage() {
	const [submitted, setSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { addToast } = useToastStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordForm>();

	const onSubmit = async (data: ForgotPasswordForm) => {
		setIsLoading(true);
		try {
			const res = await axiosClient.post("/auth/forgot-password", data);
			addToast({ type: "success", message: res.data.message });
			setSubmitted(true);
		} catch (error) {
			let msg = "Gagal mengirim instruksi reset password.";
			if (error && typeof error === "object" && "response" in error) {
				const errObj = error as { response?: { data?: { message?: string } } };
				if (errObj.response?.data?.message) {
					msg = errObj.response.data.message;
				}
			}
			addToast({ type: "error", message: msg });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="auth-page-wrapper">
			{/* Palette accent dots decorator */}
			<div className="absolute top-5 right-5 flex gap-1.5">
				<div className="deco-dot-warm"></div>
				<div className="deco-dot-accent"></div>
				<div className="deco-dot-mint"></div>
			</div>

			<div className="auth-card">
				<Link
					href="/login"
					className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-primary mb-6 transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Kembali ke Login
				</Link>

				<h1 className="text-2xl font-bold font-display text-content mb-2">
					Lupa Password?
				</h1>
				<p className="text-sm text-content-muted mb-6">
					Masukkan alamat email akun TruBrush Anda. Kami akan mengirimkan
					instruksi dan link reset password.
				</p>

				{submitted ? (
					<div className="bg-verified/10 border border-verified/30 rounded-xl p-6 text-center space-y-3">
						<CheckCircle2 className="w-12 h-12 text-verified mx-auto" />
						<h3 className="font-semibold text-content text-base">
							Email Instruksi Terkirim
						</h3>
						<p className="text-xs text-content-muted leading-relaxed">
							Silakan periksa kotak masuk (inbox) atau folder spam email Anda.
							Link reset password berlaku selama 15 menit.
						</p>
						<Button
							variant="secondary"
							className="w-full text-xs justify-center mt-2"
							onClick={() => setSubmitted(false)}
						>
							Kirim Ulang Email
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<label htmlFor="email" className="form-label">
								Email Akun
							</label>
							<Input
								id="email"
								type="email"
								placeholder="nama@email.com"
								{...register("email", {
									required: "Email wajib diisi",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Format email tidak valid",
									},
								})}
							>
								<Mail className="form-input-icon" />
							</Input>
							{errors.email && (
								<p className="form-error-msg">{errors.email.message}</p>
							)}
						</div>

						<Button
							type="submit"
							variant="primary"
							className="w-full justify-center"
							disabled={isLoading}
						>
							{isLoading ? "Mengirim Email..." : "Kirim Link Reset Password"}
						</Button>
					</form>
				)}
			</div>
		</div>
	);
}

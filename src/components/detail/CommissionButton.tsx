"use client";

import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { OrderCommissionModal } from "@/components/detail/OrderCommissionModal";
import Button from "@/components/ui/Button";
import { useModalStore } from "@/store/ModalStore";
import { useUserStore } from "@/store/UserStore";

interface CommissionButtonProps {
	artworkId?: string;
	artworkTitle?: string;
	artistId: string;
	artistName: string;
	basePrice: number | null;
	isVerified?: boolean;
	children?: ReactNode;
	className?: string;
}

export default function CommissionButton({
	artworkTitle,
	artistId,
	artistName,
	basePrice,
	isVerified = true,
	children = "Pesan Komisi",
	className = "",
}: CommissionButtonProps) {
	const router = useRouter();
	const { user, isAuthenticated } = useUserStore();
	const { openModal } = useModalStore();
	const [isFormOpen, setIsFormOpen] = useState(false);

	const handleClick = () => {
		if (!isAuthenticated || !user) {
			openModal({
				title: "Login diperlukan",
				description:
					"Silakan login terlebih dahulu untuk melakukan commission.",
				type: "confirm",
				confirmLabel: "Login",
				cancelLabel: "Batal",
				onConfirm: () => router.push("/login"),
			});
			return;
		}

		if (user.role !== "client") {
			openModal({
				title: "Hanya client yang bisa pesan komisi",
				description:
					"Silakan gunakan akun client untuk membuat order commission.",
			});
			return;
		}

		if (user.id === artistId) {
			openModal({
				title: "Tidak bisa commission karya sendiri",
				description:
					"Gunakan akun client untuk melakukan commission ke artist.",
			});
			return;
		}

		if (!isVerified) {
			openModal({
				title: "Artis Belum Terverifikasi",
				description:
					"Artis ini belum terverifikasi oleh Kurator TruBrush (memerlukan minimal 5 karya portofolio yang disetujui kurator) sehingga belum dapat menerima pesanan komisi berbayar.",
			});
			return;
		}

		setIsFormOpen(true);
	};

	if (!isVerified) {
		return (
			<Button
				type="button"
				variant="danger"
				className={`w-full justify-center pointer-events-none opacity-80 ${className}`}
				disabled
			>
				Belum Diverifikasi
			</Button>
		);
	}

	return (
		<>
			<Button
				type="button"
				onClick={handleClick}
				className={`w-full inline-flex items-center justify-center gap-2 ${className}`}
			>
				<Briefcase className="w-4 h-4" />
				{children}
			</Button>

			<OrderCommissionModal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				artistId={artistId}
				artistName={artistName}
				artworkTitle={artworkTitle}
				basePrice={basePrice}
			/>
		</>
	);
}

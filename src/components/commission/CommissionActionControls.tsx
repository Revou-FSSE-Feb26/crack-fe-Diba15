import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Commission, CommissionProgress, DisputeLog } from "@/types";
import DisputeBanner from "./controls/DisputeBanner";
import FinalApprovalPanel from "./controls/FinalApprovalPanel";
import FinalDeliverableUploadPanel from "./controls/FinalDeliverableUploadPanel";
import PaymentEscrowPanel from "./controls/PaymentEscrowPanel";
import ProgressUploadPanel from "./controls/ProgressUploadPanel";
import RespondCommissionPanel from "./controls/RespondCommissionPanel";

interface CommissionActionControlsProps {
	commission: Commission;
	progressItem: CommissionProgress | null;
	commissionDispute: DisputeLog | null;
	isArtistView: boolean;
	onRespond: (status: "accepted" | "cancelled", title: string) => void;
	onApproveFinal: () => void;
	onCancel: () => void;
	onOpenDispute: () => void;
	onUpdateProgress: (payload: {
		sketch_url?: string;
		final_artwork_url?: string;
	}) => Promise<unknown>;
	onCompleteCommission: () => Promise<unknown>;
}

export default function CommissionActionControls({
	commission,
	progressItem,
	commissionDispute,
	isArtistView,
	onRespond,
	onApproveFinal,
	onCancel,
	onOpenDispute,
	onUpdateProgress,
	onCompleteCommission,
}: CommissionActionControlsProps) {
	const isCommissionActive =
		!["completed", "cancelled", "disputed"].includes(commission.status) &&
		commission.payment_status === "paid" &&
		commissionDispute?.status !== "approved";

	const canCancel =
		!isArtistView &&
		["pending", "accepted", "revision", "in_progress"].includes(
			commission.status,
		) &&
		commission.payment_status === "unpaid" &&
		!commissionDispute;

	const canPay =
		commission.payment_status === "unpaid" &&
		!["pending", "cancelled", "completed"].includes(commission.status) &&
		!commissionDispute;

	const canDispute =
		!isArtistView &&
		isCommissionActive &&
		Boolean(progressItem?.sketch_url) &&
		Boolean(progressItem?.final_artwork_url) &&
		!progressItem?.final_artwork_approved &&
		!commissionDispute;

	const canApprove =
		!isArtistView &&
		isCommissionActive &&
		Boolean(progressItem?.final_artwork_url) &&
		!progressItem?.final_artwork_approved &&
		(!commissionDispute || commissionDispute.status === "rejected");

	const canUploadProgress =
		isArtistView &&
		commission.payment_status === "paid" &&
		!progressItem?.final_artwork_approved &&
		["accepted", "in_progress", "revision"].includes(commission.status);

	const canUploadFinalDeliverable =
		isArtistView &&
		isCommissionActive &&
		Boolean(progressItem?.final_artwork_approved);

	return (
		<div className="space-y-3">
			{/* 1. Pending Order Response */}
			{commission.status === "pending" && (
				<RespondCommissionPanel
					price={commission.price}
					isArtistView={isArtistView}
					onRespond={onRespond}
				/>
			)}

			{/* 2. Accepted / Unpaid Order Payment */}
			{canPay && (
				<PaymentEscrowPanel
					commissionId={commission.id}
					price={commission.price}
					isArtistView={isArtistView}
				/>
			)}

			{/* 3. Artist Upload Progress (Sketch / Preview) */}
			{canUploadProgress && (
				<ProgressUploadPanel
					commissionId={commission.id}
					onUpdateProgress={onUpdateProgress}
				/>
			)}

			{/* 4. Artist Final Archive Deliverable Upload */}
			{canUploadFinalDeliverable && (
				<FinalDeliverableUploadPanel
					commissionId={commission.id}
					price={commission.price}
					onCompleteCommission={onCompleteCommission}
				/>
			)}

			{/* 5. Client Final Approval Panel */}
			{!isArtistView && canApprove && (
				<FinalApprovalPanel
					canDispute={canDispute}
					onApproveFinal={onApproveFinal}
					onOpenDispute={onOpenDispute}
				/>
			)}

			{/* 6. Standalone Dispute Button for Client */}
			{!isArtistView && !canApprove && canDispute && (
				<Button
					variant="danger"
					className="flex gap-1 items-center w-full justify-center text-sm"
					onClick={onOpenDispute}
				>
					<AlertTriangle className="w-4 h-4" />
					Ajukan Dispute Komisi
				</Button>
			)}

			{/* 7. Client Cancel Order Button */}
			{!isArtistView && canCancel && (
				<Button
					variant="secondary"
					className="flex gap-1 items-center w-full justify-center text-sm"
					onClick={onCancel}
				>
					Batalkan Commission
				</Button>
			)}

			{/* 8. Dispute and Cancellation Status Banners */}
			<DisputeBanner
				commissionStatus={commission.status}
				commissionPrice={commission.price}
				paymentMethod={commission.payment_method}
				cardLastFour={commission.card_last_four}
				commissionDispute={commissionDispute}
				isArtistView={isArtistView}
			/>
		</div>
	);
}

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface FinalApprovalPanelProps {
	canDispute: boolean;
	onApproveFinal: () => void;
	onOpenDispute: () => void;
}

export default function FinalApprovalPanel({
	canDispute,
	onApproveFinal,
	onOpenDispute,
}: FinalApprovalPanelProps) {
	return (
		<div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
			<p className="text-sm font-semibold text-content">
				Artist telah mengunggah Preview Final
			</p>
			<p className="text-xs text-content-muted">
				Tinjau karya akhir di atas. Jika sudah sesuai, setujui pratinjau agar
				Artist dapat mengunggah berkas karya asli dan menerima pembayaran.
			</p>
			<div className="flex gap-2">
				<Button
					className="flex gap-1 items-center flex-1 justify-center text-sm font-semibold"
					onClick={onApproveFinal}
				>
					<CheckCircle2 className="w-4 h-4" />
					Approve Hasil Akhir
				</Button>
				{canDispute && (
					<Button
						variant="danger"
						className="flex gap-1 items-center justify-center text-sm"
						onClick={onOpenDispute}
					>
						<AlertTriangle className="w-4 h-4" />
						Ajukan Dispute
					</Button>
				)}
			</div>
		</div>
	);
}

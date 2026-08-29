"use client";

import {
	FileText,
	ShieldCheck,
	Target,
	User as UserIcon,
	X,
} from "lucide-react";
import type { AuditLogItem } from "@/types";
import { formatDateTime } from "@/utils";
import {
	auditStatusBadges,
	categoryBadges,
	categoryLabels,
} from "@/utils/dashboard/audit-logs/auditTableColumns";

interface AuditLogDetailModalProps {
	log: AuditLogItem | null;
	isOpen?: boolean;
	onClose: () => void;
}

export function AuditLogDetailModal({
	log,
	isOpen = true,
	onClose,
}: AuditLogDetailModalProps) {
	if (!isOpen || !log) return null;

	const statusKey = log.status.toLowerCase();
	const statusBadge = auditStatusBadges[statusKey] || "badge-ghost";
	const categoryBadge =
		categoryBadges[log.category] || "bg-content/10 text-content";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
			<div className="bg-surface border border-content/10 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-content/10">
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-xl bg-primary/10 text-primary">
							<ShieldCheck className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-base font-bold text-content">
								Detail Log Audit
							</h3>
							<p className="text-xs text-content-muted font-mono">{log.id}</p>
						</div>
					</div>
					<button
						type="button"
						className="btn btn-ghost btn-xs btn-square text-content-muted hover:text-content"
						onClick={onClose}
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
					{/* Action Box */}
					<div className="rounded-xl bg-content/5 p-4 text-center border border-content/10">
						<span className="text-xs font-medium text-content-muted block mb-1">
							Tindakan Moderasi
						</span>
						<span className="text-lg font-bold text-content block">
							{log.action}
						</span>
						<div className="flex items-center justify-center gap-2 mt-2">
							<span
								className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryBadge}`}
							>
								{categoryLabels[log.category] || log.category}
							</span>
							<span
								className={`badge badge-sm uppercase font-bold ${statusBadge}`}
							>
								{log.status}
							</span>
						</div>
					</div>

					{/* Detail List */}
					<div className="space-y-3 text-xs">
						<div className="flex justify-between items-center py-2 border-b border-content/5">
							<span className="text-content-muted">Waktu Eksekusi:</span>
							<span className="font-medium text-content">
								{formatDateTime(log.createdAt ?? log.created_at)}
							</span>
						</div>

						{/* Staff Info */}
						<div className="rounded-xl bg-content/5 p-3.5 space-y-2 border border-content/5">
							<div className="flex items-center gap-1.5 font-semibold text-content text-xs">
								<UserIcon className="h-3.5 w-3.5 text-primary" />
								<span>Informasi Aktor / Staf</span>
							</div>
							<div className="grid grid-cols-2 gap-2 text-xs pt-1">
								<div>
									<span className="text-content-muted block text-[11px]">
										Nama Staf:
									</span>
									<span className="font-medium text-content">
										{log.actor.name}
									</span>
								</div>
								<div>
									<span className="text-content-muted block text-[11px]">
										Peran / Role:
									</span>
									<span className="font-medium text-content capitalize">
										{log.actor.role}
									</span>
								</div>
								<div className="col-span-2">
									<span className="text-content-muted block text-[11px]">
										Email Staf:
									</span>
									<span className="font-mono text-content text-[11px]">
										{log.actor.email}
									</span>
								</div>
							</div>
						</div>

						{/* Target Info */}
						<div className="rounded-xl bg-content/5 p-3.5 space-y-2 border border-content/5">
							<div className="flex items-center gap-1.5 font-semibold text-content text-xs">
								<Target className="h-3.5 w-3.5 text-primary" />
								<span>Informasi Target Subjek</span>
							</div>
							<div className="grid grid-cols-2 gap-2 text-xs pt-1">
								<div>
									<span className="text-content-muted block text-[11px]">
										Tipe Target:
									</span>
									<span className="font-medium text-content uppercase">
										{log.targetType ?? log.target_type}
									</span>
								</div>
								<div>
									<span className="text-content-muted block text-[11px]">
										Subjek Target:
									</span>
									<span className="font-medium text-content truncate block">
										{log.targetTitle ??
											log.target_title ??
											log.targetId ??
											log.target_id}
									</span>
								</div>
								<div className="col-span-2">
									<span className="text-content-muted block text-[11px]">
										ID Target:
									</span>
									<span className="font-mono text-content text-[11px]">
										{log.targetId ?? log.target_id}
									</span>
								</div>
							</div>
						</div>

						{/* Details / Notes */}
						{log.details && (
							<div className="rounded-xl bg-content/5 p-3.5 space-y-2 border border-content/5">
								<div className="flex items-center gap-1.5 font-semibold text-content text-xs">
									<FileText className="h-3.5 w-3.5 text-primary" />
									<span>Catatan / Alasan Resolusi</span>
								</div>
								<p className="text-xs text-content leading-relaxed whitespace-pre-wrap pt-1 bg-surface p-2.5 rounded-lg border border-content/5">
									{log.details}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 px-6 py-4 border-t border-content/10 bg-content/2">
					<button
						type="button"
						className="btn btn-primary btn-sm"
						onClick={onClose}
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	);
}

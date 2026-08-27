"use client";

import { Briefcase, CheckCircle2, Clock3, CreditCard } from "lucide-react";
import Link from "next/link";
import AvatarInitials from "@/components/home/AvatarInitials";
import EmptyState from "@/components/profile/EmptyState";
import DataTablePagination from "@/components/ui/data-table/DataTablePagination";
import Stat from "@/components/ui/Stat";
import { usePagination } from "@/hooks/usePagination";
import type { Commission } from "@/types";
import { formatDate, formatPrice } from "@/utils";
import { commissionStatusConfig } from "@/utils/commissionStatus";

interface ClientCommissionHistoryProps {
	commissions: Commission[];
	isArtist?: boolean;
}

export default function ClientCommissionHistory({
	commissions,
	isArtist = false,
}: ClientCommissionHistoryProps) {
	const { setPage, setPerPage, paginate } = usePagination({
		initialPerPage: 5,
	});

	const paginatedData = paginate(commissions);

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between mb-2">
				<h2 className="font-heading text-lg sm:text-xl font-semibold text-content">
					{isArtist ? "Pesanan Komisi Masuk" : "Riwayat Komisi"}
				</h2>
				<span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-content/5 text-content-muted">
					Total {commissions.length} order
				</span>
			</div>

			{commissions.length === 0 ? (
				<EmptyState
					icon={Briefcase}
					title="Belum ada komisi"
					description={
						isArtist
							? "Pesanan komisi yang masuk dari klien akan tampil di bagian ini."
							: "Pesanan komisi yang kamu buat akan tampil di bagian ini."
					}
				/>
			) : (
				<div className="space-y-4">
					<div className="space-y-3">
						{paginatedData.data.map((commission) => {
							const counterpartName = isArtist
								? commission.client?.name || "Client"
								: commission.artist?.name || "Artist";
							const counterpartAvatar = isArtist
								? commission.client?.profile?.avatarUrl
								: commission.artist?.profile?.avatarUrl;
							const counterpartRole = isArtist ? "Client" : "Artist";
							const status = commissionStatusConfig[commission.status] || {
								label: commission.status,
								className: "bg-content/10 text-content-muted",
							};

							return (
								<Link
									key={commission.id}
									href={`/commissions/${commission.id}`}
									className="block group"
								>
									<article className="bg-surface border border-content/10 rounded-2xl p-3.5 sm:p-4 transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-sm">
										<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
											<div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
												<AvatarInitials
													name={counterpartName}
													src={counterpartAvatar}
													className="w-10 h-10 sm:w-11 sm:h-11 text-xs sm:text-sm shrink-0"
												/>
												<div className="min-w-0 flex-1">
													<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
														<h3 className="font-semibold text-sm sm:text-base text-content group-hover:text-primary transition-colors">
															{commission.commission_title}
														</h3>
														<span
															className={`rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-medium ${status.className}`}
														>
															{status.label}
														</span>
													</div>
													<p className="mt-0.5 text-xs text-content-muted">
														{counterpartRole}: {counterpartName}
													</p>
													{commission.description && (
														<p className="mt-1.5 text-xs text-content-muted leading-relaxed line-clamp-2">
															{commission.description}
														</p>
													)}
												</div>
											</div>

											<div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 pt-2 sm:pt-0 border-t border-content/5 sm:border-t-0">
												<p className="font-display text-base sm:text-lg font-bold text-primary">
													{formatPrice(commission.price)}
												</p>
												<p className="text-[11px] sm:text-xs text-content-muted">
													{formatDate(commission.created_at)}
												</p>
											</div>
										</div>

										<div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
											<Stat
												icon={CreditCard}
												label="Pembayaran"
												value={commission.payment_status}
												tone="primary"
												iconPlacement="left"
												formatUnderscore
											/>
											<Stat
												icon={Clock3}
												label="Update"
												value={formatDate(commission.updated_at)}
												tone="primary"
												iconPlacement="left"
											/>
											<Stat
												icon={CheckCircle2}
												label="Status"
												value={status.label}
												tone="primary"
												iconPlacement="left"
											/>
										</div>
									</article>
								</Link>
							);
						})}
					</div>

					{/* Pagination Controls */}
					<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
						<DataTablePagination
							page={paginatedData.page}
							perPage={paginatedData.per_page as 5 | 10}
							total={paginatedData.total}
							totalPages={paginatedData.total_pages}
							onPageChange={setPage}
							onPerPageChange={setPerPage}
							itemLabel="order komisi"
						/>
					</div>
				</div>
			)}
		</section>
	);
}

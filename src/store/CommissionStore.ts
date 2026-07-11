import { create } from "zustand";
import { persist } from "zustand/middleware";

import initialCommissions from "@/data/commissions";
import { useUserManagementStore } from "@/store/UserManagementStore";
import { useUserStore } from "@/store/UserStore";
import type {
	Commission,
	CommissionProgress,
	CommissionState,
	DisputeLog,
	Revision,
} from "@/types";

const now = () => new Date().toISOString();

export const useCommissionStore = create<CommissionState>()(
	persist(
		(set, get) => ({
			commissions: initialCommissions,
			progress: [
				{
					id: "cp-001",
					commission_id: "c-001",
					sketch_url: "https://picsum.photos/seed/commission-sketch-1/900/650",
					sketch_approved: true,
					final_artwork_url:
						"https://picsum.photos/seed/commission-final-1/900/650",
					final_artwork_approved: true,
					updated_at: "2024-06-26T15:30:00Z",
				},
				{
					id: "cp-002",
					commission_id: "c-002",
					sketch_url: "https://picsum.photos/seed/commission-sketch-2/900/650",
					sketch_approved: false,
					final_artwork_url: null,
					final_artwork_approved: false,
					updated_at: "2024-07-06T08:45:00Z",
				},
			],
			revisions: [
				{
					id: "r-001",
					commission_id: "c-002",
					user_id: "u-005",
					comment:
						"Tolong pertahankan palet warna biru dan tambahkan variasi pose.",
					created_at: "2024-07-06T09:10:00Z",
				},
			],
			disputes: [],

			createCommission: (payload) => {
				const createdAt = now();
				const commission: Commission = {
					id: `c-${Date.now()}`,
					...payload,
					status: "pending",
					payment_status: "unpaid",
					created_at: createdAt,
					updated_at: createdAt,
				};

				const progressItem: CommissionProgress = {
					id: `cp-${Date.now()}`,
					commission_id: commission.id,
					sketch_url: null,
					sketch_approved: false,
					final_artwork_url: null,
					final_artwork_approved: false,
					updated_at: createdAt,
				};

				set((state) => ({
					commissions: [commission, ...state.commissions],
					progress: [progressItem, ...state.progress],
				}));

				return commission;
			},

			setCommissionStatus: (id, status) =>
				set((state) => ({
					commissions: state.commissions.map((commission) =>
						commission.id === id
							? { ...commission, status, updated_at: now() }
							: commission,
					),
				})),

			setPaymentStatus: (
				id,
				payment_status,
				payment_method,
				card_last_four,
			) => {
				const commission = get().commissions.find((item) => item.id === id);
				if (!commission)
					return { success: false, message: "Komisi tidak ditemukan." };

				if (payment_status === "paid") {
					if (payment_method === "wallet") {
						const clientUser = useUserManagementStore
							.getState()
							.users.find((u) => u.id === commission.client_id);
						if (!clientUser)
							return { success: false, message: "Klien tidak ditemukan." };
						if (clientUser.balance < commission.price) {
							return {
								success: false,
								message: "Saldo E-Wallet tidak mencukupi.",
							};
						}

						const newBalance = clientUser.balance - commission.price;
						useUserManagementStore
							.getState()
							.updateUser(clientUser.id, { balance: newBalance });
						if (useUserStore.getState().user?.id === clientUser.id) {
							useUserStore
								.getState()
								.updateCurrentUser({ balance: newBalance });
						}
					}
				}

				set((state) => ({
					commissions: state.commissions.map((c) =>
						c.id === id
							? {
									...c,
									payment_status,
									payment_method,
									card_last_four,
									updated_at: now(),
								}
							: c,
					),
				}));
				return { success: true, message: "Pembayaran berhasil diproses." };
			},

			uploadDummyResult: (id) =>
				set((state) => ({
					commissions: state.commissions.map((commission) =>
						commission.id === id
							? { ...commission, status: "revision", updated_at: now() }
							: commission,
					),
					progress: state.progress.map((item) =>
						item.commission_id === id
							? {
									...item,
									sketch_url:
										item.sketch_url ??
										"https://picsum.photos/seed/wip-proof/900/650",
									final_artwork_url:
										item.final_artwork_url ??
										"https://picsum.photos/seed/final-proof/900/650",
									updated_at: now(),
								}
							: item,
					),
				})),

			approveResult: (id) => {
				const current = get().progress.find(
					(item) => item.commission_id === id,
				);
				if (!current?.final_artwork_url) return;

				const commission = get().commissions.find((c) => c.id === id);
				if (commission) {
					const artistUser = useUserManagementStore
						.getState()
						.users.find((u) => u.id === commission.artists_id);
					if (artistUser) {
						const newBalance = artistUser.balance + commission.price;
						useUserManagementStore
							.getState()
							.updateUser(artistUser.id, { balance: newBalance });
						if (useUserStore.getState().user?.id === artistUser.id) {
							useUserStore
								.getState()
								.updateCurrentUser({ balance: newBalance });
						}
					}
				}

				set((state) => ({
					commissions: state.commissions.map((commission) =>
						commission.id === id
							? {
									...commission,
									status: "completed",
									payment_status: "released",
									updated_at: now(),
								}
							: commission,
					),
					progress: state.progress.map((item) =>
						item.commission_id === id
							? { ...item, final_artwork_approved: true, updated_at: now() }
							: item,
					),
				}));
			},

			addRevision: (commission_id, user_id, comment) => {
				const trimmed = comment.trim();
				if (!trimmed) return;
				const updatedAt = now();

				const revision: Revision = {
					id: `r-${Date.now()}`,
					commission_id,
					user_id,
					comment: trimmed,
					created_at: updatedAt,
				};

				set((state) => ({
					revisions: [revision, ...state.revisions],
					commissions: state.commissions.map((commission) =>
						commission.id === commission_id
							? { ...commission, updated_at: updatedAt }
							: commission,
					),
				}));
			},

			fileDispute: (commission_id, reason) => {
				const commission = get().commissions.find(
					(c) => c.id === commission_id,
				);
				if (!commission)
					return { success: false, message: "Komisi tidak ditemukan." };

				const dispute: DisputeLog = {
					id: `d-${Date.now()}`,
					commission_id,
					is_disputed: true,
					reason,
					status: "pending",
					mediator_id: null,
					created_at: now(),
				};

				set((state) => ({
					disputes: [dispute, ...state.disputes],
					commissions: state.commissions.map((c) =>
						c.id === commission_id
							? { ...c, status: "disputed", updated_at: now() }
							: c,
					),
				}));

				return { success: true, message: "Dispute berhasil diajukan." };
			},

			resolveDispute: (commission_id, approved, mediator_id) => {
				const commission = get().commissions.find(
					(c) => c.id === commission_id,
				);
				if (!commission)
					return { success: false, message: "Komisi tidak ditemukan." };

				const dispute = get().disputes.find(
					(d) => d.commission_id === commission_id && d.status === "pending",
				);
				if (!dispute)
					return {
						success: false,
						message: "Sengketa pending tidak ditemukan.",
					};

				if (approved) {
					if (commission.payment_method === "wallet") {
						const clientUser = useUserManagementStore
							.getState()
							.users.find((u) => u.id === commission.client_id);
						if (clientUser) {
							const newBalance = clientUser.balance + commission.price;
							useUserManagementStore
								.getState()
								.updateUser(clientUser.id, { balance: newBalance });
							if (useUserStore.getState().user?.id === clientUser.id) {
								useUserStore
									.getState()
									.updateCurrentUser({ balance: newBalance });
							}
						}
					}

					set((state) => ({
						disputes: state.disputes.map((d) =>
							d.id === dispute.id
								? { ...d, status: "approved", mediator_id, is_disputed: false }
								: d,
						),
						commissions: state.commissions.map((c) =>
							c.id === commission_id
								? {
										...c,
										status: "cancelled",
										payment_status: "refunded",
										updated_at: now(),
									}
								: c,
						),
					}));
				} else {
					const artistUser = useUserManagementStore
						.getState()
						.users.find((u) => u.id === commission.artists_id);
					if (artistUser) {
						const newBalance = artistUser.balance + commission.price;
						useUserManagementStore
							.getState()
							.updateUser(artistUser.id, { balance: newBalance });
						if (useUserStore.getState().user?.id === artistUser.id) {
							useUserStore
								.getState()
								.updateCurrentUser({ balance: newBalance });
						}
					}

					set((state) => ({
						disputes: state.disputes.map((d) =>
							d.id === dispute.id
								? { ...d, status: "rejected", mediator_id, is_disputed: false }
								: d,
						),
						commissions: state.commissions.map((c) =>
							c.id === commission_id
								? {
										...c,
										status: "completed",
										payment_status: "released",
										updated_at: now(),
									}
								: c,
						),
					}));
				}

				return {
					success: true,
					message: `Dispute berhasil ${approved ? "disetujui" : "ditolak"}.`,
				};
			},
		}),
		{
			name: "trubrush-commissions",
		},
	),
);

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Transaction {
	id: string;
	user_id: string;
	type: "payment" | "refund" | "release" | "topup";
	amount: number;
	title: string;
	created_at: string;
}

interface TransactionState {
	transactions: Transaction[];
	addTransaction: (payload: Omit<Transaction, "id" | "created_at">) => void;
	getTransactionsByUserId: (userId: string) => Transaction[];
}

export const useTransactionStore = create<TransactionState>()(
	persist(
		(set, get) => ({
			transactions: [
				{
					id: "tx-init-client",
					user_id: "u-005", // Client
					type: "topup",
					amount: 2000000,
					title: "Saldo awal E-Wallet (Registrasi)",
					created_at: "2024-06-01T08:00:00Z",
				},
				{
					id: "tx-init-artist",
					user_id: "u-001", // Artist
					type: "topup",
					amount: 0,
					title: "Saldo awal E-Wallet (Registrasi)",
					created_at: "2024-05-01T08:00:00Z",
				},
			],
			addTransaction: (payload) => {
				const tx: Transaction = {
					id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
					...payload,
					created_at: new Date().toISOString(),
				};
				set((state) => ({ transactions: [tx, ...state.transactions] }));
			},
			getTransactionsByUserId: (userId) => {
				return get().transactions.filter((tx) => tx.user_id === userId);
			},
		}),
		{
			name: "trubrush-transactions",
		},
	),
);

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import initialCommissions from "@/data/commissions";
import type {
  Commission,
  CommissionProgress,
  Revision,
  CommissionState,
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
          final_artwork_url: "https://picsum.photos/seed/commission-final-1/900/650",
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
          comment: "Tolong pertahankan palet warna biru dan tambahkan variasi pose.",
          created_at: "2024-07-06T09:10:00Z",
        },
      ],

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

      setPaymentStatus: (id, payment_status) =>
        set((state) => ({
          commissions: state.commissions.map((commission) =>
            commission.id === id
              ? { ...commission, payment_status, updated_at: now() }
              : commission,
          ),
        })),

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
                  sketch_url: item.sketch_url ?? "https://picsum.photos/seed/wip-proof/900/650",
                  final_artwork_url:
                    item.final_artwork_url ?? "https://picsum.photos/seed/final-proof/900/650",
                  updated_at: now(),
                }
              : item,
          ),
        })),

      approveResult: (id) => {
        const current = get().progress.find((item) => item.commission_id === id);
        if (!current?.final_artwork_url) return;

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
    }),
    {
      name: "trubrush-commissions",
    },
  ),
);

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import initialProfiles from "@/data/profiles";
import type { Profile } from "@/types";

interface UpdateProfilePayload {
  bio?: string | null;
  is_open_for_commission?: boolean;
  base_price_idr?: number | null;
}

interface ActionResult {
  success: boolean;
  message: string;
}

interface ProfileState {
  profiles: Profile[];
  getProfileByUserId: (userId: string) => Profile | undefined;
  updateProfile: (userId: string, payload: UpdateProfilePayload) => ActionResult;
}

const now = () => new Date().toISOString();

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: initialProfiles,

      getProfileByUserId: (userId) =>
        get().profiles.find((profile) => profile.user_id === userId),

      updateProfile: (userId, payload) => {
        const target = get().profiles.find((profile) => profile.user_id === userId);

        if (!target) {
          return { success: false, message: "Profile tidak ditemukan." };
        }

        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.user_id === userId
              ? { ...profile, ...payload, updated_at: now() }
              : profile,
          ),
        }));

        return { success: true, message: "Profile berhasil diperbarui." };
      },
    }),
    {
      name: "trubrush-profiles",
    },
  ),
);
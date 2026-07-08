import type { User } from "@/types";

export type ProfileUser = Omit<User, "password">;

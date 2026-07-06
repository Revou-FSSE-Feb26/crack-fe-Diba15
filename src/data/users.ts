import { User } from "@/types";

// Mock users for local auth (no backend yet).
// Passwords are plain-text intentionally — replace with hashed values once backend is ready.
const users: User[] = [
  // --- Artists ---
  {
    id: "u-001",
    name: "Ari Ramadan",
    email: "ari@example.com",
    password: "artist123",
    role: "artist",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
  },
  {
    id: "u-002",
    name: "Nadia Suryani",
    email: "nadia@example.com",
    password: "artist123",
    role: "artist",
    created_at: "2024-02-03T09:15:00Z",
    updated_at: "2024-02-03T09:15:00Z",
  },
  {
    id: "u-003",
    name: "Budi Laksono",
    email: "budi@example.com",
    password: "artist123",
    role: "artist",
    created_at: "2024-03-20T11:00:00Z",
    updated_at: "2024-03-20T11:00:00Z",
  },
  {
    id: "u-004",
    name: "Rina Pertiwi",
    email: "rina@example.com",
    password: "artist123",
    role: "artist",
    created_at: "2024-04-05T14:30:00Z",
    updated_at: "2024-04-05T14:30:00Z",
  },
  // --- Clients ---
  {
    id: "u-005",
    name: "Dimas Prasetyo",
    email: "dimas@example.com",
    password: "client123",
    role: "client",
    created_at: "2024-05-01T10:00:00Z",
    updated_at: "2024-05-01T10:00:00Z",
  },
  {
    id: "u-006",
    name: "Sari Dewi",
    email: "sari@example.com",
    password: "client123",
    role: "client",
    created_at: "2024-05-15T13:00:00Z",
    updated_at: "2024-05-15T13:00:00Z",
  },
  // --- Curators ---
  {
    id: "u-008",
    name: "Hendra Kurniawan",
    email: "hendra@trubrush.com",
    password: "curator123",
    role: "curator",
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-05T08:00:00Z",
  },
  // --- Admin ---
  {
    id: "u-007",
    name: "Admin TruBrush",
    email: "admin@trubrush.com",
    password: "admin123",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export default users;

import { User } from "@/types";

const users: User[] = [
    {
        id: "u-001",
        name: "Ari Ramadan",
        email: "ari@example.com",
        password: "hashed_password",
        role: "artist",
        created_at: "2024-01-10T08:00:00Z",
        updated_at: "2024-01-10T08:00:00Z",
    },
    {
        id: "u-002",
        name: "Nadia Suryani",
        email: "nadia@example.com",
        password: "hashed_password",
        role: "artist",
        created_at: "2024-02-03T09:15:00Z",
        updated_at: "2024-02-03T09:15:00Z",
    },
    {
        id: "u-003",
        name: "Budi Laksono",
        email: "budi@example.com",
        password: "hashed_password",
        role: "artist",
        created_at: "2024-03-20T11:00:00Z",
        updated_at: "2024-03-20T11:00:00Z",
    },
    {
        id: "u-004",
        name: "Rina Pertiwi",
        email: "rina@example.com",
        password: "hashed_password",
        role: "artist",
        created_at: "2024-04-05T14:30:00Z",
        updated_at: "2024-04-05T14:30:00Z",
    },
];

export default users;
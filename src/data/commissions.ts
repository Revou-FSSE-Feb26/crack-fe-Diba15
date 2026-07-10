import type { Commission } from "@/types";

const commissions: Commission[] = [
	{
		id: "c-001",
		artists_id: "u-001",
		client_id: "u-005",
		commission_title: "Ilustrasi keluarga bergaya watercolor",
		description:
			"Potret keluarga kecil dengan latar taman kota untuk hadiah ulang tahun.",
		price: 450000,
		status: "completed",
		payment_status: "released",
		created_at: "2024-06-12T09:00:00Z",
		updated_at: "2024-06-26T15:30:00Z",
	},
	{
		id: "c-002",
		artists_id: "u-002",
		client_id: "u-005",
		commission_title: "Character sheet original character",
		description:
			"Desain karakter fantasy dengan tiga pose dan palet warna utama.",
		price: 650000,
		status: "in_progress",
		payment_status: "paid",
		created_at: "2024-07-02T10:15:00Z",
		updated_at: "2024-07-06T08:45:00Z",
	},
	{
		id: "c-003",
		artists_id: "u-003",
		client_id: "u-006",
		commission_title: "Ink portrait folklore theme",
		description:
			"Portrait hitam putih dengan ornamen folklore untuk koleksi pribadi.",
		price: 300000,
		status: "revision",
		payment_status: "paid",
		created_at: "2024-07-01T13:20:00Z",
		updated_at: "2024-07-05T11:10:00Z",
	},
	{
		id: "c-004",
		artists_id: "u-001",
		client_id: "u-006",
		commission_title: "Landscape kota hujan",
		description:
			"Lukisan digital bergaya cat air untuk cover playlist personal.",
		price: 275000,
		status: "pending",
		payment_status: "unpaid",
		created_at: "2024-07-04T16:00:00Z",
		updated_at: "2024-07-04T16:00:00Z",
	},
];

export default commissions;

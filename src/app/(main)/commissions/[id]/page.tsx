import CommissionDetailContent from "@/components/commission/CommissionDetailContent";

interface CommissionDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CommissionDetailPage({
	params,
}: CommissionDetailPageProps) {
	const { id } = await params;

	return <CommissionDetailContent commissionId={id} />;
}

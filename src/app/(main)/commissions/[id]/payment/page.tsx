import { CommissionPaymentContent } from "@/components/commission/CommissionPaymentContent";

interface CommissionPaymentPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CommissionPaymentPage({
	params,
}: CommissionPaymentPageProps) {
	const { id } = await params;

	return <CommissionPaymentContent commissionId={id} />;
}

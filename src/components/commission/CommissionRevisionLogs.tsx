import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import type { Revision } from "@/types";
import { formatDate } from "@/utils";

interface CommissionRevisionLogsProps {
	thread: Revision[];
	onAddComment: (comment: string) => void;
	artistName?: string;
	clientName?: string;
	artistId?: string;
}

export default function CommissionRevisionLogs({
	thread,
	onAddComment,
	artistName = "Artist",
	clientName = "Client",
	artistId,
}: CommissionRevisionLogsProps) {
	const [comment, setComment] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!comment.trim()) return;
		onAddComment(comment.trim());
		setComment("");
	};

	return (
		<div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
			<div className="flex items-center gap-2 mb-3">
				<MessageSquare className="w-4 h-4 text-primary" />
				<p className="font-medium text-sm text-content">Komentar dan revisi</p>
			</div>
			<div className="space-y-2">
				{thread.length === 0 ? (
					<p className="text-sm text-content-muted">Belum ada komentar.</p>
				) : (
					thread.map((item) => {
						const authorName =
							artistId && item.user_id === artistId ? artistName : clientName;

						return (
							<div key={item.id} className="rounded-lg bg-content/5 px-3 py-2">
								<p className="text-xs text-content-muted">
									{authorName} · {formatDate(item.created_at)}
								</p>
								<p className="mt-1 text-sm text-content">{item.comment}</p>
							</div>
						);
					})
				)}
			</div>
			<form
				className="mt-3 flex flex-col gap-2 sm:flex-row"
				onSubmit={handleSubmit}
			>
				<input
					value={comment}
					onChange={(event) => setComment(event.target.value)}
					placeholder="Tulis komentar, negosiasi harga, atau balasan..."
					className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700"
				/>
				<Button type="submit" className="justify-center text-sm">
					Kirim
				</Button>
			</form>
		</div>
	);
}

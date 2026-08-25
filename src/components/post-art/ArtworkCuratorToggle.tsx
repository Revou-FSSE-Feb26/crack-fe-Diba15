import { ShieldCheck } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { PostArtworkForm } from "@/hooks/useArtworkUploadForm";

interface ArtworkCuratorToggleProps {
	register: UseFormRegister<PostArtworkForm>;
}

export default function ArtworkCuratorToggle({
	register,
}: ArtworkCuratorToggleProps) {
	return (
		<div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 sm:p-6 space-y-3">
			<div className="flex items-start gap-3.5">
				<div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
					<ShieldCheck className="h-5 w-5" />
				</div>
				<div className="flex-1 space-y-1">
					<label
						htmlFor="reviewByCurator"
						className="font-heading text-sm font-bold text-content cursor-pointer flex flex-wrap items-center gap-2"
					>
						Periksa karya oleh kurator TruBrush
						<span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-background px-2 py-0.5 rounded-full">
							Direkomendasikan
						</span>
					</label>
					<p className="text-xs text-content-muted leading-relaxed">
						Jika dicentang, karya akan ditinjau oleh kurator manusia terlebih
						dahulu untuk memastikan keaslian non-AI. Karya yang lolos kurasi
						akan berkontribusi pada status <strong>Artist Terverifikasi</strong>{" "}
						(5 portofolio lolos kurasi).
					</p>
				</div>
				<input
					type="checkbox"
					id="reviewByCurator"
					{...register("reviewByCurator")}
					className="checkbox checkbox-primary rounded-md mt-1 cursor-pointer"
				/>
			</div>
		</div>
	);
}

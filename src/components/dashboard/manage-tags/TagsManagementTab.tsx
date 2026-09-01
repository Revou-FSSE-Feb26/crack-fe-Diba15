"use client";

import { Search, Tags } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import TagFormModal from "@/components/dashboard/manage-tags/TagFormModal";
import DataTable from "@/components/ui/data-table/DataTable";
import {
	useCreateTag,
	useDeleteTag,
	useUpdateTag,
} from "@/hooks/useArtworkQueries";
import { usePagination, useResetPageOnChange } from "@/hooks/usePagination";
import { useModalStore } from "@/store/ModalStore";
import type { Tag } from "@/types";
import { createTagTableColumns } from "@/utils/dashboard/manage-tags/tagTableColumns";

interface TagsManagementTabProps {
	tagsList: Tag[];
	isLoading: boolean;
	isCreateModalOpen?: boolean;
	onCloseCreateModal?: () => void;
}

export function TagsManagementTab({
	tagsList,
	isLoading,
	isCreateModalOpen = false,
	onCloseCreateModal,
}: TagsManagementTabProps) {
	const { openModal } = useModalStore();
	const createTagMutation = useCreateTag();
	const updateTagMutation = useUpdateTag();
	const deleteTagMutation = useDeleteTag();

	const [tagSearch, setTagSearch] = useState("");
	const [isTagModalOpen, setIsTagModalOpen] = useState(false);
	const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);

	// Sync external create modal trigger if passed
	const isModalVisible = isTagModalOpen || isCreateModalOpen;

	const { setPage, setPerPage, paginate, resetPage } = usePagination({
		initialPerPage: 10,
	});

	useResetPageOnChange(resetPage, [tagSearch]);

	const filteredTags = useMemo(() => {
		const query = tagSearch.trim().toLowerCase();
		if (!query) return tagsList;
		return tagsList.filter(
			(t) =>
				t.tag_name.toLowerCase().includes(query) ||
				t.id.toLowerCase().includes(query),
		);
	}, [tagsList, tagSearch]);

	const paginatedTags = useMemo(
		() => paginate(filteredTags),
		[filteredTags, paginate],
	);

	const handleOpenEditTag = useCallback((tag: Tag) => {
		setTagToEdit(tag);
		setIsTagModalOpen(true);
	}, []);

	const handleDeleteTag = useCallback(
		(tag: Tag) => {
			const count = tag.count ?? 0;
			const warningExtra =
				count > 0
					? ` Tag ini saat ini masih digunakan pada ${count} karya seni. Menghapusnya akan melepaskan tag ini dari karya tersebut.`
					: "";

			openModal({
				title: `Hapus Tag "${tag.tag_name}"?`,
				description: `Apakah Anda yakin ingin menghapus tag #${tag.tag_name} dari database?${warningExtra}`,
				type: "confirm",
				variant: "danger",
				confirmLabel: "Hapus Tag",
				cancelLabel: "Batal",
				onConfirm: () => {
					deleteTagMutation.mutate(tag.id);
				},
			});
		},
		[openModal, deleteTagMutation],
	);

	const tagColumns = useMemo(
		() =>
			createTagTableColumns({
				onEdit: handleOpenEditTag,
				onDelete: handleDeleteTag,
			}),
		[handleDeleteTag, handleOpenEditTag],
	);

	const handleSubmitTag = (tagName: string) => {
		if (tagToEdit) {
			updateTagMutation.mutate(
				{ id: tagToEdit.id, payload: { tagName } },
				{
					onSuccess: () => {
						setIsTagModalOpen(false);
						setTagToEdit(null);
						onCloseCreateModal?.();
					},
				},
			);
		} else {
			createTagMutation.mutate(
				{ tagName },
				{
					onSuccess: () => {
						setIsTagModalOpen(false);
						onCloseCreateModal?.();
					},
				},
			);
		}
	};

	const handleCloseModal = () => {
		setIsTagModalOpen(false);
		setTagToEdit(null);
		onCloseCreateModal?.();
	};

	return (
		<div className="space-y-4">
			{/* Filter Toolbar */}
			<div className="rounded-2xl border border-content/10 bg-surface p-4 space-y-3 print:hidden">
				<div className="relative w-full max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
					<input
						type="text"
						value={tagSearch}
						onChange={(event) => setTagSearch(event.target.value)}
						placeholder="Cari nama tag atau ID..."
						className="input input-sm w-full pl-9 bg-background border-content/10 text-xs"
					/>
				</div>
			</div>

			{/* Tags Table */}
			<div className="rounded-2xl border border-content/10 bg-surface overflow-hidden">
				<DataTable
					columns={tagColumns}
					pagination={paginatedTags}
					getRowKey={(row) => row.id}
					isLoading={isLoading}
					onPageChange={setPage}
					onPerPageChange={setPerPage}
					itemLabel="tag"
					emptyState={
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Tags className="h-10 w-10 text-content-muted mb-2 opacity-40" />
							<p className="text-sm font-semibold text-content">
								Tidak Ada Tag Ditemukan
							</p>
							<p className="text-xs text-content-muted mt-1 max-w-xs">
								Belum ada tag yang cocok dengan kata kunci pencarian Anda.
							</p>
						</div>
					}
				/>
			</div>

			{/* Tag Form Modal (Create / Edit) */}
			<TagFormModal
				isOpen={isModalVisible}
				tagToEdit={tagToEdit}
				isLoading={createTagMutation.isPending || updateTagMutation.isPending}
				onClose={handleCloseModal}
				onSubmit={handleSubmitTag}
			/>
		</div>
	);
}

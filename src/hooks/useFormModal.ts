import { useEffect, useRef } from "react";
import { useModalStore } from "@/store/ModalStore";

interface UseFormModalOptions {
	modalId: string;
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Reusable hook to synchronize a form-based modal component with global ModalStore.
 * Handles auto-cleanup on unmount, close on outside trigger, and callback references.
 */
export function useFormModal({
	modalId,
	isOpen,
	onClose,
}: UseFormModalOptions) {
	const { openModal, closeModal, isOpen: globalOpen, config } = useModalStore();

	const onCloseRef = useRef(onClose);
	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!isOpen) {
			if (globalOpen && config?.id === modalId) {
				closeModal();
			}
		}
	}, [isOpen, globalOpen, config?.id, closeModal, modalId]);

	return {
		openModal,
		closeModal,
		globalOpen,
		config,
		isCurrentModalOpen: globalOpen && config?.id === modalId,
		onCloseRef,
	};
}

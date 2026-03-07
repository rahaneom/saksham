import { useEffect, useRef } from "react";

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "btn-primary",
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-bottom sm:modal-middle [&::backdrop]:!bg-transparent"
      onClose={onClose}
    >
      <div className="modal-box rounded-lg sm:rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-6">
        <h3 className="font-bold text-base sm:text-lg text-base-content">{title}</h3>
        <p className="py-2 sm:py-3 text-xs sm:text-sm text-base-content/70">{message}</p>

        <div className="modal-action gap-2 sm:gap-3">
          <button className="btn btn-md btn-error hover:bg-red-600 px-3 sm:px-4" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className={`btn btn-md ${confirmButtonClass} px-3 sm:px-4`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop opacity-0 pointer-events-none"></form>
    </dialog>
  );
}

export default ConfirmModal;

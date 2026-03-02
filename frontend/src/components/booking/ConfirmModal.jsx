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
      <div className="modal-box rounded-lg sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
        <h3 className="font-bold text-base sm:text-lg text-slate-800">{title}</h3>
        <p className="py-2 sm:py-3 text-xs sm:text-sm text-slate-600">{message}</p>

        <div className="modal-action gap-2 sm:gap-3">
          <button className="btn btn-xs sm:btn-sm btn-ghost hover:bg-red-500 px-3 sm:px-4" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className={`btn btn-xs sm:btn-sm ${confirmButtonClass} px-3 sm:px-4`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop opacity-0 pointer-events-none"></form>
    </dialog>
  );
}

export default ConfirmModal;

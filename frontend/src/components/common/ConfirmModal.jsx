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
      <div className="modal-box rounded-2xl border border-base-300 bg-base-100">
        <h3 className="font-bold text-lg text-base-content">{title}</h3>
        <p className="py-3 text-base-content/70">{message}</p>

        <div className="modal-action">
          <button className="btn btn-ghost hover:bg-red-500 px-4" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className={`btn ${confirmButtonClass} px-4`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop opacity-0 pointer-events-none"></form>
    </dialog>
  );
}

export default ConfirmModal;

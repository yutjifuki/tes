import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay confirm-modal-overlay">
      <div className="modal-content confirm-modal-content">
        <h3>{title || "Konfirmasi Tindakan"}</h3>
        <p>{message || "Apakah Anda yakin ingin melanjutkan tindakan ini?"}</p>
        <div className="confirm-modal-actions">
          <button onClick={onConfirm} className="confirm-btn-yes">
            {confirmText}
          </button>
          <button onClick={onClose} className="confirm-btn-no">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

export default function ConfirmModal({
  cancelLabel = 'Cancel',
  confirmLabel = 'Delete',
  message,
  title,
  onCancel,
  onConfirm
}) {
  return (
    <div
      className="modal-backdrop-custom"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="confirm-modal-title" className="modal-title">
              {title}
            </h5>
            <button type="button" className="close" onClick={onCancel} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className="confirm-modal-message">{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light btn-sm" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={onConfirm} autoFocus>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

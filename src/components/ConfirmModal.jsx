/**
 * Renders a reusable confirmation dialog with cancel and destructive confirm actions.
 *
 * @param {object} props Component props.
 * @param {string} [props.cancelLabel='Cancel'] Text for the cancel button.
 * @param {string} [props.confirmLabel='Delete'] Text for the confirm button.
 * @param {string} props.message Body copy describing the action being confirmed.
 * @param {string} props.title Dialog heading.
 * @param {() => void} props.onCancel Handler called when the dialog is dismissed.
 * @param {() => void} props.onConfirm Handler called when the confirm button is clicked.
 * @returns {JSX.Element} A centered modal confirmation prompt.
 */
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

import '../styles/ConfirmDialog.css';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="confirm-backdrop" onClick={onCancel} />

            {/* Dialog */}
            <div className="confirm-dialog">
                <div className="confirm-content">
                    <h3 className="confirm-title">{title}</h3>
                    <p className="confirm-message">{message}</p>
                </div>

                <div className="confirm-actions">
                    <button
                        onClick={onCancel}
                        className="confirm-btn confirm-btn-cancel"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="confirm-btn confirm-btn-confirm"
                        autoFocus
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </>
    );
};

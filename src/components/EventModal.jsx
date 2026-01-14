import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/EventModal.css';

export const EventModal = ({ isOpen, onClose, onSave, selectedDate, editingEvent }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingEvent) {
            setTitle(editingEvent.title);
        } else {
            setTitle('');
        }
        setError('');
    }, [editingEvent, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('El título es requerido');
            return;
        }

        onSave({ title: title.trim() });
        setTitle('');
        setError('');
        onClose();
    };

    const handleClose = () => {
        setTitle('');
        setError('');
        onClose();
    };

    if (!isOpen || !selectedDate) return null;

    const { year, month, day } = selectedDate;
    const dateStr = `${day}/${month + 1}/${year}`;

    return (
        <>
            <div className="modal-backdrop" onClick={handleClose} />
            <div className="event-modal">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
                    </h2>
                    <button className="modal-close" onClick={handleClose} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-date">
                    <span>{dateStr}</span>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-field">
                        <label htmlFor="event-title" className="form-label">
                            Título del evento
                        </label>
                        <input
                            id="event-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Reunión con equipo"
                            className={`form-input ${error ? 'error' : ''}`}
                            autoFocus
                        />
                        {error && <span className="form-error">{error}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={handleClose} className="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingEvent ? 'Guardar' : 'Crear Evento'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

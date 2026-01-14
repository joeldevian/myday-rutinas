import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { availableIcons } from '../utils/defaultRoutines';
import { getTimeOfDay } from '../utils/routineHelpers';
import '../styles/RoutineModal.css';

export const RoutineModal = ({ isOpen, onClose, onSave, routine, defaultTimeOfDay }) => {
    const [formData, setFormData] = useState({
        title: '',
        time: '09:00',
        icon: 'Circle',
    });

    const [errors, setErrors] = useState({});

    // Pre-cargar datos si estamos editando
    useEffect(() => {
        if (routine) {
            setFormData({
                title: routine.title,
                time: routine.time,
                icon: routine.icon,
            });
        } else {
            // Si es nuevo, resetear
            setFormData({
                title: '',
                time: getDefaultTime(defaultTimeOfDay),
                icon: 'Circle',
            });
        }
        setErrors({});
    }, [routine, defaultTimeOfDay, isOpen]);

    const getDefaultTime = (timeOfDay) => {
        if (timeOfDay === 'morning') return '09:00';
        if (timeOfDay === 'afternoon') return '14:00';
        if (timeOfDay === 'night') return '20:00';
        return '09:00';
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        }

        if (!formData.time) {
            newErrors.time = 'La hora es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const routineData = {
            ...formData,
            title: formData.title.trim(),
        };

        onSave(routineData);
        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop" onClick={onClose} />

            {/* Modal */}
            <div className="routine-modal">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {routine ? 'Editar Rutina' : 'Nueva Rutina'}
                    </h2>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Título */}
                    <div className="form-field">
                        <label htmlFor="title" className="form-label">
                            Título
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            placeholder="Ej: Ejercicio, Desayuno, Trabajo..."
                            autoFocus
                        />
                        {errors.title && <span className="form-error">{errors.title}</span>}
                    </div>

                    {/* Hora */}
                    <div className="form-field">
                        <label htmlFor="time" className="form-label">
                            Hora
                        </label>
                        <input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                            className={`form-input ${errors.time ? 'error' : ''}`}
                        />
                        {errors.time && <span className="form-error">{errors.time}</span>}
                    </div>

                    {/* Selector de Iconos */}
                    <div className="form-field">
                        <label className="form-label">Icono</label>
                        <div className="icon-grid">
                            {availableIcons.map((iconName) => {
                                const IconComponent = Icons[iconName];
                                const isSelected = formData.icon === iconName;

                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        className={`icon-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleChange('icon', iconName)}
                                        title={iconName}
                                    >
                                        <IconComponent size={20} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {routine ? 'Guardar Cambios' : 'Crear Rutina'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

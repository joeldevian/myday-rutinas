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
        endTime: '10:00',
        icon: 'Circle',
    });

    const [errors, setErrors] = useState({});

    // Pre-cargar datos si estamos editando
    useEffect(() => {
        if (routine) {
            setFormData({
                title: routine.title,
                time: routine.time,
                endTime: routine.endTime || '10:00',
                icon: routine.icon,
            });
        } else {
            // Si es nuevo, resetear
            const defaultStart = getDefaultTime(defaultTimeOfDay);
            setFormData({
                title: '',
                time: defaultStart,
                endTime: getDefaultEndTime(defaultStart),
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

    const getDefaultEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':');
        const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
        return `${endHour}:${minutes}`;
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        }

        if (!formData.time) {
            newErrors.time = 'La hora de inicio es requerida';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'La hora de finalización es requerida';
        }

        if (formData.time && formData.endTime && formData.endTime <= formData.time) {
            newErrors.endTime = 'La hora de finalización debe ser posterior a la de inicio';
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

                    {/* Hora de Inicio */}
                    <div className="form-field">
                        <label htmlFor="time" className="form-label">
                            Hora de Inicio
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

                    {/* Hora de Finalización */}
                    <div className="form-field">
                        <label htmlFor="endTime" className="form-label">
                            Hora de Finalización
                        </label>
                        <input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => handleChange('endTime', e.target.value)}
                            className={`form-input ${errors.endTime ? 'error' : ''}`}
                        />
                        {errors.endTime && <span className="form-error">{errors.endTime}</span>}
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

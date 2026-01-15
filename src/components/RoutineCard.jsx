import { useState } from 'react';
import * as Icons from 'lucide-react';
import { isPastTime, isCurrentTime } from '../utils/routineHelpers';
import '../styles/RoutineCard.css';

export const RoutineCard = ({
    routine,
    onToggleComplete,
    onEdit,
    onDelete,
    isNext = false
}) => {
    const [showMenu, setShowMenu] = useState(false);

    // Obtener el icono dinámicamente
    const IconComponent = Icons[routine.icon] || Icons.Circle;

    // Determinar estado visual
    const isPast = isPastTime(routine.time);
    const isCurrent = isCurrentTime(routine.time);

    const cardClass = `routine-card ${routine.completed ? 'completed' : ''} ${isCurrent ? 'current' : isPast ? 'past' : 'future'
        }`;

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEdit = () => {
        setShowMenu(false);
        onEdit(routine);
    };

    const handleDelete = () => {
        setShowMenu(false);
        if (window.confirm(`¿Eliminar "${routine.title}"?`)) {
            onDelete(routine.id);
        }
    };

    return (
        <div className={cardClass}>
            {/* Badges */}
            {isCurrent && (
                <div className="routine-badge badge-now">AHORA</div>
            )}
            {isNext && !isCurrent && !isPast && (
                <div className="routine-badge badge-next">SIGUIENTE</div>
            )}

            <div className="routine-card-main" onClick={() => onToggleComplete(routine.id)}>
                {/* Checkbox */}
                <div className="routine-checkbox">
                    <input
                        type="checkbox"
                        checked={routine.completed}
                        onChange={() => onToggleComplete(routine.id)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                {/* Icon */}
                <div className="routine-icon">
                    <IconComponent size={20} />
                </div>

                {/* Content */}
                <div className="routine-content">
                    <h4 className="routine-title">{routine.title}</h4>
                    <div className="routine-time-range">
                        <span className="routine-time">{routine.time}</span>
                        {routine.endTime && (
                            <>
                                <span className="routine-time-separator"> - </span>
                                <span className="routine-time">{routine.endTime}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Menu Button - Now inline */}
                <div className="routine-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="routine-menu-btn"
                        onClick={handleMenuToggle}
                        aria-label="Opciones"
                    >
                        <Icons.MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <>
                            <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
                            <div className="routine-menu">
                                <button onClick={handleEdit} className="menu-item">
                                    <Icons.Edit size={16} />
                                    <span>Editar</span>
                                </button>
                                <button onClick={handleDelete} className="menu-item menu-item-danger">
                                    <Icons.Trash2 size={16} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

import { Trash2, Edit } from 'lucide-react';
import { isToday, isPastDate, formatDateKey } from '../utils/calendarHelpers';
import '../styles/DayCell.css';

export const DayCell = ({ year, month, day, events, onAddEvent, onEditEvent, onDeleteEvent }) => {
    if (!day) return <div className="day-cell empty"></div>;

    const isCurrentDay = isToday(year, month, day);
    const isPast = isPastDate(year, month, day);
    const dateKey = formatDateKey(year, month, day);

    const handleClick = () => {
        onAddEvent(year, month, day);
    };

    const handleEditEvent = (e, event) => {
        e.stopPropagation();
        onEditEvent(dateKey, event);
    };

    const handleDeleteEvent = (e, eventId) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar este evento?')) {
            onDeleteEvent(dateKey, eventId);
        }
    };

    return (
        <div
            className={`day-cell ${isCurrentDay ? 'today' : ''} ${isPast ? 'past' : ''}`}
            onClick={handleClick}
        >
            <div className="day-number">{day}</div>

            {events.length > 0 && (
                <div className="day-events">
                    {events.slice(0, 2).map((event) => (
                        <div key={event.id} className="event-item" onClick={(e) => e.stopPropagation()}>
                            <span className="event-title" title={event.title}>
                                {event.title}
                            </span>
                            <div className="event-actions">
                                <button
                                    className="event-btn"
                                    onClick={(e) => handleEditEvent(e, event)}
                                    title="Editar"
                                >
                                    <Edit size={12} />
                                </button>
                                <button
                                    className="event-btn event-btn-danger"
                                    onClick={(e) => handleDeleteEvent(e, event.id)}
                                    title="Eliminar"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {events.length > 2 && (
                        <div className="more-events">+{events.length - 2} más</div>
                    )}
                </div>
            )}
        </div>
    );
};

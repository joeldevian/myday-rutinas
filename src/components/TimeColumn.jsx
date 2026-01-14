import { Plus } from 'lucide-react';
import { RoutineCard } from './RoutineCard';
import { filterRoutinesByTimeOfDay, translateTimeOfDay } from '../utils/routineHelpers';
import '../styles/TimeColumn.css';

export const TimeColumn = ({
    timeOfDay,
    routines,
    onToggleComplete,
    onEdit,
    onDelete,
    onAddRoutine,
    nextRoutineId,
}) => {
    const filteredRoutines = filterRoutinesByTimeOfDay(routines, timeOfDay);
    const title = translateTimeOfDay(timeOfDay);

    return (
        <div className="time-column">
            <div className="time-column-header">
                <h3 className="time-column-title">{title}</h3>
                <button
                    className="time-column-add-btn"
                    onClick={() => onAddRoutine(timeOfDay)}
                    title="Agregar rutina"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="time-column-body">
                {filteredRoutines.length === 0 ? (
                    <div className="time-column-empty">
                        <p>No hay rutinas programadas</p>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onAddRoutine(timeOfDay)}
                        >
                            <Plus size={16} />
                            Agregar rutina
                        </button>
                    </div>
                ) : (
                    <div className="routines-list">
                        {filteredRoutines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                onToggleComplete={onToggleComplete}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                isNext={routine.id === nextRoutineId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

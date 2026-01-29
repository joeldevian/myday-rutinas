import { useState } from 'react';
import { Plus, Target, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useWeeklyGoals } from '../hooks/useWeeklyGoals';
import { ConfirmDialog } from './ConfirmDialog';
import '../styles/WeeklyGoals.css';

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Componente para una fila de objetivo con checkboxes por día
 */
const WeeklyGoalRow = ({ goal, onToggleDay, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEdit = () => {
        setShowMenu(false);
        onEdit(goal);
    };

    const handleDelete = () => {
        setShowMenu(false);
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        setShowConfirmDelete(false);
        onDelete(goal.id);
    };

    // Calcular progreso de la fila
    const completedDays = goal.daysCompleted.filter(Boolean).length;

    return (
        <>
            <div className="weekly-goal-row">
                <div className="goal-info">
                    <Target size={16} className="goal-icon" />
                    <span className="goal-title">{goal.title}</span>
                    <span className="goal-progress">{completedDays}/7</span>
                </div>

                <div className="goal-days">
                    {goal.daysCompleted.map((completed, dayIndex) => (
                        <button
                            key={dayIndex}
                            className={`day-checkbox ${completed ? 'completed' : ''}`}
                            onClick={() => onToggleDay(goal.id, dayIndex)}
                            title={DAY_LABELS[dayIndex]}
                        >
                            <span className="checkbox-inner">
                                {completed && '✓'}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="goal-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="goal-menu-btn"
                        onClick={handleMenuToggle}
                        aria-label="Opciones"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
                            <div className="goal-menu">
                                <button onClick={handleEdit} className="menu-item">
                                    <Edit size={16} />
                                    <span>Editar</span>
                                </button>
                                <button onClick={handleDelete} className="menu-item menu-item-danger">
                                    <Trash2 size={16} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirmDelete}
                title="¿Eliminar objetivo?"
                message={`¿Estás seguro de que quieres eliminar "${goal.title}"? Esta acción no se puede deshacer.`}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirmDelete(false)}
            />
        </>
    );
};

/**
 * Modal simple para agregar/editar objetivo
 */
const GoalModal = ({ isOpen, onClose, onSave, goal }) => {
    const [title, setTitle] = useState(goal?.title || '');

    // Reset title when modal opens with new goal
    useState(() => {
        setTitle(goal?.title || '');
    }, [goal]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onSave(title.trim());
            setTitle('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal goal-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{goal ? 'Editar Objetivo' : 'Nuevo Objetivo'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="goalTitle">Nombre del objetivo</label>
                        <input
                            type="text"
                            id="goalTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Hacer ejercicio"
                            autoFocus
                            maxLength={100}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
                            {goal ? 'Guardar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Componente principal del grid de objetivos semanales
 */
export const WeeklyGoalsGrid = ({ userId }) => {
    const { goals, loading, createGoal, updateGoal, deleteGoal, toggleDayComplete, getWeekStats } = useWeeklyGoals(userId);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const stats = getWeekStats();

    const handleAddGoal = () => {
        setEditingGoal(null);
        setModalOpen(true);
    };

    const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setModalOpen(true);
    };

    const handleSaveGoal = (title) => {
        if (editingGoal) {
            updateGoal(editingGoal.id, title);
        } else {
            createGoal(title);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingGoal(null);
    };

    if (loading) {
        return (
            <div className="weekly-goals-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando objetivos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="weekly-goals-container">
            {/* Header */}
            <div className="weekly-goals-header">
                <div className="header-title">
                    <Target size={24} />
                    <h2>Objetivos de la Semana</h2>
                </div>
                <div className="header-actions">
                    {goals.length > 0 && (
                        <span className="week-progress">
                            {stats.percentage}% completado
                        </span>
                    )}
                    <button className="btn btn-primary" onClick={handleAddGoal}>
                        <Plus size={18} />
                        Agregar
                    </button>
                </div>
            </div>

            {/* Días header */}
            {goals.length > 0 && (
                <div className="days-header">
                    <div className="days-spacer"></div>
                    <div className="days-labels">
                        {DAY_LABELS.map((day, index) => (
                            <span key={index} className="day-label">{day}</span>
                        ))}
                    </div>
                    <div className="days-spacer-end"></div>
                </div>
            )}

            {/* Lista de objetivos */}
            <div className="weekly-goals-list">
                {goals.length === 0 ? (
                    <div className="empty-state">
                        <Target size={48} />
                        <h3>Sin objetivos esta semana</h3>
                        <p>Agrega tus objetivos semanales para hacer seguimiento de tu progreso</p>
                        <button className="btn btn-primary" onClick={handleAddGoal}>
                            <Plus size={18} />
                            Agregar primer objetivo
                        </button>
                    </div>
                ) : (
                    goals.map((goal) => (
                        <WeeklyGoalRow
                            key={goal.id}
                            goal={goal}
                            onToggleDay={toggleDayComplete}
                            onEdit={handleEditGoal}
                            onDelete={deleteGoal}
                        />
                    ))
                )}
            </div>

            {/* Barra de progreso general */}
            {goals.length > 0 && (
                <div className="weekly-progress-bar">
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${stats.percentage}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">
                        {stats.completedCheckboxes} de {stats.totalCheckboxes} tareas completadas
                    </span>
                </div>
            )}

            {/* Modal */}
            <GoalModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveGoal}
                goal={editingGoal}
            />
        </div>
    );
};

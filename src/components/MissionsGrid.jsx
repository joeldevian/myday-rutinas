import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { useMonthlyMissions } from '../hooks/useMonthlyMissions';
import { SkullIcon, SkullCrossbonesIcon } from './SkullIcon';
import { ConfirmDialog } from './ConfirmDialog';
import spartLogo from '../assets/img/spart.png';
import '../styles/Missions.css';

/**
 * Componente para cada misión individual
 */
const MissionRow = ({ mission, onToggle, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEdit = () => {
        setShowMenu(false);
        onEdit(mission);
    };

    const handleDelete = () => {
        setShowMenu(false);
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        setShowConfirmDelete(false);
        onDelete(mission.id);
    };

    return (
        <>
            <div
                className={`mission-row ${mission.completed ? 'completed' : ''}`}
                onClick={() => onToggle(mission.id)}
            >
                <div className="mission-checkbox">
                    <input
                        type="checkbox"
                        checked={mission.completed}
                        onChange={() => onToggle(mission.id)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className="checkbox-custom">
                        {mission.completed && <SkullIcon size={14} />}
                    </span>
                </div>

                <span className="mission-title">{mission.title}</span>

                <div className="mission-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="mission-menu-btn"
                        onClick={handleMenuToggle}
                        aria-label="Opciones"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
                            <div className="mission-menu">
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
                title="¿Eliminar misión?"
                message={`¿Estás seguro de que quieres eliminar "${mission.title}"? Esta acción no se puede deshacer.`}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirmDelete(false)}
            />
        </>
    );
};

/**
 * Modal para agregar/editar misión
 */
const MissionModal = ({ isOpen, onClose, onSave, mission }) => {
    const [title, setTitle] = useState(mission?.title || '');

    useEffect(() => {
        setTitle(mission?.title || '');
    }, [mission, isOpen]);

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
        <div className="modal-overlay mission-modal-overlay" onClick={onClose}>
            <div className="modal mission-modal" onClick={(e) => e.stopPropagation()}>
                <div className="mission-modal-header">
                    <SkullCrossbonesIcon size={32} className="modal-skull" />
                    <h3>{mission ? 'EDITAR MISIÓN' : 'NUEVA MISIÓN'}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="missionTitle">Descripción de la misión</label>
                        <input
                            type="text"
                            id="missionTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Completar curso de React"
                            autoFocus
                            maxLength={150}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            ABORTAR
                        </button>
                        <button type="submit" className="btn btn-danger" disabled={!title.trim()}>
                            {mission ? 'ACTUALIZAR' : 'CONFIRMAR'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Componente principal del módulo de Misiones
 */
export const MissionsGrid = ({ userId }) => {
    const {
        missions,
        loading,
        createMission,
        updateMission,
        deleteMission,
        toggleMissionComplete,
        getMonthStats
    } = useMonthlyMissions(userId);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingMission, setEditingMission] = useState(null);

    const stats = getMonthStats();

    const handleAddMission = () => {
        setEditingMission(null);
        setModalOpen(true);
    };

    const handleEditMission = (mission) => {
        setEditingMission(mission);
        setModalOpen(true);
    };

    const handleSaveMission = (title) => {
        if (editingMission) {
            updateMission(editingMission.id, title);
        } else {
            createMission(title);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingMission(null);
    };

    if (loading) {
        return (
            <div className="missions-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando misiones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="missions-container">
            {/* Header con tema militar */}
            <div className="missions-header">
                <div className="header-title-group">
                    <SkullCrossbonesIcon size={28} className="header-skull" />
                    <div className="header-text">
                        <h2>MISIONES</h2>
                        <span className="header-subtitle">Operaciones del mes</span>
                    </div>
                </div>
                <div className="header-date">
                    <Calendar size={16} />
                    <span>{stats.monthName} {stats.year}</span>
                </div>
            </div>

            {/* Contenedor principal con la imagen de fondo */}
            <div className="missions-body">
                {/* Lista de misiones */}
                <div className="missions-list">
                    {missions.length === 0 ? (
                        <div className="empty-state-missions">
                            <SkullIcon size={64} className="empty-skull" />
                            <h3>SIN MISIONES ASIGNADAS</h3>
                            <p>Añade tus objetivos para este mes</p>
                            <button className="btn btn-danger" onClick={handleAddMission}>
                                <Plus size={18} />
                                ASIGNAR MISIÓN
                            </button>
                        </div>
                    ) : (
                        <>
                            {missions.map((mission) => (
                                <MissionRow
                                    key={mission.id}
                                    mission={mission}
                                    onToggle={toggleMissionComplete}
                                    onEdit={handleEditMission}
                                    onDelete={deleteMission}
                                />
                            ))}
                            <button className="add-mission-btn" onClick={handleAddMission}>
                                <Plus size={18} />
                                AGREGAR MISIÓN
                            </button>
                        </>
                    )}
                </div>

                {/* Barra de progreso con logo */}
                {missions.length > 0 && (
                    <div className="missions-progress-section">
                        <div className="progress-content">
                            <div className="progress-info">
                                <span className="progress-label">PROGRESO DE OPERACIONES</span>
                                <span className="progress-percentage">{stats.percentage}%</span>
                            </div>
                            <div className="progress-track-missions">
                                <div
                                    className="progress-fill-missions"
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>
                            <span className="progress-detail">
                                {stats.completed} de {stats.total} misiones completadas
                            </span>
                        </div>
                        <div className="progress-logo">
                            <img src={spartLogo} alt="Insignia" />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <MissionModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveMission}
                mission={editingMission}
            />
        </div>
    );
};

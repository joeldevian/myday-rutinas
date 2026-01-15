import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Calendar as CalendarIcon, Settings as SettingsIcon, ChevronLeft, ChevronRight, Clock, BarChart3, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRoutines } from '../hooks/useRoutines';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { TimeColumn } from './TimeColumn';
import { RoutineModal } from './RoutineModal';
import { Calendar } from './Calendar';
import { Timer } from './Timer';
import { Statistics } from './Statistics';
import { Settings } from './Settings';
import { isPastTime } from '../utils/routineHelpers';
import '../styles/Dashboard.css';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [defaultTimeOfDay, setDefaultTimeOfDay] = useState(null);
    const [activeView, setActiveView] = useState('routines'); // 'routines', 'calendar', 'timer', 'stats', 'settings'
    const [avatarError, setAvatarError] = useState(false);

    // Rutinas hook - pass userId
    const { routines, loading, createRoutine, updateRoutine, toggleComplete, deleteRoutine } = useRoutines(user?.id);

    // Tiempo actual para actualizaciones
    const currentTime = useCurrentTime();

    // Calcular próxima rutina
    const getNextRoutine = () => {
        const futureRoutines = routines.filter(r => !isPastTime(r.time) && !r.completed);
        return futureRoutines.length > 0 ? futureRoutines[0] : null;
    };

    const nextRoutine = getNextRoutine();

    // Close sidebar on mobile by default
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Set initial state
        handleResize();

        // Listen to window resize
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavClick = (view) => {
        setActiveView(view);
        // Auto-close sidebar on mobile after navigation
        if (window.innerWidth <= 640) {
            setSidebarOpen(false);
        }
    };

    const handleEdit = (routine) => {
        setEditingRoutine(routine);
        setDefaultTimeOfDay(null);
        setModalOpen(true);
    };

    const handleAddRoutine = (timeOfDay = null) => {
        setEditingRoutine(null);
        setDefaultTimeOfDay(timeOfDay);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingRoutine(null);
        setDefaultTimeOfDay(null);
    };

    const handleSaveRoutine = (routineData) => {
        if (editingRoutine) {
            updateRoutine(editingRoutine.id, routineData);
        } else {
            createRoutine(routineData);
        }
    };

    return (
        <div className="dashboard">
            {/* Left Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-content">
                    {/* User Profile Section */}
                    <div className="sidebar-user">
                        <img
                            src={avatarError || !user?.picture ?
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff&size=128`
                                : user.picture}
                            alt={user?.name}
                            className="sidebar-avatar"
                            onError={() => setAvatarError(true)}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                        />
                        {sidebarOpen && (
                            <div className="sidebar-user-info">
                                <h3 className="sidebar-user-name">{user?.name}</h3>
                            </div>
                        )}
                    </div>

                    {/* Navigation Menu */}
                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeView === 'routines' ? 'active' : ''}`}
                            onClick={() => handleNavClick('routines')}
                            title="Inicio"
                        >
                            <Home size={20} />
                            {sidebarOpen && <span>Inicio</span>}
                        </button>
                        <button
                            className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`}
                            onClick={() => handleNavClick('calendar')}
                            title="Calendario"
                        >
                            <CalendarIcon size={20} />
                            {sidebarOpen && <span>Calendario</span>}
                        </button>
                        <button
                            className={`nav-item ${activeView === 'timer' ? 'active' : ''}`}
                            onClick={() => handleNavClick('timer')}
                            title="Cronómetro"
                        >
                            <Clock size={20} />
                            {sidebarOpen && <span>Cronómetro</span>}
                        </button>
                        <button
                            className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
                            onClick={() => handleNavClick('stats')}
                            title="Estadísticas"
                        >
                            <BarChart3 size={20} />
                            {sidebarOpen && <span>Estadísticas</span>}
                        </button>
                        <button
                            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
                            onClick={() => handleNavClick('settings')}
                            title="Configuración"
                        >
                            <SettingsIcon size={20} />
                            {sidebarOpen && <span>Configuración</span>}
                        </button>
                    </nav>

                    {/* Spacer */}
                    <div className="sidebar-spacer"></div>

                    {/* Logout Button */}
                    <button onClick={logout} className="sidebar-logout" title="Cerrar Sesión">
                        <LogOut size={20} />
                        {sidebarOpen && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {/* Mobile Menu Toggle (Hamburger) */}
                <button
                    className="mobile-menu-toggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle Menu"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Sidebar Toggle Button */}
                <button
                    className="sidebar-toggle-btn desktop-only"
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                    title={sidebarOpen ? "Ocultar panel" : "Mostrar panel"}
                >
                    {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>

                <div className="main-body">
                    {activeView === 'routines' ? (
                        // Routines View
                        loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Cargando rutinas...</p>
                            </div>
                        ) : (
                            <div className="routines-grid">
                                <TimeColumn
                                    timeOfDay="morning"
                                    routines={routines}
                                    onToggleComplete={toggleComplete}
                                    onEdit={handleEdit}
                                    onDelete={deleteRoutine}
                                    onAddRoutine={handleAddRoutine}
                                    nextRoutineId={nextRoutine?.id}
                                />
                                <TimeColumn
                                    timeOfDay="afternoon"
                                    routines={routines}
                                    onToggleComplete={toggleComplete}
                                    onEdit={handleEdit}
                                    onDelete={deleteRoutine}
                                    onAddRoutine={handleAddRoutine}
                                    nextRoutineId={nextRoutine?.id}
                                />
                                <TimeColumn
                                    timeOfDay="night"
                                    routines={routines}
                                    onToggleComplete={toggleComplete}
                                    onEdit={handleEdit}
                                    onDelete={deleteRoutine}
                                    onAddRoutine={handleAddRoutine}
                                    nextRoutineId={nextRoutine?.id}
                                />
                            </div>
                        )
                    ) : activeView === 'calendar' ? (
                        // Calendar View
                        <Calendar userId={user?.id} />
                    ) : activeView === 'timer' ? (
                        // Timer View
                        <Timer />
                    ) : activeView === 'stats' ? (
                        // Statistics View
                        <Statistics routines={routines} userId={user?.id} />
                    ) : (
                        // Settings View
                        <Settings userId={user?.id} />
                    )}
                </div>
            </main>

            {/* Routine Modal */}
            <RoutineModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRoutine}
                routine={editingRoutine}
                defaultTimeOfDay={defaultTimeOfDay}
            />
        </div>
    );
};

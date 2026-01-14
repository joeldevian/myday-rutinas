import { useState } from 'react';
import { User, Trash2, Download, Upload, Info, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStorageKeys } from '../utils/storageKeys';
import '../styles/Settings.css';

export const Settings = ({ userId }) => {
    const { user, updateUser } = useAuth();
    const [userName, setUserName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    // Get user-specific storage keys
    const storageKeys = getUserStorageKeys(userId);

    const handleSaveName = () => {
        if (userName.trim()) {
            setIsSaving(true);
            updateUser({ name: userName.trim() });
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const handleClearRoutines = () => {
        if (window.confirm('¿Estás seguro de eliminar TODAS las rutinas? Esta acción no se puede deshacer.')) {
            localStorage.removeItem(storageKeys.routines);
            localStorage.removeItem(storageKeys.lastReset);
            window.location.reload();
        }
    };

    const handleClearStats = () => {
        if (window.confirm('¿Eliminar todo el historial de estadísticas?')) {
            localStorage.removeItem(storageKeys.statsHistory);
            window.location.reload();
        }
    };

    const handleClearCalendar = () => {
        if (window.confirm('¿Eliminar todos los eventos del calendario?')) {
            localStorage.removeItem(storageKeys.events);
            window.location.reload();
        }
    };

    const handleClearAll = () => {
        if (window.confirm('⚠️ ¿ELIMINAR TODOS LOS DATOS? (Rutinas, Estadísticas, Calendario)\n\nEsta acción NO se puede deshacer.')) {
            if (window.confirm('¿Estás completamente seguro? Esta es tu última oportunidad.')) {
                Object.values(storageKeys).forEach(key => {
                    if (key) localStorage.removeItem(key);
                });
                window.location.reload();
            }
        }
    };

    const handleExportData = () => {
        const data = {
            routines: JSON.parse(localStorage.getItem(storageKeys.routines) || '[]'),
            stats: JSON.parse(localStorage.getItem(storageKeys.statsHistory) || '{}'),
            events: JSON.parse(localStorage.getItem(storageKeys.events) || '[]'),
            exportDate: new Date().toISOString(),
            version: '1.0.0',
            userId: userId
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `myday-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (window.confirm('¿Importar datos? Esto REEMPLAZARÁ todos tus datos actuales.')) {
                    if (data.routines) localStorage.setItem(storageKeys.routines, JSON.stringify(data.routines));
                    if (data.stats) localStorage.setItem(storageKeys.statsHistory, JSON.stringify(data.stats));
                    if (data.events) localStorage.setItem(storageKeys.events, JSON.stringify(data.events));

                    alert('✅ Datos importados correctamente');
                    window.location.reload();
                }
            } catch (error) {
                alert('❌ Error al importar: archivo inválido');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Configuración</h1>
                <p>Personaliza tu experiencia en MyDay</p>
            </div>

            <div className="settings-sections">
                {/* Perfil */}
                <div className="settings-section">
                    <div className="section-header">
                        <User size={24} />
                        <h2>Perfil de Usuario</h2>
                    </div>
                    <div className="section-content">
                        <div className="setting-item">
                            <label htmlFor="userName">Nombre</label>
                            <div className="input-group">
                                <input
                                    id="userName"
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Tu nombre"
                                    className="settings-input"
                                />
                                <button
                                    onClick={handleSaveName}
                                    className="btn btn-primary"
                                    disabled={!userName.trim() || userName === user?.name}
                                >
                                    <Save size={18} />
                                    {isSaving ? 'Guardado' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gestión de Datos */}
                <div className="settings-section">
                    <div className="section-header">
                        <Trash2 size={24} />
                        <h2>Gestión de Datos</h2>
                    </div>
                    <div className="section-content">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Limpiar Rutinas</h3>
                                <p>Elimina todas las rutinas guardadas</p>
                            </div>
                            <button onClick={handleClearRoutines} className="btn btn-danger">
                                <Trash2 size={18} />
                                Limpiar
                            </button>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Limpiar Estadísticas</h3>
                                <p>Elimina el historial de progreso</p>
                            </div>
                            <button onClick={handleClearStats} className="btn btn-danger">
                                <Trash2 size={18} />
                                Limpiar
                            </button>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Limpiar Calendario</h3>
                                <p>Elimina todos los eventos del calendario</p>
                            </div>
                            <button onClick={handleClearCalendar} className="btn btn-danger">
                                <Trash2 size={18} />
                                Limpiar
                            </button>
                        </div>

                        <div className="setting-item danger-zone">
                            <div className="setting-info">
                                <h3>⚠️ Limpiar TODO</h3>
                                <p>Elimina TODOS los datos de la aplicación</p>
                            </div>
                            <button onClick={handleClearAll} className="btn btn-danger-alt">
                                <Trash2 size={18} />
                                Eliminar Todo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Importar/Exportar */}
                <div className="settings-section">
                    <div className="section-header">
                        <Download size={24} />
                        <h2>Respaldo de Datos</h2>
                    </div>
                    <div className="section-content">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Exportar Datos</h3>
                                <p>Descarga una copia de seguridad (JSON)</p>
                            </div>
                            <button onClick={handleExportData} className="btn btn-secondary">
                                <Download size={18} />
                                Exportar
                            </button>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h3>Importar Datos</h3>
                                <p>Restaurar desde archivo de respaldo</p>
                            </div>
                            <label className="btn btn-secondary" htmlFor="import-file">
                                <Upload size={18} />
                                Importar
                            </label>
                            <input
                                id="import-file"
                                type="file"
                                accept=".json"
                                onChange={handleImportData}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Info de la App */}
                <div className="settings-section">
                    <div className="section-header">
                        <Info size={24} />
                        <h2>Información</h2>
                    </div>
                    <div className="section-content">
                        <div className="app-info">
                            <div className="info-row">
                                <span>Versión</span>
                                <strong>1.0.0</strong>
                            </div>
                            <div className="info-row">
                                <span>Desarrollado por</span>
                                <strong>Joel D. Ircañaupa Yaurimo</strong>
                            </div>
                            <div className="info-row">
                                <span>Descripción</span>
                                <strong>MyDay - Gestión de rutinas diarias</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

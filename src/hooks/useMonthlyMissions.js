import { useState, useEffect, useCallback } from 'react';
import { getStorageKey } from '../utils/storageKeys';

/**
 * Obtiene el identificador del mes actual (año-mes)
 * @param {Date} date - Fecha
 * @returns {string} - Identificador del mes (ej: "2026-0" para enero)
 */
const getMonthIdentifier = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}`;
};

/**
 * Obtiene el nombre del mes en español
 * @param {number} monthIndex - Índice del mes (0-11)
 * @returns {string}
 */
const getMonthName = (monthIndex) => {
    const months = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return months[monthIndex];
};

/**
 * Genera un ID único
 */
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Custom hook para manejar misiones mensuales
 * @param {string} userId - ID del usuario actual
 */
export const useMonthlyMissions = (userId) => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Claves de almacenamiento por usuario
    const STORAGE_KEY = getStorageKey('monthlyMissions', userId);
    const LAST_MONTH_KEY = getStorageKey('monthlyMissions_lastMonth', userId);

    /**
     * Obtener información del mes actual
     */
    const getCurrentMonthInfo = useCallback(() => {
        const now = new Date();
        return {
            monthName: getMonthName(now.getMonth()),
            year: now.getFullYear(),
            identifier: getMonthIdentifier(now)
        };
    }, []);

    /**
     * Verificar si es un nuevo mes y resetear TODO (misiones + checkboxes)
     */
    const checkAndResetMonthly = useCallback((missions) => {
        const currentMonth = getMonthIdentifier(new Date());
        const lastMonth = localStorage.getItem(LAST_MONTH_KEY);

        if (lastMonth !== currentMonth) {
            // Nuevo mes - BORRAR TODAS las misiones (reset completo)
            localStorage.setItem(LAST_MONTH_KEY, currentMonth);
            return []; // Array vacío - nuevo mes, nuevas misiones
        }

        return missions;
    }, [LAST_MONTH_KEY]);

    // Cargar misiones desde localStorage al montar
    useEffect(() => {
        if (!userId || !STORAGE_KEY) {
            setLoading(false);
            return;
        }

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const loadedMissions = JSON.parse(saved);
                const resetIfNeeded = checkAndResetMonthly(loadedMissions);
                setMissions(resetIfNeeded);

                // Guardar si hubo reset
                if (resetIfNeeded !== loadedMissions) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetIfNeeded));
                }
            } else {
                // Inicializar el mes actual
                localStorage.setItem(LAST_MONTH_KEY, getMonthIdentifier(new Date()));
                setMissions([]);
            }
        } catch (error) {
            console.error('Error loading monthly missions:', error);
            setMissions([]);
        } finally {
            setLoading(false);
        }
    }, [userId, STORAGE_KEY, LAST_MONTH_KEY, checkAndResetMonthly]);

    // Guardar en localStorage cuando cambien las misiones
    useEffect(() => {
        if (!loading && STORAGE_KEY) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
            } catch (error) {
                console.error('Error saving monthly missions:', error);
            }
        }
    }, [missions, loading, STORAGE_KEY]);

    // Verificar cambio de mes cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setMissions(prev => {
                const resetIfNeeded = checkAndResetMonthly(prev);
                return resetIfNeeded;
            });
        }, 60000); // Cada minuto

        return () => clearInterval(interval);
    }, [checkAndResetMonthly]);

    /**
     * Crear nueva misión
     */
    const createMission = (title) => {
        const newMission = {
            id: generateId(),
            title,
            completed: false,
            createdAt: new Date().toISOString()
        };

        setMissions(prev => [...prev, newMission]);
        return newMission;
    };

    /**
     * Actualizar misión existente
     */
    const updateMission = (id, title) => {
        setMissions(prev =>
            prev.map(mission =>
                mission.id === id ? { ...mission, title } : mission
            )
        );
    };

    /**
     * Eliminar misión
     */
    const deleteMission = (id) => {
        setMissions(prev => prev.filter(mission => mission.id !== id));
    };

    /**
     * Toggle estado de misión completada
     */
    const toggleMissionComplete = (id) => {
        setMissions(prev =>
            prev.map(mission =>
                mission.id === id ? { ...mission, completed: !mission.completed } : mission
            )
        );
    };

    /**
     * Obtener estadísticas del mes
     */
    const getMonthStats = () => {
        const total = missions.length;
        const completed = missions.filter(m => m.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            percentage,
            ...getCurrentMonthInfo()
        };
    };

    return {
        missions,
        loading,
        createMission,
        updateMission,
        deleteMission,
        toggleMissionComplete,
        getMonthStats,
        getCurrentMonthInfo
    };
};

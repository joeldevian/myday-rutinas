import { useState, useEffect } from 'react';
import { defaultRoutines } from '../utils/defaultRoutines';
import { generateId, getTimeOfDay, sortRoutinesByTime } from '../utils/routineHelpers';
import { getStorageKey } from '../utils/storageKeys';
import { useStats } from './useStats';

/**
 * Custom hook para manejar rutinas con CRUD y persistencia
 * @param {string} userId - ID del usuario actual
 */
export const useRoutines = (userId) => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);

    // Generate user-specific storage keys
    const STORAGE_KEY = getStorageKey('routines', userId);
    const LAST_RESET_KEY = getStorageKey('last_reset', userId);
    const LAST_STATS_SAVE_KEY = getStorageKey('last_stats_save', userId);

    // Stats hook para guardar automáticamente
    const { saveCurrentDay, saveYesterdayIfNeeded } = useStats(routines, userId);

    // Verificar si es un nuevo día y resetear completadas
    const checkAndResetDaily = (routines) => {
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem(LAST_RESET_KEY);

        if (lastReset !== today) {
            // IMPORTANTE: Guardar estadísticas del día anterior antes de resetear
            // Esto asegura que se guarden incluso si la app estuvo cerrada
            if (routines && routines.length > 0) {
                saveYesterdayIfNeeded(routines);
            }

            // Es un nuevo día - resetear rutinas completadas
            const resetRoutines = routines.map(routine => ({
                ...routine,
                completed: false,
                timer: {
                    isRunning: false,
                    elapsedTime: 0,
                    startedAt: null,
                    pausedAt: null,
                },
            }));

            localStorage.setItem(LAST_RESET_KEY, today);
            return resetRoutines;
        }

        return routines;
    };

    // Migrar rutinas antiguas para agregar endTime si no lo tienen
    const migrateRoutines = (routines) => {
        return routines.map(routine => {
            if (!routine.endTime && routine.time) {
                // Calcular endTime como hora de inicio + 1 hora
                const [hours, minutes] = routine.time.split(':');
                const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
                return {
                    ...routine,
                    endTime: `${endHour}:${minutes}`
                };
            }
            return routine;
        });
    };

    // Cargar rutinas desde localStorage al montar
    useEffect(() => {
        // Don't load if no userId yet
        if (!userId || !STORAGE_KEY) {
            setLoading(false);
            return;
        }

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const loadedRoutines = JSON.parse(saved);
                // Primero migrar rutinas antiguas
                const migratedRoutines = migrateRoutines(loadedRoutines);
                // Luego resetear si es necesario
                const resetIfNeeded = checkAndResetDaily(migratedRoutines);
                setRoutines(resetIfNeeded);

                // Guardar si hubo cambios por migración o reset
                if (resetIfNeeded !== loadedRoutines || migratedRoutines !== loadedRoutines) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetIfNeeded));
                }
            } else {
                // Primera vez: panel limpio para nuevos usuarios
                // No cargar rutinas por defecto, dejar vacío
                setRoutines([]);
            }
        } catch (error) {
            console.error('Error loading routines:', error);
            setRoutines([]);
        } finally {
            setLoading(false);
        }
    }, [userId, STORAGE_KEY]);

    // Guardar en localStorage cuando cambien las rutinas
    useEffect(() => {
        if (!loading && STORAGE_KEY) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
            } catch (error) {
                console.error('Error saving routines:', error);
            }
        }
    }, [routines, loading, STORAGE_KEY]);

    // Verificar cambio de día cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setRoutines(prev => {
                const resetIfNeeded = checkAndResetDaily(prev);
                return resetIfNeeded;
            });
        }, 60000); // Cada minuto

        return () => clearInterval(interval);
    }, []);

    // Guardar estadísticas automáticamente cuando cambie el progreso
    useEffect(() => {
        if (!loading && routines.length > 0 && userId) {
            const today = new Date().toISOString().split('T')[0];
            const lastSave = localStorage.getItem(LAST_STATS_SAVE_KEY);

            // Guardar si han pasado al menos 10 segundos desde el último guardado
            // o si es el primer guardado del día
            const shouldSave = !lastSave ||
                lastSave.split('_')[0] !== today ||
                (Date.now() - parseInt(lastSave.split('_')[1] || '0')) > 10000;

            if (shouldSave) {
                saveCurrentDay();
                localStorage.setItem(LAST_STATS_SAVE_KEY, `${today}_${Date.now()}`);
            }
        }
    }, [routines, loading, userId, saveCurrentDay, LAST_STATS_SAVE_KEY]);

    /**
     * Crear nueva rutina
     */
    const createRoutine = (routineData) => {
        const newRoutine = {
            id: generateId(),
            title: routineData.title,
            time: routineData.time,
            endTime: routineData.endTime,
            icon: routineData.icon || 'Circle',
            completed: false,
            timeOfDay: getTimeOfDay(routineData.time),
            createdAt: new Date().toISOString(),
            timer: {
                isRunning: false,
                elapsedTime: 0,
                startedAt: null,
                pausedAt: null,
            },
        };

        setRoutines(prev => sortRoutinesByTime([...prev, newRoutine]));
        return newRoutine;
    };

    /**
     * Actualizar rutina existente
     */
    const updateRoutine = (id, updates) => {
        setRoutines(prev => {
            const updated = prev.map(routine => {
                if (routine.id === id) {
                    const updatedRoutine = { ...routine, ...updates };
                    // Recalcular timeOfDay si cambió la hora
                    if (updates.time) {
                        updatedRoutine.timeOfDay = getTimeOfDay(updates.time);
                    }
                    return updatedRoutine;
                }
                return routine;
            });
            return sortRoutinesByTime(updated);
        });
    };

    /**
     * Eliminar rutina
     */
    const deleteRoutine = (id) => {
        setRoutines(prev => prev.filter(routine => routine.id !== id));
    };

    /**
     * Toggle estado completado de rutina
     */
    const toggleComplete = (id) => {
        setRoutines(prev =>
            prev.map(routine =>
                routine.id === id
                    ? {
                        ...routine,
                        completed: !routine.completed,
                        // Detener timer si se marca como completada
                        timer: !routine.completed ? {
                            isRunning: false,
                            elapsedTime: routine.timer.elapsedTime,
                            startedAt: null,
                            pausedAt: null,
                        } : routine.timer
                    }
                    : routine
            )
        );
    };

    /**
     * Resetear todas las rutinas (marcar como no completadas)
     */
    const resetAllRoutines = () => {
        setRoutines(prev =>
            prev.map(routine => ({
                ...routine,
                completed: false,
                timer: {
                    isRunning: false,
                    elapsedTime: 0,
                    startedAt: null,
                    pausedAt: null,
                },
            }))
        );
        localStorage.setItem(LAST_RESET_KEY, new Date().toDateString());
    };

    /**
     * Obtener rutina por ID
     */
    const getRoutineById = (id) => {
        return routines.find(routine => routine.id === id);
    };

    return {
        routines,
        loading,
        createRoutine,
        updateRoutine,
        deleteRoutine,
        toggleComplete,
        resetAllRoutines,
        getRoutineById,
    };
};

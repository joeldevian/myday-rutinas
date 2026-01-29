import { useState, useEffect, useCallback } from 'react';
import { getStorageKey } from '../utils/storageKeys';

/**
 * Obtiene el número de semana del año basado en el domingo como primer día
 * @param {Date} date - Fecha
 * @returns {string} - Año y número de semana (ej: "2026-5")
 */
const getWeekIdentifier = (date) => {
    const d = new Date(date);
    // Ajustar al domingo de la semana actual
    const dayOfWeek = d.getDay(); // 0 = domingo
    const sunday = new Date(d);
    sunday.setDate(d.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);

    // Calcular número de semana
    const startOfYear = new Date(sunday.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((sunday - startOfYear) / 86400000) + 1) / 7);

    return `${sunday.getFullYear()}-${weekNumber}`;
};

/**
 * Genera un ID único
 */
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Custom hook para manejar objetivos semanales
 * @param {string} userId - ID del usuario actual
 */
export const useWeeklyGoals = (userId) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Claves de almacenamiento por usuario
    const STORAGE_KEY = getStorageKey('weeklyGoals', userId);
    const LAST_WEEK_KEY = getStorageKey('weeklyGoals_lastWeek', userId);

    /**
     * Verificar si es una nueva semana y resetear checkboxes
     */
    const checkAndResetWeekly = useCallback((goals) => {
        const currentWeek = getWeekIdentifier(new Date());
        const lastWeek = localStorage.getItem(LAST_WEEK_KEY);

        if (lastWeek !== currentWeek) {
            // Nueva semana - resetear solo daysCompleted, mantener objetivos
            const resetGoals = goals.map(goal => ({
                ...goal,
                daysCompleted: [false, false, false, false, false, false, false]
            }));

            localStorage.setItem(LAST_WEEK_KEY, currentWeek);
            return resetGoals;
        }

        return goals;
    }, [LAST_WEEK_KEY]);

    // Cargar objetivos desde localStorage al montar
    useEffect(() => {
        if (!userId || !STORAGE_KEY) {
            setLoading(false);
            return;
        }

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const loadedGoals = JSON.parse(saved);
                const resetIfNeeded = checkAndResetWeekly(loadedGoals);
                setGoals(resetIfNeeded);

                // Guardar si hubo cambios por reset
                if (resetIfNeeded !== loadedGoals) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetIfNeeded));
                }
            } else {
                setGoals([]);
            }
        } catch (error) {
            console.error('Error loading weekly goals:', error);
            setGoals([]);
        } finally {
            setLoading(false);
        }
    }, [userId, STORAGE_KEY, checkAndResetWeekly]);

    // Guardar en localStorage cuando cambien los objetivos
    useEffect(() => {
        if (!loading && STORAGE_KEY) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
            } catch (error) {
                console.error('Error saving weekly goals:', error);
            }
        }
    }, [goals, loading, STORAGE_KEY]);

    // Verificar cambio de semana cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setGoals(prev => {
                const resetIfNeeded = checkAndResetWeekly(prev);
                return resetIfNeeded;
            });
        }, 60000); // Cada minuto

        return () => clearInterval(interval);
    }, [checkAndResetWeekly]);

    /**
     * Crear nuevo objetivo
     */
    const createGoal = (title) => {
        const newGoal = {
            id: generateId(),
            title,
            daysCompleted: [false, false, false, false, false, false, false],
            createdAt: new Date().toISOString()
        };

        setGoals(prev => [...prev, newGoal]);
        return newGoal;
    };

    /**
     * Actualizar objetivo existente
     */
    const updateGoal = (id, title) => {
        setGoals(prev =>
            prev.map(goal =>
                goal.id === id ? { ...goal, title } : goal
            )
        );
    };

    /**
     * Eliminar objetivo
     */
    const deleteGoal = (id) => {
        setGoals(prev => prev.filter(goal => goal.id !== id));
    };

    /**
     * Toggle estado de día completado
     * @param {string} goalId - ID del objetivo
     * @param {number} dayIndex - Índice del día (0 = Domingo, 6 = Sábado)
     */
    const toggleDayComplete = (goalId, dayIndex) => {
        setGoals(prev =>
            prev.map(goal => {
                if (goal.id === goalId) {
                    const newDaysCompleted = [...goal.daysCompleted];
                    newDaysCompleted[dayIndex] = !newDaysCompleted[dayIndex];
                    return { ...goal, daysCompleted: newDaysCompleted };
                }
                return goal;
            })
        );
    };

    /**
     * Resetear todos los checkboxes (manual)
     */
    const resetAllProgress = () => {
        setGoals(prev =>
            prev.map(goal => ({
                ...goal,
                daysCompleted: [false, false, false, false, false, false, false]
            }))
        );
        localStorage.setItem(LAST_WEEK_KEY, getWeekIdentifier(new Date()));
    };

    /**
     * Obtener estadísticas de la semana
     */
    const getWeekStats = () => {
        const totalCheckboxes = goals.length * 7;
        const completedCheckboxes = goals.reduce(
            (acc, goal) => acc + goal.daysCompleted.filter(Boolean).length,
            0
        );
        const percentage = totalCheckboxes > 0
            ? Math.round((completedCheckboxes / totalCheckboxes) * 100)
            : 0;

        return {
            totalGoals: goals.length,
            totalCheckboxes,
            completedCheckboxes,
            percentage
        };
    };

    return {
        goals,
        loading,
        createGoal,
        updateGoal,
        deleteGoal,
        toggleDayComplete,
        resetAllProgress,
        getWeekStats
    };
};

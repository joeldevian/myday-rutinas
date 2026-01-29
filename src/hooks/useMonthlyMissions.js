import { useState, useEffect, useCallback } from 'react';
import { getStorageKey } from '../utils/storageKeys';

/**
 * Obtiene el identificador del mes actual (año-mes)
 */
const getMonthIdentifier = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}`;
};

/**
 * Obtiene el nombre del mes en español
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
 * Verifica si es hora de evaluar méritos (11:55 PM del último día del mes)
 */
const isEvaluationTime = () => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const isLastDay = now.getDate() === lastDayOfMonth;
    const isEvalHour = now.getHours() === 23 && now.getMinutes() >= 55;
    return isLastDay && isEvalHour;
};

/**
 * Verifica si hay que resetear méritos anuales (1 de enero 2027 a las 00:00)
 */
const shouldResetAnnualMerits = () => {
    const now = new Date();
    return now.getFullYear() >= 2027 && now.getMonth() === 0 && now.getDate() === 1;
};

/**
 * Custom hook para manejar misiones mensuales con sistema de méritos
 */
export const useMonthlyMissions = (userId) => {
    const [missions, setMissions] = useState([]);
    const [merits, setMerits] = useState({ novato: 0, elite: 0, leyenda: 0 });
    const [loading, setLoading] = useState(true);

    // Claves de almacenamiento por usuario
    const STORAGE_KEY = getStorageKey('monthlyMissions', userId);
    const LAST_MONTH_KEY = getStorageKey('monthlyMissions_lastMonth', userId);
    const MERITS_KEY = getStorageKey('monthlyMissions_merits', userId);
    const LAST_EVAL_KEY = getStorageKey('monthlyMissions_lastEval', userId);

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
     * Evaluar y asignar mérito según misiones completadas
     * - Novato: 1 misión completada
     * - Élite: 3 misiones completadas  
     * - Leyenda: TODAS las misiones completadas
     */
    const evaluateAndAssignMerit = useCallback((currentMissions, currentMerits) => {
        const total = currentMissions.length;
        const completed = currentMissions.filter(m => m.completed).length;

        if (total === 0) return currentMerits;

        const newMerits = { ...currentMerits };

        if (completed === total) {
            // Completó TODAS - Leyenda
            newMerits.leyenda += 1;
        } else if (completed >= 3) {
            // Completó 3+ - Élite
            newMerits.elite += 1;
        } else if (completed >= 1) {
            // Completó al menos 1 - Novato
            newMerits.novato += 1;
        }

        return newMerits;
    }, []);

    /**
     * Verificar si es un nuevo mes y resetear TODO
     */
    const checkAndResetMonthly = useCallback((missions, currentMerits) => {
        const currentMonth = getMonthIdentifier(new Date());
        const lastMonth = localStorage.getItem(LAST_MONTH_KEY);
        const lastEval = localStorage.getItem(LAST_EVAL_KEY);

        // Evaluar méritos si es hora y no se ha evaluado este mes
        if (isEvaluationTime() && lastEval !== currentMonth && missions.length > 0) {
            const newMerits = evaluateAndAssignMerit(missions, currentMerits);
            localStorage.setItem(LAST_EVAL_KEY, currentMonth);
            localStorage.setItem(MERITS_KEY, JSON.stringify(newMerits));
            setMerits(newMerits);
        }

        if (lastMonth !== currentMonth) {
            localStorage.setItem(LAST_MONTH_KEY, currentMonth);
            return [];
        }

        return missions;
    }, [LAST_MONTH_KEY, LAST_EVAL_KEY, MERITS_KEY, evaluateAndAssignMerit]);

    /**
     * Resetear méritos anuales si es 1 de enero 2027
     */
    const checkAnnualReset = useCallback(() => {
        if (shouldResetAnnualMerits()) {
            const resetMerits = { novato: 0, elite: 0, leyenda: 0 };
            setMerits(resetMerits);
            localStorage.setItem(MERITS_KEY, JSON.stringify(resetMerits));
        }
    }, [MERITS_KEY]);

    // Cargar misiones y méritos desde localStorage
    useEffect(() => {
        if (!userId || !STORAGE_KEY) {
            setLoading(false);
            return;
        }

        try {
            // Cargar méritos
            const savedMerits = localStorage.getItem(MERITS_KEY);
            const loadedMerits = savedMerits
                ? JSON.parse(savedMerits)
                : { novato: 0, elite: 0, leyenda: 0 };
            setMerits(loadedMerits);

            // Verificar reset anual
            checkAnnualReset();

            // Cargar misiones
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const loadedMissions = JSON.parse(saved);
                const resetIfNeeded = checkAndResetMonthly(loadedMissions, loadedMerits);
                setMissions(resetIfNeeded);

                if (resetIfNeeded !== loadedMissions) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetIfNeeded));
                }
            } else {
                localStorage.setItem(LAST_MONTH_KEY, getMonthIdentifier(new Date()));
                setMissions([]);
            }
        } catch (error) {
            console.error('Error loading monthly missions:', error);
            setMissions([]);
        } finally {
            setLoading(false);
        }
    }, [userId, STORAGE_KEY, LAST_MONTH_KEY, MERITS_KEY, checkAndResetMonthly, checkAnnualReset]);

    // Guardar misiones cuando cambien
    useEffect(() => {
        if (!loading && STORAGE_KEY) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
            } catch (error) {
                console.error('Error saving monthly missions:', error);
            }
        }
    }, [missions, loading, STORAGE_KEY]);

    // Verificar evaluación cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setMissions(prev => {
                const resetIfNeeded = checkAndResetMonthly(prev, merits);
                return resetIfNeeded;
            });
            checkAnnualReset();
        }, 60000);

        return () => clearInterval(interval);
    }, [checkAndResetMonthly, checkAnnualReset, merits]);

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

    const updateMission = (id, title) => {
        setMissions(prev =>
            prev.map(mission =>
                mission.id === id ? { ...mission, title } : mission
            )
        );
    };

    const deleteMission = (id) => {
        setMissions(prev => prev.filter(mission => mission.id !== id));
    };

    const toggleMissionComplete = (id) => {
        setMissions(prev =>
            prev.map(mission =>
                mission.id === id ? { ...mission, completed: !mission.completed } : mission
            )
        );
    };

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
        merits,
        loading,
        createMission,
        updateMission,
        deleteMission,
        toggleMissionComplete,
        getMonthStats,
        getCurrentMonthInfo
    };
};


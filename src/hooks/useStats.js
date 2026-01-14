import { useState, useEffect } from 'react';
import { getStorageKey } from '../utils/storageKeys';

/**
 * Hook para gestionar estadísticas de progreso diario
 * @param {array} routines - Lista de rutinas actuales
 * @param {string} userId - ID del usuario actual
 */
export const useStats = (routines, userId) => {
    const [statsHistory, setStatsHistory] = useState({});

    // Generate user-specific storage key
    const STORAGE_KEY = getStorageKey('stats_history', userId);

    // Cargar historial desde localStorage
    useEffect(() => {
        // Don't load if no userId yet
        if (!userId || !STORAGE_KEY) {
            return;
        }

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setStatsHistory(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }, [userId, STORAGE_KEY]);

    // Guardar historial en localStorage
    useEffect(() => {
        if (STORAGE_KEY) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(statsHistory));
            } catch (error) {
                console.error('Error saving stats:', error);
            }
        }
    }, [statsHistory, STORAGE_KEY]);

    // Obtener snapshot del día actual
    const getCurrentDaySnapshot = () => {
        const today = new Date().toISOString().split('T')[0];
        const total = routines.length;
        const completed = routines.filter(r => r.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            date: today,
            total,
            completed,
            percentage
        };
    };

    // Guardar snapshot del día actual
    const saveCurrentDay = () => {
        const snapshot = getCurrentDaySnapshot();
        setStatsHistory(prev => ({
            ...prev,
            [snapshot.date]: {
                total: snapshot.total,
                completed: snapshot.completed,
                percentage: snapshot.percentage
            }
        }));
    };

    // Obtener últimos N días
    const getLastNDays = (n = 7) => {
        const days = [];
        const today = new Date();

        for (let i = n - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];

            // Si es hoy, usar datos en tiempo real
            if (i === 0) {
                const current = getCurrentDaySnapshot();
                days.push({
                    date: dateKey,
                    dayName: getDayName(date),
                    total: current.total,
                    completed: current.completed,
                    percentage: current.percentage,
                    isToday: true
                });
            } else {
                // Usar datos guardados o ceros
                const saved = statsHistory[dateKey] || { total: 0, completed: 0, percentage: 0 };
                days.push({
                    date: dateKey,
                    dayName: getDayName(date),
                    total: saved.total,
                    completed: saved.completed,
                    percentage: saved.percentage,
                    isToday: false
                });
            }
        }

        return days;
    };

    // Obtener nombre del día
    const getDayName = (date) => {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return days[date.getDay()];
    };

    // Limpiar datos antiguos (más de 30 días)
    const cleanOldData = () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

        setStatsHistory(prev => {
            const cleaned = {};
            Object.keys(prev).forEach(date => {
                if (date >= cutoffDate) {
                    cleaned[date] = prev[date];
                }
            });
            return cleaned;
        });
    };

    return {
        statsHistory,
        saveCurrentDay,
        getLastNDays,
        getCurrentDaySnapshot,
        cleanOldData
    };
};

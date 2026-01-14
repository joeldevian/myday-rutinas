import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gestionar cronómetros de rutinas
 * @param {string} routineId - ID de la rutina
 * @param {object} initialTimer - Estado inicial del timer
 * @returns {object} Estado y funciones del cronómetro
 */
export const useTimeTracker = (routineId, initialTimer = null) => {
    const [timer, setTimer] = useState(
        initialTimer || {
            isRunning: false,
            elapsedTime: 0,
            startedAt: null,
            pausedAt: null,
        }
    );

    // Actualizar cada segundo cuando el timer está corriendo
    useEffect(() => {
        if (!timer.isRunning || !timer.startedAt) return;

        const interval = setInterval(() => {
            const startTime = new Date(timer.startedAt).getTime();
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000) + (timer.elapsedTime || 0);

            setTimer(prev => ({
                ...prev,
                elapsedTime: elapsed,
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer.isRunning, timer.startedAt, timer.elapsedTime]);

    /**
     * Iniciar el cronómetro
     */
    const startTimer = useCallback(() => {
        setTimer(prev => ({
            ...prev,
            isRunning: true,
            startedAt: new Date().toISOString(),
            pausedAt: null,
        }));
    }, []);

    /**
     * Pausar el cronómetro
     */
    const pauseTimer = useCallback(() => {
        setTimer(prev => ({
            ...prev,
            isRunning: false,
            pausedAt: new Date().toISOString(),
        }));
    }, []);

    /**
     * Resetear el cronómetro
     */
    const resetTimer = useCallback(() => {
        setTimer({
            isRunning: false,
            elapsedTime: 0,
            startedAt: null,
            pausedAt: null,
        });
    }, []);

    /**
     * Formatear tiempo a MM:SS o HH:MM:SS
     */
    const formatTime = useCallback((seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    }, []);

    return {
        timer,
        startTimer,
        pauseTimer,
        resetTimer,
        formattedTime: formatTime(timer.elapsedTime),
        isRunning: timer.isRunning,
        elapsedTime: timer.elapsedTime,
    };
};

/**
 * Formato simple de tiempo en segundos a HH:MM:SS
 */
export const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
};

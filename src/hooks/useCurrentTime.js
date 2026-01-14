import { useState, useEffect } from 'react';

/**
 * Hook para obtener la hora actual actualizada cada minuto
 * @returns {Date} Hora actual
 */
export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Actualizar inmediatamente
        setCurrentTime(new Date());

        // Configurar intervalo para actualizar cada minuto
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60000ms = 1 minuto

        return () => clearInterval(interval);
    }, []);

    return currentTime;
};

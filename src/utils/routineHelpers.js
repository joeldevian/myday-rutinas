/**
 * Determina el período del día basado en la hora
 * Mañana: 00:00 - 11:00
 * Tarde: 12:00 - 17:00
 * Noche: 18:00 - 23:00
 * @param {string} time - Hora en formato "HH:mm"
 * @returns {string} - "morning", "afternoon", o "night"
 */
export const getTimeOfDay = (time) => {
    const hour = parseInt(time.split(':')[0]);

    if (hour >= 0 && hour <= 11) return 'morning';
    if (hour >= 12 && hour <= 17) return 'afternoon';
    return 'night'; // 18:00 - 23:00
};

/**
 * Genera un ID único para rutinas
 * @returns {string} - UUID simple
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Verifica si una hora ya pasó hoy
 * @param {string} time - Hora en formato "HH:mm"
 * @returns {boolean}
 */
export const isPastTime = (time) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const routineTime = new Date();
    routineTime.setHours(hours, minutes, 0, 0);

    return now > routineTime;
};

/**
 * Verifica si la hora actual está dentro del rango de la rutina
 * Muestra "AHORA" si la hora actual está entre la hora de inicio y fin
 * @param {string} startTime - Hora de inicio en formato "HH:mm"
 * @param {string} endTime - Hora de fin en formato "HH:mm" (opcional)
 * @returns {boolean}
 */
export const isCurrentTime = (startTime, endTime = null) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Convertir hora actual a minutos desde medianoche
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    // Parsear hora de inicio
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;

    // Si no hay hora de fin, usar comportamiento antiguo (solo hora)
    if (!endTime) {
        return currentHour === startHour;
    }

    // Parsear hora de fin
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const endTotalMinutes = endHour * 60 + endMinute;

    // Verificar si la hora actual está dentro del rango [inicio, fin)
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes;
};

/**
 * Ordena rutinas por hora
 * @param {Array} routines - Array de rutinas
 * @returns {Array} - Rutinas ordenadas
 */
export const sortRoutinesByTime = (routines) => {
    return [...routines].sort((a, b) => {
        const timeA = a.time.replace(':', '');
        const timeB = b.time.replace(':', '');
        return timeA - timeB;
    });
};

/**
 * Filtra rutinas por período del día
 * @param {Array} routines - Array de rutinas
 * @param {string} timeOfDay - "morning", "afternoon", "night"
 * @returns {Array} - Rutinas filtradas
 */
export const filterRoutinesByTimeOfDay = (routines, timeOfDay) => {
    return routines.filter(routine => routine.timeOfDay === timeOfDay);
};

/**
 * Traduce período del día al español
 * @param {string} timeOfDay - "morning", "afternoon", "night"
 * @returns {string}
 */
export const translateTimeOfDay = (timeOfDay) => {
    const translations = {
        morning: 'Mañana',
        afternoon: 'Tarde',
        night: 'Noche',
    };
    return translations[timeOfDay] || timeOfDay;
};

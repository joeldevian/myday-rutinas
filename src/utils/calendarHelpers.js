/**
 * Helper functions for calendar and date management
 */

/**
 * Get number of days in a month
 */
export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * Get first day of month (0 = Sunday, 6 = Saturday)
 */
export const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateKey = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
};

/**
 * Parse date key to components
 */
export const parseDateKey = (dateKey) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return { year, month: month - 1, day };
};

/**
 * Check if date is today
 */
export const isToday = (year, month, day) => {
    const today = new Date();
    return (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
    );
};

/**
 * Check if date is in the past
 */
export const isPastDate = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
};

/**
 * Get month name in Spanish
 */
export const getMonthName = (month) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
};

/**
 * Get day names in Spanish
 */
export const getDayNames = () => {
    return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
};

/**
 * Generate calendar grid for a month
 */
export const generateCalendarGrid = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const grid = [];
    let week = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
        week.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        week.push(day);

        if (week.length === 7) {
            grid.push(week);
            week = [];
        }
    }

    // Add empty cells to complete the last week
    if (week.length > 0) {
        while (week.length < 7) {
            week.push(null);
        }
        grid.push(week);
    }

    return grid;
};

// Datos de ejemplo para rutinas diarias
export const defaultRoutines = [
    {
        id: '1',
        title: 'Ejercicio Matutino',
        time: '07:00',
        icon: 'Dumbbell',
        completed: false,
        timeOfDay: 'morning',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
    {
        id: '2',
        title: 'Desayuno',
        time: '08:00',
        icon: 'Coffee',
        completed: false,
        timeOfDay: 'morning',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
    {
        id: '3',
        title: 'Trabajo',
        time: '09:00',
        icon: 'Briefcase',
        completed: false,
        timeOfDay: 'morning',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
    {
        id: '4',
        title: 'Almuerzo',
        time: '13:00',
        icon: 'Utensils',
        completed: false,
        timeOfDay: 'afternoon',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
    {
        id: '5',
        title: 'Lectura',
        time: '15:00',
        icon: 'Book',
        completed: false,
        timeOfDay: 'afternoon',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
    {
        id: '6',
        title: 'Cena',
        time: '19:00',
        icon: 'Utensils',
        completed: false,
        timeOfDay: 'night',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
    {
        id: '7',
        title: 'Meditación',
        time: '21:00',
        icon: 'Heart',
        completed: false,
        timeOfDay: 'night',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
    {
        id: '8',
        title: 'Dormir',
        time: '22:30',
        icon: 'Moon',
        completed: false,
        timeOfDay: 'night',
        createdAt: new Date().toISOString(),
        timer: { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null },
    },
];

// Iconos disponibles para selección
export const availableIcons = [
    'Coffee',
    'Dumbbell',
    'Book',
    'Briefcase',
    'Heart',
    'Moon',
    'Sun',
    'Utensils',
    'Music',
    'Code',
    'Gamepad2',
    'Smartphone',
    'Laptop',
    'Tv',
    'ShoppingCart',
    'Car',
    // Nuevos iconos
    'Brain',          // Estudio / Aprendizaje
    'Footprints',     // Caminar
    'CalendarDays',   // Agenda / Planificación
    'StickyNote',     // Notas / Notion
    'UtensilsCrossed', // Cena / Comida especial
];

/**
 * Componente SVG de Calavera - Estilo Militar/Escuadrón
 */
export const SkullIcon = ({ size = 24, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Cráneo principal */}
            <path
                d="M12 2C7.58 2 4 5.58 4 10c0 2.03.76 3.88 2 5.28V18c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1v-2.72c1.24-1.4 2-3.25 2-5.28 0-4.42-3.58-8-8-8z"
                fill="currentColor"
            />
            {/* Ojo izquierdo */}
            <ellipse
                cx="9"
                cy="10"
                rx="1.5"
                ry="2"
                fill="#0a0a0a"
            />
            {/* Ojo derecho */}
            <ellipse
                cx="15"
                cy="10"
                rx="1.5"
                ry="2"
                fill="#0a0a0a"
            />
            {/* Nariz */}
            <path
                d="M12 12.5L10.5 15h3L12 12.5z"
                fill="#0a0a0a"
            />
            {/* Dientes */}
            <rect x="9" y="16" width="1.5" height="2" fill="#0a0a0a" />
            <rect x="11.25" y="16" width="1.5" height="2" fill="#0a0a0a" />
            <rect x="13.5" y="16" width="1.5" height="2" fill="#0a0a0a" />
        </svg>
    );
};

/**
 * Calavera con huesos cruzados - Para badges
 */
export const SkullCrossbonesIcon = ({ size = 24, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Huesos cruzados */}
            <path
                d="M5.5 2L2 5.5L18.5 22L22 18.5L5.5 2z"
                fill="currentColor"
                opacity="0.7"
            />
            <path
                d="M18.5 2L22 5.5L5.5 22L2 18.5L18.5 2z"
                fill="currentColor"
                opacity="0.7"
            />
            {/* Extremos de huesos */}
            <circle cx="3" cy="3" r="2" fill="currentColor" />
            <circle cx="21" cy="3" r="2" fill="currentColor" />
            <circle cx="3" cy="21" r="2" fill="currentColor" />
            <circle cx="21" cy="21" r="2" fill="currentColor" />
            {/* Cráneo central */}
            <circle cx="12" cy="10" r="6" fill="currentColor" />
            <ellipse cx="10" cy="9" rx="1" ry="1.5" fill="#0a0a0a" />
            <ellipse cx="14" cy="9" rx="1" ry="1.5" fill="#0a0a0a" />
            <path d="M12 11L11 13h2L12 11z" fill="#0a0a0a" />
            <rect x="10" y="14" width="1" height="1.5" fill="#0a0a0a" />
            <rect x="11.5" y="14" width="1" height="1.5" fill="#0a0a0a" />
            <rect x="13" y="14" width="1" height="1.5" fill="#0a0a0a" />
        </svg>
    );
};

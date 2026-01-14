import { useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import '../styles/Statistics.css';

export const Statistics = ({ routines, userId }) => {
    const { saveCurrentDay, getLastNDays, cleanOldData } = useStats(routines, userId);
    const last7Days = getLastNDays(7);

    // Guardar snapshot al final del día (23:59)
    useEffect(() => {
        const checkAndSave = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // Guardar a las 23:59
            if (hours === 23 && minutes === 59) {
                saveCurrentDay();
                cleanOldData();
            }
        };

        // Verificar cada minuto
        const interval = setInterval(checkAndSave, 60000);
        return () => clearInterval(interval);
    }, [saveCurrentDay, cleanOldData]);

    // Calcular promedio semanal
    const weeklyAverage = Math.round(
        last7Days.reduce((sum, day) => sum + day.percentage, 0) / 7
    );

    // Obtener máximo para escala
    const maxPercentage = Math.max(...last7Days.map(d => d.percentage), 100);

    return (
        <div className="statistics-container">
            <div className="stats-header">
                <div className="stats-title">
                    <BarChart3 size={28} />
                    <h2>Estadísticas Semanales</h2>
                </div>
                <div className="stats-summary">
                    <div className="stat-card">
                        <span className="stat-label">Promedio</span>
                        <span className="stat-value">{weeklyAverage}%</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Hoy</span>
                        <span className="stat-value">{last7Days[6]?.percentage || 0}%</span>
                    </div>
                </div>
            </div>

            <div className="stats-chart">
                <div className="chart-bars">
                    {last7Days.map((day, index) => (
                        <div key={day.date} className="bar-container">
                            <div className="bar-wrapper">
                                <div
                                    className={`bar ${day.isToday ? 'today' : ''}`}
                                    style={{
                                        height: `${(day.percentage / maxPercentage) * 100}%`,
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <span className="bar-percentage">{day.percentage}%</span>
                                </div>
                            </div>
                            <div className="bar-labels">
                                <span className="bar-day">{day.dayName}</span>
                                <span className="bar-date">{day.date.slice(5)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stats-legend">
                <div className="legend-item">
                    <div className="legend-color today"></div>
                    <span>Hoy (tiempo real)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color past"></div>
                    <span>Días anteriores</span>
                </div>
            </div>

            <div className="stats-info">
                <p className="info-text">
                    Las estadísticas se guardan automáticamente cada día a las 23:59 y se mantienen por 30 días.
                </p>
            </div>
        </div>
    );
};

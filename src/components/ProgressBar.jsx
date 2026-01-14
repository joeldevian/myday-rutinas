import '../styles/ProgressBar.css';

export const ProgressBar = ({ routines }) => {
    const totalRoutines = routines.length;
    const completedRoutines = routines.filter(r => r.completed).length;
    const percentage = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-header">
                <span className="progress-bar-label">Progreso del Día</span>
                <span className="progress-bar-stats">
                    {completedRoutines}/{totalRoutines} ({percentage}%)
                </span>
            </div>
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                >
                    {percentage > 10 && <span className="progress-bar-text">{percentage}%</span>}
                </div>
            </div>
        </div>
    );
};

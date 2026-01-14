import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimeTracker } from '../hooks/useTimeTracker';
import '../styles/TimerDisplay.css';

export const TimerDisplay = ({ routineId, initialTimer, onTimerUpdate }) => {
    const { timer, startTimer, pauseTimer, resetTimer, formattedTime, isRunning } = useTimeTracker(
        routineId,
        initialTimer
    );

    // Notificar cambios al padre para persistencia
    const handleStart = () => {
        startTimer();
        if (onTimerUpdate) {
            onTimerUpdate(routineId, { ...timer, isRunning: true, startedAt: new Date().toISOString() });
        }
    };

    const handlePause = () => {
        pauseTimer();
        if (onTimerUpdate) {
            onTimerUpdate(routineId, { ...timer, isRunning: false, pausedAt: new Date().toISOString() });
        }
    };

    const handleReset = () => {
        resetTimer();
        if (onTimerUpdate) {
            onTimerUpdate(routineId, { isRunning: false, elapsedTime: 0, startedAt: null, pausedAt: null });
        }
    };

    return (
        <div className="timer-display">
            <div className="timer-time">
                <span className={`time-text ${isRunning ? 'running' : ''}`}>
                    {formattedTime}
                </span>
            </div>

            <div className="timer-controls">
                {!isRunning ? (
                    <button
                        className="timer-btn timer-btn-play"
                        onClick={handleStart}
                        title="Iniciar"
                        aria-label="Iniciar cronómetro"
                    >
                        <Play size={14} />
                    </button>
                ) : (
                    <button
                        className="timer-btn timer-btn-pause"
                        onClick={handlePause}
                        title="Pausar"
                        aria-label="Pausar cronómetro"
                    >
                        <Pause size={14} />
                    </button>
                )}

                {timer.elapsedTime > 0 && (
                    <button
                        className="timer-btn timer-btn-reset"
                        onClick={handleReset}
                        title="Resetear"
                        aria-label="Resetear cronómetro"
                    >
                        <RotateCcw size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

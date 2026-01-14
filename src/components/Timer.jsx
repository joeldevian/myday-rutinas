import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import '../styles/Timer.css';

export const Timer = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => {
                    if (time <= 1) {
                        setIsRunning(false);
                        setIsFinished(true);
                        // Play pleasant chime sound
                        playChime();
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);

    const handleSetTime = () => {
        const total = hours * 3600 + minutes * 60 + seconds;
        if (total > 0) {
            setTotalSeconds(total);
            setTimeLeft(total);
            setIsRunning(false);
            setIsFinished(false);
        }
    };

    const handleStart = () => {
        if (timeLeft > 0) {
            setIsRunning(true);
            setIsFinished(false);
        } else if (hours > 0 || minutes > 0 || seconds > 0) {
            handleSetTime();
            setTimeout(() => setIsRunning(true), 100);
        }
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsFinished(false);
        setTimeLeft(0);
        setTotalSeconds(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    // Play pleasant chime sound when timer finishes
    const playChime = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Play a pleasant three-note chime
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord

        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + (index * 0.15);
            const duration = 0.6;

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    };

    const formatTime = (secs) => {
        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const sec = secs % 60;

        if (hrs > 0) {
            return `${hrs}:${String(mins).padStart(2, '0')}:${String(sec).padStart(2, '0')} `;
        }
        return `${mins}:${String(sec).padStart(2, '0')} `;
    };

    const getProgress = () => {
        if (totalSeconds === 0) return 0;
        return ((totalSeconds - timeLeft) / totalSeconds) * 100;
    };

    const circumference = 2 * Math.PI * 87; // radius = 87
    const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

    return (
        <div className="timer-container">
            {/* Custom Time Inputs */}
            <div className="timer-inputs">
                <div className="time-input-group">
                    <label>Horas</label>
                    <input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="time-input"
                    />
                </div>
                <span className="time-separator">:</span>
                <div className="time-input-group">
                    <label>Minutos</label>
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="time-input"
                    />
                </div>
                <span className="time-separator">:</span>
                <div className="time-input-group">
                    <label>Segundos</label>
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                        disabled={isRunning}
                        className="time-input"
                    />
                </div>
            </div>

            {/* Circular Clock */}
            <div className={`timer-clock ${isRunning ? 'running' : ''} ${isFinished ? 'finished' : ''}`}>
                <svg className="timer-svg" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="87"
                        fill="none"
                        stroke="var(--border-medium)"
                        strokeWidth="10"
                    />

                    {/* Progress circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="87"
                        fill="none"
                        stroke="var(--accent-green)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="timer-progress"
                        transform="rotate(-90 100 100)"
                    />
                </svg>

                {/* Time Display */}
                <div className="timer-display">
                    {timeLeft > 0 ? (
                        <span className="timer-time">{formatTime(timeLeft)}</span>
                    ) : isFinished ? (
                        <span className="timer-finished">¡Tiempo!</span>
                    ) : (
                        <span className="timer-placeholder">Establece el tiempo</span>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="timer-controls">
                {!isRunning ? (
                    <button
                        className="timer-btn timer-btn-primary"
                        onClick={handleStart}
                    >
                        <Play size={24} />
                        Iniciar
                    </button>
                ) : (
                    <button className="timer-btn timer-btn-warning" onClick={handlePause}>
                        <Pause size={24} />
                        Pausar
                    </button>
                )}
                <button className="timer-btn timer-btn-secondary" onClick={handleReset}>
                    <RotateCcw size={24} />
                    Reiniciar
                </button>
            </div>
        </div>
    );
};

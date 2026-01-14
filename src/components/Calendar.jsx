import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';
import { DayCell } from './DayCell';
import { EventModal } from './EventModal';
import {
    generateCalendarGrid,
    getMonthName,
    getDayNames,
    formatDateKey,
} from '../utils/calendarHelpers';
import '../styles/Calendar.css';

export const Calendar = ({ userId }) => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    const { events, addEvent, updateEvent, deleteEvent, getEventsForDate } = useCalendar(userId);

    const calendarGrid = generateCalendarGrid(currentYear, currentMonth);
    const dayNames = getDayNames();

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleAddEvent = (year, month, day) => {
        setSelectedDate({ year, month, day });
        setEditingEvent(null);
        setModalOpen(true);
    };

    const handleEditEvent = (dateKey, event) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        setSelectedDate({ year, month: month - 1, day });
        setEditingEvent(event);
        setModalOpen(true);
    };

    const handleSaveEvent = (eventData) => {
        const { year, month, day } = selectedDate;

        if (editingEvent) {
            const dateKey = formatDateKey(year, month, day);
            updateEvent(dateKey, editingEvent.id, eventData);
        } else {
            addEvent(year, month, day, eventData);
        }
    };

    const handleDeleteEvent = (dateKey, eventId) => {
        deleteEvent(dateKey, eventId);
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h2 className="calendar-title">
                    {getMonthName(currentMonth)} {currentYear}
                </h2>
                <div className="calendar-nav">
                    <button className="nav-btn" onClick={handlePreviousMonth} aria-label="Mes anterior">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="nav-btn" onClick={handleNextMonth} aria-label="Mes siguiente">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="calendar-grid">
                {/* Day names header */}
                <div className="calendar-days-header">
                    {dayNames.map((dayName) => (
                        <div key={dayName} className="day-name">
                            {dayName}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="calendar-days">
                    {calendarGrid.map((week, weekIndex) => (
                        <div key={weekIndex} className="calendar-week">
                            {week.map((day, dayIndex) => (
                                <DayCell
                                    key={`${weekIndex}-${dayIndex}`}
                                    year={currentYear}
                                    month={currentMonth}
                                    day={day}
                                    events={day ? getEventsForDate(currentYear, currentMonth, day) : []}
                                    onAddEvent={handleAddEvent}
                                    onEditEvent={handleEditEvent}
                                    onDeleteEvent={handleDeleteEvent}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <EventModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveEvent}
                selectedDate={selectedDate}
                editingEvent={editingEvent}
            />
        </div>
    );
};

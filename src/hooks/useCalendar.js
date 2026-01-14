import { useState, useEffect } from 'react';
import { formatDateKey } from '../utils/calendarHelpers';
import { getStorageKey } from '../utils/storageKeys';

/**
 * Custom hook for managing calendar events
 * @param {string} userId - ID del usuario actual
 */
export const useCalendar = (userId) => {
    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(true);

    // Generate user-specific storage key
    const STORAGE_KEY = getStorageKey('events', userId);

    // Load events from localStorage on mount
    useEffect(() => {
        // Don't load if no userId yet
        if (!userId || !STORAGE_KEY) {
            setLoading(false);
            return;
        }

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setEvents(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading calendar events:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, STORAGE_KEY]);

    // Save events to localStorage whenever they change
    useEffect(() => {
        if (!loading && STORAGE_KEY) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            } catch (error) {
                console.error('Error saving calendar events:', error);
            }
        }
    }, [events, loading, STORAGE_KEY]);

    /**
     * Add new event to a specific date
     */
    const addEvent = (year, month, day, eventData) => {
        const dateKey = formatDateKey(year, month, day);
        const newEvent = {
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: eventData.title,
            date: dateKey,
            createdAt: new Date().toISOString(),
        };

        setEvents(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), newEvent],
        }));

        return newEvent;
    };

    /**
     * Update existing event
     */
    const updateEvent = (dateKey, eventId, updates) => {
        setEvents(prev => ({
            ...prev,
            [dateKey]: (prev[dateKey] || []).map(event =>
                event.id === eventId ? { ...event, ...updates } : event
            ),
        }));
    };

    /**
     * Delete event
     */
    const deleteEvent = (dateKey, eventId) => {
        setEvents(prev => ({
            ...prev,
            [dateKey]: (prev[dateKey] || []).filter(event => event.id !== eventId),
        }));
    };

    /**
     * Get events for a specific date
     */
    const getEventsForDate = (year, month, day) => {
        const dateKey = formatDateKey(year, month, day);
        return events[dateKey] || [];
    };

    /**
     * Get all events
     */
    const getAllEvents = () => {
        return events;
    };

    return {
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDate,
        getAllEvents,
    };
};

import React, { useState, useMemo } from 'react';
import './CalenterWtoutALib.css';
import { Box, Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Switch } from '@mui/material';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

type CalendarView = 'day' | 'week' | 'month';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalenterWtoutALib() {
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'All-day Event 1',
      start: new Date(new Date().setHours(8, 0, 0, 0)),
      end: new Date(new Date().setHours(18, 0, 0, 0)),
    },
    {
      id: '2',
      title: 'All-day Event 2',
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
    {
      id: '3',
      title: 'Timed Event',
      start: new Date(new Date().setHours(14, 0, 0, 0)),
      end: new Date(new Date().setHours(16, 0, 0, 0)),
    },
  ]);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [isAddEventPopupOpen, setIsAddEventPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    id: '',
    title: '',
    start: new Date(),
    end: new Date(),
  });

  const calendarDays = useMemo(() => {
    const days = [];
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    const relevantDays = view === 'month' ? calendarDays : weekDays;

    relevantDays.forEach((day) => {
      const dayStr = day.toISOString().split('T')[0];
      grouped.set(
        dayStr,
        events.filter((event) => {
          const eventDate = new Date(event.start).toISOString().split('T')[0];
          return eventDate === dayStr;
        })
      );
    });

    return grouped;
  }, [events, calendarDays, weekDays, view]);

  const handleDragStart = (eventId: string, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedEvent(eventId);
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedEvent) return;

    const updatedEvents = events.map((event) => {
      if (event.id === draggedEvent) {
        const newDate = new Date(date);
        const diff = event.end.getTime() - event.start.getTime();
        return {
          ...event,
          start: newDate,
          end: new Date(newDate.getTime() + diff),
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setDraggedEvent(null);
  };

  const navigateToDay = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const goToNext = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  const goToBack = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const openAddEventPopup = () => {
    setIsAddEventPopupOpen(true);
  };

  const closeAddEventPopup = () => {
    setIsAddEventPopupOpen(false);
  };

  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        ...newEvent,
        id: `${events.length + 1}`,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      },
    ]);
    setIsAddEventPopupOpen(false);
    setNewEvent({
      id: '',
      title: '',
      start: new Date(),
      end: new Date(),
    });
  };

  const MonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {DAYS.map((day) => (
        <div key={day} className="p-2 text-center font-semibold bg-gray-100">
          {day}
        </div>
      ))}

      {calendarDays.map((date) => {
        const dayStr = date.toISOString().split('T')[0];
        const dayEvents = eventsByDate.get(dayStr) || [];

        return (
          <div
            key={dayStr}
            className="min-h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => navigateToDay(date)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(date, e)}
          >
            <div className="text-sm text-gray-500 mb-1">{date.getDate()}</div>
            <div className="space-y-1">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(event.id, e)}
                  className="bg-blue-500 text-white p-1 rounded text-sm cursor-move"
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const WeekView = () => (
    <div className="relative">
      <div className="grid grid-cols-8 border-b">
        <div className="p-2" />
        {weekDays.map((date) => (
          <div
            key={date.toString()}
            className="p-2 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => navigateToDay(date)}
          >
            <div className="font-semibold">{DAYS[date.getDay()]}</div>
            <div className="text-sm text-gray-500">{date.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8">
        <div className="border-r">
          {HOURS.map((hour) => (
            <div key={hour} className="h-12 border-b text-xs p-1 text-gray-500">
              {`${hour}:00`}
            </div>
          ))}
        </div>
        {weekDays.map((date) => (
          <div key={date.toString()} className="border-r">
            {HOURS.map((hour) => (
              <div key={hour} className="h-12 border-b" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const DayView = () => (
    <div className="grid grid-cols-2">
      <div className="border-r">
        {HOURS.map((hour) => (
          <div key={hour} className="h-12 border-b text-xs p-1 text-gray-500">
            {`${hour}:00`}
          </div>
        ))}
      </div>
      <div>
        {HOURS.map((hour) => (
          <div key={hour} className="h-12 border-b" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-screen-lg mx-auto p-4">
    
<Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto', padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => setView('day')}
            variant={view === 'day' ? 'contained' : 'outlined'}
            color="primary"
          >
            Day
          </Button>
          <Button
            onClick={() => setView('week')}
            variant={view === 'week' ? 'contained' : 'outlined'}
            color="primary"
          >
            Week
          </Button>
          <Button
            onClick={() => setView('month')}
            variant={view === 'month' ? 'contained' : 'outlined'}
            color="primary"
          >
            Month
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={goToBack} variant="outlined">
            Back
          </Button>
          <Button onClick={goToNext} variant="outlined">
            Next
          </Button>
          <Button onClick={openAddEventPopup} variant="contained" color="success">
            Add Event
          </Button>
        </Box>
      </Box>

      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, backgroundColor: 'white' }}>
        {view === 'month' && <MonthView />}
        {view === 'week' && <WeekView />}
        {view === 'day' && <DayView />}
      </Box>

      <Dialog open={isAddEventPopupOpen} onClose={closeAddEventPopup}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date and Time"
              type="datetime-local"
              value={newEvent.start.toISOString().slice(0, 16)}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              fullWidth
            />
            <TextField
              label="End Date and Time"
              type="datetime-local"
              value={newEvent.end.toISOString().slice(0, 16)}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddEventPopup}>Cancel</Button>
          <Button onClick={handleAddEvent} color="primary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
      {isAddEventPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              placeholder="Event Title"
            />
            <div className="flex space-x-2 mb-4">
              <input
                type="datetime-local"
                value={newEvent.start.toISOString().slice(0, 16)}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                className="w-1/2 p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="datetime-local"
                value={newEvent.end.toISOString().slice(0, 16)}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                className="w-1/2 p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Event
              </button>
              <button
                onClick={closeAddEventPopup}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

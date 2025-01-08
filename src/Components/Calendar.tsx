import React, { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./Ca.css";

const localizer = momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}
const initialEvents: CalendarEvent[] = [
  {
    title: "All-day Event 1",
    start: new Date(new Date().setHours(8, 0, 0, 0)),
    end: new Date(new Date().setHours(18, 0, 0, 0)),
  },
  {
    title: "All-day Event 2",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
  {
    title: "Timed Event",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(16, 0, 0, 0)),
  },
];

export default function Calendar() {
  const [events, setEvents] = useState(initialEvents);
  const [currentView, setCurrentView] = useState<string>(Views.MONTH);

  const onEventDrop = ({ event , start, end } : { event : CalendarEvent, start : Date, end  : Date}) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...event, start, end } : existingEvent
    );
    setEvents(updatedEvents);
  };

  const onEventResize = ({ event , start, end } : { event : CalendarEvent, start : Date, end  : Date}) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event ? { ...event, start, end } : existingEvent
    );
    setEvents(updatedEvents);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };
  return (
    <>
     {/* <style>
        {currentView === "week" &&
          `.rbc-day-slot .rbc-events-container { top: 50px; }`}
        {currentView === "day" &&
          `.rbc-day-slot .rbc-events-container { top: 30px;  }`}
      </style> */}
    <DragAndDropCalendar
      localizer={localizer}
      events={events}
      showAllEvents
      showMultiDayTimes
      // onEventDrop={onEventDrop}
      // onEventResize={onEventResize}
      resizable
      style={{ height: 600 }}
      onView={handleViewChange}
      className={`${currentView}`}
      />
      </>
  );
}

import React, { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Event as CalendarEvent,
  SlotInfo,
  View,
  CalendarProps,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);

interface Event extends CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

const initialEvents: Event[] = [
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

// Wrap the BigCalendar with the Drag and Drop functionality
const DragAndDropBigCalendar = withDragAndDrop(BigCalendar);

export default function ControlCalendar(): JSX.Element {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const onEventDrop = ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt === event
          ? { ...evt, start: new Date(start), end: new Date(end) }
          : evt
      )
    );
  };

  const onEventResize = ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt === event
          ? { ...evt, start: new Date(start), end: new Date(end) }
          : evt
      )
    );
  };

  return (
    <DragAndDropBigCalendar
      localizer={localizer}
      events={events}
      style={{ height: "100%" }}
      selectable
      resizable
      // onEventDrop={onEventDrop}
      // onEventResize={onEventResize}
      defaultView="month"
      views={["month", "week", "day", "agenda"] as View[]}
      step={30}
      timeslots={2}
      min={new Date(1970, 1, 1, 8, 0, 0)}
      max={new Date(1970, 1, 1, 20, 0, 0)}
      defaultDate={new Date()}
      popup
      // tooltipAccessor={(event) => event.title}
      // onSelectEvent={(event: Event) => alert(`Event selected: ${event.title}`)}
      // onSelectSlot={(slotInfo: SlotInfo) =>
      //   alert(
      //     `Selected slot: ${slotInfo.start.toLocaleString()} - ${slotInfo.end.toLocaleString()}`
      //   )
      // }
      showMultiDayTimes
      drilldownView="agenda"
      formats={{
        dayFormat: "dddd, MMMM D",
      }}
      // eventPropGetter={(event: Event) => ({
      //   style: {
      //     backgroundColor: event.title === "Timed Event" ? "orange" : "blue",
      //   },
      // })}
    />
  );
}

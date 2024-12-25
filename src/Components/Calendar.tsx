import {
  Calendar as BigCalendar,
  CalendarProps,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "All-day Event 1",
    start: new Date(new Date().setHours(8, 0, 0, 0)), // Starts at 8:00 AM
    end: new Date(new Date().setHours(23, 59, 59, 999)), // Ends at the last minute of the day
  },
  {
    title: "All-day Event 2",
    start: new Date(new Date().setDate(new Date().getDate() + 1)), // Starts tomorrow
    end: new Date(new Date().setDate(new Date().getDate() + 1)), // Ends the same day
  },
  {
    title: "Timed Event",
    start: new Date(new Date().setHours(14, 0, 0, 0)), // Starts at 2:00 PM
    end: new Date(new Date().setHours(16, 0, 0, 0)), // Ends at 4:00 PM
  },
];

export default function Calendar(props: Omit<CalendarProps, "localizer">) {
  return (
    <BigCalendar
      {...props}
      defaultDate={new Date()}
      events={events}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      allDayAccessor={() => false} // Prevent header placement
      eventPropGetter={() => ({
        style: {
         display: "grid",
        },
      })}
    />
  );
}

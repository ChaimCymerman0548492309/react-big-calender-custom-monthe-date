import {
  Calendar as BigCalendar,
  CalendarProps,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import styles
import "./Ca.css"; // Import custom styles

const localizer = momentLocalizer(moment);

// Example events
const events = [
  {
    title: "Meeting",
    start: new Date(2024, 11, 4, 0, 0), // December 4, 2024, 10:00 AM
    end: new Date(2024, 11, 4, 11, 0),   // December 4, 2024, 11:00 AM
  },
  {
    title: "Workshop",
    start: new Date(2024, 11, 5, 14, 0), // December 5, 2024, 2:00 PM
    end: new Date(2024, 11, 5, 16, 0),   // December 5, 2024, 4:00 PM
  },
];

export default function Calendar(props: Omit<CalendarProps, "localizer">) {
  const today = new Date();

  // Custom date cell wrapper for month view
  const CustomDayCell: React.FC<any> = ({ value }) => {
    const isToday =
      value.getDate() === today.getDate() &&
      value.getMonth() === today.getMonth() &&
      value.getFullYear() === today.getFullYear();

    return (
      <div
        style={{
          position: "relative",
          padding: "5px",
          border: isToday ? "none" : "1px solid #ddd",
          borderRadius: "30px",
          width: "30px",
          height: "30px",
          color: isToday ? "white" : "#000",
          backgroundColor: isToday ? "black" : "white",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            color: isToday ? "white" : "#000",
          }}
        >
          {moment(value).format("DD")}
        </div>
      </div>
    );
  };

  // Custom time slot wrapper for day and week views
  const CustomTimeSlotWrapper: React.FC<any> = ({ value, children }) => {
    const isFirstSlot = value.getHours() === 0 && value.getMinutes() === 0;
    const isToday =
      value.getDate() === today.getDate() &&
      value.getMonth() === today.getMonth() &&
      value.getFullYear() === today.getFullYear();

    return (
      <div style={{ position: "relative", height: "100%" }}>
        {isFirstSlot && (
          <div
            style={{
              position: "absolute",
              top: "5px",
              left: "5px",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "2px solid black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isToday ? "black" : "#f0f0f0",
              color: isToday ? "white" : "#000",
              zIndex: 1,
            }}
          >
            {moment(value).format("DD")}
          </div>
        )}
        {children}
      </div>
    );
  };

  return (
    <BigCalendar
      {...props}
      events={events} // Adding example events
      localizer={localizer}
      components={{
        dateCellWrapper: CustomDayCell, // Month view customization
        timeSlotWrapper: CustomTimeSlotWrapper, // Day and Week views customization
      }}
    />
  );
}

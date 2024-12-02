import {
  Calendar as BigCalendar,
  CalendarProps,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import styles
import "./Ca.css"; // Import custom styles

const localizer = momentLocalizer(moment);

export default function Calendar(props: Omit<CalendarProps, "localizer">) {
  const today = new Date();

  // Function to apply styles for specific days
  const dayPropGetter = (date: Date) => {
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return {
        className: "custom-today-class", // Apply a custom class
        style: {
          backgroundColor: "#FFECB3", // Highlight background color
          color: "#BF360C", // Text color
          border: "2px solid #FF6F00", // Border styling
        },
      };
    }
    return {};
  };


  // Custom date cell wrapper component for month view
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
          zIndex: "555",
          overflow: "hidden" ,
          color: isToday ? "white" : "#000",
          backgroundColor: isToday ? "black" : "white",
        
        }}
      >
        <div
          style={{
            right: "0px",
            fontWeight: "bold",
            color: isToday ? "white" : "#000",
            backgroundColor: isToday ? "black" : "white",
            width: "30px",
            height: "30px",
            overflow: "hidden"
          }}
        >
          {moment(value).format("DD")}
        </div>
      </div>
    );
  };

  return (
    <BigCalendar
      {...props}
      localizer={localizer}
      dayPropGetter={dayPropGetter}
      components={{
        dateCellWrapper: CustomDayCell,
      }}
    />
  );
}

import moment from "moment";
import Calendar from "../Calendar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const events = [
  {
    start: moment("2023-03-18T10:00:00").toDate(),
    end: moment("2023-03-18T11:00:00").toDate(),
    title: "MRI Registration",
  },
  {
    start: moment("2023-03-18T14:00:00").toDate(),
    end: moment("2023-03-18T15:30:00").toDate(),
    title: "ENT Appointment",
  },
];

export default function BasicCalendar() {
  return  <DndProvider backend={HTML5Backend}> {/* Wrap the entire app with DndProvider */}
  <Calendar />
</DndProvider>
  // <Calendar
  //  events={events} 
  //  />;
}

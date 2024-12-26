import { useState } from "react";
import {
  BasicCalendar,
  ControlCalendar,
  CustomizingCalendar,
  AdvancedCalendar,
} from "./Components";
import CalenterWtoutALib from "./Components/CalenterWtoutALib";

function App() {
  return (
    <div style={{ height: "95vh" }}>
      <BasicCalendar />
      {/* <CalenterWtoutALib/> */}
      {/* <ControlCalendar /> */}
      {/* <CustomizingCalendar /> */}
      {/* <AdvancedCalendar /> */}
    </div>
  );
}

export default App;

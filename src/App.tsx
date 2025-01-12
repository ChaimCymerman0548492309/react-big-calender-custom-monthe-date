import { useState } from "react";
import {
  BasicCalendar,
  ControlCalendar,
  CustomizingCalendar,
  AdvancedCalendar,
} from "./Components";
import CalenterWtoutALib from "./Components/CalenterWtoutALib";
import Game from "./Components/Game/Game";
import { Canvas } from "@react-three/fiber";
import ReactThreeFiber from "./Components/react-three-fiber/ReactThreeFiber";
import ChipComp from "./Components/Chip/Chip";

function App() {
  return (
    <div style={{ height: "95vh" }}>
      {/* <BasicCalendar /> */}
      {/* <CalenterWtoutALib/> */}
      {/* <ControlCalendar /> */}
      {/* <CustomizingCalendar /> */}
      {/* <AdvancedCalendar /> */}
      {/* <Game/> */}
    {/* <ReactThreeFiber/> */}
    <ChipComp/>
    </div>
  );
}

export default App;

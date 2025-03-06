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
import CheckboxesTags from "./Components/CheckboxesTags/CheckboxesTags";
import CheckboxesTags2 from "./Components/CheckboxesTags/CheckboxesTags2";
import AIFace from "./Components/AIFace/AIFace";
import AIFace2 from "./Components/AIFace/AIFace2";
import Bee from "./Components/Bee/Bee";

function App() {
  return (
    <div style={{ height: "95vh" ,width : '100%'}}>
      {/* <BasicCalendar /> */}
      {/* <CalenterWtoutALib/> */}
      {/* <ControlCalendar /> */}
      {/* <CustomizingCalendar /> */}
      {/* <AdvancedCalendar /> */}
      {/* <Game/> */}
    {/* <ReactThreeFiber/> */}
    {/* <ChipComp/> */}
    {/* <CheckboxesTags/> */}
    {/* <CheckboxesTags2></CheckboxesTags2> */}
    {/* <AIFace/> */}
    {/* <Bee/> */}
    <AIFace2 />
    </div>
  );
}

export default App;

import React from "react";
import Lottie from "lottie-react";
import beeAnimation from "./AnimationBee2.json"; 
// import beeAnimation from "./Animation.json"; 

const Bee = () => {
  return (
    <div style={{ 
      position: "absolute", 
      top: 0, 
      // left: 0, 
      // width: "1200px", 
      // height: "100vh", 
      // overflow: "hidden", 
      border: '2px solid black',
      // background: 'transparent'
    }}>
      <Lottie
        loop={true}
        animationData={beeAnimation}
        // animationData={beeAnimation}
        style={{
          // background: 'transparent',
          position: "absolute",
          // top: 0,
          // left: 0,
          width: "1400px",
          height: "100vh", 
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default Bee;
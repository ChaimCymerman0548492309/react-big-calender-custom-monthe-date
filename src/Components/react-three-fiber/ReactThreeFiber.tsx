// import React from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Plane, PerspectiveCamera } from '@react-three/drei';

// function Car() {
//   return (
//     <mesh position={[0, 0.5, 0]}>
//       {/* Car body */}
//       <boxGeometry args={[2, 1, 1]} />
//       <meshStandardMaterial color="red" />
      
//       {/* Wheels */}
//       <mesh position={[-0.8, -0.5, 0.5]}>
//         <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
//       <mesh position={[0.8, -0.5, 0.5]}>
//         <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
//       <mesh position={[-0.8, -0.5, -0.5]}>
//         <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
//       <mesh position={[0.8, -0.5, -0.5]}>
//         <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
//     </mesh>
//   );
// }

// function Track() {
//   return (
//     <Plane rotation={[-Math.PI / 2, 0, 0]} args={[50, 50]}>
//       <meshStandardMaterial color="gray" />
//     </Plane>
//   );
// }

// function ReactThreeFiber() {
//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <Canvas>
//         {/* Camera */}
//         <PerspectiveCamera makeDefault position={[10, 10, 10]} />
//         <OrbitControls />

//         {/* Lights */}
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 10, 5]} intensity={1} />

//         {/* Scene */}
//         <Track />
//         <Car />
//       </Canvas>
//     </div>
//   );
// }

// export default ReactThreeFiber;

import React from 'react'

function ReactThreeFiber() {
  return (
    <div>ReactThreeFiber</div>
  )
}

export default ReactThreeFiber
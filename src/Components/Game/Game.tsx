// import React, { useState, useEffect, useCallback } from "react";
// import { Button, Slider, Typography, Container } from "@mui/material";
// import "./Game.css";

// const GRID_WIDTH = 10;
// const GRID_HEIGHT = 20;

// // Tetris shapes
// const SHAPES: Shape[] = [
//   [[1, 1, 1, 1]], // I
//   [
//     [1, 1],
//     [1, 1],
//   ], // O
//   [
//     [0, 1, 0],
//     [1, 1, 1],
//   ], // T
//   [
//     [1, 1, 0],
//     [0, 1, 1],
//   ], // Z
//   [
//     [0, 1, 1],
//     [1, 1, 0],
//   ], // S
//   [
//     [1, 0, 0],
//     [1, 1, 1],
//   ], // L
//   [
//     [0, 0, 1],
//     [1, 1, 1],
//   ], // J
// ];

// const COLORS: string[] = [
//   "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFFF33", "#33FFFF", "#FF3333",
// ];

// type Shape = number[][];
// type TetrisPiece = { shape: Shape; color: string };
// type Position = { x: number; y: number };

// const Game: React.FC = () => {
//   const [grid, setGrid] = useState<number[][]>([]);
//   const [currentShape, setCurrentShape] = useState<TetrisPiece | null>(null);
//   const [position, setPosition] = useState<Position>({ x: 3, y: 0 });
//   const [gameOver, setGameOver] = useState<boolean>(false);
//   const [score, setScore] = useState<number>(0);
//   const [speed, setSpeed] = useState<number>(500);
//   const [gameStarted, setGameStarted] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   function createEmptyGrid(): number[][] {
//     return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
//   }

//   function generateRandomShape(): TetrisPiece {
//     const index = Math.floor(Math.random() * SHAPES.length);
//     return { shape: SHAPES[index], color: COLORS[index] };
//   }

//   const startNewGame = () => {
//     setGrid(createEmptyGrid());
//     setCurrentShape(generateRandomShape());
//     setPosition({ x: 3, y: 0 });
//     setGameOver(false);
//     setScore(0);
//     setSpeed(500);
//     setGameStarted(true);
//     setErrorMessage("");
//   };

//   const movePiece = useCallback(
//     (dx: number, dy: number) => {
//       if (!gameOver && gameStarted) {
//         const newPosition = { x: position.x + dx, y: position.y + dy };
//         if (canMoveTo(newPosition)) {
//           setPosition(newPosition);
//         } else if (dy > 0) {
//           if (position.y === 0) {
//             setErrorMessage("Blocks are touching the top!");
//           }
//           placePiece();
//         }
//       }
//     },
//     [gameOver, position, gameStarted]
//   );

//   const rotatePiece = useCallback(() => {
//     if (!gameOver && gameStarted) {
//       const rotatedShape = rotateMatrix(currentShape!.shape);
//       if (canMoveTo(position, rotatedShape)) {
//         setCurrentShape({ ...currentShape!, shape: rotatedShape });
//       }
//     }
//   }, [currentShape, gameOver, position, gameStarted]);

//   function canMoveTo(newPosition: Position, shape: Shape = currentShape!.shape): boolean {
//     return shape.every((row, y) =>
//       row.every((cell, x) => {
//         if (!cell) return true;
//         const newX = x + newPosition.x;
//         const newY = y + newPosition.y;
//         return (
//           newX >= 0 &&
//           newX < GRID_WIDTH &&
//           newY >= 0 &&
//           newY < GRID_HEIGHT &&
//           !grid[newY]?.[newX]
//         );
//       })
//     );
//   }

//   function placePiece(): void {
//     const newGrid = grid.map((row) => row.slice());
  
//     currentShape!.shape.forEach((row, y) =>
//       row.forEach((cell, x) => {
//         if (cell) {
//           const newX = x + position.x;
//           const newY = y + position.y;
//           if (newY < 0) {
//             setGameOver(true);
//             return;
//           }
//           newGrid[newY][newX] = 1; // Use 1 for occupied cells
//         }
//       })
//     );
  
//     // Clear full lines
//     setGrid(clearFullLines(newGrid));
  
//     // Generate new shape
//     setCurrentShape(generateRandomShape());
  
//     // Reset position
//     setPosition({ x: 3, y: 0 });
  
//     // Increment score
//     setScore((prevScore) => prevScore + 10);
//   }
  

//   function clearFullLines(grid: number[][]): number[][] {
//     const filteredGrid = grid.filter((row) => row.some((cell) => !cell));
//     const emptyRows = Array(GRID_HEIGHT - filteredGrid.length)
//       .fill(null)
//       .map(() => Array(GRID_WIDTH).fill(0));
//     return [...emptyRows, ...filteredGrid];
//   }

//   function rotateMatrix(matrix: Shape): Shape {
//     return matrix[0].map((_, colIndex) =>
//       matrix.map((row) => row[colIndex]).reverse()
//     );
//   }

//   function isCurrentPiece(x: number, y: number): boolean | undefined{
//     return currentShape?.shape.some((row, shapeY) =>
//       row.some(
//         (cell, shapeX) =>
//           cell &&
//           x === shapeX + position.x &&
//           y === shapeY + position.y
//       )
//     );
//   }

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent): void => {
//       if (gameOver || !gameStarted) return;
//       switch (event.key) {
//         case "ArrowLeft":
//           movePiece(-1, 0);
//           break;
//         case "ArrowRight":
//           movePiece(1, 0);
//           break;
//         case "ArrowDown":
//           movePiece(0, 1);
//           break;
//         case "ArrowUp":
//           rotatePiece();
//           break;
//         default:
//           break;
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [gameOver, movePiece, rotatePiece, gameStarted]);

//   useEffect(() => {
//     if (gameStarted) {
//       const interval = setInterval(() => movePiece(0, 1), speed);
//       return () => clearInterval(interval);
//     }
//   }, [movePiece, speed, gameStarted]);

//   return (
//     <Container className="App" maxWidth="sm">
//       <Typography variant="h1" gutterBottom>
//         Colorful Tetris
//       </Typography>
//           <Button variant="contained" color="primary" onClick={startNewGame}>
//             Start New Game
//           </Button>
//       {gameOver && (
//         <>
//           <Typography variant="h2">Game Over! Final Score: {score}</Typography>
//           <Button variant="contained" color="primary" onClick={startNewGame}>
//             Start New Game
//           </Button>
//         </>
//       )}
//       {errorMessage && <Typography variant="h2">{errorMessage}</Typography>}
//       <div className="controls">
//         <Typography variant="h6">Speed: {speed}</Typography>
//         <Slider
//           value={speed}
//           onChange={(e, value) => setSpeed(value as number)}
//           min={100}
//           max={1000}
//           step={100}
//           valueLabelDisplay="auto"
//         />
//       </div>
//       <Typography variant="h6">Score: {score}</Typography>
//       <div className="grid">
//         {grid.map((row, y) =>
//           row.map((cell, x) => (
//             <div
//               key={`${x}-${y}`}
//               className="cell"
//               style={{
//                 backgroundColor: cell
//                   ? currentShape?.color
//                   : isCurrentPiece(x, y)
//                   ? currentShape?.color
//                   : "",
//               }}
//             />
//           ))
//         )}
//       </div>
//     </Container>
//   );
// };

// export default Game;


import React from 'react'

function Game() {
  return (
    <div>Game</div>
  )
}

export default Game



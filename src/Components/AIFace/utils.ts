
import * as faceapi from 'face-api.js';



// פונקציה לציור קמטי עיניים (קרני דג)
export const drawCrowsFeet = (ctx: CanvasRenderingContext2D, landmarks: faceapi.FaceLandmarks68) => {
  // נקודות ציון לעין שמאל (אינדקסים 36-41)
  const leftEyeOuter = landmarks.positions[36];
  const leftEyeInner = landmarks.positions[39];
  
  // נקודות ציון לעין ימין (אינדקסים 42-47)
  const rightEyeOuter = landmarks.positions[45];
  const rightEyeInner = landmarks.positions[42];

  if (!leftEyeOuter || !leftEyeInner || !rightEyeOuter || !rightEyeInner) return;

  ctx.strokeStyle = 'rgba(100, 80, 70, 0.4)';
  ctx.lineWidth = 1;

  // עין שמאל - 3 קווים בצורת קרני דג
  for (let i = 0; i < 3; i++) {
    const angle = Math.PI / 4 * (i / 2);
    const length = 15 + i * 3;
    
    ctx.beginPath();
    ctx.moveTo(leftEyeOuter.x, leftEyeOuter.y);
    ctx.lineTo(
      leftEyeOuter.x + Math.cos(angle) * length,
      leftEyeOuter.y + Math.sin(angle) * length
    );
    ctx.stroke();
  }

  // עין ימין - 3 קווים בצורת קרני דג
  for (let i = 0; i < 3; i++) {
    const angle = Math.PI + Math.PI / 4 * (i / 2);
    const length = 15 + i * 3;
    
    ctx.beginPath();
    ctx.moveTo(rightEyeOuter.x, rightEyeOuter.y);
    ctx.lineTo(
      rightEyeOuter.x + Math.cos(angle) * length,
      rightEyeOuter.y + Math.sin(angle) * length
    );
    ctx.stroke();
  }
};

// פונקציה לציור קמטי פה
export const drawMouthWrinkles = (ctx: CanvasRenderingContext2D, landmarks: faceapi.FaceLandmarks68) => {
  // נקודות ציון סביב הפה (אינדקסים 48-67)
  const upperLip = landmarks.positions[51]; // מרכז השפה העליונה
  const lowerLip = landmarks.positions[57]; // מרכז השפה התחתונה
  const mouthCorners = [landmarks.positions[48], landmarks.positions[54]]; // זוויות הפה

  if (!upperLip || !lowerLip || !mouthCorners[0] || !mouthCorners[1]) return;

  ctx.strokeStyle = 'rgba(120, 80, 70, 0.3)';
  ctx.lineWidth = 1;

  // קווים אנכיים מעל השפה העליונה
  for (let i = 0; i < 5; i++) {
    const x = upperLip.x + (i - 2) * 10;
    ctx.beginPath();
    ctx.moveTo(x, upperLip.y - 10);
    ctx.lineTo(x, upperLip.y - 5);
    ctx.stroke();
  }

  // קווים מהזוויות כלפי מטה
  mouthCorners.forEach(corner => {
    if (!corner) return;
    
    ctx.beginPath();
    ctx.moveTo(corner.x, corner.y);
    ctx.lineTo(corner.x + (corner === mouthCorners[0] ? -15 : 15), corner.y + 20);
    ctx.stroke();
  });

  // קווי צחוק מהזוויות לכיוון הלחיים
  mouthCorners.forEach(corner => {
    if (!corner) return;
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(corner.x, corner.y);
      ctx.lineTo(
        corner.x + (corner === mouthCorners[0] ? -20 : 20),
        corner.y - 10 - i * 5
      );
      ctx.stroke();
    }
  });
};

// פונקציה לציור שקיות מתחת לעיניים
export const applyUnderEyeBags = (ctx: CanvasRenderingContext2D, landmarks: faceapi.FaceLandmarks68) => {
  const leftEye = landmarks.positions.slice(36, 42);
  const rightEye = landmarks.positions.slice(42, 48);

  [leftEye, rightEye].forEach(eye => {
    if (eye.length < 6) return;

    const bottomCenter = {
      x: (eye[3].x + eye[4].x) / 2,
      y: (eye[3].y + eye[4].y) / 2
    };

    ctx.fillStyle = 'rgba(180, 150, 130, 0.2)';
    ctx.beginPath();
    ctx.moveTo(eye[1].x, eye[1].y);
    ctx.quadraticCurveTo(
      bottomCenter.x, bottomCenter.y + 15,
      eye[5].x, eye[5].y
    );
    ctx.lineTo(eye[5].x, eye[5].y + 5);
    ctx.quadraticCurveTo(
      bottomCenter.x, bottomCenter.y + 20,
      eye[1].x, eye[1].y + 5
    );
    ctx.closePath();
    ctx.fill();
  });
};
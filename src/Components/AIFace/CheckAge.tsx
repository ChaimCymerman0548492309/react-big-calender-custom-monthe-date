import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
// import * as tf from '@tensorflow/tfjs';
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { applyUnderEyeBags, drawCrowsFeet, drawMouthWrinkles } from './utils';

// רקע מעוצב
const Background = styled('div')({
  backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// תיבה מעוצבת
const StyledPaper = styled(Paper)({
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
});

const CheckAge: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isAging, setIsAging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [futureImage, setFutureImage] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading face-api.js models...");
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(
            "/models/face-api.js-models-master/face-api.js-models-master/ssd_mobilenetv1/ssd_mobilenetv1_model-weights_manifest.json"
          ),
          faceapi.nets.faceExpressionNet.loadFromUri(
            "/models/face-api.js-models-master/face-api.js-models-master/face_expression/face_expression_model-weights_manifest.json"
          ),
          faceapi.nets.ageGenderNet.loadFromUri(
            "/models/face-api.js-models-master/face-api.js-models-master/age_gender_model/age_gender_model-weights_manifest.json"
          ),
          faceapi.nets.faceLandmark68Net.loadFromUri(
            "/models/face-api.js-models-master/face-api.js-models-master/face_landmark_68/face_landmark_68_model-weights_manifest.json"
          ),
          // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        console.log("Models loaded successfully");
        setIsModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
        setError("טעינת המודלים נכשלה. אנא בדוק את החיבור שלך או נסה שוב.");
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraStarted(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("אין אפשרות לגשת למצלמה. אנא ודא שהרשאות המצלמה מופעלות.");
    }
  };

  const checkAge = async () => {
    if (!isModelsLoaded || !videoRef.current) return;
    try {
      setIsLoading(true);
       const detections = await faceapi
         .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
         .withAgeAndGender();
      // const detections = await faceapi
      //   .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
      //   .withFaceLandmarks()
      //   .withAgeAndGender();
      // const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options()).withAgeAndGender();
      if (detections.length > 0) {
        setAge(Math.round(detections[0].age));
      } else {
        setError("לא ניתן לזהות גיל. נסה שוב.");
      }
    } catch (err) {
      console.error("Error detecting age:", err);
      setError("שגיאה בזיהוי גיל.");
    } finally {
      setIsLoading(false);
    }
  };

const applyAgingEffects = async () => {
  if (!videoRef.current || !canvasRef.current || age === null) return;

  setIsAging(true);
  setError(null);

  try {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withAgeAndGender();

    if (detections.length > 0 && detections[0].landmarks) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // הגדרת מימדים
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // צייר את הפריים הנוכחי
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // אפקטים מתקדמים
      const landmarks = detections[0].landmarks;
      if (landmarks?.positions) {
        // 1. אפקט עור מזדקן
        applySkinAging(ctx, canvas.width, canvas.height);

        // 2. קמטים מדויקים לפי נקודות ציון
        applyAdvancedWrinkles(ctx, landmarks);

        // 3. שיער אפור משופר
        applyRealisticGrayHair(ctx, landmarks, age + 10);

        // 4. אפקטים נוספים
        // applyAgeSpots(ctx, canvas.width, canvas.height);
        // applyEyebrowThinning(ctx, landmarks);
      }

      setFutureImage(canvas.toDataURL("image/jpeg"));
    }
  } catch (err) {
    console.error("שגיאה:", err);
    setError("בעיה ביצירת תמונה עתידית");
  } finally {
    setIsAging(false);
  }
};

// אפקט עור מתקדם
const applySkinAging = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  // הוסף רקע עור מזדקן
  const skinOverlay = document.createElement("canvas");
  skinOverlay.width = width;
  skinOverlay.height = height;
  const skinCtx = skinOverlay.getContext("2d");
  if (!skinCtx) return;

  // צור טקסטורת עור מזדקן
  skinCtx.fillStyle = "#f5e7d0";
  skinCtx.fillRect(0, 0, width, height);

  // הוסף נקודות גיל
  for (let i = 0; i < 50; i++) {
    skinCtx.fillStyle = `rgba(180, 120, 100, ${Math.random() * 0.2})`;
    skinCtx.beginPath();
    skinCtx.arc(
      Math.random() * width,
      Math.random() * height * 0.7,
      Math.random() * 3 + 1,
      0,
      Math.PI * 2
    );
    skinCtx.fill();
  }

  // הוסף את השכבה עם שקיפות
  ctx.globalAlpha = 0.3;
  ctx.drawImage(skinOverlay, 0, 0);
  ctx.globalAlpha = 1.0;
};

// קמטים מתקדמים
const applyAdvancedWrinkles = (
  ctx: CanvasRenderingContext2D,
  landmarks: faceapi.FaceLandmarks68
) => {
  // קמטי מצח
  drawForeheadWrinkles(ctx, landmarks);

  // קמטי עיניים (קרני דג)
  drawCrowsFeet(ctx, landmarks);

  // קמטי פה
  drawMouthWrinkles(ctx, landmarks);

  // שקיות מתחת לעיניים
  applyUnderEyeBags(ctx, landmarks);
};

const drawForeheadWrinkles = (
  ctx: CanvasRenderingContext2D,
  landmarks: faceapi.FaceLandmarks68
) => {
  const points = [
    landmarks.positions[21],
    landmarks.positions[22],
    landmarks.positions[18],
    landmarks.positions[23],
    landmarks.positions[24],
  ].filter(Boolean);

  if (points.length < 3) return;

  ctx.strokeStyle = "rgba(100, 80, 70, 0.4)";
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    points.forEach((p, idx) => {
      const yOffset = 2 * Math.sin(idx * 0.5 + i * 1.5) + i * 3;
      if (idx === 0) ctx.moveTo(p.x, p.y + yOffset);
      else ctx.lineTo(p.x, p.y + yOffset);
    });
    ctx.stroke();
  }
};

// שיער אפור משופר
const applyRealisticGrayHair = (
  ctx: CanvasRenderingContext2D,
  landmarks: faceapi.FaceLandmarks68,
  futureAge: number
) => {
  const intensity = Math.min(0.7, (futureAge - 30) * 0.02);
  if (intensity <= 0) return;

  // צור מסיכת שיער אפור
  const hairCanvas = document.createElement("canvas");
  hairCanvas.width = ctx.canvas.width;
  hairCanvas.height = ctx.canvas.height;
  const hairCtx = hairCanvas.getContext("2d");
  if (!hairCtx) return;

  // הגדר אזור שיער
  const hairPoints = [
    landmarks.positions[10], // מצח
    landmarks.positions[338], // רקה ימין
    landmarks.positions[284], // רקה שמאל
    landmarks.positions[151], // סנטר
  ].filter(Boolean);

  if (hairPoints.length < 3) return;

  hairCtx.fillStyle = "black";
  hairCtx.beginPath();
  hairPoints.forEach((p, i) => {
    const yOffset = i === 0 ? -50 : 0; // הארכה מעבר לקו השיער
    if (i === 0) hairCtx.moveTo(p.x, p.y + yOffset);
    else hairCtx.lineTo(p.x, p.y + yOffset);
  });
  hairCtx.closePath();
  hairCtx.fill();

  // הוסף גווני אפור שונים
  ctx.save();
  ctx.clip(); // הגבל לאזור השיער בלבד

  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0, `rgba(200, 200, 200, ${intensity})`);
  grad.addColorStop(1, `rgba(150, 150, 150, ${intensity * 0.7})`);

  ctx.fillStyle = grad;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // הוסף גיוון טקסטורה
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * ctx.canvas.width,
      Math.random() * ctx.canvas.height * 0.5,
      Math.random() * 3 + 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.restore();
};

  // פונקציה להוספת שיער אפור
  // const applyGrayHair = (ctx: CanvasRenderingContext2D, face: any, futureAge: number) => {
  //   const hairPoints = [70, 63, 105, 66, 107, 336]; // נקודות שיער
  //   const coords = getPointsCoords(face, hairPoints);
    
  //   // ככל שהגיל העתידי יותר גבוה, השיער יותר אפור
  //   const grayIntensity = Math.min(0.7, (futureAge - 40) * 0.02);
  //   if (grayIntensity <= 0) return;
    
  //   ctx.fillStyle = `rgba(150, 150, 150, ${grayIntensity})`;
  //   ctx.beginPath();
  //   coords.forEach((point, i) => {
  //     if (i === 0) ctx.moveTo(point.x, point.y);
  //     else ctx.lineTo(point.x, point.y);
  //   });
  //   ctx.closePath();
  //   ctx.fill();
  // };

  // פונקציות עזר
  const getPointsCoords = (face: any, indices: number[]) => {
    return indices.map(i => ({
      x: face.scaledMesh[i][0],
      y: face.scaledMesh[i][1]
    }));
  };

  return (
    <StyledPaper>
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2}>
          <CircularProgress color="primary" />
          <Typography variant="body1">טוען נתונים... אנא המתן</Typography>
        </Box>
      )}

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        width="320" 
        height="240" 
        style={{ 
          border: '2px solid #4CAF50', 
          borderRadius: '10px', 
          display: isCameraStarted ? 'block' : 'none' 
        }} 
      />
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />

      {!isCameraStarted && !isLoading && isModelsLoaded && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={startCamera} 
          style={{ marginTop: '10px', backgroundColor: '#4CAF50' }}
        >
          בדיקת גיל :)
        </Button>
      )}

      {isCameraStarted && (
        <>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={checkAge} 
            style={{ marginTop: '10px', backgroundColor: '#3F51B5' }}
            disabled={isAging}
          >
            בדוק את גילך
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={applyAgingEffects} 
            style={{ marginTop: '10px', backgroundColor: '#9C27B0' }}
            disabled={isAging || age === null}
          >
            {isAging ? 'יוצר תמונה עתידית...' : 'איך תיראה בעוד 10 שנים?'}
          </Button>
        </>
      )}

      {age !== null && (
        <Typography variant="h6" style={{ color: '#4CAF50', marginTop: '10px' }}>
          הגיל המשוער שלך: {age}
        </Typography>
      )}

      {futureImage && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2} style={{ marginTop: '10px' }}>
          <Typography variant="h6" style={{ color: '#4CAF50' }}>
            כך תיראה בעוד 10 שנים:
          </Typography>
          <img 
            src={futureImage} 
            alt="Future You" 
            style={{ 
              width: '320px', 
              height: '240px', 
              borderRadius: '10px',
              border: '2px solid #9C27B0'
            }} 
          />
        </Box>
      )}
    </StyledPaper>
  );
};

export default CheckAge;
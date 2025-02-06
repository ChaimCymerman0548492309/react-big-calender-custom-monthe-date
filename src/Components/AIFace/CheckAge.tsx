import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, CircularProgress } from '@mui/material';
import { Box } from '@mui/material';

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
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [futureImage, setFutureImage] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models...");
        await Promise.all([
        //   faceapi.nets.ssdMobilenetv1.loadFromUri('/models/ssd_mobilenetv1'),
        //   faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression'),
        //   faceapi.nets.ageGenderNet.loadFromUri('/models/age_gender_model'),
           faceapi.nets.ssdMobilenetv1.loadFromUri('/models/face-api.js-models-master/face-api.js-models-master/ssd_mobilenetv1'),
           faceapi.nets.faceExpressionNet.loadFromUri('/models/face-api.js-models-master/face-api.js-models-master/face_expression'),
           faceapi.nets.ageGenderNet.loadFromUri('/models/face-api.js-models-master/face-api.js-models-master/age_gender_model'),
        ])
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
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options()).withAgeAndGender();
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

  const showFutureImage = async () => {
    if (!isModelsLoaded || !videoRef.current) return;
    try {
      setIsLoading(true);
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options()).withAgeAndGender();
      if (detections.length > 0) {
        const age = Math.round(detections[0].age);
        setFutureImage(`https://via.placeholder.com/150?text=Future+You+at+${age + 10}`);
      } else {
        setError("לא ניתן לזהות גיל. נסה שוב.");
      }
    } catch (err) {
      console.error("Error generating future image:", err);
      setError("שגיאה ביצירת תמונה עתידית.");
    } finally {
      setIsLoading(false);
    }
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

      <video ref={videoRef} autoPlay playsInline muted width="320" height="240" style={{ border: '2px solid #4CAF50', borderRadius: '10px', display: isCameraStarted ? 'block' : 'none' }} />

      {!isCameraStarted && !isLoading && isModelsLoaded && (
        <Button variant="contained" color="primary" onClick={startCamera} style={{ marginTop: '10px', backgroundColor: '#4CAF50' }}>
בדיקת גיל :)        </Button>
      )}

      {isCameraStarted && (
        <>
          <Button variant="contained" color="primary" onClick={checkAge} style={{ marginTop: '10px', backgroundColor: '#3F51B5' }}>
            בדוק את גילך
          </Button>
          <Button variant="contained" color="primary" onClick={showFutureImage} style={{ marginTop: '10px', backgroundColor: '#9C27B0' }}>
            איך תיראה בעוד 10 שנים?
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
          <img src={futureImage} alt="Future You" style={{ width: '150px', height: '150px', borderRadius: '10px' }} />
        </Box>
      )}
    </StyledPaper>
  );
};

export default CheckAge;

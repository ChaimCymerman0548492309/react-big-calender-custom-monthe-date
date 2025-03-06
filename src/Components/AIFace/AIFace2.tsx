import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, CircularProgress, Tooltip, TextField, AppBar, Toolbar } from '@mui/material';
import { Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import CheckAge from './CheckAge';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const SERVER_URL = 'http://localhost:5000';
// רקע עם תמונה סטטית מ-Unsplash
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

// עיצוב כללי
const StyledPaper = styled(Paper)({
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
});

const FaceDetection: React.FC<{ onExpressionsChange: (expressions: { [key: string]: number }) => void, isAutoMode: boolean }> = ({ onExpressionsChange, isAutoMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadModels = async () => {
    try {
      console.log("Loading models...");
      setIsLoading(true);
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models/face-api.js-models-master/face-api.js-models-master/ssd_mobilenetv1');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models/face-api.js-models-master/face-api.js-models-master/face_expression');
      console.log("Models loaded successfully");
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load models:", err);
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraStarted(true);
      console.log("Camera started successfully");
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const detectFaces = async () => {
    
    console.log("Detecting faces...");
    if (videoRef.current && isCameraStarted) {
      try {
        console.log("Detecting faces...");
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.SsdMobilenetv1Options()
        ).withFaceExpressions();

        if (detections.length > 0) {
          const expressions = detections[0].expressions as unknown as { [key: string]: number };
          onExpressionsChange(expressions);
        }
      } catch (err) {
        console.error("Error detecting faces:", err);
      }
    }
  };

  const startDetection = async () => {
    await loadModels();
    await startCamera();
    setIsDetectionActive(true);
  };

  useEffect(() => {
    if (isAutoMode && isDetectionActive) {
      const interval = setInterval(() => {
        detectFaces();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isAutoMode, isDetectionActive]);

  return (
    <StyledPaper>
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2}>
          <CircularProgress style={{ color: '#4CAF50' }} />
          <Typography variant="body1" style={{ color: '#4CAF50' }}>טוען מודלים... אנא המתן</Typography>
        </Box>
      )}
      <video ref={videoRef} autoPlay playsInline muted width="320" height="240" style={{ border: '2px solid #4CAF50', borderRadius: '10px', display: isCameraStarted ? 'block' : 'none' }} />
      {!isCameraStarted && !isLoading && (
        <Button variant="contained" color="primary" onClick={startDetection} style={{ marginTop: '10px', backgroundColor: '#4CAF50' }}>
          התחל ניטור מצב רוח
        </Button>
      )}
      {isDetectionActive && !isAutoMode && (
        <Button variant="contained" color="secondary" onClick={detectFaces} style={{ marginTop: '10px', backgroundColor: '#FF5722' }}>
          בדוק את מצב הרוח שלי
        </Button>
      )}
    </StyledPaper>
  );
};

const MoodMessages: React.FC<{ expressions: { [key: string]: number }, addMoodRecord: (mood: string) => void, userId: string }> = ({ expressions, addMoodRecord, userId }) => {
  const [joke, setJoke] = useState<string>("");
  const [massge, setMassge] = useState<string>("");

  const getRandomJoke = async () => {
    const jokes = [
      "למה התרנגול חצה את הכביש? כדי להגיע לצד השני!",
      "איך קוראים לערפד עצוב? דם על הפנים.",
      "למה התות לא הלך לבית הספר? כי הוא היה מרוח!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  };

  const getDominantExpression = (expressions: { [key: string]: number }) => {
    let dominantExpression = '';
    let maxValue = 0;

    for (const [expression, value] of Object.entries(expressions)) {
      if (value > maxValue) {
        maxValue = value;
        dominantExpression = expression;
      }
    }

    return dominantExpression;
  };

  const saveMoodToDB = async (mood: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, mood }),
      });
      if (!response.ok) {
        throw new Error('Failed to save mood');
      }
      const data = await response.json();
      console.log('Mood saved:', data);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  useEffect(() => {
    if (expressions.sad > 0.5) {
      getRandomJoke().then((joke) => setJoke(joke));
    }

    const dominantExpression = getDominantExpression(expressions);
    setMassge(dominantExpression);
    addMoodRecord(dominantExpression);
    saveMoodToDB(dominantExpression); // שמירת מצב הרוח ב-MongoDB
  }, [expressions]);

  const getMessage = () => {
    switch (massge) {
      case 'happy':
        return "אתה נראה שמח היום! 😊";
      case 'sad':
        return "לא נראה שהכול בסדר... אולי כדאי לקחת הפסקה? 🫂";
      case 'angry':
        return "היי, תירגע! הכל יהיה בסדר. 🌟";
      case 'surprised':
        return "וואו! נראה שהופתעת! 😮";
      case 'disgusted':
        return "משהו לא נראה לך טעים? 🤢";
      case 'fearful':
        return "אתה נראה מפוחד... הכל בסדר? 😨";
      case 'neutral':
        return "שיהיה לך יום נפלא! 🌞";
      default:
        return "מחפשים את ההבעה שלך... 🤔";
    }
  };

  return (
    <StyledPaper style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#4CAF50' }}>
        {getMessage()}
      </Typography>
      <Typography variant="h6" style={{ color: '#FF5722' }}>
        הודעת המערכת היא: {massge}
      </Typography>
      {expressions.sad > 0.5 && <Typography variant="body1" style={{ color: '#333' }}>{joke}</Typography>}
    </StyledPaper>
  );
};

const MoodHistoryTable: React.FC<{ history: { time: string, mood: string }[] }> = ({ history }) => {
  const getEmoji = (mood: string) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'angry':
        return '😠';
      case 'surprised':
        return '😮';
      case 'disgusted':
        return '🤢';
      case 'fearful':
        return '😨';
      case 'neutral':
        return '😐';
      default:
        return '🤔';
    }
  };

  return (
    <TableContainer component={StyledPaper} style={{ height: '100%', overflow: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', color: '#4CAF50' }}>שעה</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#4CAF50' }}>מצב רוח</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#4CAF50' }}>אמוג'י</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.time}</TableCell>
              <TableCell>{record.mood}</TableCell>
              <TableCell>{getEmoji(record.mood)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MoodChart: React.FC<{ history: { time: string, mood: string }[] }> = ({ history }) => {
  const moodToValue = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 5;
      case 'neutral':
        return 4;
      case 'surprised':
        return 3;
      case 'sad':
        return 2;
      case 'angry':
        return 1;
      case 'disgusted':
        return 1;
      case 'fearful':
        return 1;
      default:
        return 0;
    }
  };

  const data = history.map((record) => ({
    time: record.time,
    moodValue: moodToValue(record.mood),
  }));

  return (
    <StyledPaper style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant="h5" style={{ color: '#4CAF50', textAlign: 'center' }}>
        גרף מצב הרוח לאורך היום
      </Typography>
      <Typography variant="body1" style={{ color: '#4CAF50', textAlign: 'center' }}>
        ציר ה-Y מציג את מצב הרוח שלך בצורה מספרית:
        <br />
        5 - שמח, 4 - ניטרלי, 3 - מופתע, 2 - עצוב, 1 - כועס/מבועת/נגעל
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 5]} />
          <RechartsTooltip />
          <Legend />
          <Line type="monotone" dataKey="moodValue" stroke="#4CAF50" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </StyledPaper>
  );
};

const LoginRegister: React.FC<{ onLogin: () => void , setUserId: any ,setIsUserLogin : any}> = ({ onLogin , setUserId , setIsUserLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    
    try {
      console.log(email);
      
      setUserId(email);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setIsUserLogin(false);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setIsUserLogin(false);
      }
      onLogin();
    } catch (err : any) {
      setError(err.message as string,);
      console.error(err);
    }
  };

  return (
    <StyledPaper style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <Typography variant="h5" gutterBottom>
        {isLogin ? 'Login' : 'Register'}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        {isLogin ? 'Login' : 'Register'}
      </Button>
      <Button variant="text" fullWidth onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </Button>
    </StyledPaper>
  );
};




const AIFace2: React.FC = () => {
  const [expressions, setExpressions] = useState<{ [key: string]: number }>({});
  const [moodHistory, setMoodHistory] = useState<{ time: string, mood: string }[]>([]);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLogin, setIsUserLogin] = useState(false);

  const addMoodRecord = (mood: string) => {
    const time = new Date().toLocaleTimeString();
    setMoodHistory([...moodHistory, { time, mood }]);
  };

  const fetchMoodHistory = async (userId: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/moods/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mood history');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching mood history:', error);
      return [];
    }
  };

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchMoodHistory(userId).then((data) => {
        setMoodHistory(data);
      });
    }
  }, [isLoggedIn, userId]);

  return (
    <Background>
      {/* AppBar עם כפתורי התחברות והרשמה */}
      <AppBar  style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: '#4CAF50' }}>
            {userId ? `ברוך הבא ${userId}` : 'ברוך הבא אורח'}
          </Typography>
          {/* {!isLoggedIn && ( */}
            <>
              <Button color="inherit" onClick={() => setIsUserLogin(true)} style={{ color: '#4CAF50' }}>
                התחברות
              </Button>
              {/* <Button color="inherit" onClick={() => setIsLoggedIn(true)} style={{ color: '#4CAF50' }}>
                הרשמה
              </Button> */}
            </>
          {/* )} */}
        </Toolbar>
      </AppBar>

      <CheckAge />
      {isUserLogin ? (
        <LoginRegister onLogin={() => setIsLoggedIn(true)} setUserId={setUserId} setIsUserLogin={setIsUserLogin}/>
      ) : (
        <Grid container spacing={3} style={{ maxWidth: '1200px', margin: '0 auto', height: '90vh' }}>
          <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Typography variant="h2" gutterBottom style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              מראה חכמה
            </Typography>
            <Typography variant="h5" style={{ color: '#fff', textAlign: 'center' }}>
              נטר את מצב הרוח שלך לאורך היום!
            </Typography>
            <Typography variant="body1" style={{ color: '#fff', textAlign: 'center' }}>
              האפליקציה הזו תעזור לך לעקוב אחר מצב הרוח שלך לאורך היום. באמצעות טכנולוגיית זיהוי פנים, נוכל לזהות את ההבעה שלך ולעזור לך להבין איך אתה מרגיש.
            </Typography>
            <FaceDetection onExpressionsChange={setExpressions} isAutoMode={isAutoMode} />
            {Object.keys(expressions).length > 0 && <MoodMessages expressions={expressions} addMoodRecord={addMoodRecord} userId={userId!} />}
            <Tooltip title="הניטור האוטומטי יבדוק את מצב הרוח שלך כל דקה ויעדכן את הטבלה והגרף באופן אוטומטי." arrow>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsAutoMode(!isAutoMode)}
                style={{ backgroundColor: isAutoMode ? '#FF5722' : '#4CAF50' }}
              >
                {isAutoMode ? 'כבה ניטור אוטומטי' : 'הפעל ניטור אוטומטי'}
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={6}>
            <MoodHistoryTable history={moodHistory} />
          </Grid>
          <Grid item xs={12}>
            <MoodChart history={moodHistory} />
          </Grid>
        </Grid>
      )} 
    </Background>
  );
};

export default AIFace2;


import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { Button, TextField, Typography, Paper } from '@mui/material';

const Register: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Explicitly type error as string or null

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose(); // Close the registration modal after successful registration
    } catch (err) {
      // Handle the error and set it to the state
      if (err instanceof Error) {
        setError(err.message); // Ensure the error is of type Error
      } else {
        setError('An unknown error occurred.'); // Fallback for unknown errors
      }
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <Typography variant="h5" gutterBottom>
        Register
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
      <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
        Register
      </Button>
    </Paper>
  );
};

export default Register;
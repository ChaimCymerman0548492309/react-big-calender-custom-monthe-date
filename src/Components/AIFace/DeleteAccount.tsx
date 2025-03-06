import React, { useState } from 'react';
import { auth } from './firebase';
import { Button, Typography, Paper } from '@mui/material';

const DeleteAccount: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [error, setError] = useState<string | null>(null); // Explicitly type error as string or null

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.delete();
        alert('Account deleted successfully');
        onClose(); // Close the delete account modal
      } catch (err) {
        // Handle the error and set it to the state
        if (err instanceof Error) {
          setError(err.message); // Ensure the error is of type Error
        } else {
          setError('An unknown error occurred.'); // Fallback for unknown errors
        }
      }
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <Typography variant="h5" gutterBottom>
        Delete Account
      </Typography>
      <Typography variant="body1" gutterBottom>
        Are you sure you want to delete your account? This action cannot be undone.
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="secondary" fullWidth onClick={handleDeleteAccount}>
        Delete Account
      </Button>
    </Paper>
  );
};

export default DeleteAccount;
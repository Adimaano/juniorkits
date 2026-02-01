import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { Lock, Key } from 'lucide-react';
import { authService } from '../services/firebase';
import './Login.css';

const Login = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authService.login(passcode);
      if (result.success) {
        onLogin(true);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <Card className="login-card">
        <CardContent className="login-content">
          <div className="brand-header">
            <div className="brand-icon">
              <Lock size={48} />
            </div>
            <Typography variant="h4" component="h1" className="brand-title">
              JuniorKits
            </Typography>
            <Typography variant="subtitle1" className="brand-subtitle">
              Equipment Management System
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <Key size={20} />
              </div>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={isLoading}
                className="passcode-input"
                inputProps={{
                  'aria-label': 'Passcode input'
                }}
              />
            </div>

            {error && (
              <Alert severity="error" className="error-alert">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || !passcode.trim()}
              className="login-button"
            >
              {isLoading ? 'Authenticating...' : 'Access System'}
            </Button>
          </form>

          <div className="help-text">
            <Typography variant="body2" color="textSecondary">
              Hint: The passcode is "joopie"
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
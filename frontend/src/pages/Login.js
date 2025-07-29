import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { setToken } from '../utils/auth';

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    IconButton,
    InputAdornment
} from '@mui/material';

import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(email, password);
            setToken(res.data.token);
            setSnackbar({
                open: true,
                message: 'Login successful!',
                severity: 'success',
            });

            setTimeout(() => navigate('/transactions'), 1000);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Login failed',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2,
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 2, boxShadow: 4 }}>
                {/* Header with dark theme */}
                <Box sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#fff', p: 2, borderRadius: '8px 8px 0 0' }}>
                    <Typography align="center" variant="h6" fontWeight="500">
                        Login
                    </Typography>
                </Box>

                <CardContent>
                    <Box textAlign="center" mb={2}>
                        <img
                            src="https://mma.prnewswire.com/media/2009794/Typeface_Logo.jpg?p=facebook"
                            alt="Typeface Logo"
                            style={{ maxWidth: 180, height: 'auto' }}
                        />
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            disabled={loading}
                        />

                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    borderRadius: 25,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #44a08d 0%, #3a8c7a 100%)',
                                    },
                                    px: 3,
                                }}
                                startIcon={<LoginIcon />}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Box>


                    </form>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;

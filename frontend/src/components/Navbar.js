import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import SavingsIcon from '@mui/icons-material/Savings';

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!getToken();

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
            <Toolbar>
                <SavingsIcon sx={{ mr: 2, fontSize: 32, color: '#4ecdc4' }} />
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: 'white' }}>
                    Personal Finance Assistant
                </Typography>
                {isLoggedIn ? (
                    <>
                        <Button color="inherit" component={Link} to="/dashboard" sx={{ mx: 1, color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Dashboard</Button>
                        <Button color="inherit" component={Link} to="/transactions" sx={{ mx: 1, color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Transactions</Button>
                        <Button color="inherit" component={Link} to="/upload" sx={{ mx: 1, color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Upload</Button>
                        <Button color="inherit" onClick={handleLogout} sx={{ mx: 1, color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login" sx={{ mx: 1, color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Login</Button>
                        <Button color="inherit" component={Link} to="/register" sx={{ mx: 1, color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>Register</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar; 
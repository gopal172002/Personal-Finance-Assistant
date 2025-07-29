import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', 
        },
        secondary: {
            main: '#9c27b0', 
        },
        background: {
            default: '#f4f6fb',
            paper: '#fff',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h5: { fontWeight: 700 },
        h4: { fontWeight: 800 },
    },
    shape: {
        borderRadius: 12,
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
); 
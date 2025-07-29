import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import { getToken } from './utils/auth';

function PrivateRoute({ children }) {
    return getToken() ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
                <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </>
    );
}

export default App; 